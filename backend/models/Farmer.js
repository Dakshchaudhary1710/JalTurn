const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, default: "" },
  landholdingSize: { type: Number, required: true },
  category: { type: String, required: true },
  waterGroupId: { type: String, required: true }
});

module.exports = mongoose.model('Farmer', farmerSchema);
