const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());



const CROPS = {
  wheat: {
    id: "wheat",
    name: "Wheat (गेहूं)",
    scientificName: "Triticum aestivum",
    season: "Rabi",
    totalDurationDays: 125,
    stages: {
      initial: {
        name: "Initial / Crown Root Initiation (CRI)",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.4,
        criticality: 95,
        description: "Crown Root Initiation stage (20-25 DAS) — highly sensitive to moisture stress. Delay causes permanent tiller reduction.",
        sensitivityRank: "Extremely High"
      },
      development: {
        name: "Tillering & Jointing",
        durationDays: 35,
        startDay: 21,
        endDay: 55,
        kc: 0.8,
        criticality: 70,
        description: "Active vegetative growth and stem elongation. Moderate to high water demand.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Flowering & Grain Filling / Milking",
        durationDays: 45,
        startDay: 56,
        endDay: 100,
        kc: 1.15,
        criticality: 92,
        description: "Peak anthesis and grain formation. Water deficit causes shriveled grains and severe yield drop.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Dough to Maturation",
        durationDays: 25,
        startDay: 101,
        endDay: 125,
        kc: 0.4,
        criticality: 30,
        description: "Grain ripening and drying. Irrigation stopped to facilitate harvest.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 18
  },

  mustard: {
    id: "mustard",
    name: "Mustard (सरसों)",
    scientificName: "Brassica juncea",
    season: "Rabi",
    totalDurationDays: 110,
    stages: {
      initial: {
        name: "Emergence & Seedling",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.35,
        criticality: 60,
        description: "Establishment of root system and rosette stage.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Branching & Pre-Flowering",
        durationDays: 30,
        startDay: 21,
        endDay: 50,
        kc: 0.75,
        criticality: 82,
        description: "Secondary branch formation (30-40 DAS). Critical for siliqua number.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Flowering & Pod Filling (Siliqua)",
        durationDays: 40,
        startDay: 51,
        endDay: 90,
        kc: 1.05,
        criticality: 90,
        description: "Peak flowering and pod elongation (55-65 DAS). Yield loss up to 40% if stressed.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Pod Maturation & Drying",
        durationDays: 20,
        startDay: 91,
        endDay: 110,
        kc: 0.35,
        criticality: 25,
        description: "Seeds turn black/brown; water withheld.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 25
  },

  paddy: {
    id: "paddy",
    name: "Paddy / Rice (धान)",
    scientificName: "Oryza sativa",
    season: "Kharif",
    totalDurationDays: 130,
    stages: {
      initial: {
        name: "Nursery & Transplanting Establishment",
        durationDays: 25,
        startDay: 1,
        endDay: 25,
        kc: 1.1,
        criticality: 80,
        description: "Seedling recovery after transplanting. Continuous shallow ponding needed.",
        sensitivityRank: "High"
      },
      development: {
        name: "Tillering & Panicle Initiation",
        durationDays: 35,
        startDay: 26,
        endDay: 60,
        kc: 1.2,
        criticality: 88,
        description: "Active tiller production and primordial development. Stress reduces panicle count.",
        sensitivityRank: "Very High"
      },
      midSeason: {
        name: "Heading, Flowering & Milk Stage",
        durationDays: 45,
        startDay: 61,
        endDay: 105,
        kc: 1.35,
        criticality: 98,
        description: "Panicle exertion and anthesis. Even 2-3 days drought causes spikelet sterility.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Dough to Grain Ripening",
        durationDays: 25,
        startDay: 106,
        endDay: 130,
        kc: 0.7,
        criticality: 35,
        description: "Grain hardening. Field drained 10 days before harvest.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 7
  },

  cotton: {
    id: "cotton",
    name: "Cotton (कपास)",
    scientificName: "Gossypium hirsutum",
    season: "Kharif",
    totalDurationDays: 160,
    stages: {
      initial: {
        name: "Germination & Early Vegetative",
        durationDays: 30,
        startDay: 1,
        endDay: 30,
        kc: 0.45,
        criticality: 50,
        description: "Taproot penetration into deeper soil profiles.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Squaring (Floral Bud Formation)",
        durationDays: 40,
        startDay: 31,
        endDay: 70,
        kc: 0.85,
        criticality: 78,
        description: "Square formation. Stress causes square shedding.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Peak Flowering & Boll Development",
        durationDays: 60,
        startDay: 71,
        endDay: 130,
        kc: 1.15,
        criticality: 94,
        description: "Active boll setting and lint elongation. Severe boll drop if water-stressed.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Boll Opening & Maturation",
        durationDays: 30,
        startDay: 131,
        endDay: 160,
        kc: 0.6,
        criticality: 30,
        description: "Bolls burst open for picking. Excess water spoils cotton lint quality.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 20
  },

  gram: {
    id: "gram",
    name: "Gram / Chickpea (चना)",
    scientificName: "Cicer arietinum",
    season: "Rabi",
    totalDurationDays: 115,
    stages: {
      initial: {
        name: "Emergence & Early Vegetative",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.4,
        criticality: 45,
        description: "Seedling emergence; deep taproot establishment.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Branching & Pre-Flowering",
        durationDays: 30,
        startDay: 21,
        endDay: 50,
        kc: 0.7,
        criticality: 80,
        description: "Pre-flowering vegetative pulse (45 DAS). Crucial irrigation turn.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Pod Development & Grain Filling",
        durationDays: 45,
        startDay: 51,
        endDay: 95,
        kc: 1.0,
        criticality: 89,
        description: "Pod enlargement (70-75 DAS). Moisture deficit causes pod abortion.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Senescence & Maturity",
        durationDays: 20,
        startDay: 96,
        endDay: 115,
        kc: 0.35,
        criticality: 20,
        description: "Foliage turns golden brown; dry down.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 30
  },

  maize: {
    id: "maize",
    name: "Maize / Corn (मक्का)",
    scientificName: "Zea mays",
    season: "Kharif/Rabi",
    totalDurationDays: 110,
    stages: {
      initial: {
        name: "Emergence to V4 Leaf Stage",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.4,
        criticality: 55,
        description: "Early seedling growth.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Rapid Stem Elongation (Knee-high)",
        durationDays: 30,
        startDay: 21,
        endDay: 50,
        kc: 0.85,
        criticality: 75,
        description: "Vegetative biomass accumulation.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Tasseling, Silking & Cob Filling",
        durationDays: 40,
        startDay: 51,
        endDay: 90,
        kc: 1.2,
        criticality: 96,
        description: "Silking and pollination window (50-65 DAS). 2 days stress reduces yield by 30-40%.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Dent & Black Layer Maturity",
        durationDays: 20,
        startDay: 91,
        endDay: 110,
        kc: 0.6,
        criticality: 25,
        description: "Grain drydown and husk browning.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 14
  },

  potato: {
    id: "potato",
    name: "Potato (आलू)",
    scientificName: "Solanum tuberosum",
    season: "Rabi",
    totalDurationDays: 95,
    stages: {
      initial: {
        name: "Sprouting & Emergence",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.5,
        criticality: 60,
        description: "Sprout emergence and root development.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Stolon Initiation & Tuberization",
        durationDays: 25,
        startDay: 21,
        endDay: 45,
        kc: 0.85,
        criticality: 88,
        description: "Tuber hook formation (30-40 DAS). Moisture stress limits tuber count.",
        sensitivityRank: "Very High"
      },
      midSeason: {
        name: "Tuber Bulking",
        durationDays: 35,
        startDay: 46,
        endDay: 80,
        kc: 1.15,
        criticality: 95,
        description: "Rapid starch storage in tubers. Irregular moisture causes hollow heart or cracked tubers.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Skin Curing & Maturation",
        durationDays: 15,
        startDay: 81,
        endDay: 95,
        kc: 0.65,
        criticality: 25,
        description: "Haulm cutting / dehaulming stage; skins harden.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 10
  }
};

/* =========================================================
   IN-MEMORY DATA STORE
   Replace with MongoDB/MySQL later.
   ========================================================= */

const waterGroups = [
  {
    id: "wg-01",
    _id: "wg-01",
    name: "Rampur Village Borewell #04",
    sourceType: "Shared Borewell",
    sourceName: "Tubewell 15-HP (Discharge 38,000 L/hr)",
    village: "Rampur, Sector 4",
    activeStatus: "ACTIVE",
    totalCapacityAcres: 24.5,
    currentTurnFarmerId: "farmer-01",
    currentTurnStartedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: "wg-02",
    _id: "wg-02",
    name: "Shivalik Canal Lateral 2B",
    sourceType: "Canal Lateral Outlet",
    sourceName: "Canal Minor Sluice Gate #14",
    village: "Shivalik Kalan",
    activeStatus: "IDLE",
    totalCapacityAcres: 48.0,
    currentTurnFarmerId: null,
    currentTurnStartedAt: null
  }
];

const farmers = [
  { id: "farmer-01", name: "Rameshwar Singh (रामेश्वर सिंह)", phone: "+91 98765 43210", landholdingSize: 1.2, category: "Marginal", waterGroupId: "wg-01" },
  { id: "farmer-02", name: "Suresh Patel (सुरेश पटेल)", phone: "+91 98123 45678", landholdingSize: 0.8, category: "Marginal", waterGroupId: "wg-01" },
  { id: "farmer-03", name: "Anita Devi (अनीता देवी)", phone: "+91 97234 56789", landholdingSize: 0.6, category: "Marginal", waterGroupId: "wg-01" },
  { id: "farmer-04", name: "Mohan Lal Sharma (मोहन लाल)", phone: "+91 94111 22334", landholdingSize: 4.5, category: "Medium", waterGroupId: "wg-01" },
  { id: "farmer-05", name: "Harpreet Kaur (हरप्रीत कौर)", phone: "+91 98450 11223", landholdingSize: 1.5, category: "Small", waterGroupId: "wg-01" },
  { id: "farmer-06", name: "Devendra Yadav (देवेन्द्र यादव)", phone: "+91 93321 99887", landholdingSize: 6.0, category: "Large", waterGroupId: "wg-01" }
];

const plots = [
  { id: "plot-01", farmerId: "farmer-01", crop: "wheat", sowingDate: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 1.2, lastWateredAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 19, waterGroupId: "wg-01", evidenceVerified: true },
  { id: "plot-02", farmerId: "farmer-02", crop: "wheat", sowingDate: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 0.8, lastWateredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 15, waterGroupId: "wg-01", evidenceVerified: false },
  { id: "plot-03", farmerId: "farmer-03", crop: "mustard", sowingDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 0.6, lastWateredAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 12, waterGroupId: "wg-01", evidenceVerified: true },
  { id: "plot-04", farmerId: "farmer-04", crop: "wheat", sowingDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 4.5, lastWateredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 10, waterGroupId: "wg-01", evidenceVerified: false },
  { id: "plot-05", farmerId: "farmer-05", crop: "gram", sowingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 1.5, lastWateredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 8, waterGroupId: "wg-01", evidenceVerified: false },
  { id: "plot-06", farmerId: "farmer-06", crop: "potato", sowingDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 6.0, lastWateredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 7, waterGroupId: "wg-01", evidenceVerified: true }
];

const waterTurns = [
  { id: "turn-01", _id: "turn-01", farmerId: "farmer-01", farmerName: "Rameshwar Singh", cropName: "Wheat", plotId: "plot-01", waterGroupId: "wg-01", score: 91.45, rank: 1, scheduledAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), completedAt: null, status: "IN_PROGRESS", durationMinutes: 120, tieBreakReason: null, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "turn-hist-01", farmerId: "farmer-03", farmerName: "Anita Devi", cropName: "Mustard", plotId: "plot-03", waterGroupId: "wg-01", score: 84.2, rank: 1, startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), status: "COMPLETED", durationMinutes: 120, tieBreakReason: "Tie resolved: Longer waiting time (14 days vs 10 days)", createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() }
];

const disputes = [
  { id: "disp-01", farmerId: "farmer-04", farmerName: "Mohan Lal Sharma", turnId: "turn-01", waterGroupId: "wg-01", reason: "Claimed sowing date was 5 days earlier than recorded in system.", status: "RESOLVED", resolutionNote: "Coordinator verified with seed purchase invoice; corrected sowing date to 2025-12-08.", createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
];

const auditLogs = [
  { id: "log-01", waterGroupId: "wg-01", type: "QUEUE_RECALCULATION", message: "Priority queue dynamically recomputed for 6 plots based on FAO-56 stage updates.", timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() },
  { id: "log-02", waterGroupId: "wg-01", type: "TURN_STARTED", message: "Water turn initiated for Rameshwar Singh (Wheat - Flowering/Milk stage, Urgency 91.45).", timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() }
];
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
   WATER GROUPS
   ========================================================= */

app.get("/api/water-groups", (req, res) => {
  res.json({
    success: true,
    waterGroups,
  });
});

app.post("/api/water-groups", (req, res) => {
  const { name, village, sourceType, totalCapacityAcres } = req.body;
  if (!name || !village || !sourceType) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  const newGroup = {
    id: "wg-" + Date.now().toString().slice(-4),
    name,
    village,
    sourceType,
    sourceName: name,
    totalCapacityAcres: Number(totalCapacityAcres) || 10,
    activeStatus: "IDLE",
    currentTurnFarmerId: null,
    currentTurnStartedAt: null
  };
  newGroup._id = newGroup.id;
  waterGroups.push(newGroup);
  res.json({ success: true, waterGroup: newGroup });
});

/* =========================================================
   QUEUE CALCULATION
   ========================================================= */

function computeQueue(waterGroupId, customWeights = null) {
  const group = waterGroups.find(g => g.id === waterGroupId) || waterGroups[0];
  const groupPlots = plots.filter(p => p.waterGroupId === group.id);
  const weights = customWeights || { w1_stageCriticality: 0.6, w2_waitingScore: 0.25, w3_smallholderFairness: 0.15 };

  const queueItems = groupPlots.map(plot => {
    const farmer = farmers.find(f => f.id === plot.farmerId) || { name: "Farmer", phone: "+91 98000 00000", category: "Marginal" };
    
    // Use the existing calculateUrgency logic but adapted for weights
    const cropConfig = CROPS[plot.crop] || CROPS.wheat;
    const daysSinceSowing = calculateDaysSinceSowing(plot.sowingDate);
    const { stageKey, stage } = calculateCropStage(plot.crop, daysSinceSowing);
    
    const waitDays = Number(plot.daysSinceLastWater) || 5;
    const waitRatio = waitDays / (cropConfig.irrigationIntervalDays || 18);
    const waitingScore = Math.min(100, Math.max(10, Math.round(waitRatio * 70)));
  
    const land = Math.max(0.1, Number(plot.landArea) || 1.0);
    const smallholderScore = Math.min(100, Math.max(15, Math.round(100 * (1.8 / (0.8 + land)))));
  
    const urgencyScore = Number((
      weights.w1_stageCriticality * stage.criticality +
      weights.w2_waitingScore * waitingScore +
      weights.w3_smallholderFairness * smallholderScore
    ).toFixed(2));

    return {
      id: plot.id,
      plotId: plot.id,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      farmerCategory: farmer.category,
      waterGroupId: group.id,
      crop: cropConfig.name,
      daysSinceSowing,
      stageKey,
      stageName: stage.name,
      stageCriticality: stage.criticality,
      kc: stage.kc,
      description: stage.description,
      waitDays,
      waitingScore,
      landArea: land,
      smallholderScore,
      urgencyScore,
      weights,
      explanation: `Calculated from ${stage.name} (${stage.criticality}/100, ${weights.w1_stageCriticality * 100}% wt), ${waitDays} days waiting (${waitingScore}/100, ${weights.w2_waitingScore * 100}% wt), and ${land} acre plot fairness (${smallholderScore}/100, ${weights.w3_smallholderFairness * 100}% wt).`,
      evidenceVerified: Boolean(plot.evidenceVerified)
    };
  });

  queueItems.sort((a, b) => b.urgencyScore - a.urgencyScore);

  let remainingActiveMinutes = 45;
  let accumulatedMinutes = 0;

  const queueWithEstimates = queueItems.map((item, idx) => {
    const turnDurationMins = Math.round(Math.max(60, Math.min(240, item.landArea * 60)));
    let estWaitMins = remainingActiveMinutes + accumulatedMinutes;
    let estTurnText = "Next in line";

    if (idx === 0) {
      estTurnText = `In ${remainingActiveMinutes} mins`;
    } else {
      const hours = Math.floor(estWaitMins / 60);
      const mins = estWaitMins % 60;
      estTurnText = hours > 0 ? `In ${hours}h ${mins}m` : `In ${mins}m`;
    }
    accumulatedMinutes += turnDurationMins;

    let comparativeWhy = "";
    if (idx > 0) {
      const first = queueItems[0];
      if (first.stageCriticality > item.stageCriticality) {
        comparativeWhy = `Your score is lower than ${first.farmerName} because their ${first.crop} is currently in a more water-sensitive stage (${first.stageName}, Criticality ${first.stageCriticality} vs ${item.stageCriticality}).`;
      } else if (first.waitDays > item.waitDays) {
        comparativeWhy = `Your score is lower than ${first.farmerName} because they have waited longer without irrigation (${first.waitDays} days vs ${item.waitDays} days).`;
      } else {
        comparativeWhy = `Ranked #${idx + 1} based on composite score: ${item.urgencyScore} vs #${idx} (${queueItems[idx - 1].urgencyScore}).`;
      }
    } else {
      comparativeWhy = `Rank #1: Highest composite urgency (${item.urgencyScore}/100) — priority turn scheduled.`;
    }

    return {
      ...item,
      rank: idx + 1,
      estimatedDurationMinutes: turnDurationMins,
      estimatedWaitMinutes: estWaitMins,
      estimatedTurnText: estTurnText,
      comparativeWhy
    };
  });

  const activeTurn = waterTurns.find(t => t.waterGroupId === group.id && t.status === "IN_PROGRESS");

  return {
    success: true,
    waterGroup: group,
    activeTurn: activeTurn || null,
    queue: queueWithEstimates,
    fairnessMetrics: {
      averageWaitDays: 4.2,
      longestWaitDays: 6.1,
      smallholderSharePct: 42,
      criticalStageSharePct: 67,
      fairnessIndex: 84
    },
    updatedAt: new Date().toISOString()
  };
}

app.get("/api/queue/:waterGroupId", (req, res) => {
  const result = computeQueue(req.params.waterGroupId);
  res.json(result);
});

app.post("/api/queue/recalculate", (req, res) => {
  const { waterGroupId, customWeights } = req.body;
  const result = computeQueue(waterGroupId, customWeights);
  res.json(result);
});

/* =========================================================
   TURNS
   ========================================================= */

app.post("/api/turns/start", (req, res) => {
  const { waterGroupId, plotId } = req.body;
  const queueData = computeQueue(waterGroupId);
  const plot = queueData.queue.find(q => q.plotId === plotId) || queueData.queue[0];
  const newTurn = {
    id: "turn-" + Date.now().toString().slice(-6),
    farmerId: plot.farmerId,
    farmerName: plot.farmerName,
    cropName: plot.crop,
    plotId: plot.plotId,
    waterGroupId,
    score: plot.urgencyScore,
    rank: 1,
    startedAt: new Date().toISOString(),
    status: "IN_PROGRESS",
    durationMinutes: 120,
    createdAt: new Date().toISOString()
  };
  waterTurns.unshift(newTurn);
  auditLogs.unshift({
    id: "log-" + Date.now(),
    waterGroupId,
    type: "TURN_STARTED",
    message: `Water turn started for ${plot.farmerName} (${plot.crop}).`,
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, turn: newTurn });
});

app.post("/api/turns/complete", (req, res) => {
  const { waterGroupId, turnId } = req.body;
  const turn = waterTurns.find(t => t.status === "IN_PROGRESS") || waterTurns[0];
  if (turn) {
    turn.status = "COMPLETED";
    turn.completedAt = new Date().toISOString();
    const p = plots.find(pl => pl.id === turn.plotId);
    if (p) p.daysSinceLastWater = 0;

    auditLogs.unshift({
      id: "log-" + Date.now(),
      waterGroupId,
      type: "TURN_COMPLETED",
      message: `Water turn completed for ${turn.farmerName}. Plot moisture replenished; queue recalculated.`,
      timestamp: new Date().toISOString()
    });
  }
  res.json({ success: true, turn });
});

app.post("/api/turns/skip", (req, res) => {
  const { waterGroupId, turnId, reason } = req.body;
  const turn = waterTurns.find(t => t.status === "IN_PROGRESS");
  if (turn) {
    turn.status = "SKIPPED";
    turn.tieBreakReason = `Skipped: ${reason || 'Operator override'}`;
  }
  res.json({ success: true, turn });
});

app.get("/api/turns/history/:waterGroupId", (req, res) => {
  res.json({ success: true, turns: waterTurns.filter(t => t.waterGroupId === req.params.waterGroupId) });
});

/* =========================================================
   DISPUTES
   ========================================================= */

app.get("/api/disputes/:waterGroupId", (req, res) => {
  res.json({ success: true, disputes: disputes.filter(d => d.waterGroupId === req.params.waterGroupId) });
});

app.post("/api/disputes", (req, res) => {
  const { farmerId, farmerName, turnId, waterGroupId, reason } = req.body;
  const newDispute = {
    id: "disp-" + Date.now().toString().slice(-4),
    farmerId,
    farmerName: farmerName || "Farmer",
    turnId: turnId || "turn-01",
    waterGroupId: waterGroupId || "wg-01",
    reason,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
  disputes.unshift(newDispute);
  auditLogs.unshift({
    id: "log-" + Date.now(),
    waterGroupId: newDispute.waterGroupId,
    type: "DISPUTE_RAISED",
    message: `Dispute raised: "${reason}".`,
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, dispute: newDispute });
});

/* =========================================================
   LOGS
   ========================================================= */

app.get("/api/logs/:waterGroupId", (req, res) => {
  res.json({ success: true, logs: auditLogs.filter(l => l.waterGroupId === req.params.waterGroupId) });
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

app.post("/api/farmers", (req, res) => {
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

    if (!name || !name.trim()) return res.status(400).json({ success: false, message: "Farmer name is required." });
    if (!crop || !CROPS[crop]) return res.status(400).json({ success: false, message: "Valid crop is required." });
    if (!sowingDate) return res.status(400).json({ success: false, message: "Sowing date is required." });

    const newFarmer = {
      id: "farmer-" + Date.now().toString().slice(-4),
      name: name.trim(),
      phone: phone?.trim() || "",
      landholdingSize: Number(landArea || 1.0),
      category: Number(landArea) <= 1.0 ? "Marginal" : "Small",
      waterGroupId: waterGroupId || "wg-01"
    };
    farmers.push(newFarmer);

    const newPlot = {
      id: "plot-" + Date.now().toString().slice(-4),
      farmerId: newFarmer.id,
      crop,
      sowingDate,
      landArea: newFarmer.landholdingSize,
      daysSinceLastWater: Number(daysSinceLastWater || 5),
      waterGroupId: newFarmer.waterGroupId,
      evidenceVerified: Boolean(evidenceVerified)
    };
    plots.push(newPlot);

    auditLogs.unshift({
      id: "log-" + Date.now(),
      waterGroupId: newFarmer.waterGroupId,
      type: "FARMER_REGISTERED",
      message: `New farmer ${newFarmer.name} (${newFarmer.landholdingSize} acres) registered.`,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: "Farmer registered successfully.",
      farmer: newFarmer,
      plot: newPlot
    });
  } catch (error) {
    console.error("Farmer registration error:", error);
    res.status(500).json({ success: false, message: "Unable to register farmer." });
  }
});

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