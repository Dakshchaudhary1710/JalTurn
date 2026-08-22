const express = require('express');
const router = express.Router();
const CROPS = require('../data/crops');
const { auditLogs } = require('../data/seedData');

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "JalTurn backend is running",
    timestamp: new Date().toISOString(),
  });
});

router.get("/crops", (req, res) => {
  res.json({
    success: true,
    crops: CROPS,
  });
});

router.get("/logs/:waterGroupId", (req, res) => {
  res.json({ success: true, logs: auditLogs.filter(l => l.waterGroupId === req.params.waterGroupId) });
});

router.get("/audit", (req, res) => {
  res.json({
    success: true,
    count: auditLogs.length,
    logs: [...auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
  });
});

module.exports = router;
