const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  // Core Identity
  id:           { type: String, required: true, unique: true },
  farmerId:     { type: String, required: true },
  farmerName:   { type: String, required: true },
  farmerPhone:  { type: String, default: "" },
  turnId:       { type: String, required: true },
  plotId:       { type: String, default: "" },
  waterGroupId: { type: String, required: true },

  // Dispute Classification
  category: {
    type: String,
    default: "QUEUE_ORDER",
    enum: [
      "QUEUE_ORDER",          // farmer disagrees with their rank
      "TURN_DURATION",        // turn ended early / ran too long
      "SKIPPED_WITHOUT_REASON",
      "EVIDENCE_REJECTION",   // evidence photo rejected unfairly
      "BOREWELL_FAILURE",     // mechanical failure during turn
      "UPSTREAM_MONOPOLY",    // head-reach farmer took extra water
      "DATA_ERROR",           // wrong sowing date / landholding in system
      "OTHER"
    ]
  },
  reason:             { type: String, required: true },
  evidenceDescription:{ type: String, default: "" },     // what proof the farmer claims to have
  evidenceImageUrl:   { type: String, default: "" },

  // Resolution
  status: {
    type: String,
    default: "PENDING",
    enum: ["PENDING","UNDER_REVIEW","RESOLVED","REJECTED","ESCALATED"]
  },
  resolutionNote:         { type: String, default: null },
  resolvedAt:             { type: Date,   default: null },
  resolvedByCoordinatorId:{ type: String, default: null },
  resolvedByName:         { type: String, default: "" },

  // Priority Escalation
  escalatedAt:    { type: Date,    default: null },
  escalationLevel:{ type: Number,  default: 0 },      // 0=local, 1=block, 2=district
  priority:       { type: String,  default: "NORMAL", enum: ["LOW","NORMAL","HIGH","CRITICAL"] }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
