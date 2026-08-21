const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());



const CROPS = {
  wheat: {
    name: "Wheat (गेहूं)",
    season: "Rabi",
    totalDurationDays: 120,
    irrigationIntervalDays: 18,

    stages: {
      initial: {
        endDay: 20,
        name: "Initial / Establishment",
        criticality: 65,
        kc: 0.30,
        description:
          "Early establishment stage. Adequate soil moisture supports root development.",
      },

      development: {
        endDay: 50,
        name: "Development",
        criticality: 78,
        kc: 0.70,
        description:
          "Vegetative development requires increasing water availability.",
      },

      midSeason: {
        endDay: 90,
        name: "Mid-Season / Flowering",
        criticality: 92,
        kc: 1.15,
        description:
          "Critical crop stage. Water stress can significantly reduce yield.",
      },

      lateSeason: {
        endDay: 120,
        name: "Late Season",
        criticality: 65,
        kc: 0.75,
        description:
          "Water demand begins to decline as the crop approaches maturity.",
      },
    },
  },

  rice: {
    name: "Rice (धान)",
    season: "Kharif",
    totalDurationDays: 135,
    irrigationIntervalDays: 12,

    stages: {
      initial: {
        endDay: 25,
        name: "Initial / Establishment",
        criticality: 72,
        kc: 1.05,
        description:
          "Establishment stage requiring consistent moisture.",
      },

      development: {
        endDay: 60,
        name: "Vegetative Development",
        criticality: 80,
        kc: 1.10,
        description:
          "Strong vegetative growth requires reliable water availability.",
      },

      midSeason: {
        endDay: 100,
        name: "Mid-Season / Flowering",
        criticality: 95,
        kc: 1.20,
        description:
          "Highly sensitive reproductive stage where water stress can reduce yield.",
      },

      lateSeason: {
        endDay: 135,
        name: "Late Season",
        criticality: 60,
        kc: 0.90,
        description:
          "Water requirement declines toward maturity.",
      },
    },
  },

  maize: {
    name: "Maize (मक्का)",
    season: "Kharif",
    totalDurationDays: 110,
    irrigationIntervalDays: 15,

    stages: {
      initial: {
        endDay: 20,
        name: "Initial / Establishment",
        criticality: 65,
        kc: 0.40,
        description:
          "Early establishment depends on sufficient soil moisture.",
      },

      development: {
        endDay: 45,
        name: "Development",
        criticality: 78,
        kc: 0.80,
        description:
          "Vegetative growth increases crop water demand.",
      },

      midSeason: {
        endDay: 80,
        name: "Mid-Season / Flowering",
        criticality: 94,
        kc: 1.20,
        description:
          "Flowering and pollination are highly sensitive to water stress.",
      },

      lateSeason: {
        endDay: 110,
        name: "Late Season",
        criticality: 60,
        kc: 0.60,
        description:
          "Water demand reduces as the crop reaches maturity.",
      },
    },
  },

  cotton: {
    name: "Cotton (कपास)",
    season: "Kharif",
    totalDurationDays: 180,
    irrigationIntervalDays: 20,

    stages: {
      initial: {
        endDay: 30,
        name: "Initial / Establishment",
        criticality: 60,
        kc: 0.35,
        description:
          "Early establishment requires adequate but controlled moisture.",
      },

      development: {
        endDay: 80,
        name: "Vegetative Development",
        criticality: 75,
        kc: 0.80,
        description:
          "Vegetative growth increases water demand.",
      },

      midSeason: {
        endDay: 140,
        name: "Flowering / Boll Formation",
        criticality: 93,
        kc: 1.20,
        description:
          "Critical flowering and boll-development period.",
      },

      lateSeason: {
        endDay: 180,
        name: "Late Season",
        criticality: 62,
        kc: 0.70,
        description:
          "Water demand gradually declines toward harvest.",
      },
    },
  },
};

/* =========================================================
   IN-MEMORY DATA STORE
   Replace with MongoDB/MySQL later.
   ========================================================= */

const farmers = [];
const auditLogs = [];

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function calculateDaysSinceSowing(sowingDate) {
  const sowing = new Date(sowingDate);
  const today = new Date();

  if (Number.isNaN(sowing.getTime())) {
    throw new Error("Invalid sowing date");
  }

  const difference =
    today.getTime() - sowing.getTime();

  return Math.max(
    1,
    Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1
  );
}

/* =========================================================
   CROP STAGE
   ========================================================= */

