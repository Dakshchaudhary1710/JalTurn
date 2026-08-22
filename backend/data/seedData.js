/**
 * Seed Data v2 — JalTurn
 * Full demo dataset for water groups, farmers, plots, turns, disputes, and audit logs.
 */

const waterGroups = [
  {
    id: "wg-01",
    _id: "wg-01",
    name: "Rampur Village Borewell #04",
    village: "Rampur, Sector 4",
    district: "Ludhiana",
    block: "Khanna",
    gpsLat: 30.6942,
    gpsLng: 76.2178,
    sourceType: "Shared Borewell",
    sourceName: "Tubewell 15-HP (Discharge 38,000 L/hr)",
    borewellDepthFeet: 320,
    motorHorsePower: 15,
    flowRateLPH: 38000,
    totalCapacityAcres: 24.5,
    scheduleStartTime: "06:00",
    scheduleEndTime: "20:00",
    operationalDays: ["Mon","Tue","Wed","Thu","Fri","Sat"],
    operatorName: "Gurmail Singh",
    operatorPhone: "+91 99880 12345",
    licenseNumber: "PB-LDH-BW-2022-0047",
    activeStatus: "ACTIVE",
    currentTurnFarmerId: "farmer-01",
    currentTurnStartedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    totalTurnsCompleted: 142,
    totalWaterHoursDelivered: 284
  },
  {
    id: "wg-02",
    _id: "wg-02",
    name: "Shivalik Canal Lateral 2B",
    village: "Shivalik Kalan",
    district: "Rupnagar",
    block: "Nurpur Bedi",
    gpsLat: 30.9716,
    gpsLng: 76.5236,
    sourceType: "Canal Lateral Outlet",
    sourceName: "Canal Minor Sluice Gate #14",
    borewellDepthFeet: null,
    motorHorsePower: null,
    flowRateLPH: 55000,
    totalCapacityAcres: 48.0,
    scheduleStartTime: "05:30",
    scheduleEndTime: "19:00",
    operationalDays: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    operatorName: "Baldev Kumar",
    operatorPhone: "+91 98760 54321",
    licenseNumber: "PB-RPR-CL-2021-0012",
    activeStatus: "IDLE",
    currentTurnFarmerId: null,
    currentTurnStartedAt: null,
    totalTurnsCompleted: 89,
    totalWaterHoursDelivered: 178
  },
  {
    id: "wg-03",
    _id: "wg-03",
    name: "Kisan Sahkari Tubewell #09",
    village: "Greenfield Village Block B",
    district: "Ludhiana",
    block: "Khanna",
    sourceType: "Cooperative Deep Borewell",
    sourceName: "Solar Hybrid Pump 25-HP (Discharge 52,000 L/hr)",
    borewellDepthFeet: 400,
    motorHorsePower: 25,
    flowRateLPH: 52000,
    totalCapacityAcres: 36.0,
    activeStatus: "IDLE",
    currentTurnFarmerId: null,
    currentTurnStartedAt: null,
    totalTurnsCompleted: 45,
    totalWaterHoursDelivered: 90
  }
];

