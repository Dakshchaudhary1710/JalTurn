import { CROPS } from "../utils/cropData.js";

/**
 * Default Formula Weights (Field Calibrated & Tunable)
 */
export const DEFAULT_WEIGHTS = {
  w1_stageCriticality: 0.60,
  w2_waitingScore: 0.25,
  w3_smallholderFairness: 0.15
};

/**
 * Calculates days elapsed between sowing date and reference date
 */
export function calculateDaysSinceSowing(sowingDate, referenceDate = new Date()) {
  const sowing = new Date(sowingDate);
  const current = new Date(referenceDate);
  const diffTime = Math.max(0, current - sowing);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 1-indexed (Day 1 = sowing day)
}

/**
 * Determines current FAO-56 growth stage and base stage criticality
 */
export function determineCropStage(cropId, sowingDate, referenceDate = new Date()) {
  const crop = CROPS[cropId.toLowerCase()] || CROPS.wheat;
  const daysSinceSowing = calculateDaysSinceSowing(sowingDate, referenceDate);

  const stages = crop.stages;
  let activeStageKey = "initial";
  let activeStage = stages.initial;
  let stageDayOffset = daysSinceSowing;

  if (daysSinceSowing <= stages.initial.endDay) {
    activeStageKey = "initial";
    activeStage = stages.initial;
    stageDayOffset = daysSinceSowing;
  } else if (daysSinceSowing <= stages.development.endDay) {
    activeStageKey = "development";
    activeStage = stages.development;
    stageDayOffset = daysSinceSowing - stages.initial.endDay;
  } else if (daysSinceSowing <= stages.midSeason.endDay) {
    activeStageKey = "midSeason";
    activeStage = stages.midSeason;
    stageDayOffset = daysSinceSowing - stages.development.endDay;
  } else if (daysSinceSowing <= stages.lateSeason.endDay) {
    activeStageKey = "lateSeason";
    activeStage = stages.lateSeason;
    stageDayOffset = daysSinceSowing - stages.midSeason.endDay;
  } else {
    // Post-harvest / Matured
    activeStageKey = "harvestReady";
    activeStage = {
      name: "Harvest Ready / Post-Maturity",
      durationDays: 10,
      startDay: stages.lateSeason.endDay + 1,
      endDay: stages.lateSeason.endDay + 10,
      kc: 0.25,
      criticality: 10,
      description: "Crop has reached physiological maturity. Low moisture requirement.",
      sensitivityRank: "Minimal"
    };
    stageDayOffset = daysSinceSowing - stages.lateSeason.endDay;
  }

  const stageProgressPercent = Math.min(
    100,
    Math.round((stageDayOffset / activeStage.durationDays) * 100)
  );

  return {
    cropId: crop.id,
    cropName: crop.name,
    scientificName: crop.scientificName,
    season: crop.season,
    daysSinceSowing,
    totalDurationDays: crop.totalDurationDays,
    stageKey: activeStageKey,
    stageName: activeStage.name,
    stageCriticality: activeStage.criticality,
    kc: activeStage.kc,
    stageProgressPercent,
    sensitivityRank: activeStage.sensitivityRank,
    description: activeStage.description,
    optimalIntervalDays: crop.irrigationIntervalDays
  };
}

/**
 * Calculates Normalized Waiting Score (0 - 100)
 * Evaluates how long the plot has been waiting relative to optimal irrigation cycle
 */
export function calculateWaitingScore(daysSinceLastWater, optimalIntervalDays = 18) {
  const waitDays = Math.max(0, Number(daysSinceLastWater) || 0);
  if (waitDays <= 0) return 10;
  
  // Score reaches 100 if wait time exceeds 1.5x the normal interval
  const ratio = waitDays / optimalIntervalDays;
  const score = Math.min(100, Math.round(ratio * 70));
  return Math.max(10, score);
}

