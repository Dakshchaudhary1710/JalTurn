import { calculateUrgency, DEFAULT_WEIGHTS } from "./agronomyEngine.js";
import { sortQueueWithTieBreakers, resolveTieBetweenFarmers } from "./tieBreakerService.js";
import { INITIAL_DATA } from "../utils/seedData.js";
import { v4 as uuidv4 } from "uuid";

// In-Memory dynamic state store (seamless local store with full persistence during server runtime)
class WaterGroupStore {
  constructor() {
    this.waterGroups = JSON.parse(JSON.stringify(INITIAL_DATA.waterGroups));
    this.farmers = JSON.parse(JSON.stringify(INITIAL_DATA.farmers));
    this.plots = JSON.parse(JSON.stringify(INITIAL_DATA.plots));
    this.waterTurns = JSON.parse(JSON.stringify(INITIAL_DATA.waterTurns));
    this.disputes = JSON.parse(JSON.stringify(INITIAL_DATA.disputes));
    this.logs = JSON.parse(JSON.stringify(INITIAL_DATA.logs));
    this.customWeights = { ...DEFAULT_WEIGHTS };
  }

  // LOGGING
  addLog(waterGroupId, type, message, metadata = {}) {
    const newLog = {
      id: "log-" + uuidv4().slice(0, 8),
      waterGroupId,
      type,
      message,
      metadata,
      timestamp: new Date().toISOString()
    };
    this.logs.unshift(newLog);
    return newLog;
  }

  // FARMERS
  getFarmers(waterGroupId) {
    if (!waterGroupId) return this.farmers;
    return this.farmers.filter(f => f.waterGroupId === waterGroupId);
  }

  getFarmerById(farmerId) {
    return this.farmers.find(f => f.id === farmerId || f._id === farmerId);
  }

  addFarmer(farmerData) {
    const newFarmer = {
      id: "farmer-" + uuidv4().slice(0, 8),
      _id: "farmer-" + uuidv4().slice(0, 8),
      name: farmerData.name,
      phone: farmerData.phone,
      landholdingSize: Number(farmerData.landholdingSize) || 1.0,
      category: Number(farmerData.landholdingSize) <= 1.0 ? "Marginal" : Number(farmerData.landholdingSize) <= 2.5 ? "Small" : "Medium",
      waterGroupId: farmerData.waterGroupId || "wg-01",
      createdAt: new Date().toISOString()
    };
    this.farmers.push(newFarmer);

    // Also register plot if provided in registration
    if (farmerData.crop && farmerData.sowingDate) {
      this.addPlot({
        farmerId: newFarmer.id,
        crop: farmerData.crop,
        sowingDate: farmerData.sowingDate,
        landArea: newFarmer.landholdingSize,
        lastWateredAt: farmerData.lastWateredAt || new Date(Date.now() - (Number(farmerData.daysSinceLastWater || 5) * 24 * 3600 * 1000)).toISOString(),
        daysSinceLastWater: Number(farmerData.daysSinceLastWater) || 5,
        waterGroupId: newFarmer.waterGroupId,
        evidenceVerified: Boolean(farmerData.evidenceVerified),
        notes: farmerData.notes || ""
      });
    }

    this.addLog(newFarmer.waterGroupId, "FARMER_REGISTERED", `New farmer ${newFarmer.name} (${newFarmer.landholdingSize} acres) registered.`);
    return newFarmer;
  }

  // PLOTS
  getPlots(waterGroupId) {
    if (!waterGroupId) return this.plots;
    return this.plots.filter(p => p.waterGroupId === waterGroupId);
  }

  getPlotById(plotId) {
    return this.plots.find(p => p.id === plotId || p._id === plotId);
  }

  addPlot(plotData) {
    const newPlot = {
      id: "plot-" + uuidv4().slice(0, 8),
      _id: "plot-" + uuidv4().slice(0, 8),
      farmerId: plotData.farmerId,
      crop: plotData.crop,
      sowingDate: plotData.sowingDate,
      landArea: Number(plotData.landArea || 1.0),
      lastWateredAt: plotData.lastWateredAt || new Date().toISOString(),
      daysSinceLastWater: Number(plotData.daysSinceLastWater || 0),
      waterGroupId: plotData.waterGroupId || "wg-01",
      evidenceVerified: Boolean(plotData.evidenceVerified),
      soilMoisturePct: plotData.soilMoisturePct || 25,
      notes: plotData.notes || ""
    };
    this.plots.push(newPlot);
    return newPlot;
  }

  updatePlot(plotId, updates) {
    const plotIndex = this.plots.findIndex(p => p.id === plotId || p._id === plotId);
    if (plotIndex === -1) return null;
    this.plots[plotIndex] = { ...this.plots[plotIndex], ...updates };
    return this.plots[plotIndex];
  }

