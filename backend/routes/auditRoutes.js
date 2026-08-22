const express = require('express');
const router = express.Router();
const CROPS = require('../data/crops');
const AuditLog = require('../models/AuditLog');

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

router.get("/logs/:waterGroupId", async (req, res) => {
  try {
    const logs = await AuditLog.find({ waterGroupId: req.params.waterGroupId }).sort({ timestamp: -1 });
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/audit", async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 });
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
