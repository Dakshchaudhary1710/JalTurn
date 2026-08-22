/**
 * In-Memory Seed Data
 * Initial demo data for water groups, farmers, plots, turns, disputes, and audit logs.
 * Replace with MongoDB collections later.
 */

const waterGroups = [
  {
    id: "wg-01",
    _id: "wg-01",
    name: "Rampur Village Borewell #04",
    sourceType: "Shared Borewell",
    sourceName: "Tubewell 15-HP (Discharge 38,000 L/hr)",
    village: "Rampur, Sector 4",
    activeStatus: "ACTIVE",
    totalCapacityAcres: 24.5,
    currentTurnFarmerId: "farmer-01",
    currentTurnStartedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: "wg-02",
    _id: "wg-02",
    name: "Shivalik Canal Lateral 2B",
    sourceType: "Canal Lateral Outlet",
    sourceName: "Canal Minor Sluice Gate #14",
    village: "Shivalik Kalan",
    activeStatus: "IDLE",
    totalCapacityAcres: 48.0,
    currentTurnFarmerId: null,
    currentTurnStartedAt: null
  }
];

const farmers = [
  { id: "farmer-01", name: "Rameshwar Singh (रामेश्वर सिंह)", phone: "+91 98765 43210", landholdingSize: 1.2, category: "Marginal", waterGroupId: "wg-01" },
  { id: "farmer-02", name: "Suresh Patel (सुरेश पटेल)", phone: "+91 98123 45678", landholdingSize: 0.8, category: "Marginal", waterGroupId: "wg-01" },
  { id: "farmer-03", name: "Anita Devi (अनीता देवी)", phone: "+91 97234 56789", landholdingSize: 0.6, category: "Marginal", waterGroupId: "wg-01" },
  { id: "farmer-04", name: "Mohan Lal Sharma (मोहन लाल)", phone: "+91 94111 22334", landholdingSize: 4.5, category: "Medium", waterGroupId: "wg-01" },
  { id: "farmer-05", name: "Harpreet Kaur (हरप्रीत कौर)", phone: "+91 98450 11223", landholdingSize: 1.5, category: "Small", waterGroupId: "wg-01" },
  { id: "farmer-06", name: "Devendra Yadav (देवेन्द्र यादव)", phone: "+91 93321 99887", landholdingSize: 6.0, category: "Large", waterGroupId: "wg-01" }
];

const plots = [
  { id: "plot-01", farmerId: "farmer-01", crop: "wheat", sowingDate: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 1.2, lastWateredAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 19, waterGroupId: "wg-01", evidenceVerified: true },
  { id: "plot-02", farmerId: "farmer-02", crop: "wheat", sowingDate: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 0.8, lastWateredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 15, waterGroupId: "wg-01", evidenceVerified: false },
  { id: "plot-03", farmerId: "farmer-03", crop: "mustard", sowingDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 0.6, lastWateredAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 12, waterGroupId: "wg-01", evidenceVerified: true },
  { id: "plot-04", farmerId: "farmer-04", crop: "wheat", sowingDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 4.5, lastWateredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 10, waterGroupId: "wg-01", evidenceVerified: false },
  { id: "plot-05", farmerId: "farmer-05", crop: "gram", sowingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 1.5, lastWateredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 8, waterGroupId: "wg-01", evidenceVerified: false },
  { id: "plot-06", farmerId: "farmer-06", crop: "potato", sowingDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), landArea: 6.0, lastWateredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), daysSinceLastWater: 7, waterGroupId: "wg-01", evidenceVerified: true }
];

const waterTurns = [
  { id: "turn-01", _id: "turn-01", farmerId: "farmer-01", farmerName: "Rameshwar Singh", cropName: "Wheat", plotId: "plot-01", waterGroupId: "wg-01", score: 91.45, rank: 1, scheduledAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), completedAt: null, status: "IN_PROGRESS", durationMinutes: 120, tieBreakReason: null, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "turn-hist-01", farmerId: "farmer-03", farmerName: "Anita Devi", cropName: "Mustard", plotId: "plot-03", waterGroupId: "wg-01", score: 84.2, rank: 1, startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), status: "COMPLETED", durationMinutes: 120, tieBreakReason: "Tie resolved: Longer waiting time (14 days vs 10 days)", createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() }
];

const disputes = [
  { id: "disp-01", farmerId: "farmer-04", farmerName: "Mohan Lal Sharma", turnId: "turn-01", waterGroupId: "wg-01", reason: "Claimed sowing date was 5 days earlier than recorded in system.", status: "RESOLVED", resolutionNote: "Coordinator verified with seed purchase invoice; corrected sowing date to 2025-12-08.", createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
];

const auditLogs = [
  { id: "log-01", waterGroupId: "wg-01", type: "QUEUE_RECALCULATION", message: "Priority queue dynamically recomputed for 6 plots based on FAO-56 stage updates.", timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() },
  { id: "log-02", waterGroupId: "wg-01", type: "TURN_STARTED", message: "Water turn initiated for Rameshwar Singh (Wheat - Flowering/Milk stage, Urgency 91.45).", timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() }
];

module.exports = {
  waterGroups,
  farmers,
  plots,
  waterTurns,
  disputes,
  auditLogs
};