const farmers = [
  { id: "farmer-01", name: "Rameshwar Singh (रामेश्वर सिंह)", nameHindi: "रामेश्वर सिंह", phone: "+91 98765 43210", category: "Marginal", landholdingSize: 1.2, village: "Rampur", waterGroupId: "wg-01", isActive: true, isVerified: true },
  { id: "farmer-02", name: "Suresh Patel (सुरेश पटेल)", nameHindi: "सुरेश पटेल", phone: "+91 98123 45678", category: "Marginal", landholdingSize: 0.8, village: "Rampur", waterGroupId: "wg-01", isActive: true, isVerified: true },
  { id: "farmer-03", name: "Anita Devi (अनीता देवी)", nameHindi: "अनीता देवी", phone: "+91 97234 56789", category: "Marginal", landholdingSize: 0.6, village: "Rampur", waterGroupId: "wg-01", isActive: true, isVerified: false },
  { id: "farmer-04", name: "Mohan Lal Sharma (मोहन लाल)", nameHindi: "मोहन लाल", phone: "+91 94111 22334", category: "Medium", landholdingSize: 4.5, village: "Rampur", waterGroupId: "wg-01", isActive: true, isVerified: true },
  { id: "farmer-05", name: "Harpreet Kaur (हरप्रीत कौर)", nameHindi: "हरप्रीत कौर", phone: "+91 98450 11223", category: "Small", landholdingSize: 1.5, village: "Rampur", waterGroupId: "wg-01", isActive: true, isVerified: true },
  { id: "farmer-06", name: "Devendra Yadav (देवेन्द्र यादव)", nameHindi: "देवेन्द्र यादव", phone: "+91 93321 99887", category: "Large", landholdingSize: 6.0, village: "Rampur", waterGroupId: "wg-01", isActive: true, isVerified: true },
  { id: "farmer-07", name: "Gurpreet Singh (गुरप्रीत सिंह)", nameHindi: "गुरप्रीत सिंह", phone: "+91 98112 33445", category: "Marginal", landholdingSize: 0.9, village: "Rampur", waterGroupId: "wg-01", isActive: true, isVerified: true },
  { id: "farmer-08", name: "Sunita Devi (सुनीता देवी)", nameHindi: "सुनीता देवी", phone: "+91 97654 32109", category: "Marginal", landholdingSize: 0.5, village: "Shivalik", waterGroupId: "wg-02", isActive: true, isVerified: true },
  { id: "farmer-09", name: "Rajesh Kumar (राजेश कुमार)", nameHindi: "राजेश कुमार", phone: "+91 94567 89012", category: "Small", landholdingSize: 1.8, village: "Shivalik", waterGroupId: "wg-02", isActive: true, isVerified: false },
  { id: "farmer-10", name: "Lakhwinder Singh (लखविंदर सिंह)", nameHindi: "लखविंदर सिंह", phone: "+91 98901 23456", category: "Medium", landholdingSize: 3.2, village: "Greenfield", waterGroupId: "wg-03", isActive: true, isVerified: true }
];

const plots = [
  { id: "plot-01", farmerId: "farmer-01", waterGroupId: "wg-01", crop: "wheat", cropVariety: "HD-2967", sowingDate: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 1.2, daysSinceLastWater: 19, lastWateredAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: true },
  { id: "plot-02", farmerId: "farmer-02", waterGroupId: "wg-01", crop: "wheat", cropVariety: "PBW-343", sowingDate: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 0.8, daysSinceLastWater: 15, lastWateredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: false },
  { id: "plot-03", farmerId: "farmer-03", waterGroupId: "wg-01", crop: "mustard", cropVariety: "PUSA Bold", sowingDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 0.6, daysSinceLastWater: 12, lastWateredAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: true },
  { id: "plot-04", farmerId: "farmer-04", waterGroupId: "wg-01", crop: "wheat", cropVariety: "HD-3086", sowingDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 4.5, daysSinceLastWater: 10, lastWateredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: false },
  { id: "plot-05", farmerId: "farmer-05", waterGroupId: "wg-01", crop: "gram", cropVariety: "Pusa 256", sowingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 1.5, daysSinceLastWater: 8, lastWateredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: false },
  { id: "plot-06", farmerId: "farmer-06", waterGroupId: "wg-01", crop: "potato", cropVariety: "Kufri Jyoti", sowingDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 6.0, daysSinceLastWater: 7, lastWateredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: true },
  { id: "plot-07", farmerId: "farmer-07", waterGroupId: "wg-01", crop: "maize", cropVariety: "African Tall", sowingDate: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 0.9, daysSinceLastWater: 16, lastWateredAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: true },
  { id: "plot-08", farmerId: "farmer-08", waterGroupId: "wg-02", crop: "paddy", cropVariety: "PR-126", sowingDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 0.5, daysSinceLastWater: 6, lastWateredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: true },
  { id: "plot-09", farmerId: "farmer-09", waterGroupId: "wg-02", crop: "cotton", cropVariety: "Bt Cotton", sowingDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 1.8, daysSinceLastWater: 18, lastWateredAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: false },
  { id: "plot-10", farmerId: "farmer-10", waterGroupId: "wg-03", crop: "wheat", cropVariety: "HD-2967", sowingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), landArea: 3.2, daysSinceLastWater: 14, lastWateredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), evidenceVerified: true }
];

