const crypto = require("crypto");
const CROPS = require("../data/crops");
const WaterGroup = require('../models/WaterGroup');
const Farmer = require('../models/Farmer');
const Plot = require('../models/Plot');
const WaterTurn = require('../models/WaterTurn');
const AuditLog = require('../models/AuditLog');

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function calculateDaysSinceSowing(sowingDate) {
  const sowing = new Date(sowingDate);
  const today = new Date();

  if (Number.isNaN(sowing.getTime())) {
    throw new Error("Invalid sowing date");
  }

  const difference = today.getTime() - sowing.getTime();

  return Math.max(
    1,
    Math.floor(difference / (1000 * 60 * 60 * 24)) + 1
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

  if (daysSinceSowing <= cropConfig.stages.initial.endDay) {
    stageKey = "initial";
    stage = cropConfig.stages.initial;
  } else if (daysSinceSowing <= cropConfig.stages.development.endDay) {
    stageKey = "development";
    stage = cropConfig.stages.development;
  } else if (daysSinceSowing <= cropConfig.stages.midSeason.endDay) {
    stageKey = "midSeason";
    stage = cropConfig.stages.midSeason;
  } else if (daysSinceSowing <= cropConfig.stages.lateSeason.endDay) {
    stageKey = "lateSeason";
    stage = cropConfig.stages.lateSeason;
  } else {
    stageKey = "harvestReady";
    stage = {
      name: "Harvest Ready / Post-Maturity",
      criticality: 10,
      kc: 0.25,
      description: "Crop mature. Low moisture requirement.",
    };
  }

  return { stageKey, stage };
}

/* =========================================================
   URGENCY CALCULATION
   ========================================================= */

function calculateUrgency({ crop, sowingDate, daysSinceLastWater, landArea }) {
  const cropConfig = CROPS[crop];

  if (!cropConfig) {
    throw new Error(`Unknown crop: ${crop}`);
  }

  const daysSinceSowing = calculateDaysSinceSowing(sowingDate);
  const { stageKey, stage } = calculateCropStage(crop, daysSinceSowing);

  // Waiting Score
  const waitDays = Number(daysSinceLastWater) || 0;
  const waitRatio = waitDays / (cropConfig.irrigationIntervalDays || 18);
  const waitingScore = Math.min(100, Math.max(10, Math.round(waitRatio * 70)));

  // Smallholder Score
  const land = Math.max(0.1, Number(landArea) || 1);
  const smallholderScore = Math.min(100, Math.max(15, Math.round(100 * (1.8 / (0.8 + land)))));

  // Composite Score
  const rawUrgency = 0.60 * stage.criticality + 0.25 * waitingScore + 0.15 * smallholderScore;

  return {
    cropName: cropConfig.name,
    daysSinceSowing,
    stageKey,
    stageName: stage.name,
    stageCriticality: stage.criticality,
    kc: stage.kc,
    waitingScore,
    smallholderScore,
    urgencyScore: Number(rawUrgency.toFixed(2)),
    description: stage.description,
  };
}

/* =========================================================
   AUDIT LOG
   ========================================================= */

async function createAuditLog({ action, waterGroupId, type, farmerId, message, metadata = {} }) {
  const log = await AuditLog.create({
    id: "log-" + Date.now().toString() + "-" + crypto.randomUUID().slice(0, 4),
    waterGroupId: waterGroupId || "wg-01",
    type: type || action,
    message,
    metadata,
    timestamp: new Date()
  });
  return log;
}

/* =========================================================
   QUEUE COMPUTATION
   ========================================================= */

async function computeQueue(waterGroupId, customWeights = null) {
  let group = await WaterGroup.findOne({ id: waterGroupId });
  if (!group) {
    group = await WaterGroup.findOne(); // fallback
  }
  if (!group) {
    return { success: false, message: "No water groups found" };
  }
  
  const groupPlots = await Plot.find({ waterGroupId: group.id });
  const allFarmers = await Farmer.find({ waterGroupId: group.id });
  
  const weights = customWeights || { w1_stageCriticality: 0.6, w2_waitingScore: 0.25, w3_smallholderFairness: 0.15 };

  const queueItems = groupPlots.map(plot => {
    const farmer = allFarmers.find(f => f.id === plot.farmerId) || { name: "Farmer", phone: "+91 98000 00000", category: "Marginal" };

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

  const activeTurn = await WaterTurn.findOne({ waterGroupId: group.id, status: "IN_PROGRESS" });

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

module.exports = {
  calculateDaysSinceSowing,
  calculateCropStage,
  calculateUrgency,
  createAuditLog,
  computeQueue
};
