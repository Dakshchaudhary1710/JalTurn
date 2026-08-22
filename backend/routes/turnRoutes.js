const express = require('express');
const router = express.Router();
const WaterTurn = require('../models/WaterTurn');
const Plot = require('../models/Plot');
const { computeQueue, createAuditLog } = require('../utils/urgencyCalculator');

router.post("/start", async (req, res) => {
  try {
    const { waterGroupId, plotId } = req.body;
    const queueData = await computeQueue(waterGroupId);
    const plot = queueData.queue.find(q => q.plotId === plotId) || queueData.queue[0];
    
    const newTurn = await WaterTurn.create({
      id: "turn-" + Date.now().toString().slice(-6),
      farmerId: plot.farmerId,
      farmerName: plot.farmerName,
      cropName: plot.crop,
      plotId: plot.plotId,
      waterGroupId,
      score: plot.urgencyScore,
      rank: 1,
      startedAt: new Date(),
      status: "IN_PROGRESS",
      durationMinutes: 120
    });

    await createAuditLog({
      action: "TURN_STARTED",
      waterGroupId,
      farmerId: plot.farmerId,
      message: `Water turn started for ${plot.farmerName} (${plot.crop}).`
    });

    res.json({ success: true, turn: newTurn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/complete", async (req, res) => {
  try {
    const { waterGroupId, turnId } = req.body;
    
    // Attempt to find the specific turn, or fallback to the first active turn
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

      await createAuditLog({
        action: "TURN_COMPLETED",
        waterGroupId,
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