  // WATER GROUPS
  getWaterGroups() {
    return this.waterGroups;
  }

  getWaterGroupById(id) {
    return this.waterGroups.find(g => g.id === id || g._id === id);
  }

  updateWaterGroup(id, updates) {
    const idx = this.waterGroups.findIndex(g => g.id === id || g._id === id);
    if (idx === -1) return null;
    this.waterGroups[idx] = { ...this.waterGroups[idx], ...updates };
    return this.waterGroups[idx];
  }

  // AUTHORITATIVE PRIORITY QUEUE CALCULATION
  getAuthoritativeQueue(waterGroupId = "wg-01", customWeights = null) {
    const group = this.getWaterGroupById(waterGroupId) || this.waterGroups[0];
    const groupPlots = this.getPlots(group.id);
    const activeWeights = customWeights || this.customWeights;

    // 1. Calculate urgency for every registered plot in group
    const queueCandidates = groupPlots.map(plot => {
      const farmer = this.getFarmerById(plot.farmerId) || { name: "Unknown Farmer", phone: "N/A", landholdingSize: plot.landArea };
      
      const urgencyResult = calculateUrgency({
        crop: plot.crop,
        sowingDate: plot.sowingDate,
        landArea: plot.landArea,
        lastWateredAt: plot.lastWateredAt,
        daysSinceLastWater: plot.daysSinceLastWater,
        evidenceVerified: plot.evidenceVerified
      }, activeWeights);

      return {
        id: plot.id,
        plotId: plot.id,
        farmerId: farmer.id || plot.farmerId,
        farmerName: farmer.name,
        farmerPhone: farmer.phone,
        farmerCategory: farmer.category,
        waterGroupId: group.id,
        
        // Plot & Agronomic metrics
        crop: urgencyResult.crop,
        cropId: urgencyResult.cropId,
        daysSinceSowing: urgencyResult.daysSinceSowing,
        stageKey: urgencyResult.stageKey,
        stageName: urgencyResult.stageName,
        stageCriticality: urgencyResult.stageCriticality,
        sensitivityRank: urgencyResult.sensitivityRank,
        kc: urgencyResult.kc,
        description: urgencyResult.description,

        // Waiting & Land metrics
        waitDays: urgencyResult.waitDays,
        waitingScore: urgencyResult.waitingScore,
        landArea: urgencyResult.landArea,
        smallholderScore: urgencyResult.smallholderScore,
        evidenceVerified: urgencyResult.evidenceVerified,
        soilMoisturePct: plot.soilMoisturePct,

        // Final score and mathematical breakdown
        urgencyScore: urgencyResult.urgencyScore,
        weights: urgencyResult.weights,
        breakdown: urgencyResult.breakdown,
        explanation: urgencyResult.explanation
      };
    });

    // 2. Sort queue applying tie-breaker hierarchy
    const sortedQueue = sortQueueWithTieBreakers(queueCandidates, { waterGroupId: group.id, date: new Date().toISOString().slice(0, 10) });

    // 3. Compute estimated turnaround & duration
    let accumulatedMinutes = 0;
    const now = new Date();

    // Check if there is an active turn in progress
    const activeTurn = this.waterTurns.find(t => t.waterGroupId === group.id && t.status === "IN_PROGRESS");
    let remainingActiveMinutes = 0;
    if (activeTurn && activeTurn.startedAt) {
      const elapsedMins = Math.floor((now - new Date(activeTurn.startedAt)) / (1000 * 60));
      remainingActiveMinutes = Math.max(5, (activeTurn.durationMinutes || 120) - elapsedMins);
    }

    const queueWithEstimates = sortedQueue.map((item, index) => {
      const turnDurationMins = Math.round(Math.max(60, Math.min(240, item.landArea * 60))); // ~1 hr per acre
      let estWaitMins = remainingActiveMinutes + accumulatedMinutes;
      
      let estTurnText = "Next in line";
      if (index === 0) {
        estTurnText = remainingActiveMinutes > 0 ? `In ${remainingActiveMinutes} mins` : "Immediate";
      } else {
        const hours = Math.floor(estWaitMins / 60);
        const mins = estWaitMins % 60;
        estTurnText = hours > 0 ? `In ${hours}h ${mins}m` : `In ${mins}m`;
      }

      accumulatedMinutes += turnDurationMins;

      // Comparative explanation with farmer #1 if this farmer is not #1
      let comparativeWhy = "";
      if (index > 0) {
        const first = sortedQueue[0];
        if (first.stageCriticality > item.stageCriticality) {
          comparativeWhy = `Your score is lower than ${first.farmerName} because their ${first.crop} is currently in a more water-sensitive stage (${first.stageName}, Criticality ${first.stageCriticality} vs ${item.stageCriticality}).`;
        } else if (first.waitDays > item.waitDays) {
          comparativeWhy = `Your score is lower than ${first.farmerName} because they have waited longer without irrigation (${first.waitDays} days vs ${item.waitDays} days).`;
        } else if (first.landArea < item.landArea) {
          comparativeWhy = `Your score is lower than ${first.farmerName} due to smallholder equity weighting (${first.landArea} acre vs ${item.landArea} acre).`;
        } else {
          comparativeWhy = `Ranked # ${index + 1} based on composite score: ${item.urgencyScore} vs #${index} (${sortedQueue[index - 1].urgencyScore}).`;
        }
      } else {
        comparativeWhy = `Rank #1: Highest composite urgency (${item.urgencyScore}/100) — priority turn scheduled.`;
      }

      return {
        ...item,
        estimatedDurationMinutes: turnDurationMins,
        estimatedWaitMinutes: estWaitMins,
        estimatedTurnText: estTurnText,
        comparativeWhy
      };
    });

    // 4. Calculate Group Fairness & Transparency Indicators
    const fairnessMetrics = this.calculateFairnessMetrics(queueWithEstimates);

    return {
      waterGroup: group,
      activeTurn: activeTurn || null,
      queue: queueWithEstimates,
      fairnessMetrics,
      updatedAt: new Date().toISOString()
    };
  }

