const mongoose = require('mongoose');

const waterTurnSchema = new mongoose.Schema({
  // Core Identity
  id:           { type: String, required: true, unique: true },
  farmerId:     { type: String, required: true },
  farmerName:   { type: String, required: true },
  farmerPhone:  { type: String, default: "" },
  cropName:     { type: String, required: true },
  plotId:       { type: String, required: true },
  waterGroupId: { type: String, required: true },

  // Queue Position at Time of Turn
  score:      { type: Number, required: true },
  rank:       { type: Number, required: true },
  queueSize:  { type: Number, default: 1 },        // how many were in queue

  // Score Breakdown (transparency)
  scoreBreakdown: {
    stageCriticality:    { type: Number, default: 0 },
    waitingScore:        { type: Number, default: 0 },
    smallholderEquity:   { type: Number, default: 0 },
    evidenceBonus:       { type: Number, default: 0 }
  },

  // FAO-56 Context at Turn Time
  cropStageName:  { type: String, default: "" },
  cropDAS:        { type: Number, default: 0 },
  cropKc:         { type: Number, default: 1.0 },
  landArea:       { type: Number, default: 0 },

  // Timing
  scheduledAt:    { type: Date, default: null },
  startedAt:      { type: Date, default: null },
  completedAt:    { type: Date, default: null },
  durationMinutes:{ type: Number, required: true },

  // Status & Resolution
  status:         { type: String, default: "IN_PROGRESS", enum: ["PENDING","IN_PROGRESS","COMPLETED","SKIPPED","DISPUTED"] },
  tieBreakReason: { type: String, default: null },
  skipReason:     { type: String, default: null },

  // SMS / Notification Log
  smsNotificationSent:  { type: Boolean, default: false },
  smsNotificationSentAt:{ type: Date,    default: null },
  ivrCallMade:          { type: Boolean, default: false },
  whatsappSent:         { type: Boolean, default: false },

  // Operator metadata
  startedByCoordinatorId:  { type: String, default: null },
  completedByCoordinatorId:{ type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('WaterTurn', waterTurnSchema);
