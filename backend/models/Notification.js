const mongoose = require('mongoose');

/**
 * Notification — tracks every SMS / WhatsApp / IVR alert sent to farmers.
 * Powers the SMS Alert & Notification Center screens.
 */
const notificationSchema = new mongoose.Schema({
  // Core Identity
  id:           { type: String, required: true, unique: true },
  waterGroupId: { type: String, required: true },
  farmerId:     { type: String, required: true },
  farmerName:   { type: String, required: true },
  farmerPhone:  { type: String, required: true },

  // Channel & Content
  channel: {
    type: String,
    required: true,
    enum: ["SMS", "WHATSAPP", "IVR", "IN_APP"]
  },
  messageType: {
    type: String,
    required: true,
    enum: [
      "TURN_ALERT",           // "Your turn is in 30 minutes"
      "TURN_STARTED",         // "Your water turn has started"
      "TURN_COMPLETED",       // "Your turn is complete"
      "TURN_SKIPPED",         // "Your turn was skipped"
      "QUEUE_POSITION",       // "You are #3 in queue"
      "DISPUTE_UPDATE",       // "Your dispute has been resolved"
      "REGISTRATION_CONFIRM", // "You have been registered"
      "REMINDER",             // general reminder
      "BOREWELL_ALERT",       // maintenance / outage
      "CUSTOM"
    ]
  },
  messageBody:     { type: String, required: true },
  messageBodyHindi:{ type: String, default: "" },

  // Delivery Status
  status: {
    type: String,
    default: "PENDING",
    enum: ["PENDING","SENT","DELIVERED","FAILED","OPTED_OUT"]
  },
  sentAt:       { type: Date, default: null },
  deliveredAt:  { type: Date, default: null },
  failureReason:{ type: String, default: "" },
  retryCount:   { type: Number, default: 0 },
  providerRef:  { type: String, default: "" },   // e.g., Twilio SID / MSG91 ID

  // Related References
  turnId:    { type: String, default: null },
  disputeId: { type: String, default: null },

  // IVR specific
  ivrCallDurationSecs: { type: Number, default: null },
  ivrFarmerResponse:   { type: String, default: null },  // "1" = confirm, "2" = pass

  // Scheduling
  scheduledFor: { type: Date, default: null }  // for advance alerts
}, { timestamps: true });

notificationSchema.index({ waterGroupId: 1, createdAt: -1 });
notificationSchema.index({ farmerId: 1 });
notificationSchema.index({ status: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
