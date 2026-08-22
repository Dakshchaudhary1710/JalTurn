const express = require('express');
const router = express.Router();
const CROPS = require('../data/crops');
const { farmers, plots, auditLogs } = require('../data/seedData');
const { calculateUrgency } = require('../utils/urgencyCalculator');

router.post("/preview", (req, res) => {
  try {
    const { crop, sowingDate, daysSinceLastWater, landArea } = req.body;

    if (!crop || !sowingDate) {
      return res.status(400).json({ success: false, message: "Crop and sowingDate are required." });
    }

    const preview = calculateUrgency({ crop, sowingDate, daysSinceLastWater, landArea });
    res.json({ success: true, preview });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/", (req, res) => {
  try {
    const { name, phone, waterGroupId, crop, sowingDate, landArea, daysSinceLastWater, evidenceVerified, notes } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ success: false, message: "Farmer name is required." });
    if (!crop || !CROPS[crop]) return res.status(400).json({ success: false, message: "Valid crop is required." });
    if (!sowingDate) return res.status(400).json({ success: false, message: "Sowing date is required." });

    const newFarmer = {
      id: "farmer-" + Date.now().toString().slice(-4),
      name: name.trim(),
      phone: phone?.trim() || "",
      landholdingSize: Number(landArea || 1.0),
      category: Number(landArea) <= 1.0 ? "Marginal" : "Small",
      waterGroupId: waterGroupId || "wg-01"
    };
    farmers.push(newFarmer);

    const newPlot = {
      id: "plot-" + Date.now().toString().slice(-4),
      farmerId: newFarmer.id,
      crop,
      sowingDate,
      landArea: newFarmer.landholdingSize,
      daysSinceLastWater: Number(daysSinceLastWater || 5),
      waterGroupId: newFarmer.waterGroupId,
      evidenceVerified: Boolean(evidenceVerified)
    };
    plots.push(newPlot);

    auditLogs.unshift({
      id: "log-" + Date.now(),
      waterGroupId: newFarmer.waterGroupId,
      type: "FARMER_REGISTERED",
      message: `New farmer ${newFarmer.name} (${newFarmer.landholdingSize} acres) registered.`,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({ success: true, message: "Farmer registered successfully.", farmer: newFarmer, plot: newPlot });
  } catch (error) {
    console.error("Farmer registration error:", error);
    res.status(500).json({ success: false, message: "Unable to register farmer." });
  }
});

router.get("/", (req, res) => {
  const { waterGroupId } = req.query;
  let result = farmers;
  if (waterGroupId) {
    result = farmers.filter(farmer => farmer.waterGroupId === waterGroupId);
  }
  res.json({ success: true, count: result.length, farmers: result });
});

router.get("/:id", (req, res) => {
  const farmer = farmers.find(f => f.id === req.params.id);
  if (!farmer) {
    return res.status(404).json({ success: false, message: "Farmer not found." });
  }
  res.json({ success: true, farmer });
});

module.exports = router;
