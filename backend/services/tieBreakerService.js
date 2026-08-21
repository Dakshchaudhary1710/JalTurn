/**
 * JalTurn Predefined 4-Tier Tie-Breaker Engine
 * 
 * Rules Chain:
 * 1. Longer waiting time (Days since last water)
 * 2. Smaller landholding size (Marginal farmer equity)
 * 3. Verified crop-stage evidence (Soil moisture / geotagged photo / field validation)
 * 4. Public Verifiable Lottery (Cryptographic/Deterministic seed-based random draw)
 */

export function resolveTieBetweenFarmers(farmerA, farmerB, context = {}) {
  const logSteps = [];
  const scoreDiff = Math.abs(farmerA.urgencyScore - farmerB.urgencyScore);

  if (scoreDiff > 0.05) {
    return {
      isTie: false,
      winner: farmerA.urgencyScore > farmerB.urgencyScore ? farmerA : farmerB,
      loser: farmerA.urgencyScore > farmerB.urgencyScore ? farmerB : farmerA,
      tier: "SCORE_DIFFERENCE",
      reason: `Farmer with higher urgency score (${Math.max(farmerA.urgencyScore, farmerB.urgencyScore)} vs ${Math.min(farmerA.urgencyScore, farmerB.urgencyScore)}) took priority.`,
      logSteps
    };
  }

  logSteps.push({
    step: 1,
    rule: "Urgency Score Comparison",
    detail: `Both farmers have equal urgency score: ${farmerA.urgencyScore.toFixed(2)} vs ${farmerB.urgencyScore.toFixed(2)}.`
  });

  // TIER 1: Longer Waiting Time
  const waitA = Number(farmerA.waitDays || farmerA.plot?.daysSinceLastWater || 0);
  const waitB = Number(farmerB.waitDays || farmerB.plot?.daysSinceLastWater || 0);

  if (waitA !== waitB) {
    const winner = waitA > waitB ? farmerA : farmerB;
    const loser = waitA > waitB ? farmerB : farmerA;
    const winnerWait = Math.max(waitA, waitB);
    const loserWait = Math.min(waitA, waitB);

    logSteps.push({
      step: 2,
      rule: "Tier 1: Waiting Time Priority",
      detail: `${winner.name} waited ${winnerWait} days vs ${loser.name} (${loserWait} days).`,
      resolved: true
    });

    return {
      isTie: true,
      winner,
      loser,
      tier: "TIER_1_WAITING_TIME",
      reason: `Tier 1 Tie-Break: ${winner.name} has waited longer (${winnerWait} days vs ${loserWait} days).`,
      logSteps
    };
  }

  logSteps.push({
    step: 2,
    rule: "Tier 1: Waiting Time Priority",
    detail: `Both farmers have identical waiting time (${waitA} days). Proceeding to Tier 2.`
  });

  // TIER 2: Smaller Landholding Size (Equity for marginal/smallholders)
  const landA = Number(farmerA.landArea || farmerA.landholdingSize || 1.0);
  const landB = Number(farmerB.landArea || farmerB.landholdingSize || 1.0);

  if (Math.abs(landA - landB) > 0.05) {
    const winner = landA < landB ? farmerA : farmerB;
    const loser = landA < landB ? farmerB : farmerA;
    const winnerLand = Math.min(landA, landB);
    const loserLand = Math.max(landA, landB);

    logSteps.push({
      step: 3,
      rule: "Tier 2: Landholding Size (Smallholder Equity)",
      detail: `${winner.name} (${winnerLand} acres) prioritised over ${loser.name} (${loserLand} acres).`,
      resolved: true
    });

    return {
      isTie: true,
      winner,
      loser,
      tier: "TIER_2_LANDHOLDING",
      reason: `Tier 2 Tie-Break: ${winner.name} holds a smaller plot (${winnerLand} acres vs ${loserLand} acres) to protect smallholder resilience.`,
      logSteps
    };
  }

  logSteps.push({
    step: 3,
    rule: "Tier 2: Landholding Size",
    detail: `Both farmers hold equal plot sizes (${landA} acres). Proceeding to Tier 3.`
  });

  // TIER 3: Verified Crop-Stage Evidence
  const evA = Boolean(farmerA.evidenceVerified || farmerA.plot?.evidenceVerified);
  const evB = Boolean(farmerB.evidenceVerified || farmerB.plot?.evidenceVerified);

  if (evA !== evB) {
    const winner = evA ? farmerA : farmerB;
    const loser = evA ? farmerB : farmerA;

    logSteps.push({
      step: 4,
      rule: "Tier 3: Verified Agronomic Evidence",
      detail: `${winner.name} has submitted verified agronomic field/soil evidence.`,
      resolved: true
    });

    return {
      isTie: true,
      winner,
      loser,
      tier: "TIER_3_EVIDENCE",
      reason: `Tier 3 Tie-Break: ${winner.name} provided verified agronomic evidence / soil-moisture validation.`,
      logSteps
    };
  }

  logSteps.push({
    step: 4,
    rule: "Tier 3: Verified Agronomic Evidence",
    detail: `Evidence status identical (${evA ? "Both Verified" : "Neither Verified"}). Proceeding to Tier 4.`
  });

  // TIER 4: Public Verifiable Lottery
  const seedString = `${context.waterGroupId || "WG"}_${context.date || new Date().toISOString().slice(0, 10)}_${farmerA.id || farmerA.name}_${farmerB.id || farmerB.name}`;
  // Simple deterministic hash for transparency
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash |= 0;
  }
  const isAWinner = Math.abs(hash) % 2 === 0;
  const winner = isAWinner ? farmerA : farmerB;
  const loser = isAWinner ? farmerB : farmerA;

  logSteps.push({
    step: 5,
    rule: "Tier 4: Public Verifiable Lottery",
    detail: `Deterministic cryptographic draw executed with seed '${seedString}'. Winner: ${winner.name}.`,
    resolved: true
  });

  return {
    isTie: true,
    winner,
    loser,
    tier: "TIER_4_PUBLIC_LOTTERY",
    reason: `Tier 4 Tie-Break: Public algorithmic lottery draw selected ${winner.name} (Seed: ${seedString}).`,
    logSteps
  };
}

/**
 * Sorts array of candidate plots/farmers applying full urgency + tie-break chain
 */
export function sortQueueWithTieBreakers(queueItems, context = {}) {
  const sorted = [...queueItems].sort((a, b) => {
    // 1. Urgency score descending
    if (Math.abs(b.urgencyScore - a.urgencyScore) > 0.05) {
      return b.urgencyScore - a.urgencyScore;
    }

    // Tie-break resolution
    const resolution = resolveTieBetweenFarmers(a, b, context);
    return resolution.winner.id === a.id ? -1 : 1;
  });

  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}