/**
 * Calculates Normalized Smallholder Fairness Score (0 - 100)
 * Marginal & small farmers (< 1-2 acres) get higher baseline equity support
 * to prevent large landholders from monopolizing communal water turns.
 */
export function calculateSmallholderScore(landholdingSizeAcres) {
  const land = Math.max(0.1, Number(landholdingSizeAcres) || 1.0);
  
  // Inverse monotonic function:
  // <= 0.5 acre -> ~95-100
  // 1.0 acre    -> ~85
  // 2.0 acres   -> ~70
  // 5.0 acres   -> ~45
  // 10.0 acres  -> ~25
  const score = Math.round(100 * (1.8 / (0.8 + land)));
  return Math.max(15, Math.min(100, score));
}

/**
 * Master Urgency Score Calculator
 * Returns full explainability breakdown
 */
export function calculateUrgency(plotData, customWeights = DEFAULT_WEIGHTS) {
  const {
    crop = "wheat",
    sowingDate,
    landArea = 1.0,
    lastWateredAt,
    daysSinceLastWater,
    evidenceVerified = false
  } = plotData;

  const weights = {
    w1: customWeights.w1_stageCriticality ?? DEFAULT_WEIGHTS.w1_stageCriticality,
    w2: customWeights.w2_waitingScore ?? DEFAULT_WEIGHTS.w2_waitingScore,
    w3: customWeights.w3_smallholderFairness ?? DEFAULT_WEIGHTS.w3_smallholderFairness
  };

  // Determine Crop Stage and Criticality
  const stageInfo = determineCropStage(crop, sowingDate);

  // Compute Days Since Last Water
  let waitDays = daysSinceLastWater;
  if (waitDays === undefined && lastWateredAt) {
    const lastWater = new Date(lastWateredAt);
    const diff = Math.max(0, new Date() - lastWater);
    waitDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  }
  waitDays = waitDays !== undefined ? Number(waitDays) : 4;

  const waitingScore = calculateWaitingScore(waitDays, stageInfo.optimalIntervalDays);
  const smallholderScore = calculateSmallholderScore(landArea);

  // Composite Formula
  const rawUrgency = (
    weights.w1 * stageInfo.stageCriticality +
    weights.w2 * waitingScore +
    weights.w3 * smallholderScore
  );

  const urgencyScore = Number(rawUrgency.toFixed(2));

  return {
    crop: stageInfo.cropName,
    cropId: stageInfo.cropId,
    daysSinceSowing: stageInfo.daysSinceSowing,
    stageKey: stageInfo.stageKey,
    stageName: stageInfo.stageName,
    stageCriticality: stageInfo.stageCriticality,
    sensitivityRank: stageInfo.sensitivityRank,
    kc: stageInfo.kc,
    description: stageInfo.description,
    
    // Waiting metrics
    waitDays,
    optimalIntervalDays: stageInfo.optimalIntervalDays,
    waitingScore,

    // Land metrics
    landArea: Number(landArea),
    smallholderScore,

    // Evidence
    evidenceVerified: Boolean(evidenceVerified),

    // Final Score & Weights
    urgencyScore,
    weights: {
      w1_stageCriticality: weights.w1,
      w2_waitingScore: weights.w2,
      w3_smallholderFairness: weights.w3
    },

    // Contribution Breakdown
    breakdown: {
      stageContribution: Number((weights.w1 * stageInfo.stageCriticality).toFixed(2)),
      waitingContribution: Number((weights.w2 * waitingScore).toFixed(2)),
      smallholderContribution: Number((weights.w3 * smallholderScore).toFixed(2))
    },

    // Human-readable explanation text
    explanation: `Calculated from ${stageInfo.stageName} (${stageInfo.stageCriticality}/100, ${weights.w1 * 100}% wt), ${waitDays} days waiting (${waitingScore}/100, ${weights.w2 * 100}% wt), and ${landArea} acre plot fairness (${smallholderScore}/100, ${weights.w3 * 100}% wt).`
  };
}
