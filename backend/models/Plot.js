const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  farmerId: { type: String, required: true },
  crop: { type: String, required: true },
  sowingDate: { type: String, required: true },
  landArea: { type: Number, required: true },
  lastWateredAt: { type: Date, default: null },
  daysSinceLastWater: { type: Number, default: 0 },
  waterGroupId: { type: String, required: true },
  evidenceVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Plot', plotSchema);
