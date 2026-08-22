const express = require('express');
const router = express.Router();
const { waterTurns, auditLogs, plots } = require('../data/seedData');
const { computeQueue } = require('../utils/urgencyCalculator');

router.post("/start", (req, res) => {
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

router.post("/complete", (req, res) => {
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

router.post("/skip", (req, res) => {
  const { waterGroupId, turnId, reason } = req.body;
  const turn = waterTurns.find(t => t.status === "IN_PROGRESS");
  if (turn) {
    turn.status = "SKIPPED";
    turn.tieBreakReason = `Skipped: ${reason || 'Operator override'}`;
  }
  res.json({ success: true, turn });
});

router.get("/history/:waterGroupId", (req, res) => {
  res.json({ success: true, turns: waterTurns.filter(t => t.waterGroupId === req.params.waterGroupId) });
});

module.exports = router;
