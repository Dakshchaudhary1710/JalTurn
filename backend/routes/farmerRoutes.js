const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const CROPS = require('../data/crops');
const Farmer = require('../models/Farmer');
const Plot = require('../models/Plot');
const { calculateUrgency, createAuditLog } = require('../utils/urgencyCalculator');

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

router.post("/", async (req, res) => {
  try {
    const { name, phone, waterGroupId, crop, sowingDate, landArea, daysSinceLastWater, evidenceVerified, notes } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ success: false, message: "Farmer name is required." });
    if (!crop || !CROPS[crop]) return res.status(400).json({ success: false, message: "Valid crop is required." });
    if (!sowingDate) return res.status(400).json({ success: false, message: "Sowing date is required." });

    const farmerId = "farmer-" + crypto.randomUUID().slice(0, 8);
    const plotId   = "plot-"   + crypto.randomUUID().slice(0, 8);
    const groupId  = waterGroupId || "wg-01";
    const acreSize = Math.max(0.1, Number(landArea) || 1.0);
    const category = acreSize <= 1.0 ? "Marginal" : acreSize <= 2.0 ? "Small" : acreSize <= 5.0 ? "Medium" : "Large";

    const newFarmer = await Farmer.create({
      id: farmerId,
      name: name.trim(),
      phone: phone?.trim() || "",
      landholdingSize: acreSize,
      category,
      waterGroupId: groupId,
      isActive: true,
      isVerified: false
    });

    const newPlot = await Plot.create({
      id: plotId,
      farmerId: farmerId,
      crop,
      sowingDate,
      landArea: acreSize,
      daysSinceLastWater: Number(daysSinceLastWater || 5),
      waterGroupId: groupId,
      evidenceVerified: Boolean(evidenceVerified),
      notes: notes || "",
      isActive: true
    });

    await createAuditLog({
      action: "FARMER_REGISTERED",
      waterGroupId: newFarmer.waterGroupId,
      farmerId: newFarmer.id,
      message: `New farmer ${newFarmer.name} (${newFarmer.landholdingSize} acres) registered.`
    });

    res.status(201).json({ success: true, message: "Farmer registered successfully.", farmer: newFarmer, plot: newPlot });
  } catch (error) {
    console.error("Farmer registration error:", error);
    res.status(500).json({ success: false, message: "Unable to register farmer." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { waterGroupId } = req.query;
    const filter = waterGroupId ? { waterGroupId } : {};
    const farmers = await Farmer.find(filter);
    res.json({ success: true, count: farmers.length, farmers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ id: req.params.id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found." });
    }
    res.json({ success: true, farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
