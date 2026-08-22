const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute');
const { createAuditLog } = require('../utils/urgencyCalculator');

router.get("/:waterGroupId", async (req, res) => {
  try {
    const disputes = await Dispute.find({ waterGroupId: req.params.waterGroupId }).sort({ createdAt: -1 });
    res.json({ success: true, disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { farmerId, farmerName, turnId, waterGroupId, reason } = req.body;
    
    const newDispute = await Dispute.create({
      id: "disp-" + Date.now().toString().slice(-4),
      farmerId,
      farmerName: farmerName || "Farmer",
      turnId: turnId || "turn-01",
      waterGroupId: waterGroupId || "wg-01",
      reason,
      status: "PENDING"
    });

    await createAuditLog({
      action: "DISPUTE_RAISED",
      waterGroupId: newDispute.waterGroupId,
      farmerId,
      message: `Dispute raised: "${reason}".`
    });

    res.json({ success: true, dispute: newDispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
