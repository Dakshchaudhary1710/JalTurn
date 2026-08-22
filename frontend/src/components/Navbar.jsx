import React from "react";
import {
  Droplets,
  Sprout,
  Scale,
  History,
  UserPlus,
  Bell,
  Radio,
  Power,
  Zap,
  BarChart3,
} from "lucide-react";

export function Navbar({
  activeTab,
  setActiveTab,
  waterGroups = [],
  selectedGroupId,
  setSelectedGroupId,
  activeStatus = "ACTIVE",
  notificationsCount = 2,
  onOpenNotifications,
  onOpenSMSMock,
  onOpenAddBorewell,
  onTogglePumpStatus,
}) {
  const selectedPump = waterGroups.find(
    (g) => String(g.id || g._id) === String(selectedGroupId)
  );

  const pumpStatus =
    selectedPump?.status ||
    selectedPump?.pumpStatus ||
    selectedPump?.activeStatus ||
    activeStatus ||
    "STANDBY";

  const isPumpActive = String(pumpStatus).toUpperCase() === "ACTIVE";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= DESKTOP NAVBAR ================= */}
        <div className="flex items-center justify-between h-16">

          {/* ================= BRAND ================= */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab("landing")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Droplets className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Jal<span className="text-emerald-400">Turn</span>
                </span>
              </div>
            </div>
          </div>

          {/* ================= NAVIGATION ================= */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">

            {/* Live Queue */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "dashboard"
                  ? "bg-emerald-900/80 text-emerald-400 shadow-sm border border-emerald-700/60"
                  : "text-white/85 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Sprout className="w-4 h-4 text-teal-400" />
              <span>Live Queue</span>
            </button>

            {/* Register Farmer */}
            <button
              onClick={() => setActiveTab("register")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "register"
                  ? "bg-emerald-900/80 text-emerald-400 shadow-sm border border-emerald-700/60"
                  : "text-white/85 hover:text-white hover:bg-slate-800"
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Register Farmer</span>
            </button>

            {/* Tie Demo */}
            <button
              onClick={() => setActiveTab("tie-demo")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "tie-demo"
                  ? "bg-amber-950/60 text-amber-300 border border-amber-800/80 shadow-sm"
                  : "text-white/85 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Tie Demo</span>
            </button>

            {/* Turn History */}
            <button
              onClick={() => setActiveTab("history")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "history"
                  ? "bg-purple-900/50 text-purple-300 shadow-sm border border-purple-700/60"
                  : "text-white/85 hover:text-white hover:bg-slate-800"
              }`}
            >
              <History className="w-4 h-4 text-purple-400" />
              <span>Turn History</span>
            </button>

            {/* Fairness */}
            <button
              onClick={() => setActiveTab("fairness")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "fairness"
                  ? "bg-teal-900/50 text-teal-300 shadow-sm border border-teal-700/60"
                  : "text-white/85 hover:text-white hover:bg-slate-800"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Fairness</span>
            </button>

          </nav>

          {/* ================= RIGHT SECTION ================= */}
          <div className="flex items-center space-x-3">

            {/* ================= PUMP SELECTOR ================= */}
            <div className="relative">
              <select
                value={selectedGroupId || ""}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer max-w-[210px]"
              >
                {waterGroups.length > 0 ? (
                  waterGroups.map((group, index) => {
                    const groupId = group.id || group._id;
                    const pumpName =
                      group.name ||
                      group.borewellName ||
                      group.pumpName ||
                      `Borewell #${String(index + 1).padStart(2, "0")}`;

                    return (
                      <option key={groupId} value={groupId}>
                        {pumpName}
                      </option>
                    );
                  })
                ) : (
                  <option value="">No Pumps Available</option>
                )}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                ▼
              </div>
            </div>

            {/* ================= ADD PUMP ================= */}
            <button
              onClick={onOpenAddBorewell}
              title="Add New Village Borewell"
              className="p-2 rounded-lg bg-transparent text-emerald-400 hover:bg-slate-800/60 hover:text-emerald-300 border border-emerald-800/50 transition-colors flex items-center"
            >
              <UserPlus className="w-4 h-4" />
            </button>

            {/* ================= INTERACTIVE ACTIVE PUMP BUTTON ================= */}
            <button
              onClick={() => onTogglePumpStatus && onTogglePumpStatus(selectedGroupId)}
              title={
                isPumpActive
                  ? "Pump is RUNNING — Click to Switch to Standby / Pause"
                  : "Pump is STANDBY — Click to Activate Pump Power"
              }
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center space-x-2 shadow-md cursor-pointer select-none ${
                isPumpActive
                  ? "bg-emerald-950/90 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/90 shadow-emerald-950/60 ring-1 ring-emerald-500/30"
                  : "bg-slate-900/90 border-amber-500/50 text-amber-300 hover:bg-slate-800/90 hover:border-amber-400"
              }`}
            >
              <div className="relative flex items-center justify-center">
                {isPumpActive && (
                  <span className="absolute w-3 h-3 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                )}
                <span
                  className={`w-2.5 h-2.5 rounded-full relative z-10 ${
                    isPumpActive ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
              </div>

              <div className="flex items-center space-x-1 font-mono text-[11px] tracking-tight">
                <Power className={`w-3.5 h-3.5 ${isPumpActive ? "text-emerald-400" : "text-amber-400"}`} />
                <span>{isPumpActive ? "PUMP ACTIVE" : "PUMP STANDBY"}</span>
              </div>
            </button>

            {/* ================= SMS ALERT ================= */}
            <button
              onClick={onOpenSMSMock}
              title="View Simulated SMS / WhatsApp / IVR Turn Alert"
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center space-x-1"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="text-xs hidden sm:inline">SMS Alert</span>
            </button>

            {/* ================= NOTIFICATIONS ================= */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-[10px] font-bold text-slate-950 rounded-full flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* ================= MOBILE NAVIGATION ================= */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800 text-xs overflow-x-auto space-x-2">
          <button
            onClick={() => setActiveTab("landing")}
            className={`px-2.5 py-1.5 rounded ${
              activeTab === "landing"
                ? "bg-slate-800 text-emerald-400"
                : "text-slate-400"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-2.5 py-1.5 rounded ${
              activeTab === "dashboard"
                ? "bg-slate-800 text-teal-400"
                : "text-slate-400"
            }`}
          >
            Queue
          </button>

          <button
            onClick={() => setActiveTab("register")}
            className={`px-2.5 py-1.5 rounded ${
              activeTab === "register"
                ? "bg-slate-800 text-sky-400"
                : "text-slate-400"
            }`}
          >
            Register
          </button>

          <button
            onClick={() => setActiveTab("tie-demo")}
            className={`px-2.5 py-1.5 rounded ${
              activeTab === "tie-demo"
                ? "bg-amber-950 text-amber-300"
                : "text-slate-400"
            }`}
          >
            Tie Demo
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-2.5 py-1.5 rounded ${
              activeTab === "history"
                ? "bg-slate-800 text-purple-400"
                : "text-white/75"
            }`}
          >
            History
          </button>

          <button
            onClick={() => setActiveTab("fairness")}
            className={`px-2.5 py-1.5 rounded ${
              activeTab === "fairness"
                ? "bg-slate-800 text-teal-400"
                : "text-white/75"
            }`}
          >
            Fairness
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
