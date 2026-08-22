const express = require('express');
const router = express.Router();
const { computeQueue } = require('../utils/urgencyCalculator');

router.get("/:waterGroupId", (req, res) => {
  const result = computeQueue(req.params.waterGroupId);
  res.json(result);
});

router.post("/recalculate", (req, res) => {
  const { waterGroupId, customWeights } = req.body;
  const result = computeQueue(waterGroupId, customWeights);
  res.json(result);
});

module.exports = router;