const waterTurns = [
  {
    id: "turn-01", _id: "turn-01", farmerId: "farmer-01", farmerName: "Rameshwar Singh", farmerPhone: "+91 98765 43210",
    cropName: "Wheat", plotId: "plot-01", waterGroupId: "wg-01",
    score: 91.45, rank: 1, queueSize: 7,
    scheduledAt: new Date(Date.now() - 60 * 60000).toISOString(),
    startedAt:   new Date(Date.now() - 45 * 60000).toISOString(),
    completedAt: null,
    durationMinutes: 120,
    status: "IN_PROGRESS",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "turn-hist-01", farmerId: "farmer-03", farmerName: "Anita Devi", farmerPhone: "+91 97234 56789",
    cropName: "Mustard", plotId: "plot-03", waterGroupId: "wg-01",
    score: 84.2, rank: 1, queueSize: 6,
    startedAt:   new Date(Date.now() - 5 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    durationMinutes: 120,
    status: "COMPLETED",
    tieBreakReason: "Tier 1: Waiting Time — Anita Devi waited 14 days vs 10 days",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "turn-hist-02", farmerId: "farmer-05", farmerName: "Harpreet Kaur", farmerPhone: "+91 98450 11223",
    cropName: "Gram", plotId: "plot-05", waterGroupId: "wg-01",
    score: 79.8, rank: 2, queueSize: 6,
    startedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()
  }
];

const disputes = [
  {
    id: "disp-01", farmerId: "farmer-04", farmerName: "Mohan Lal Sharma", farmerPhone: "+91 94111 22334",
    turnId: "turn-01", plotId: "plot-04", waterGroupId: "wg-01",
    reason: "Claimed sowing date was 5 days earlier than recorded in system.",
    status: "RESOLVED",
    resolutionNote: "Coordinator verified with seed purchase invoice; corrected sowing date to 2025-12-08.",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "disp-02", farmerId: "farmer-06", farmerName: "Devendra Yadav", farmerPhone: "+91 93321 99887",
    turnId: "turn-hist-02", plotId: "plot-06", waterGroupId: "wg-01",
    reason: "Questioned smallholder fairness weight multiplier for plot #05.",
    status: "OPEN",
    resolutionNote: "Pending review by Water User Association committee.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const auditLogs = [
  { id: "log-01", waterGroupId: "wg-01", type: "QUEUE_RECALCULATION", message: "Priority queue dynamically recomputed for 7 plots based on FAO-56 stage updates.", timestamp: new Date(Date.now() - 50 * 60000).toISOString() },
  { id: "log-02", waterGroupId: "wg-01", type: "TURN_STARTED", message: "Water turn initiated for Rameshwar Singh (Wheat - Flowering/Milk stage, Urgency 91.45).", timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: "log-03", waterGroupId: "wg-01", type: "PUMP_STATUS_CHANGED", message: "Pump status set to ACTIVE for Rampur Village Borewell #04.", timestamp: new Date(Date.now() - 45 * 60000).toISOString() }
];

const notifications = [
  { id: "notif-01", waterGroupId: "wg-01", farmerId: "farmer-01", farmerName: "Rameshwar Singh", farmerPhone: "+91 98765 43210", channel: "SMS", messageType: "TURN_ALERT", messageBody: "JalTurn: Aapki pani ki bari 30 minute mein aayegi. Score: 91.45/100. Reply 1 to CONFIRM, 2 to PASS.", status: "DELIVERED", sentAt: new Date(Date.now() - 65 * 60000).toISOString(), deliveredAt: new Date(Date.now() - 64 * 60000).toISOString(), turnId: "turn-01" }
];

module.exports = { waterGroups, farmers, plots, waterTurns, disputes, auditLogs, notifications };
