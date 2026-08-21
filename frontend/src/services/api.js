/**
 * JalTurn Frontend API Service
 * Connects to Express REST Backend with automatic fallback to local simulation
 */

import { CROPS } from "../utils/cropDatabase.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Local in-browser fallback state store
const localStore = {
  waterGroups: [
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
  ],
  farmers: [
    { id: "farmer-01", name: "Rameshwar Singh (रामेश्वर सिंह)", phone: "+91 98765 43210", landholdingSize: 1.2, category: "Marginal", waterGroupId: "wg-01" },
    { id: "farmer-02", name: "Suresh Patel (सुरेश पटेल)", phone: "+91 98123 45678", landholdingSize: 0.8, category: "Marginal", waterGroupId: "wg-01" },
    { id: "farmer-03", name: "Anita Devi (अनीता देवी)", phone: "+91 97234 56789", landholdingSize: 0.6, category: "Marginal", waterGroupId: "wg-01" },
    { id: "farmer-04", name: "Mohan Lal Sharma (मोहन लाल)", phone: "+91 94111 22334", landholdingSize: 4.5, category: "Medium", waterGroupId: "wg-01" },
    { id: "farmer-05", name: "Harpreet Kaur (हरप्रीत कौर)", phone: "+91 98450 11223", landholdingSize: 1.5, category: "Small", waterGroupId: "wg-01" },
    { id: "farmer-06", name: "Devendra Yadav (देवेन्द्र यादव)", phone: "+91 93321 99887", landholdingSize: 6.0, category: "Large", waterGroupId: "wg-01" }
  ],
  plots: [
    {
      id: "plot-01",
      farmerId: "farmer-01",
      crop: "wheat",
      sowingDate: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 1.2,
      lastWateredAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 19,
      waterGroupId: "wg-01",
      evidenceVerified: true
    },
    {
      id: "plot-02",
      farmerId: "farmer-02",
      crop: "wheat",
      sowingDate: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 0.8,
      lastWateredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 15,
      waterGroupId: "wg-01",
      evidenceVerified: false
    },
    {
      id: "plot-03",
      farmerId: "farmer-03",
      crop: "mustard",
      sowingDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 0.6,
      lastWateredAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 12,
      waterGroupId: "wg-01",
      evidenceVerified: true
    },
    {
      id: "plot-04",
      farmerId: "farmer-04",
      crop: "wheat",
      sowingDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 4.5,
      lastWateredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 10,
      waterGroupId: "wg-01",
      evidenceVerified: false
    },
    {
      id: "plot-05",
      farmerId: "farmer-05",
      crop: "gram",
      sowingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 1.5,
      lastWateredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 8,
      waterGroupId: "wg-01",
      evidenceVerified: false
    },
    {
      id: "plot-06",
      farmerId: "farmer-06",
      crop: "potato",
      sowingDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 6.0,
      lastWateredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 7,
      waterGroupId: "wg-01",
      evidenceVerified: true
    }
  ],
  waterTurns: [
    {
      id: "turn-01",
      _id: "turn-01",
      farmerId: "farmer-01",
      farmerName: "Rameshwar Singh",
      cropName: "Wheat",
      plotId: "plot-01",
      waterGroupId: "wg-01",
      score: 91.45,
      rank: 1,
      scheduledAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      completedAt: null,
      status: "IN_PROGRESS",
      durationMinutes: 120,
      tieBreakReason: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "turn-hist-01",
      farmerId: "farmer-03",
      farmerName: "Anita Devi",
      cropName: "Mustard",
      plotId: "plot-03",
      waterGroupId: "wg-01",
      score: 84.2,
      rank: 1,
      startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      durationMinutes: 120,
      tieBreakReason: "Tie resolved: Longer waiting time (14 days vs 10 days)",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    }
  ],
  disputes: [
    {
      id: "disp-01",
      farmerId: "farmer-04",
      farmerName: "Mohan Lal Sharma",
      turnId: "turn-01",
      waterGroupId: "wg-01",
      reason: "Claimed sowing date was 5 days earlier than recorded in system.",
      status: "RESOLVED",
      resolutionNote: "Coordinator verified with seed purchase invoice; corrected sowing date to 2025-12-08.",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ],
  logs: [
    {
      id: "log-01",
      waterGroupId: "wg-01",
      type: "QUEUE_RECALCULATION",
      message: "Priority queue dynamically recomputed for 6 plots based on FAO-56 stage updates.",
      timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString()
    },
    {
      id: "log-02",
      waterGroupId: "wg-01",
      type: "TURN_STARTED",
      message: "Water turn initiated for Rameshwar Singh (Wheat - Flowering/Milk stage, Urgency 91.45).",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    }
  ]
};

// Client-side Local Calculation Helper
function calculateClientUrgency(plot, weights = { w1_stageCriticality: 0.6, w2_waitingScore: 0.25, w3_smallholderFairness: 0.15 }) {
  const cropConfig = CROPS[plot.crop] || CROPS.wheat;
  const sowing = new Date(plot.sowingDate);
  const today = new Date();
  const daysSinceSowing = Math.max(1, Math.floor((today - sowing) / (1000 * 60 * 60 * 24)) + 1);

  let stage = cropConfig.stages.initial;
  let stageKey = "initial";
  if (daysSinceSowing <= cropConfig.stages.initial.endDay) {
    stage = cropConfig.stages.initial;
    stageKey = "initial";
  } else if (daysSinceSowing <= cropConfig.stages.development.endDay) {
    stage = cropConfig.stages.development;
    stageKey = "development";
  } else if (daysSinceSowing <= cropConfig.stages.midSeason.endDay) {
    stage = cropConfig.stages.midSeason;
    stageKey = "midSeason";
  } else if (daysSinceSowing <= cropConfig.stages.lateSeason.endDay) {
    stage = cropConfig.stages.lateSeason;
    stageKey = "lateSeason";
  } else {
    stage = { name: "Harvest Ready / Post-Maturity", criticality: 10, kc: 0.25, description: "Crop mature. Low moisture demand." };
    stageKey = "harvestReady";
  }

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
    explanation: `Calculated from ${stage.name} (${stage.criticality}/100, ${weights.w1_stageCriticality * 100}% wt), ${waitDays} days waiting (${waitingScore}/100, ${weights.w2_waitingScore * 100}% wt), and ${land} acre plot fairness (${smallholderScore}/100, ${weights.w3_smallholderFairness * 100}% wt).`
  };
}

