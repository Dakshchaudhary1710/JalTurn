const mongoose = require('mongoose');

const waterGroupSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  sourceType: { type: String, required: true },
  sourceName: { type: String, required: true },
  village: { type: String, required: true },
  activeStatus: { type: String, default: 'ACTIVE' },
  totalCapacityAcres: { type: Number, required: true },
  currentTurnFarmerId: { type: String, default: null },
  currentTurnStartedAt: { type: Date, default: null }
});

module.exports = mongoose.model('WaterGroup', waterGroupSchema);
