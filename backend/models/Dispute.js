const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  farmerId: { type: String, required: true },
  farmerName: { type: String, required: true },
  turnId: { type: String, required: true },
  waterGroupId: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "PENDING" },
  resolutionNote: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dispute', disputeSchema);