function calculateCropStage(cropKey, daysSinceSowing) {
  const cropConfig = CROPS[cropKey];

  if (!cropConfig) {
    throw new Error(`Unknown crop: ${cropKey}`);
  }

  let stageKey;
  let stage;

  if (
    daysSinceSowing <=
    cropConfig.stages.initial.endDay
  ) {
    stageKey = "initial";
    stage = cropConfig.stages.initial;
  } else if (
    daysSinceSowing <=
    cropConfig.stages.development.endDay
  ) {
    stageKey = "development";
    stage = cropConfig.stages.development;
  } else if (
    daysSinceSowing <=
    cropConfig.stages.midSeason.endDay
  ) {
    stageKey = "midSeason";
    stage = cropConfig.stages.midSeason;
  } else if (
    daysSinceSowing <=
    cropConfig.stages.lateSeason.endDay
  ) {
    stageKey = "lateSeason";
    stage = cropConfig.stages.lateSeason;
  } else {
    stageKey = "harvestReady";

    stage = {
      name: "Harvest Ready / Post-Maturity",
      criticality: 10,
      kc: 0.25,
      description:
        "Crop mature. Low moisture requirement.",
    };
  }

  return {
    stageKey,
    stage,
  };
}

/* =========================================================
   URGENCY CALCULATION
   ========================================================= */

function calculateUrgency({
  crop,
  sowingDate,
  daysSinceLastWater,
  landArea,
}) {
  const cropConfig = CROPS[crop];

  if (!cropConfig) {
    throw new Error(`Unknown crop: ${crop}`);
  }

  const daysSinceSowing =
    calculateDaysSinceSowing(sowingDate);

  const { stageKey, stage } =
    calculateCropStage(
      crop,
      daysSinceSowing
    );

  /* -----------------------------
     Waiting Score
     ----------------------------- */

  const waitDays =
    Number(daysSinceLastWater) || 0;

  const waitRatio =
    waitDays /
    (cropConfig.irrigationIntervalDays || 18);

  const waitingScore = Math.min(
    100,
    Math.max(
      10,
      Math.round(waitRatio * 70)
    )
  );

  /* -----------------------------
     Smallholder Score
     ----------------------------- */

  const land =
    Math.max(
      0.1,
      Number(landArea) || 1
    );

  const smallholderScore =
    Math.min(
      100,
      Math.max(
        15,
        Math.round(
          100 *
            (1.8 /
              (0.8 + land))
        )
      )
    );

  /* -----------------------------
     Composite Score
     ----------------------------- */

  const rawUrgency =
    0.60 * stage.criticality +
    0.25 * waitingScore +
    0.15 * smallholderScore;

  return {
    cropName: cropConfig.name,

    daysSinceSowing,

    stageKey,

    stageName: stage.name,

    stageCriticality:
      stage.criticality,

    kc: stage.kc,

    waitingScore,

    smallholderScore,

    urgencyScore:
      Number(
        rawUrgency.toFixed(2)
      ),

    description:
      stage.description,
  };
}

/* =========================================================
   AUDIT LOG
   ========================================================= */

function createAuditLog({
  action,
  farmerId,
  message,
  metadata = {},
}) {
  const log = {
    id: crypto.randomUUID(),

    action,

    farmerId,

    message,

    metadata,

    timestamp:
      new Date().toISOString(),
  };

  auditLogs.push(log);

  return log;
}

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JalTurn backend is running",
    timestamp:
      new Date().toISOString(),
  });
});

/* =========================================================
   GET CROPS
   ========================================================= */

app.get("/api/crops", (req, res) => {
  res.json({
    success: true,
    crops: CROPS,
  });
});

/* =========================================================
   PREVIEW URGENCY
   ========================================================= */

