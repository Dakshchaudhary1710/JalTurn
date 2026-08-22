import React from "react";
import { Droplets, Sprout, Scale, History, BarChart3, UserPlus, Bell, Radio } from "lucide-react";

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
    <header className="sticky top-0 z-50" style={{borderBottom:"1px solid rgba(255,255,255,0.12)", background:"rgba(0,0,0,0.35)", backdropFilter:"blur(20px)"}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("landing")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{background:"linear-gradient(135deg,#5E8C76,#5E8099)"}}>
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Jal<span style={{color:"#6FCCA0"}}>Turn</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5`}
              style={activeTab === "dashboard"
                ? {background:"rgba(111,204,160,0.15)", color:"#6FCCA0", border:"1px solid rgba(111,204,160,0.35)"}
                : {color:"rgba(255,255,255,0.70)"}}
            >
              <Sprout className="w-4 h-4" style={{color:"#6FCCA0"}} />
              <span>Live Queue</span>
            </button>

            <button
              onClick={() => setActiveTab("register")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5`}
              style={activeTab === "register"
                ? {background:"rgba(123,184,212,0.15)", color:"#7BB8D4", border:"1px solid rgba(123,184,212,0.35)"}
                : {color:"rgba(255,255,255,0.70)"}}
            >
              <UserPlus className="w-4 h-4" style={{color:"#7BB8D4"}} />
              <span>Register Farmer</span>
            </button>

            <button
              onClick={() => setActiveTab("tie-demo")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5`}
              style={activeTab === "tie-demo"
                ? {background:"rgba(245,200,122,0.12)", color:"#F5C87A", border:"1px solid rgba(245,200,122,0.35)"}
                : {color:"rgba(255,255,255,0.70)"}}
            >
              <Scale className="w-4 h-4" style={{color:"#F5C87A"}} />
              <span>Tie Demo</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5`}
              style={activeTab === "history"
                ? {background:"rgba(200,180,240,0.15)", color:"#C8B4F0", border:"1px solid rgba(200,180,240,0.35)"}
                : {color:"rgba(255,255,255,0.70)"}}
            >
              <History className="w-4 h-4" style={{color:"#C8B4F0"}} />
              <span>Turn History</span>
            </button>

            <button
              onClick={() => setActiveTab("fairness")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5`}
              style={activeTab === "fairness"
                ? {background:"rgba(111,204,160,0.15)", color:"#6FCCA0", border:"1px solid rgba(111,204,160,0.35)"}
                : {color:"rgba(255,255,255,0.70)"}}
            >
              <BarChart3 className="w-4 h-4" style={{color:"#6FCCA0"}} />
              <span>Fairness</span>
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">

            {/* Water Group Selector */}
            <div className="relative">
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="text-xs font-semibold rounded-lg px-3 py-2 pr-8 focus:outline-none appearance-none cursor-pointer"
                style={{background:"rgba(255,255,255,0.10)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.20)", color:"#ffffff"}}
              >
                {waterGroups.map((g) => (
                  <option key={g.id || g._id} value={g.id || g._id} style={{color:"#000000", background:"#f5f0e8"}}>
                    {g.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white opacity-60">▼</div>
            </div>

            {/* Add Borewell */}
            <button
              onClick={onOpenAddBorewell}
              title="Add New Village Borewell"
              className="p-2 rounded-lg flex items-center transition-colors"
              style={{background:"rgba(111,204,160,0.15)", color:"#6FCCA0", border:"1px solid rgba(111,204,160,0.30)"}}
            >
              <UserPlus className="w-4 h-4" />
            </button>

            {/* Status Pill */}
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1.5 rounded-full text-xs" style={{background:"rgba(0,0,0,0.30)", border:"1px solid rgba(255,255,255,0.15)"}}>
              <span className={`w-2 h-2 rounded-full ${activeStatus === "ACTIVE" ? "animate-ping" : ""}`} style={{background: activeStatus === "ACTIVE" ? "#6FCCA0" : "#F5C87A"}}></span>
              <span className="text-[11px] font-mono" style={{color:"rgba(255,255,255,0.75)"}}>
                {activeStatus === "ACTIVE" ? "PUMP ACTIVE" : "STANDBY"}
              </span>
            </div>

            {/* SMS Alert */}
            <button
              onClick={onOpenSMSMock}
              className="p-2 rounded-lg flex items-center space-x-1 transition-colors"
              style={{background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.18)", color:"rgba(255,255,255,0.80)"}}
            >
              <Radio className="w-4 h-4" style={{color:"#6FCCA0"}} />
              <span className="text-xs hidden sm:inline">SMS Alert</span>
            </button>

            {/* Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg transition-colors"
              style={{background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.18)", color:"rgba(255,255,255,0.80)"}}
            >
              <Bell className="w-4 h-4" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center text-white" style={{background:"#5E8C76"}}>
                  {notificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center justify-between py-2 text-xs overflow-x-auto space-x-2" style={{borderTop:"1px solid rgba(255,255,255,0.10)"}}>
          <button onClick={() => setActiveTab("landing")} className="px-2.5 py-1.5 rounded" style={activeTab==='landing'?{background:"rgba(111,204,160,0.15)",color:"#6FCCA0"}:{color:"rgba(255,255,255,0.60)"}}>Overview</button>
          <button onClick={() => setActiveTab("dashboard")} className="px-2.5 py-1.5 rounded" style={activeTab==='dashboard'?{background:"rgba(111,204,160,0.15)",color:"#6FCCA0"}:{color:"rgba(255,255,255,0.60)"}}>Queue</button>
          <button onClick={() => setActiveTab("register")} className="px-2.5 py-1.5 rounded" style={activeTab==='register'?{background:"rgba(123,184,212,0.15)",color:"#7BB8D4"}:{color:"rgba(255,255,255,0.60)"}}>Register</button>
          <button onClick={() => setActiveTab("tie-demo")} className="px-2.5 py-1.5 rounded" style={activeTab==='tie-demo'?{background:"rgba(245,200,122,0.12)",color:"#F5C87A"}:{color:"rgba(255,255,255,0.60)"}}>Tie Demo</button>
          <button onClick={() => setActiveTab("history")} className="px-2.5 py-1.5 rounded" style={activeTab==='history'?{background:"rgba(200,180,240,0.15)",color:"#C8B4F0"}:{color:"rgba(255,255,255,0.60)"}}>History</button>
          <button onClick={() => setActiveTab("fairness")} className="px-2.5 py-1.5 rounded" style={activeTab==='fairness'?{background:"rgba(111,204,160,0.15)",color:"#6FCCA0"}:{color:"rgba(255,255,255,0.60)"}}>Fairness</button>
        </div>
      </div>
    </header>
  );
}

