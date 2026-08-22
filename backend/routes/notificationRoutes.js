const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { createAuditLog } = require('../utils/urgencyCalculator');

// GET all notifications for a water group
router.get("/:waterGroupId", async (req, res) => {
  try {
    const { limit = 50, channel, status, farmerId } = req.query;
    const filter = { waterGroupId: req.params.waterGroupId };
    if (channel)  filter.channel  = channel;
    if (status)   filter.status   = status;
    if (farmerId) filter.farmerId = farmerId;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST — send / log a new notification (mock: logs to DB without calling real provider)
router.post("/send", async (req, res) => {
  try {
    const {
      waterGroupId, farmerId, farmerName, farmerPhone,
      channel, messageType, messageBody, messageBodyHindi,
      turnId, disputeId, scheduledFor
    } = req.body;

    if (!farmerId || !channel || !messageBody) {
      return res.status(400).json({ success: false, message: "farmerId, channel, and messageBody are required." });
    }

    const notif = await Notification.create({
      id: "notif-" + Date.now().toString().slice(-8),
      waterGroupId: waterGroupId || "wg-01",
      farmerId,
      farmerName: farmerName || "Unknown",
      farmerPhone: farmerPhone || "",
      channel,
      messageType: messageType || "CUSTOM",
      messageBody,
      messageBodyHindi: messageBodyHindi || "",
      status: "SENT",   // mock: assume delivered immediately
      sentAt: new Date(),
      deliveredAt: new Date(),
      turnId:    turnId    || null,
      disputeId: disputeId || null,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null
    });

    // Audit
    const channelMap = { SMS: "SMS_SENT", WHATSAPP: "WHATSAPP_SENT", IVR: "IVR_CALL_MADE" };
    await createAuditLog({
      action: channelMap[channel] || "SYSTEM_EVENT",
      waterGroupId: notif.waterGroupId,
      farmerId,
      message: `${channel} notification sent to ${farmerName}: ${messageType}`
    });

    res.status(201).json({ success: true, notification: notif });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /:id/status — update delivery status (webhook from SMS provider)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, deliveredAt, failureReason, ivrFarmerResponse } = req.body;
    const notif = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { status, deliveredAt: deliveredAt || null, failureReason: failureReason || "", ivrFarmerResponse: ivrFarmerResponse || null },
      { new: true }
    );
    if (!notif) return res.status(404).json({ success: false, message: "Notification not found." });
    res.json({ success: true, notification: notif });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
