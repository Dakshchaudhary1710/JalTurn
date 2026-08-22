const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  // Core Identity
  id:             { type: String, required: true, unique: true },
  name:           { type: String, required: true },
  nameHindi:      { type: String, default: "" },

  // Contact
  phone:          { type: String, default: "" },
  altPhone:       { type: String, default: "" },
  whatsappEnabled:{ type: Boolean, default: false },
  preferredLang:  { type: String, default: "hi", enum: ["hi","en","pa","gu","mr"] },  // ISO 639-1

  // Demographics / Classification
  aadhaarLast4:   { type: String, default: "" },           // last 4 digits only
  gender:         { type: String, default: "M", enum: ["M","F","Other"] },
  category:       { type: String, required: true, enum: ["Marginal","Small","Medium","Large"] },
  landholdingSize:{ type: Number, required: true },         // acres

  // Location
  village:        { type: String, default: "" },
  district:       { type: String, default: "" },
  state:          { type: String, default: "Punjab" },
  pincode:        { type: String, default: "" },

  // Group membership
  waterGroupId:   { type: String, required: true },

  // Status & Flags
  isActive:       { type: Boolean, default: true },
  isVerified:     { type: Boolean, default: false },         // coordinator-verified KYC
  registeredAt:   { type: Date, default: Date.now },
  lastUpdatedAt:  { type: Date, default: Date.now },

  // Fairness Metrics (cached, updated on each queue calculation)
  totalTurnsReceived:  { type: Number, default: 0 },
  totalWaterHours:     { type: Number, default: 0 },
  lifetimeDisputes:    { type: Number, default: 0 },
  lifetimeDisputesWon: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);
