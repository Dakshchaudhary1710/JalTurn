const express = require('express');
const router = express.Router();
const WaterGroup = require('../models/WaterGroup');

router.get("/", async (req, res) => {
  try {
    const waterGroups = await WaterGroup.find();
    res.json({
      success: true,
      waterGroups,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, village, sourceType, totalCapacityAcres } = req.body;
    if (!name || !village || !sourceType) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const newGroup = await WaterGroup.create({
      id: "wg-" + Date.now().toString().slice(-4),
      name,
      village,
      sourceType,
      sourceName: name,
      totalCapacityAcres: Number(totalCapacityAcres) || 10
    });
    res.json({ success: true, waterGroup: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
