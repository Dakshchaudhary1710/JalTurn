const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // Core Identity
  id:           { type: String, required: true, unique: true },
  waterGroupId: { type: String, required: true },

  // Event Classification
  type: {
    type: String,
    required: true,
    enum: [
      "FARMER_REGISTERED",
      "FARMER_UPDATED",
      "FARMER_DEACTIVATED",
      "PLOT_REGISTERED",
      "PLOT_UPDATED",
      "QUEUE_RECALCULATION",
      "TURN_SCHEDULED",
      "TURN_STARTED",
      "TURN_COMPLETED",
      "TURN_SKIPPED",
      "DISPUTE_FILED",
      "DISPUTE_RESOLVED",
      "DISPUTE_ESCALATED",
      "TIE_BROKEN",
      "SMS_SENT",
      "IVR_CALL_MADE",
      "WHATSAPP_SENT",
      "NOTIFICATION_FAILED",
      "BOREWELL_ADDED",
      "BOREWELL_UPDATED",
      "BOREWELL_STATUS_CHANGED",
      "EVIDENCE_SUBMITTED",
      "EVIDENCE_VERIFIED",
      "EVIDENCE_REJECTED",
      "COORDINATOR_ACTION",
      "SYSTEM_EVENT"
    ]
  },

  // Content
  message:  { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Attribution
  actorType:{ type: String, default: "SYSTEM", enum: ["SYSTEM","COORDINATOR","FARMER","AUTOMATED"] },
  actorId:  { type: String, default: null },
  actorName:{ type: String, default: "" },

  // References (for quick filtering)
  farmerId: { type: String, default: null },
  plotId:   { type: String, default: null },
  turnId:   { type: String, default: null },
  disputeId:{ type: String, default: null },

  // Timestamp
  timestamp:{ type: Date, default: Date.now }
}, { timestamps: false });

// Index for fast audit trail queries
auditLogSchema.index({ waterGroupId: 1, timestamp: -1 });
auditLogSchema.index({ type: 1 });
auditLogSchema.index({ farmerId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
