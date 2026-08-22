const mongoose = require('mongoose');

/**
 * TieBreakLog — immutable record of every tie-break resolution.
 * Ensures the 4-tier process is fully transparent and auditable.
 */
const tieBreakLogSchema = new mongoose.Schema({
  id:           { type: String, required: true, unique: true },
  waterGroupId: { type: String, required: true },
  turnId:       { type: String, default: null },

  // The two (or more) tied farmers
  tiedFarmerIds:   { type: [String], required: true },
  tiedFarmerNames: { type: [String], required: true },

  // Which tier resolved it
  resolvedAtTier: {
    type: Number,
    required: true,
    min: 1, max: 4
  },
  tierName: {
    type: String,
    required: true,
    enum: [
      "Tier 1: Waiting Time",
      "Tier 2: Smallholder Equity",
      "Tier 3: Verified Evidence",
      "Tier 4: Randomized Draw"
    ]
  },
  explanation:  { type: String, required: true },     // human-readable reason
  winnerId:     { type: String, required: true },
  winnerName:   { type: String, required: true },
  loserId:      { type: String, required: true },
  loserName:    { type: String, required: true },

  // Score context
  winnerScore:  { type: Number, default: 0 },
  loserScore:   { type: Number, default: 0 },

  // Tier 4 lottery token (cryptographic fairness)
  lotteryToken: { type: String, default: null },

  resolvedAt:   { type: Date, default: Date.now }
}, { timestamps: false });

tieBreakLogSchema.index({ waterGroupId: 1, resolvedAt: -1 });

module.exports = mongoose.model('TieBreakLog', tieBreakLogSchema);
