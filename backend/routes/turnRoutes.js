const express = require('express');
const router = express.Router();
const WaterTurn = require('../models/WaterTurn');
const Plot = require('../models/Plot');
const WaterGroup = require('../models/WaterGroup');
const { computeQueue, createAuditLog } = require('../utils/urgencyCalculator');

router.post("/start", async (req, res) => {
  try {
    const { waterGroupId, plotId } = req.body;
    const queueData = await computeQueue(waterGroupId);
    
    if (!queueData.queue || queueData.queue.length === 0) {
      return res.status(400).json({ success: false, message: "No queued plots available for this water group." });
    }

    const plot = (plotId ? queueData.queue.find(q => q.plotId === plotId) : null) || queueData.queue[0];
    
    const newTurn = await WaterTurn.create({
      id: "turn-" + Date.now().toString().slice(-6),
      farmerId: plot.farmerId,
      farmerName: plot.farmerName,
      cropName: plot.crop,
      plotId: plot.plotId,
      waterGroupId: waterGroupId || plot.waterGroupId || "wg-01",
      score: plot.urgencyScore,
      rank: 1,
      startedAt: new Date(),
      status: "IN_PROGRESS",
      durationMinutes: Math.round(Math.max(60, Math.min(240, (plot.landArea || 1) * 60)))
    });

    // Mark water group as ACTIVE
    const targetGroupId = waterGroupId || plot.waterGroupId || "wg-01";
    await WaterGroup.findOneAndUpdate(
      { $or: [{ id: targetGroupId }, { _id: targetGroupId }] },
      { activeStatus: "ACTIVE", currentTurnFarmerId: plot.farmerId, currentTurnStartedAt: newTurn.startedAt }
    );

    await createAuditLog({
      action: "TURN_STARTED",
      waterGroupId: targetGroupId,
      farmerId: plot.farmerId,
      message: `Water turn started for ${plot.farmerName} (${plot.crop}). Pump activated.`
    });

    res.json({ success: true, turn: newTurn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/complete", async (req, res) => {
  try {
    const { waterGroupId, turnId } = req.body;
    
    let turn;
    if (turnId) {
      turn = await WaterTurn.findOne({ id: turnId });
    } else {
      turn = await WaterTurn.findOne({ status: "IN_PROGRESS" });
    }
    
    if (turn) {
      turn.status = "COMPLETED";
      turn.completedAt = new Date();
      await turn.save();

      // Reset daysSinceLastWater for the plot
      await Plot.findOneAndUpdate({ id: turn.plotId }, { daysSinceLastWater: 0, lastWateredAt: new Date() });

      const targetGroupId = waterGroupId || turn.waterGroupId || "wg-01";

      // Check if any other turn is in progress
      const otherActive = await WaterTurn.findOne({ waterGroupId: targetGroupId, status: "IN_PROGRESS" });
      if (!otherActive) {
        await WaterGroup.findOneAndUpdate(
          { $or: [{ id: targetGroupId }, { _id: targetGroupId }] },
          { activeStatus: "IDLE", currentTurnFarmerId: null, currentTurnStartedAt: null }
        );
      }

      await createAuditLog({
        action: "TURN_COMPLETED",
        waterGroupId: targetGroupId,
        farmerId: turn.farmerId,
        message: `Water turn completed for ${turn.farmerName}. Plot moisture replenished; queue recalculated.`
      });
    }
    res.json({ success: true, turn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/skip", async (req, res) => {
  try {
    const { waterGroupId, turnId, reason } = req.body;
    
    let turn;
    if (turnId) {
      turn = await WaterTurn.findOne({ id: turnId });
    } else {
      turn = await WaterTurn.findOne({ status: "IN_PROGRESS" });
    }

    if (turn) {
      turn.status = "SKIPPED";
      turn.tieBreakReason = `Skipped: ${reason || 'Operator override'}`;
      await turn.save();

      const targetGroupId = waterGroupId || turn.waterGroupId || "wg-01";
      const otherActive = await WaterTurn.findOne({ waterGroupId: targetGroupId, status: "IN_PROGRESS" });
      if (!otherActive) {
        await WaterGroup.findOneAndUpdate(
          { $or: [{ id: targetGroupId }, { _id: targetGroupId }] },
          { activeStatus: "IDLE", currentTurnFarmerId: null, currentTurnStartedAt: null }
        );
      }
    }
    res.json({ success: true, turn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/history/:waterGroupId", async (req, res) => {
  try {
    const turns = await WaterTurn.find({ waterGroupId: req.params.waterGroupId }).sort({ createdAt: -1 });
    res.json({ success: true, turns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
