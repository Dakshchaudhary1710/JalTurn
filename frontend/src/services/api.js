/**
 * JalTurn Frontend API Service
 * Connects directly to Express REST Backend at localhost:5000
 */

const API_BASE = "http://localhost:5000/api";

// Fetch helper
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || `HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`[JalTurn API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Water Groups
  getWaterGroups: async () => {
    return await apiRequest("/water-groups");
  },
  
  addWaterGroup: async (groupData) => {
    return await apiRequest("/water-groups", {
      method: "POST",
      body: JSON.stringify(groupData)
    });
  },

  // Authoritative Queue
  getQueue: async (waterGroupId = "wg-01") => {
    return await apiRequest(`/queue/${waterGroupId}`);
  },

  recalculateQueue: async (waterGroupId = "wg-01", customWeights = null) => {
    return await apiRequest("/queue/recalculate", {
      method: "POST",
      body: JSON.stringify({ waterGroupId, customWeights })
    });
  },

  // Turns
  startTurn: async (waterGroupId, plotId) => {
    return await apiRequest("/turns/start", {
      method: "POST",
      body: JSON.stringify({ waterGroupId, plotId })
    });
  },

  completeTurn: async (waterGroupId, turnId) => {
    return await apiRequest("/turns/complete", {
      method: "POST",
      body: JSON.stringify({ waterGroupId, turnId })
    });
  },

  skipTurn: async (waterGroupId, turnId, reason) => {
    return await apiRequest("/turns/skip", {
      method: "POST",
      body: JSON.stringify({ waterGroupId, turnId, reason })
    });
  },

  getTurnHistory: async (waterGroupId = "wg-01") => {
    return await apiRequest(`/turns/history/${waterGroupId}`);
  },

  // Farmers Registration
  getFarmers: async (waterGroupId = "wg-01") => {
    return await apiRequest(`/farmers?waterGroupId=${waterGroupId}`);
  },

  registerFarmer: async (farmerData) => {
    return await apiRequest("/farmers", {
      method: "POST",
      body: JSON.stringify(farmerData)
    });
  },

  // Disputes
  getDisputes: async (waterGroupId = "wg-01") => {
    return await apiRequest(`/disputes/${waterGroupId}`);
  },

  createDispute: async (disputeData) => {
    return await apiRequest("/disputes", {
      method: "POST",
      body: JSON.stringify(disputeData)
    });
  },

  // Logs
  getLogs: async (waterGroupId = "wg-01") => {
    return await apiRequest(`/logs/${waterGroupId}`);
  }
};
