const express = require('express');
const router = express.Router();
const { disputes, auditLogs } = require('../data/seedData');

router.get("/:waterGroupId", (req, res) => {
  res.json({ success: true, disputes: disputes.filter(d => d.waterGroupId === req.params.waterGroupId) });
});

router.post("/", (req, res) => {
  const { farmerId, farmerName, turnId, waterGroupId, reason } = req.body;
  const newDispute = {
    id: "disp-" + Date.now().toString().slice(-4),
    farmerId,
    farmerName: farmerName || "Farmer",
    turnId: turnId || "turn-01",
    waterGroupId: waterGroupId || "wg-01",
    reason,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
  disputes.unshift(newDispute);
  auditLogs.unshift({
    id: "log-" + Date.now(),
    waterGroupId: newDispute.waterGroupId,
    type: "DISPUTE_RAISED",
    message: `Dispute raised: "${reason}".`,
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, dispute: newDispute });
});

module.exports = router;
