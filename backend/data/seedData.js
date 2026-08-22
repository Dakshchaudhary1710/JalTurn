/**
 * Seed Data v2 — JalTurn
 * Full demo dataset aligned with the complete v2 schemas.
 */

const waterGroups = [
  {
    id: "wg-01",
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
    currentTurnStartedAt: new Date(Date.now() - 45 * 60 * 1000),
    totalTurnsCompleted: 142,
    totalWaterHoursDelivered: 284
  },
  {
    id: "wg-02",
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
  }
];

const farmers = [
  { id: "farmer-01", name: "Rameshwar Singh (रामेश्वर सिंह)", nameHindi: "रामेश्वर सिंह", phone: "+91 98765 43210", altPhone: "", whatsappEnabled: true, preferredLang: "hi", gender: "M", category: "Marginal", landholdingSize: 1.2, village: "Rampur", district: "Ludhiana", state: "Punjab", pincode: "141401", waterGroupId: "wg-01", isActive: true, isVerified: true, totalTurnsReceived: 12, totalWaterHours: 24, lifetimeDisputes: 0, lifetimeDisputesWon: 0 },
  { id: "farmer-02", name: "Suresh Patel (सुरेश पटेल)", nameHindi: "सुरेश पटेल", phone: "+91 98123 45678", altPhone: "", whatsappEnabled: false, preferredLang: "hi", gender: "M", category: "Marginal", landholdingSize: 0.8, village: "Rampur", district: "Ludhiana", state: "Punjab", pincode: "141401", waterGroupId: "wg-01", isActive: true, isVerified: true, totalTurnsReceived: 10, totalWaterHours: 20, lifetimeDisputes: 0, lifetimeDisputesWon: 0 },
  { id: "farmer-03", name: "Anita Devi (अनीता देवी)", nameHindi: "अनीता देवी", phone: "+91 97234 56789", altPhone: "", whatsappEnabled: true, preferredLang: "hi", gender: "F", category: "Marginal", landholdingSize: 0.6, village: "Rampur", district: "Ludhiana", state: "Punjab", pincode: "141401", waterGroupId: "wg-01", isActive: true, isVerified: false, totalTurnsReceived: 8, totalWaterHours: 16, lifetimeDisputes: 0, lifetimeDisputesWon: 0 },
  { id: "farmer-04", name: "Mohan Lal Sharma (मोहन लाल)", nameHindi: "मोहन लाल", phone: "+91 94111 22334", altPhone: "+91 94111 22335", whatsappEnabled: false, preferredLang: "hi", gender: "M", category: "Medium", landholdingSize: 4.5, village: "Rampur", district: "Ludhiana", state: "Punjab", pincode: "141401", waterGroupId: "wg-01", isActive: true, isVerified: true, totalTurnsReceived: 18, totalWaterHours: 36, lifetimeDisputes: 1, lifetimeDisputesWon: 0 },
  { id: "farmer-05", name: "Harpreet Kaur (हरप्रीत कौर)", nameHindi: "हरप्रीत कौर", phone: "+91 98450 11223", altPhone: "", whatsappEnabled: true, preferredLang: "pa", gender: "F", category: "Small", landholdingSize: 1.5, village: "Rampur", district: "Ludhiana", state: "Punjab", pincode: "141401", waterGroupId: "wg-01", isActive: true, isVerified: true, totalTurnsReceived: 14, totalWaterHours: 28, lifetimeDisputes: 0, lifetimeDisputesWon: 0 },
  { id: "farmer-06", name: "Devendra Yadav (देवेन्द्र यादव)", nameHindi: "देवेन्द्र यादव", phone: "+91 93321 99887", altPhone: "", whatsappEnabled: false, preferredLang: "hi", gender: "M", category: "Large", landholdingSize: 6.0, village: "Rampur", district: "Ludhiana", state: "Punjab", pincode: "141401", waterGroupId: "wg-01", isActive: true, isVerified: true, totalTurnsReceived: 22, totalWaterHours: 44, lifetimeDisputes: 0, lifetimeDisputesWon: 0 }
];

