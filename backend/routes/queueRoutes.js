const express = require('express');
const router = express.Router();
const { computeQueue } = require('../utils/urgencyCalculator');

router.get("/:waterGroupId", async (req, res) => {
  try {
    const result = await computeQueue(req.params.waterGroupId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/recalculate", async (req, res) => {
  try {
    const { waterGroupId, customWeights } = req.body;
    const result = await computeQueue(waterGroupId, customWeights);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
