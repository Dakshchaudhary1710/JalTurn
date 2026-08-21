import React from "react";
import { Droplets, Sprout, Scale, History, BarChart3, Presentation, UserPlus, Bell, Radio, Home } from "lucide-react";

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
  onOpenAddBorewell
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("landing")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white">Jal<span className="text-emerald-400">Turn</span></span>
               
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
          

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "dashboard"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Sprout className="w-4 h-4 text-teal-400" />
              <span>Live Queue</span>
            </button>

            <button
              onClick={() => setActiveTab("register")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "register"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <UserPlus className="w-4 h-4 text-sky-400" />
              <span>Register Farmer</span>
            </button>

            <button
              onClick={() => setActiveTab("tie-demo")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "tie-demo"
                  ? "bg-amber-950/60 text-amber-300 border border-amber-800/80 shadow-sm"
                  : "text-amber-400/80 hover:text-amber-300 hover:bg-slate-900"
              }`}
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span className="flex items-center">
                Tie Demo
                <span className="ml-1 px-1.5 py-0.2 text-[9px] bg-amber-500/20 text-amber-300 rounded font-mono">4-Tier</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "history"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <History className="w-4 h-4 text-purple-400" />
              <span>Turn History</span>
            </button>

            <button
              onClick={() => setActiveTab("fairness")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "fairness"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Fairness</span>
            </button>
          </nav>

          {/* Right Section: Water Group Selector + Notifications + SMS Mock */}
          <div className="flex items-center space-x-3">
            
            {/* Water Group Selector */}
            <div className="relative">
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
              >
                {waterGroups.map((g) => (
                  <option key={g.id || g._id} value={g.id || g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                ▼
              </div>
            </div>

            {/* Add Borewell Button */}
            <button
              onClick={onOpenAddBorewell}
              title="Add New Village Borewell"
              className="p-2 rounded-lg bg-emerald-900/40 text-emerald-400 hover:bg-emerald-800/60 hover:text-emerald-300 border border-emerald-800/50 transition-colors flex items-center"
            >
              <UserPlus className="w-4 h-4" /> {/* Or just use a generic icon */}
            </button>

            {/* Source Status Pill */}
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${activeStatus === "ACTIVE" ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`}></span>
              <span className="text-[11px] font-mono text-slate-300">
                {activeStatus === "ACTIVE" ? "PUMP ACTIVE" : "STANDBY"}
              </span>
            </div>

            {/* Simulated SMS Alert Trigger */}
            <button
              onClick={onOpenSMSMock}
              title="View Simulated SMS / WhatsApp / IVR Turn Alert"
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center space-x-1"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="text-xs hidden sm:inline">SMS Alert</span>
            </button>

            {/* Notification Bell */}
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

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800 text-xs overflow-x-auto space-x-2">
          <button onClick={() => setActiveTab("landing")} className={`px-2.5 py-1.5 rounded ${activeTab === 'landing' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}>Overview</button>
          <button onClick={() => setActiveTab("dashboard")} className={`px-2.5 py-1.5 rounded ${activeTab === 'dashboard' ? 'bg-slate-800 text-teal-400' : 'text-slate-400'}`}>Queue</button>
          <button onClick={() => setActiveTab("register")} className={`px-2.5 py-1.5 rounded ${activeTab === 'register' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'}`}>Register</button>
          <button onClick={() => setActiveTab("tie-demo")} className={`px-2.5 py-1.5 rounded ${activeTab === 'tie-demo' ? 'bg-amber-950 text-amber-300' : 'text-slate-400'}`}>Tie Demo</button>
          <button onClick={() => setActiveTab("history")} className={`px-2.5 py-1.5 rounded ${activeTab === 'history' ? 'bg-slate-800 text-purple-400' : 'text-slate-400'}`}>History</button>
          <button onClick={() => setActiveTab("fairness")} className={`px-2.5 py-1.5 rounded ${activeTab === 'fairness' ? 'bg-slate-800 text-teal-400' : 'text-slate-400'}`}>Fairness</button>
        </div>

      </div>
    </header>
  );
}
