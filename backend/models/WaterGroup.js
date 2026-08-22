const mongoose = require('mongoose');

const waterGroupSchema = new mongoose.Schema({
  // Core Identity
  id:             { type: String, required: true, unique: true },
  name:           { type: String, required: true },

  // Location
  village:        { type: String, required: true },
  district:       { type: String, default: "" },
  block:          { type: String, default: "" },
  gpsLat:         { type: Number, default: null },
  gpsLng:         { type: Number, default: null },

  // Source Details
  sourceType:     { type: String, required: true, enum: ["Shared Borewell", "Canal Lateral Outlet", "Check Dam Reservoir", "Surface Well", "Lift Irrigation"] },
  sourceName:     { type: String, required: true },

  // Technical Specifications
  borewellDepthFeet:   { type: Number, default: null },
  motorHorsePower:     { type: Number, default: null },
  flowRateLPH:         { type: Number, default: null },      // litres per hour
  totalCapacityAcres:  { type: Number, required: true },

  // Operating Schedule
  scheduleStartTime:   { type: String, default: "06:00" },   // "HH:MM"
  scheduleEndTime:     { type: String, default: "18:00" },
  operationalDays:     { type: [String], default: ["Mon","Tue","Wed","Thu","Fri","Sat"] },

  // Operator / Contact
  operatorName:        { type: String, default: "" },
  operatorPhone:       { type: String, default: "" },

  // Administrative
  registrationDate:    { type: Date, default: Date.now },
  activeStatus:        { type: String, default: "ACTIVE", enum: ["ACTIVE","IDLE","MAINTENANCE","DECOMMISSIONED"] },
  licenseNumber:       { type: String, default: "" },       // Govt. licence / NOC number

  // Runtime State
  currentTurnFarmerId:    { type: String, default: null },
  currentTurnStartedAt:   { type: Date,   default: null },
  totalTurnsCompleted:    { type: Number, default: 0 },
  totalWaterHoursDelivered: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('WaterGroup', waterGroupSchema);