  // GROUP FAIRNESS METRICS
  calculateFairnessMetrics(queue) {
    if (!queue || queue.length === 0) {
      return {
        averageWaitDays: 0,
        longestWaitDays: 0,
        smallholderSharePct: 0,
        criticalStageSharePct: 0,
        fairnessIndex: 100
      };
    }

    const waitDaysArr = queue.map(q => q.waitDays);
    const avgWait = (waitDaysArr.reduce((a, b) => a + b, 0) / queue.length).toFixed(1);
    const maxWait = Math.max(...waitDaysArr);

    const smallHoldersCount = queue.filter(q => q.landArea <= 1.5).length;
    const smallholderSharePct = Math.round((smallHoldersCount / queue.length) * 100);

    const criticalCount = queue.filter(q => q.stageCriticality >= 85).length;
    const criticalStageSharePct = Math.round((criticalCount / queue.length) * 100);

    // Fairness Index (0-100): Balances wait variance, smallholder inclusion, and stage sensitivity
    const top3 = queue.slice(0, 3);
    const top3Smallholders = top3.filter(q => q.landArea <= 2.0).length;
    const top3Critical = top3.filter(q => q.stageCriticality >= 80).length;

    let fairnessScore = 75;
    if (top3Smallholders >= 1) fairnessScore += 10;
    if (top3Critical >= 2) fairnessScore += 10;
    if (maxWait < 25) fairnessScore += 5;
    const fairnessIndex = Math.min(96, Math.max(60, fairnessScore));

    return {
      averageWaitDays: Number(avgWait),
      longestWaitDays: maxWait,
      smallholderSharePct,
      criticalStageSharePct,
      fairnessIndex,
      summary: `Transparency/Fairness Indicator: ${fairnessIndex}/100 based on waiting dispersion, smallholder inclusion (${smallholderSharePct}%), and critical stage responsiveness (${criticalStageSharePct}%).`
    };
  }

  // TURN LIFECYCLE MANAGEMENT
  startTurn(waterGroupId, plotId) {
    const queueData = this.getAuthoritativeQueue(waterGroupId);
    const targetPlot = queueData.queue.find(q => q.plotId === plotId) || queueData.queue[0];

    if (!targetPlot) throw new Error("No eligible plot in queue to start turn.");

    // Complete any currently active turn
    this.waterTurns.forEach(t => {
      if (t.waterGroupId === waterGroupId && t.status === "IN_PROGRESS") {
        t.status = "COMPLETED";
        t.completedAt = new Date().toISOString();
      }
    });

    const newTurn = {
      id: "turn-" + uuidv4().slice(0, 8),
      _id: "turn-" + uuidv4().slice(0, 8),
      farmerId: targetPlot.farmerId,
      farmerName: targetPlot.farmerName,
      cropName: targetPlot.crop,
      plotId: targetPlot.plotId,
      waterGroupId,
      score: targetPlot.urgencyScore,
      rank: 1,
      scheduledAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: "IN_PROGRESS",
      durationMinutes: targetPlot.estimatedDurationMinutes || 120,
      tieBreakReason: null,
      createdAt: new Date().toISOString()
    };

    this.waterTurns.unshift(newTurn);
    this.updateWaterGroup(waterGroupId, {
      activeStatus: "ACTIVE",
      currentTurnFarmerId: targetPlot.farmerId,
      currentTurnStartedAt: newTurn.startedAt
    });

    this.addLog(waterGroupId, "TURN_STARTED", `Water turn started for ${targetPlot.farmerName} (${targetPlot.crop}, Urgency: ${targetPlot.urgencyScore}).`, { turnId: newTurn.id });
    return newTurn;
  }

