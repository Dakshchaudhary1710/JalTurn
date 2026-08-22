const express = require('express');
const router = express.Router();
const { waterGroups } = require('../data/seedData');

router.get("/", (req, res) => {
  res.json({
    success: true,
    waterGroups,
  });
});

router.post("/", (req, res) => {
  const { name, village, sourceType, totalCapacityAcres } = req.body;
  if (!name || !village || !sourceType) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  const newGroup = {
    id: "wg-" + Date.now().toString().slice(-4),
    name,
    village,
    sourceType,
    sourceName: name,
    totalCapacityAcres: Number(totalCapacityAcres) || 10,
    activeStatus: "IDLE",
    currentTurnFarmerId: null,
    currentTurnStartedAt: null
  };
  newGroup._id = newGroup.id;
  waterGroups.push(newGroup);
  res.json({ success: true, waterGroup: newGroup });
});

module.exports = router;
