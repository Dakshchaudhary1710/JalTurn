const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  // Core Identity
  id:               { type: String, required: true, unique: true },
  farmerId:         { type: String, required: true },
  waterGroupId:     { type: String, required: true },

  // Crop & Agronomy (FAO-56)
  crop:             { type: String, required: true },
  cropVariety:      { type: String, default: "" },           // e.g. "HD-2967 (Wheat)"
  sowingDate:       { type: String, required: true },        // YYYY-MM-DD
  expectedHarvestDate: { type: String, default: null },
  landArea:         { type: Number, required: true },        // acres
  soilType:         { type: String, default: "Loamy", enum: ["Sandy","Loamy","Clay","Silty","Black","Red"] },
  irrigationMethod: { type: String, default: "Flood", enum: ["Flood","Drip","Sprinkler","Furrow"] },

  // Watering State
  lastWateredAt:         { type: Date,    default: null },
  daysSinceLastWater:    { type: Number,  default: 0 },
  totalWateringsThisSeason: { type: Number, default: 0 },
  totalWaterHoursThisSeason:{ type: Number, default: 0 },

  // FAO-56 Stage (computed & cached)
  currentDAS:       { type: Number, default: 0 },            // Days After Sowing
  currentStageName: { type: String, default: "" },
  currentKc:        { type: Number, default: 1.0 },          // crop coefficient
  stageCriticalityScore: { type: Number, default: 50 },      // 0-100

  // Urgency Score (cached last compute)
  lastUrgencyScore: { type: Number, default: 0 },
  lastUrgencyComputedAt: { type: Date, default: null },

  // Evidence
  evidenceVerified:      { type: Boolean, default: false },
  evidenceImageUrl:      { type: String,  default: "" },     // S3/Cloudinary URL
  evidenceSubmittedAt:   { type: Date,    default: null },
  evidenceVerifiedBy:    { type: String,  default: "" },     // coordinator name/id

  // GPS
  gpsLat:  { type: Number, default: null },
  gpsLng:  { type: Number, default: null },

  // Status
  isActive:  { type: Boolean, default: true },
  notes:     { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Plot', plotSchema);