app.post(
  "/api/farmers/preview",
  (req, res) => {
    try {
      const {
        crop,
        sowingDate,
        daysSinceLastWater,
        landArea,
      } = req.body;

      if (!crop || !sowingDate) {
        return res.status(400).json({
          success: false,
          message:
            "Crop and sowingDate are required.",
        });
      }

      const preview =
        calculateUrgency({
          crop,
          sowingDate,
          daysSinceLastWater,
          landArea,
        });

      res.json({
        success: true,
        preview,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================================================
   REGISTER FARMER
   ========================================================= */

app.post(
  "/api/farmers",
  (req, res) => {
    try {
      const {
        name,
        phone,
        waterGroupId,
        crop,
        sowingDate,
        landArea,
        daysSinceLastWater,
        evidenceVerified,
        notes,
      } = req.body;

      /* -----------------------------
         Validation
         ----------------------------- */

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Farmer name is required.",
        });
      }

      if (!crop || !CROPS[crop]) {
        return res.status(400).json({
          success: false,
          message:
            "Valid crop is required.",
        });
      }

      if (!sowingDate) {
        return res.status(400).json({
          success: false,
          message:
            "Sowing date is required.",
        });
      }

      if (
        landArea === undefined ||
        Number(landArea) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid land area is required.",
        });
      }

      /* -----------------------------
         Calculate authoritative score
         ----------------------------- */

      const urgency =
        calculateUrgency({
          crop,
          sowingDate,
          daysSinceLastWater,
          landArea,
        });

      /* -----------------------------
         Create farmer
         ----------------------------- */

      const farmer = {
        id: crypto.randomUUID(),

        name: name.trim(),

        phone:
          phone?.trim() || "",

        waterGroupId:
          waterGroupId || "wg-01",

        crop,

        cropName:
          urgency.cropName,

        sowingDate,

        landArea:
          Number(landArea),

        daysSinceLastWater:
          Number(daysSinceLastWater) || 0,

        evidenceVerified:
          Boolean(evidenceVerified),

        notes:
          notes?.trim() || "",

        urgencyScore:
          urgency.urgencyScore,

        stageName:
          urgency.stageName,

        stageCriticality:
          urgency.stageCriticality,

        kc: urgency.kc,

        waitingScore:
          urgency.waitingScore,

        smallholderScore:
          urgency.smallholderScore,

        daysSinceSowing:
          urgency.daysSinceSowing,

        status: "WAITING",

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      };

      farmers.push(farmer);

      /* -----------------------------
         Audit record
         ----------------------------- */

      const audit = createAuditLog({
        action:
          "FARMER_REGISTERED",

        farmerId:
          farmer.id,

        message:
          `${farmer.name} registered for ${farmer.cropName}.`,

        metadata: {
          waterGroupId:
            farmer.waterGroupId,

          urgencyScore:
            farmer.urgencyScore,

          stageName:
            farmer.stageName,

          waitingScore:
            farmer.waitingScore,

          smallholderScore:
            farmer.smallholderScore,
        },
      });

      /* -----------------------------
         Response
         ----------------------------- */

      res.status(201).json({
        success: true,

        message:
          "Farmer registered successfully.",

        farmer,

        urgency: {
          cropName:
            urgency.cropName,

          daysSinceSowing:
            urgency.daysSinceSowing,

          stageName:
            urgency.stageName,

          stageCriticality:
            urgency.stageCriticality,

          kc: urgency.kc,

          waitingScore:
            urgency.waitingScore,

          smallholderScore:
            urgency.smallholderScore,

          urgencyScore:
            urgency.urgencyScore,

          description:
            urgency.description,
        },

        audit,
      });
    } catch (error) {
      console.error(
        "Farmer registration error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to register farmer.",
      });
    }
  }
);

/* =========================================================
   GET ALL FARMERS
   ========================================================= */

app.get("/api/farmers", (req, res) => {
  const {
    waterGroupId,
  } = req.query;

  let result = farmers;

  if (waterGroupId) {
    result =
      farmers.filter(
        (farmer) =>
          farmer.waterGroupId ===
          waterGroupId
      );
  }

  res.json({
    success: true,
    count: result.length,
    farmers: result,
  });
});

/* =========================================================
   GET SINGLE FARMER
   ========================================================= */

app.get(
  "/api/farmers/:id",
  (req, res) => {
    const farmer =
      farmers.find(
        (f) =>
          f.id === req.params.id
      );

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message:
          "Farmer not found.",
      });
    }

    res.json({
      success: true,
      farmer,
    });
  }
);

/* =========================================================
   GET AUDIT HISTORY
   ========================================================= */

app.get(
  "/api/audit",
  (req, res) => {
    res.json({
      success: true,
      count: auditLogs.length,
      logs: [
        ...auditLogs,
      ].sort(
        (a, b) =>
          new Date(b.timestamp) -
          new Date(a.timestamp)
      ),
    });
  }
);

/* =========================================================
   SERVER
   ========================================================= */

app.listen(PORT, () => {
  console.log(
    `JalTurn backend running on http://localhost:${PORT}`
  );
});