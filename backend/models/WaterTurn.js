const mongoose = require('mongoose');

const waterTurnSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  farmerId: { type: String, required: true },
  farmerName: { type: String, required: true },
  cropName: { type: String, required: true },
  plotId: { type: String, required: true },
  waterGroupId: { type: String, required: true },
  score: { type: Number, required: true },
  rank: { type: Number, required: true },
  scheduledAt: { type: Date },
  startedAt: { type: Date },
  completedAt: { type: Date, default: null },
  status: { type: String, default: "IN_PROGRESS" },
  durationMinutes: { type: Number, required: true },
  tieBreakReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WaterTurn', waterTurnSchema);
