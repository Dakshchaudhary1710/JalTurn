const express = require('express');
const router = express.Router();
const WaterGroup = require('../models/WaterGroup');
const { createAuditLog } = require('../utils/urgencyCalculator');

// GET all water groups
router.get("/", async (req, res) => {
  try {
    const waterGroups = await WaterGroup.find({ activeStatus: { $ne: "DECOMMISSIONED" } }).sort({ registrationDate: -1 });
    res.json({ success: true, waterGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single water group by id
router.get("/:id", async (req, res) => {
  try {
    const wg = await WaterGroup.findOne({ id: req.params.id });
    if (!wg) return res.status(404).json({ success: false, message: "Water group not found." });
    res.json({ success: true, waterGroup: wg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST — register a new borewell / water source
router.post("/", async (req, res) => {
  try {
    const {
      name, village, district, block,
      gpsLat, gpsLng,
      sourceType, sourceName,
      borewellDepthFeet, motorHorsePower, flowRateLPH,
      totalCapacityAcres,
      scheduleStartTime, scheduleEndTime, operationalDays,
      operatorName, operatorPhone,
      licenseNumber
    } = req.body;

    if (!name || !village || !sourceType) {
      return res.status(400).json({ success: false, message: "name, village and sourceType are required." });
    }

    const newGroup = await WaterGroup.create({
      id: "wg-" + Date.now().toString().slice(-6),
      name,
      village,
      district: district || "",
      block: block || "",
      gpsLat: gpsLat ? Number(gpsLat) : null,
      gpsLng: gpsLng ? Number(gpsLng) : null,
      sourceType,
      sourceName: sourceName || name,
      borewellDepthFeet: borewellDepthFeet ? Number(borewellDepthFeet) : null,
      motorHorsePower:   motorHorsePower   ? Number(motorHorsePower)   : null,
      flowRateLPH:       flowRateLPH       ? Number(flowRateLPH)       : null,
      totalCapacityAcres: Number(totalCapacityAcres) || 10,
      scheduleStartTime: scheduleStartTime || "06:00",
      scheduleEndTime:   scheduleEndTime   || "18:00",
      operationalDays:   operationalDays   || ["Mon","Tue","Wed","Thu","Fri","Sat"],
      operatorName:  operatorName  || "",
      operatorPhone: operatorPhone || "",
      licenseNumber: licenseNumber || ""
    });

    await createAuditLog({
      action: "BOREWELL_ADDED",
      waterGroupId: newGroup.id,
      message: `New ${sourceType} registered: ${name} in ${village}.`
    });

    res.status(201).json({ success: true, waterGroup: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH — update borewell details or status
router.patch("/:id", async (req, res) => {
  try {
    const allowed = [
      "name","village","district","block","gpsLat","gpsLng",
      "sourceName","borewellDepthFeet","motorHorsePower","flowRateLPH",
      "totalCapacityAcres","scheduleStartTime","scheduleEndTime",
      "operationalDays","operatorName","operatorPhone","licenseNumber","activeStatus"
    ];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    const wg = await WaterGroup.findOneAndUpdate({ id: req.params.id }, update, { new: true });
    if (!wg) return res.status(404).json({ success: false, message: "Water group not found." });

    await createAuditLog({
      action: "BOREWELL_UPDATED",
      waterGroupId: wg.id,
      message: `Water source "${wg.name}" updated.`
    });

    res.json({ success: true, waterGroup: wg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
