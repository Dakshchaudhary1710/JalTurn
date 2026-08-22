import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar.jsx";
import { LandingPage } from "./components/LandingPage.jsx";
import { ActiveTurnBanner } from "./components/ActiveTurnBanner.jsx";
import { PriorityQueue } from "./components/PriorityQueue.jsx";
import { FarmerRegistration } from "./components/FarmerRegistration.jsx";
import { ExplainabilityModal } from "./components/ExplainabilityModal.jsx";
import { TieBreakerSimulator } from "./components/TieBreakerSimulator.jsx";
import { TurnHistory } from "./components/TurnHistory.jsx";
import { FairnessDashboard } from "./components/FairnessDashboard.jsx";

import { NotificationCenter } from "./components/NotificationCenter.jsx";
import { SMSMockModal } from "./components/SMSMockModal.jsx";
import { DisputeModal } from "./components/DisputeModal.jsx";
import { AddBorewellModal } from "./components/AddBorewellModal.jsx";
import { api } from "./services/api.js";
import { Droplets, Sparkles, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState("landing"); // 'landing' | 'dashboard' | 'register' | 'tie-demo' | 'history' | 'fairness'

  // Water Groups & Selection
  const [waterGroups, setWaterGroups] = useState([
    { id: "wg-01", name: "Rampur Village Borewell #04", sourceType: "Shared Borewell", activeStatus: "ACTIVE" },
    { id: "wg-02", name: "Shivalik Canal Lateral 2B", sourceType: "Canal Lateral Outlet", activeStatus: "IDLE" }
  ]);
  const [selectedGroupId, setSelectedGroupId] = useState("wg-01");

  // Queue State
  const [queueData, setQueueData] = useState({
    waterGroup: null,
    activeTurn: null,
    queue: [],
    fairnessMetrics: null
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // History & Disputes State
  const [turnHistory, setTurnHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [disputes, setDisputes] = useState([]);

  // Modals & Drawers
  const [explainFarmer, setExplainFarmer] = useState(null);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeTargetTurn, setDisputeTargetTurn] = useState(null);
  const [isSMSOpen, setIsSMSOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddBorewellOpen, setIsAddBorewellOpen] = useState(false);

  // Toast Alerts
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // In-App Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "URGENT_TURN",
      title: "🌾 Turn Scheduled: Rameshwar Singh",
      body: "Wheat crop in critical flowering/grain-filling stage (Urgency: 91.45/100). Discharge started.",
      time: "10m ago"
    },
    {
      id: 2,
      type: "TIE_ALERT",
      title: "⚖ 4-Tier Tie Resolution Executed",
      body: "Tie between Anita Devi & Vikram resolved via Tier 1 (Waiting time 14d vs 10d).",
      time: "45m ago"
    }
  ]);

  const loadGroups = useCallback(async () => {
    try {
      const res = await api.getWaterGroups();
      if (res.success && res.waterGroups) {
        setWaterGroups(res.waterGroups);
      }
    } catch (err) {
      console.warn("Using fallback water groups:", err);
    }
  }, []);

  // Load Groups
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Fetch Authoritative Queue Data
  const loadQueueData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const [qData, histData, logData, dispData] = await Promise.all([
        api.getQueue(selectedGroupId),
        api.getTurnHistory(selectedGroupId).catch(() => ({ turns: [] })),
        api.getLogs(selectedGroupId).catch(() => ({ logs: [] })),
        api.getDisputes(selectedGroupId).catch(() => ({ disputes: [] }))
      ]);

      if (qData) {
        setQueueData(qData);
      }
      if (histData?.turns) setTurnHistory(histData.turns);
      if (logData?.logs) setLogs(logData.logs);
      if (dispData?.disputes) setDisputes(dispData.disputes);
    } catch (err) {
      console.error("Failed to load queue data:", err);
    } finally {
      setLoading(false);
      if (showIndicator) setIsRefreshing(false);
    }
  }, [selectedGroupId]);

  useEffect(() => {
    loadQueueData();
    // Auto-refresh interval every 30s for live simulation
    const interval = setInterval(() => {
      loadQueueData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadQueueData]);

  // Actions
  const handleAddBorewell = async (formData) => {
    try {
      const res = await api.addWaterGroup(formData);
      if (res.success) {
        showToast(`Water source "${formData.name}" added successfully!`);
        await loadGroups();
        setSelectedGroupId(res.waterGroup.id);
      }
    } catch (err) {
      showToast("Error adding water source: " + err.message, "error");
    }
  };

  const handleRecalculate = async (customWeights) => {
    try {
      setIsRefreshing(true);
      const res = await api.recalculateQueue(selectedGroupId, customWeights);
      if (res) {
        setQueueData(res);
        showToast("Priority Queue recalculated dynamically with updated FAO-56 weights!");
      }
    } catch (err) {
      showToast("Error recalculating queue: " + err.message, "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStartTurn = async (turnId, plotId) => {
    try {
      const res = await api.startTurn(selectedGroupId, plotId);
      if (res.success) {
        showToast(`Water turn started for ${res.turn.farmerName}!`);
        loadQueueData();
      }
    } catch (err) {
      showToast("Error starting turn: " + err.message, "error");
    }
  };

  const handleCompleteTurn = async (turnId, nextPlotId) => {
    if (!turnId && nextPlotId) {
      return handleStartTurn(null, nextPlotId);
    }
    try {
      const res = await api.completeTurn(selectedGroupId, turnId);
      if (res.success) {
        showToast(`Water turn marked completed for ${res.turn?.farmerName || 'Current Farmer'}. Plot refreshed!`);
        loadQueueData();
      }
    } catch (err) {
      showToast("Error completing turn: " + err.message, "error");
    }
  };

  const handleSkipTurn = async (turnId) => {
    try {
      const res = await api.skipTurn(selectedGroupId, turnId, "Farmer requested postponement / pump servicing");
      if (res.success) {
        showToast("Turn skipped and logged to public history.");
        loadQueueData();
      }
    } catch (err) {
      showToast("Error skipping turn: " + err.message, "error");
    }
  };

  const handleRegisterFarmer = async (formData) => {
    try {
      const res = await api.registerFarmer(formData);
      if (res.success) {
        showToast(`Farmer ${formData.name} registered successfully!`);
        await loadQueueData();
        setActiveTab("dashboard");
      } else {
        throw new Error(res.message || "Failed to register");
      }
    } catch (err) {
      showToast("Error registering farmer: " + err.message, "error");
      throw err;
    }
  };

  const handleRaiseDispute = (turn) => {
    setDisputeTargetTurn(turn);
    setIsDisputeOpen(true);
  };

  const handleSubmitDispute = async (disputeData) => {
    try {
      const res = await api.createDispute(disputeData);
      if (res.success) {
        showToast("Dispute logged immutably in Public Turn History.");
        loadQueueData();
      }
    } catch (err) {
      showToast("Error filing dispute: " + err.message, "error");
    }
  };

  const selectedGroup = waterGroups.find(g => (g.id || g._id) === selectedGroupId) || waterGroups[0];
  const activeTurn = queueData.activeTurn;
  const nextFarmer = queueData.queue && queueData.queue.length > 0 ? queueData.queue[0] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-semibold flex items-center space-x-2 ${
            toastMessage.type === "error"
              ? "bg-red-950 border-red-500 text-red-200"
              : "bg-emerald-950 border-emerald-500 text-emerald-200"
          }`}>
            {toastMessage.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        waterGroups={waterGroups}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
        activeStatus={activeTurn ? "ACTIVE" : selectedGroup?.activeStatus || "IDLE"}
        notificationsCount={notifications.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSMSMock={() => setIsSMSOpen(true)}
        onOpenAddBorewell={() => setIsAddBorewellOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* TAB 0: Landing Page (Overview & Pitch Entry) */}
        {activeTab === "landing" && (
          <LandingPage
            onLaunchDashboard={() => setActiveTab("dashboard")}
            onOpenTieDemo={() => setActiveTab("tie-demo")}
            onOpenRegister={() => setActiveTab("register")}
            onOpenPitch={() => setActiveTab("pitch")}
          />
        )}

        {/* TAB 1: Water Group Dashboard (Hero Screen) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            
            {/* Live Active Turn Banner */}
            <ActiveTurnBanner
              activeTurn={activeTurn}
              waterGroup={selectedGroup}
              nextFarmer={nextFarmer}
              onCompleteTurn={handleCompleteTurn}
              onSkipTurn={handleSkipTurn}
              onRaiseDispute={handleRaiseDispute}
            />

            {/* Authoritative Dynamic Priority Queue */}
            <PriorityQueue
              queue={queueData.queue}
              onSelectFarmerForExplain={(farmer) => setExplainFarmer(farmer)}
              onRecalculate={handleRecalculate}
              onStartTurnForFarmer={(farmer) => handleStartTurn(null, farmer.plotId)}
              onOpenTieSimulatorWith={(topFarmer, secondFarmer) => {
                setActiveTab("tie-demo");
              }}
            />

          </div>
        )}

        {/* TAB 2: Farmer Registration (Phase 1 & 5) */}
        {activeTab === "register" && (
          <FarmerRegistration
            waterGroups={waterGroups}
            selectedGroupId={selectedGroupId}
            onRegisterFarmer={handleRegisterFarmer}
            onCancel={() => setActiveTab("dashboard")}
          />
        )}

        {/* TAB 3: Predefined 4-Tier Tie Breaker (Phase 7 Judge Demo) */}
        {activeTab === "tie-demo" && (
          <TieBreakerSimulator />
        )}

        {/* TAB 4: Public Turn History & Transparent Ledger (Phase 8) */}
        {activeTab === "history" && (
          <TurnHistory
            turns={turnHistory}
            logs={logs}
            disputes={disputes}
          />
        )}

        {/* TAB 5: Group Fairness Dashboard (Phase 9) */}
        {activeTab === "fairness" && (
          <FairnessDashboard
            fairnessMetrics={queueData.fairnessMetrics}
            queue={queueData.queue}
            waterGroup={selectedGroup}
          />
        )}

      </main>

      {/* MODALS */}

      {/* 1. Explainability Modal ("Why am I #2?") */}
      <ExplainabilityModal
        farmerData={explainFarmer}
        topFarmer={nextFarmer}
        onClose={() => setExplainFarmer(null)}
      />

      {/* 2. Rural Multi-Channel Outreach Simulator (SMS, WhatsApp, IVR Voice Call) */}
      <AddBorewellModal
        isOpen={isAddBorewellOpen}
        onClose={() => setIsAddBorewellOpen(false)}
        onSubmit={handleAddBorewell}
      />

      <SMSMockModal
        isOpen={isSMSOpen}
        onClose={() => setIsSMSOpen(false)}
        activeFarmer={activeTurn ? {
          farmerName: activeTurn.farmerName,
          crop: activeTurn.cropName,
          urgencyScore: activeTurn.score,
          estimatedTurnText: "Now Active (120m cycle)"
        } : nextFarmer}
      />

      {/* 3. Dispute Modal */}
      <DisputeModal
        isOpen={isDisputeOpen}
        onClose={() => {
          setIsDisputeOpen(false);
          setDisputeTargetTurn(null);
        }}
        activeTurn={disputeTargetTurn || activeTurn}
        waterGroupId={selectedGroupId}
        onSubmitDispute={handleSubmitDispute}
      />

      {/* 4. Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClear={() => setNotifications([])}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-300">JalTurn</span>
            <span>•</span>
            <span>FAO-56 Evapotranspiration Crop-Urgency Shared Irrigation Engine</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Hackathon MVP • Designed for Water User Associations (WUAs)
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