  completeTurn(waterGroupId, turnId) {
    const turn = this.waterTurns.find(t => t.id === turnId || t._id === turnId) || 
                 this.waterTurns.find(t => t.waterGroupId === waterGroupId && t.status === "IN_PROGRESS");

    if (!turn) throw new Error("No active turn found to complete.");

    turn.status = "COMPLETED";
    turn.completedAt = new Date().toISOString();

    // Reset plot days waiting and last watered date
    this.updatePlot(turn.plotId, {
      lastWateredAt: turn.completedAt,
      daysSinceLastWater: 0,
      soilMoisturePct: 85 // freshly irrigated
    });

    this.updateWaterGroup(waterGroupId, {
      activeStatus: "IDLE",
      currentTurnFarmerId: null,
      currentTurnStartedAt: null
    });

    this.addLog(waterGroupId, "TURN_COMPLETED", `Water turn completed for ${turn.farmerName} (${turn.cropName}). Plot moisture replenished; queue recalculated.`);
    return turn;
  }

  skipTurn(waterGroupId, turnId, reason = "Farmer absent / pump maintenance") {
    const turn = this.waterTurns.find(t => t.id === turnId || t._id === turnId) || 
                 this.waterTurns.find(t => t.waterGroupId === waterGroupId && t.status === "IN_PROGRESS");

    if (turn) {
      turn.status = "SKIPPED";
      turn.completedAt = new Date().toISOString();
      turn.tieBreakReason = `Skipped: ${reason}`;
    }

    this.updateWaterGroup(waterGroupId, {
      activeStatus: "IDLE",
      currentTurnFarmerId: null,
      currentTurnStartedAt: null
    });

    this.addLog(waterGroupId, "TURN_SKIPPED", `Turn skipped for ${turn ? turn.farmerName : 'Current Turn'}. Reason: ${reason}.`);
    return turn;
  }

  // DISPUTES
  getDisputes(waterGroupId) {
    if (!waterGroupId) return this.disputes;
    return this.disputes.filter(d => d.waterGroupId === waterGroupId);
  }

  createDispute(disputeData) {
    const farmer = this.getFarmerById(disputeData.farmerId) || { name: "Farmer" };
    const newDispute = {
      id: "disp-" + uuidv4().slice(0, 8),
      _id: "disp-" + uuidv4().slice(0, 8),
      farmerId: disputeData.farmerId,
      farmerName: farmer.name,
      turnId: disputeData.turnId || "turn-general",
      waterGroupId: disputeData.waterGroupId || "wg-01",
      reason: disputeData.reason,
      status: "PENDING",
      resolutionNote: null,
      createdAt: new Date().toISOString()
    };

    this.disputes.unshift(newDispute);
    this.addLog(newDispute.waterGroupId, "DISPUTE_RAISED", `Dispute raised by ${farmer.name}: "${disputeData.reason}".`);
    return newDispute;
  }

  resolveDispute(disputeId, resolutionNote, newStatus = "RESOLVED") {
    const dispute = this.disputes.find(d => d.id === disputeId || d._id === disputeId);
    if (!dispute) throw new Error("Dispute not found");
    dispute.status = newStatus;
    dispute.resolutionNote = resolutionNote;
    this.addLog(dispute.waterGroupId, "DISPUTE_RESOLVED", `Dispute for ${dispute.farmerName} resolved: ${resolutionNote}`);
    return dispute;
  }

  // TIE-BREAKER DEMO GENERATOR (Phase 7 Specific)
  generateTieDemoScenario() {
    const farmerA = {
      id: "demo-farmer-a",
      name: "Farmer A (Ravi)",
      crop: "wheat",
      stageName: "Mid-Season (Flowering)",
      stageCriticality: 92,
      waitDays: 5,
      landArea: 1.0,
      evidenceVerified: false,
      urgencyScore: 87.5
    };

    const farmerB = {
      id: "demo-farmer-b",
      name: "Farmer B (Vikram)",
      crop: "wheat",
      stageName: "Mid-Season (Flowering)",
      stageCriticality: 92,
      waitDays: 5,
      landArea: 1.0,
      evidenceVerified: false,
      urgencyScore: 87.5
    };

    const resolution = resolveTieBetweenFarmers(farmerA, farmerB, { waterGroupId: "demo-tie-group", date: "2026-08-22" });

    return {
      farmerA,
      farmerB,
      resolution,
      demonstrationNote: "Predefined tie-break chain executed without administrator intervention. All rules visible to all farmers."
    };
  }
}

export const store = new WaterGroupStore();