const plots = [
  { id: "plot-01", farmerId: "farmer-01", waterGroupId: "wg-01", crop: "wheat", cropVariety: "HD-2967", sowingDate: new Date(Date.now() - 68 * 86400000).toISOString().slice(0,10), landArea: 1.2, soilType: "Loamy", irrigationMethod: "Flood", lastWateredAt: new Date(Date.now() - 19 * 86400000), daysSinceLastWater: 19, totalWateringsThisSeason: 4, totalWaterHoursThisSeason: 8, evidenceVerified: true, evidenceImageUrl: "", isActive: true, notes: "" },
  { id: "plot-02", farmerId: "farmer-02", waterGroupId: "wg-01", crop: "wheat", cropVariety: "PBW-343", sowingDate: new Date(Date.now() - 62 * 86400000).toISOString().slice(0,10), landArea: 0.8, soilType: "Sandy", irrigationMethod: "Flood", lastWateredAt: new Date(Date.now() - 15 * 86400000), daysSinceLastWater: 15, totalWateringsThisSeason: 3, totalWaterHoursThisSeason: 6, evidenceVerified: false, evidenceImageUrl: "", isActive: true, notes: "" },
  { id: "plot-03", farmerId: "farmer-03", waterGroupId: "wg-01", crop: "mustard", cropVariety: "PUSA Bold", sowingDate: new Date(Date.now() - 42 * 86400000).toISOString().slice(0,10), landArea: 0.6, soilType: "Clay", irrigationMethod: "Flood", lastWateredAt: new Date(Date.now() - 12 * 86400000), daysSinceLastWater: 12, totalWateringsThisSeason: 2, totalWaterHoursThisSeason: 4, evidenceVerified: true, evidenceImageUrl: "", isActive: true, notes: "" },
  { id: "plot-04", farmerId: "farmer-04", waterGroupId: "wg-01", crop: "wheat", cropVariety: "HD-3086", sowingDate: new Date(Date.now() - 75 * 86400000).toISOString().slice(0,10), landArea: 4.5, soilType: "Loamy", irrigationMethod: "Flood", lastWateredAt: new Date(Date.now() - 10 * 86400000), daysSinceLastWater: 10, totalWateringsThisSeason: 5, totalWaterHoursThisSeason: 10, evidenceVerified: false, evidenceImageUrl: "", isActive: true, notes: "" },
  { id: "plot-05", farmerId: "farmer-05", waterGroupId: "wg-01", crop: "gram", cropVariety: "Pusa 256", sowingDate: new Date(Date.now() - 35 * 86400000).toISOString().slice(0,10), landArea: 1.5, soilType: "Black", irrigationMethod: "Drip", lastWateredAt: new Date(Date.now() - 8 * 86400000), daysSinceLastWater: 8, totalWateringsThisSeason: 2, totalWaterHoursThisSeason: 4, evidenceVerified: false, evidenceImageUrl: "", isActive: true, notes: "" },
  { id: "plot-06", farmerId: "farmer-06", waterGroupId: "wg-01", crop: "potato", cropVariety: "Kufri Jyoti", sowingDate: new Date(Date.now() - 55 * 86400000).toISOString().slice(0,10), landArea: 6.0, soilType: "Silty", irrigationMethod: "Furrow", lastWateredAt: new Date(Date.now() - 7 * 86400000), daysSinceLastWater: 7, totalWateringsThisSeason: 4, totalWaterHoursThisSeason: 8, evidenceVerified: true, evidenceImageUrl: "", isActive: true, notes: "" }
];

const waterTurns = [
  {
    id: "turn-01", farmerId: "farmer-01", farmerName: "Rameshwar Singh", farmerPhone: "+91 98765 43210",
    cropName: "Wheat", plotId: "plot-01", waterGroupId: "wg-01",
    score: 91.45, rank: 1, queueSize: 6,
    scoreBreakdown: { stageCriticality: 92, waitingScore: 54, smallholderEquity: 100, evidenceBonus: 5 },
    cropStageName: "Flowering / Milk Stage", cropDAS: 68, cropKc: 1.15, landArea: 1.2,
    scheduledAt: new Date(Date.now() - 60 * 60000),
    startedAt:   new Date(Date.now() - 45 * 60000),
    completedAt: null,
    durationMinutes: 120,
    status: "IN_PROGRESS",
    tieBreakReason: null, skipReason: null,
    smsNotificationSent: true, smsNotificationSentAt: new Date(Date.now() - 65 * 60000)
  },
  {
    id: "turn-hist-01", farmerId: "farmer-03", farmerName: "Anita Devi", farmerPhone: "+91 97234 56789",
    cropName: "Mustard", plotId: "plot-03", waterGroupId: "wg-01",
    score: 84.2, rank: 1, queueSize: 6,
    scoreBreakdown: { stageCriticality: 78, waitingScore: 60, smallholderEquity: 100, evidenceBonus: 0 },
    cropStageName: "Flowering", cropDAS: 42, cropKc: 1.05, landArea: 0.6,
    startedAt:   new Date(Date.now() - 5 * 3600000),
    completedAt: new Date(Date.now() - 3 * 3600000),
    durationMinutes: 120,
    status: "COMPLETED",
    tieBreakReason: "Tier 1: Waiting Time — Anita Devi waited 14 days vs 10 days",
    smsNotificationSent: true, smsNotificationSentAt: new Date(Date.now() - 5.1 * 3600000)
  }
];

