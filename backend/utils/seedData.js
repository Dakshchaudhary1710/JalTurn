export const INITIAL_DATA = {
  waterGroups: [
    {
      id: "wg-01",
      _id: "wg-01",
      name: "Rampur Village Borewell #04",
      sourceType: "Shared Borewell",
      sourceName: "Tubewell 15-HP (Discharge 38,000 L/hr)",
      village: "Rampur, Sector 4",
      activeStatus: "ACTIVE", // ACTIVE, IDLE, MAINTENANCE
      totalCapacityAcres: 24.5,
      currentTurnFarmerId: "farmer-01",
      currentTurnStartedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // started 45 mins ago
      currentTurnDurationMinutes: 120, // 2 hours
      farmers: ["farmer-01", "farmer-02", "farmer-03", "farmer-04", "farmer-05", "farmer-06"],
      createdAt: "2026-01-10T08:00:00.000Z"
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
      currentTurnStartedAt: null,
      currentTurnDurationMinutes: 180,
      farmers: ["farmer-07", "farmer-08", "farmer-09", "farmer-10"],
      createdAt: "2026-01-15T09:30:00.000Z"
    }
  ],

  farmers: [
    {
      id: "farmer-01",
      _id: "farmer-01",
      name: "Rameshwar Singh (रामेश्वर सिंह)",
      phone: "+91 98765 43210",
      landholdingSize: 1.2, // acres
      category: "Marginal",
      waterGroupId: "wg-01",
      createdAt: "2026-01-12T00:00:00.000Z"
    },
    {
      id: "farmer-02",
      _id: "farmer-02",
      name: "Suresh Patel (सुरेश पटेल)",
      phone: "+91 98123 45678",
      landholdingSize: 0.8,
      category: "Marginal",
      waterGroupId: "wg-01",
      createdAt: "2026-01-12T00:00:00.000Z"
    },
    {
      id: "farmer-03",
      _id: "farmer-03",
      name: "Anita Devi (अनीता देवी)",
      phone: "+91 97234 56789",
      landholdingSize: 0.6,
      category: "Marginal",
      waterGroupId: "wg-01",
      createdAt: "2026-01-14T00:00:00.000Z"
    },
    {
      id: "farmer-04",
      _id: "farmer-04",
      name: "Mohan Lal Sharma (मोहन लाल)",
      phone: "+91 94111 22334",
      landholdingSize: 4.5,
      category: "Medium",
      waterGroupId: "wg-01",
      createdAt: "2026-01-14T00:00:00.000Z"
    },
    {
      id: "farmer-05",
      _id: "farmer-05",
      name: "Harpreet Kaur (हरप्रीत कौर)",
      phone: "+91 98450 11223",
      landholdingSize: 1.5,
      category: "Small",
      waterGroupId: "wg-01",
      createdAt: "2026-01-15T00:00:00.000Z"
    },
    {
      id: "farmer-06",
      _id: "farmer-06",
      name: "Devendra Yadav (देवेन्द्र यादव)",
      phone: "+91 93321 99887",
      landholdingSize: 6.0,
      category: "Large",
      waterGroupId: "wg-01",
      createdAt: "2026-01-16T00:00:00.000Z"
    },

    // Group 2 farmers
    {
      id: "farmer-07",
      _id: "farmer-07",
      name: "Gurmeet Singh (गुरमीत सिंह)",
      phone: "+91 98990 44556",
      landholdingSize: 2.0,
      category: "Small",
      waterGroupId: "wg-02",
      createdAt: "2026-01-18T00:00:00.000Z"
    },
    {
      id: "farmer-08",
      _id: "farmer-08",
      name: "Lakshmi Bai (लक्ष्मी बाई)",
      phone: "+91 97788 12345",
      landholdingSize: 0.5,
      category: "Marginal",
      waterGroupId: "wg-02",
      createdAt: "2026-01-18T00:00:00.000Z"
    },
    {
      id: "farmer-09",
      _id: "farmer-09",
      name: "Balwinder Sandhu (बलविंदर संधू)",
      phone: "+91 98221 66778",
      landholdingSize: 3.5,
      category: "Medium",
      waterGroupId: "wg-02",
      createdAt: "2026-01-19T00:00:00.000Z"
    },
    {
      id: "farmer-10",
      _id: "farmer-10",
      name: "Kavita Rathi (कविता राठी)",
      phone: "+91 99110 55443",
      landholdingSize: 1.0,
      category: "Marginal",
      waterGroupId: "wg-02",
      createdAt: "2026-01-20T00:00:00.000Z"
    }
  ],

  plots: [
    {
      id: "plot-01",
      _id: "plot-01",
      farmerId: "farmer-01",
      crop: "wheat",
      sowingDate: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // ~68 days ago (Mid-Season Flowering / Grain filling)
      landArea: 1.2,
      lastWateredAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), // 19 days ago
      daysSinceLastWater: 19,
      waterGroupId: "wg-01",
      evidenceVerified: true,
      soilMoisturePct: 18, // dry
      notes: "Field #3 near East border, Wheat HD-2967"
    },
    {
      id: "plot-02",
      _id: "plot-02",
      farmerId: "farmer-02",
      crop: "wheat",
      sowingDate: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // ~62 days (Mid-Season Flowering)
      landArea: 0.8,
      lastWateredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 15,
      waterGroupId: "wg-01",
      evidenceVerified: false,
      soilMoisturePct: 22,
      notes: "Field #1, Wheat DBW-187"
    },
    {
      id: "plot-03",
      _id: "plot-03",
      farmerId: "farmer-03",
      crop: "mustard",
      sowingDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // ~42 days (Development / Pre-flowering)
      landArea: 0.6,
      lastWateredAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 12,
      waterGroupId: "wg-01",
      evidenceVerified: true,
      soilMoisturePct: 20,
      notes: "Field #4, Mustard Pusa Bold"
    },
    {
      id: "plot-04",
      _id: "plot-04",
      farmerId: "farmer-04",
      crop: "wheat",
      sowingDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // ~75 days (Mid-Season)
      landArea: 4.5,
      lastWateredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 10,
      waterGroupId: "wg-01",
      evidenceVerified: false,
      soilMoisturePct: 28,
      notes: "Large plot south side"
    },
    {
      id: "plot-05",
      _id: "plot-05",
      farmerId: "farmer-05",
      crop: "gram",
      sowingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // ~35 days (Development)
      landArea: 1.5,
      lastWateredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 8,
      waterGroupId: "wg-01",
      evidenceVerified: false,
      soilMoisturePct: 35,
      notes: "Gram JG-11"
    },
    {
      id: "plot-06",
      _id: "plot-06",
      farmerId: "farmer-06",
      crop: "potato",
      sowingDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // ~55 days (Tuber bulking - Critical)
      landArea: 6.0,
      lastWateredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 7,
      waterGroupId: "wg-01",
      evidenceVerified: true,
      soilMoisturePct: 24,
      notes: "Potato Kufri Jyoti"
    },

    // Group 2 Plots
    {
      id: "plot-07",
      _id: "plot-07",
      farmerId: "farmer-07",
      crop: "wheat",
      sowingDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 2.0,
      lastWateredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 14,
      waterGroupId: "wg-02",
      evidenceVerified: true,
      soilMoisturePct: 20
    },
    {
      id: "plot-08",
      _id: "plot-08",
      farmerId: "farmer-08",
      crop: "mustard",
      sowingDate: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 0.5,
      lastWateredAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 22,
      waterGroupId: "wg-02",
      evidenceVerified: true,
      soilMoisturePct: 15
    },
    {
      id: "plot-09",
      _id: "plot-09",
      farmerId: "farmer-09",
      crop: "sugarcane",
      sowingDate: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 3.5,
      lastWateredAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 11,
      waterGroupId: "wg-02",
      evidenceVerified: false,
      soilMoisturePct: 30
    },
    {
      id: "plot-10",
      _id: "plot-10",
      farmerId: "farmer-10",
      crop: "potato",
      sowingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      landArea: 1.0,
      lastWateredAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastWater: 9,
      waterGroupId: "wg-02",
      evidenceVerified: true,
      soilMoisturePct: 22
    }
  ],

  waterTurns: [
    {
      id: "turn-01",
      _id: "turn-01",
      farmerId: "farmer-01",
      farmerName: "Rameshwar Singh",
      cropName: "Wheat",
      plotId: "plot-01",
      waterGroupId: "wg-01",
      score: 91.45,
      rank: 1,
      scheduledAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      completedAt: null,
      status: "IN_PROGRESS", // PENDING, IN_PROGRESS, COMPLETED, SKIPPED
      durationMinutes: 120,
      tieBreakReason: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "turn-00-hist1",
      _id: "turn-00-hist1",
      farmerId: "farmer-03",
      farmerName: "Anita Devi",
      cropName: "Mustard",
      plotId: "plot-03",
      waterGroupId: "wg-01",
      score: 84.2,
      rank: 1,
      scheduledAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      durationMinutes: 120,
      tieBreakReason: "Tie resolved: Longer waiting time (14 days vs 10 days)",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "turn-00-hist2",
      _id: "turn-00-hist2",
      farmerId: "farmer-05",
      farmerName: "Harpreet Kaur",
      cropName: "Gram",
      plotId: "plot-05",
      waterGroupId: "wg-01",
      score: 79.5,
      rank: 2,
      scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      durationMinutes: 120,
      tieBreakReason: null,
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
    }
  ],

  disputes: [
    {
      id: "disp-01",
      _id: "disp-01",
      farmerId: "farmer-04",
      farmerName: "Mohan Lal Sharma",
      turnId: "turn-01",
      waterGroupId: "wg-01",
      reason: "Claimed sowing date was 5 days earlier than recorded in system.",
      status: "RESOLVED", // PENDING, INVESTIGATING, RESOLVED, REJECTED
      resolutionNote: "Coordinator verified with seed purchase invoice; corrected sowing date to 2025-12-08.",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ],

  logs: [
    {
      id: "log-01",
      waterGroupId: "wg-01",
      type: "QUEUE_RECALCULATION",
      message: "Priority queue dynamically recomputed for 6 plots based on FAO-56 stage updates.",
      timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString()
    },
    {
      id: "log-02",
      waterGroupId: "wg-01",
      type: "TURN_STARTED",
      message: "Water turn initiated for Rameshwar Singh (Wheat - Flowering/Milk stage, Urgency 91.45).",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    {
      id: "log-03",
      waterGroupId: "wg-01",
      type: "TIE_RESOLVED",
      message: "Tie resolved between Rameshwar Singh & Suresh Patel via Tier 1 (Waiting time 19d vs 15d).",
      timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString()
    }
  ]
};