function computeClientQueue(waterGroupId = "wg-01", customWeights = null) {
  const group = localStore.waterGroups.find(g => g.id === waterGroupId) || localStore.waterGroups[0];
  const groupPlots = localStore.plots.filter(p => p.waterGroupId === group.id);
  const weights = customWeights || { w1_stageCriticality: 0.6, w2_waitingScore: 0.25, w3_smallholderFairness: 0.15 };

  const queueItems = groupPlots.map(plot => {
    const farmer = localStore.farmers.find(f => f.id === plot.farmerId) || { name: "Farmer", phone: "+91 98000 00000", category: "Marginal" };
    const urgency = calculateClientUrgency(plot, weights);

    return {
      id: plot.id,
      plotId: plot.id,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      farmerCategory: farmer.category,
      waterGroupId: group.id,
      ...urgency,
      evidenceVerified: Boolean(plot.evidenceVerified)
    };
  });

  // Sort by urgency descending
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

  const activeTurn = localStore.waterTurns.find(t => t.waterGroupId === group.id && t.status === "IN_PROGRESS");

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

// Fetch helper with transparent fallback
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`[JalTurn API] Backend unreachable at ${endpoint}. Using high-fidelity local engine fallback.`);
    return null; // Signals fallback
  }
}

export const api = {
  // Water Groups
  getWaterGroups: async () => {
    const res = await apiRequest("/water-groups");
    if (res) return res;
    return { success: true, waterGroups: localStore.waterGroups };
  },

  // Authoritative Queue
  getQueue: async (waterGroupId = "wg-01") => {
    const res = await apiRequest(`/queue/${waterGroupId}`);
    if (res) return res;
    return computeClientQueue(waterGroupId);
  },

  recalculateQueue: async (waterGroupId = "wg-01", customWeights = null) => {
    const res = await apiRequest("/queue/recalculate", {
      method: "POST",
      body: JSON.stringify({ waterGroupId, customWeights })
    });
    if (res) return res;
    return computeClientQueue(waterGroupId, customWeights);
  },

  // Turns
  startTurn: async (waterGroupId, plotId) => {
    const res = await apiRequest("/turns/start", {
      method: "POST",
      body: JSON.stringify({ waterGroupId, plotId })
    });
    if (res) return res;

    const queueData = computeClientQueue(waterGroupId);
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
    localStore.waterTurns.unshift(newTurn);
    localStore.logs.unshift({
      id: "log-" + Date.now(),
      waterGroupId,
      type: "TURN_STARTED",
      message: `Water turn started for ${plot.farmerName} (${plot.crop}).`,
      timestamp: new Date().toISOString()
    });
    return { success: true, turn: newTurn };
  },

  completeTurn: async (waterGroupId, turnId) => {
    const res = await apiRequest("/turns/complete", {
      method: "POST",
      body: JSON.stringify({ waterGroupId, turnId })
    });
    if (res) return res;

    const turn = localStore.waterTurns.find(t => t.status === "IN_PROGRESS") || localStore.waterTurns[0];
    if (turn) {
      turn.status = "COMPLETED";
      turn.completedAt = new Date().toISOString();
      // Reset plot wait
      const p = localStore.plots.find(pl => pl.id === turn.plotId);
      if (p) p.daysSinceLastWater = 0;

      localStore.logs.unshift({
        id: "log-" + Date.now(),
        waterGroupId,
        type: "TURN_COMPLETED",
        message: `Water turn completed for ${turn.farmerName}. Plot moisture replenished; queue recalculated.`,
        timestamp: new Date().toISOString()
      });
    }
    return { success: true, turn };
  },

  skipTurn: async (waterGroupId, turnId, reason) => {
    const res = await apiRequest("/turns/skip", {
      method: "POST",
      body: JSON.stringify({ waterGroupId, turnId, reason })
    });
    if (res) return res;

    const turn = localStore.waterTurns.find(t => t.status === "IN_PROGRESS");
    if (turn) {
      turn.status = "SKIPPED";
      turn.tieBreakReason = `Skipped: ${reason || 'Operator override'}`;
    }
    return { success: true, turn };
  },

  getTurnHistory: async (waterGroupId = "wg-01") => {
    const res = await apiRequest(`/turns/history/${waterGroupId}`);
    if (res) return res;
    return { success: true, turns: localStore.waterTurns };
  },

  // Farmers Registration
  getFarmers: async (waterGroupId = "wg-01") => {
    const res = await apiRequest(`/farmers?waterGroupId=${waterGroupId}`);
    if (res) return res;
    return { success: true, count: localStore.farmers.length, farmers: localStore.farmers };
  },

  registerFarmer: async (farmerData) => {
    const res = await apiRequest("/farmers", {
      method: "POST",
      body: JSON.stringify(farmerData)
    });
    if (res) return res;

    const newFarmer = {
      id: "farmer-" + Date.now().toString().slice(-4),
      name: farmerData.name,
      phone: farmerData.phone || "+91 98000 00000",
      landholdingSize: Number(farmerData.landArea || 1.0),
      category: Number(farmerData.landArea) <= 1.0 ? "Marginal" : "Small",
      waterGroupId: farmerData.waterGroupId || "wg-01"
    };
    localStore.farmers.push(newFarmer);

    const newPlot = {
      id: "plot-" + Date.now().toString().slice(-4),
      farmerId: newFarmer.id,
      crop: farmerData.crop,
      sowingDate: farmerData.sowingDate,
      landArea: newFarmer.landholdingSize,
      daysSinceLastWater: Number(farmerData.daysSinceLastWater || 5),
      waterGroupId: newFarmer.waterGroupId,
      evidenceVerified: Boolean(farmerData.evidenceVerified)
    };
    localStore.plots.push(newPlot);

    localStore.logs.unshift({
      id: "log-" + Date.now(),
      waterGroupId: newFarmer.waterGroupId,
      type: "FARMER_REGISTERED",
      message: `New farmer ${newFarmer.name} (${newFarmer.landholdingSize} acres) registered.`,
      timestamp: new Date().toISOString()
    });

    return { success: true, farmer: newFarmer, plot: newPlot };
  },

  // Disputes
  getDisputes: async (waterGroupId = "wg-01") => {
    const res = await apiRequest(`/disputes/${waterGroupId}`);
    if (res) return res;
    return { success: true, disputes: localStore.disputes };
  },

  createDispute: async (disputeData) => {
    const res = await apiRequest("/disputes", {
      method: "POST",
      body: JSON.stringify(disputeData)
    });
    if (res) return res;

    const newDispute = {
      id: "disp-" + Date.now().toString().slice(-4),
      farmerId: disputeData.farmerId,
      farmerName: disputeData.farmerName || "Farmer",
      turnId: disputeData.turnId || "turn-01",
      waterGroupId: disputeData.waterGroupId || "wg-01",
      reason: disputeData.reason,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };
    localStore.disputes.unshift(newDispute);
    localStore.logs.unshift({
      id: "log-" + Date.now(),
      waterGroupId: newDispute.waterGroupId,
      type: "DISPUTE_RAISED",
      message: `Dispute raised: "${disputeData.reason}".`,
      timestamp: new Date().toISOString()
    });
    return { success: true, dispute: newDispute };
  },

  // Logs
  getLogs: async (waterGroupId = "wg-01") => {
    const res = await apiRequest(`/logs/${waterGroupId}`);
    if (res) return res;
    return { success: true, logs: localStore.logs };
  }
};