const disputes = [
  {
    id: "disp-01", farmerId: "farmer-04", farmerName: "Mohan Lal Sharma", farmerPhone: "+91 94111 22334",
    turnId: "turn-01", plotId: "plot-04", waterGroupId: "wg-01",
    category: "DATA_ERROR",
    reason: "Claimed sowing date was 5 days earlier than recorded in system.",
    evidenceDescription: "Has seed purchase invoice from certified dealer.",
    status: "RESOLVED",
    resolutionNote: "Coordinator verified with seed purchase invoice; corrected sowing date to 2025-12-08.",
    resolvedAt: new Date(Date.now() - 2 * 3600000),
    resolvedByName: "Gurmail Singh (Coordinator)",
    escalationLevel: 0,
    priority: "NORMAL"
  }
];

const auditLogs = [
  { id: "log-01", waterGroupId: "wg-01", type: "QUEUE_RECALCULATION", message: "Priority queue dynamically recomputed for 6 plots based on FAO-56 stage updates.", actorType: "SYSTEM", timestamp: new Date(Date.now() - 50 * 60000) },
  { id: "log-02", waterGroupId: "wg-01", type: "TURN_STARTED", message: "Water turn initiated for Rameshwar Singh (Wheat - Flowering/Milk stage, Urgency 91.45).", actorType: "COORDINATOR", actorName: "Gurmail Singh", farmerId: "farmer-01", turnId: "turn-01", timestamp: new Date(Date.now() - 45 * 60000) },
  { id: "log-03", waterGroupId: "wg-01", type: "TURN_COMPLETED", message: "Water turn completed for Anita Devi. Plot moisture replenished; queue recalculated.", actorType: "COORDINATOR", actorName: "Gurmail Singh", farmerId: "farmer-03", turnId: "turn-hist-01", timestamp: new Date(Date.now() - 3 * 3600000) },
  { id: "log-04", waterGroupId: "wg-01", type: "FARMER_REGISTERED", message: "New farmer daksh (1 acres) registered.", actorType: "COORDINATOR", timestamp: new Date(Date.now() - 6 * 3600000) }
];

const notifications = [
  { id: "notif-01", waterGroupId: "wg-01", farmerId: "farmer-01", farmerName: "Rameshwar Singh", farmerPhone: "+91 98765 43210", channel: "SMS", messageType: "TURN_ALERT", messageBody: "JalTurn: Aapki pani ki bari 30 minute mein aayegi. Score: 91.45/100. Reply 1 to CONFIRM, 2 to PASS.", status: "DELIVERED", sentAt: new Date(Date.now() - 65 * 60000), deliveredAt: new Date(Date.now() - 64 * 60000), turnId: "turn-01" },
  { id: "notif-02", waterGroupId: "wg-01", farmerId: "farmer-03", farmerName: "Anita Devi", farmerPhone: "+91 97234 56789", channel: "SMS", messageType: "TURN_STARTED", messageBody: "JalTurn: Anita Devi - aapki borewell turn shuru ho gayi. Duration: 120 min.", status: "DELIVERED", sentAt: new Date(Date.now() - 5.1 * 3600000), deliveredAt: new Date(Date.now() - 5 * 3600000), turnId: "turn-hist-01" }
];

module.exports = { waterGroups, farmers, plots, waterTurns, disputes, auditLogs, notifications };
