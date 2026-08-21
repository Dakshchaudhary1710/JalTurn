import React, { useState, useEffect } from "react";
import { Droplet, Clock, CheckCircle2, AlertTriangle, FastForward, UserCheck, Waves } from "lucide-react";

export function ActiveTurnBanner({
  activeTurn,
  waterGroup,
  nextFarmer,
  onCompleteTurn,
  onSkipTurn,
  onRaiseDispute
}) {
  const [elapsedMinutes, setElapsedMinutes] = useState(45);

  useEffect(() => {
    if (!activeTurn || !activeTurn.startedAt) return;
    const interval = setInterval(() => {
      const start = new Date(activeTurn.startedAt).getTime();
      const now = Date.now();
      const mins = Math.max(1, Math.floor((now - start) / (1000 * 60)));
      setElapsedMinutes(mins);
    }, 10000);
    return () => clearInterval(interval);
  }, [activeTurn]);

  const totalDuration = activeTurn?.durationMinutes || 120;
  const remainingMins = Math.max(0, totalDuration - elapsedMinutes);
  const progressPct = Math.min(100, Math.round((elapsedMinutes / totalDuration) * 100));

  if (!activeTurn) {
    return (
      <div className="glass-panel p-6 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Source Status</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                  IDLE / STANDBY
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {waterGroup?.sourceName || "Village Borewell #04"}
              </h3>
              <p className="text-xs text-slate-400">
                Next scheduled turn: <strong className="text-emerald-400">{nextFarmer?.farmerName || "Queue Ready"}</strong>
              </p>
            </div>
          </div>

          {nextFarmer && (
            <button
              onClick={() => onCompleteTurn(null, nextFarmer.plotId)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center space-x-2"
            >
              <Droplet className="w-4 h-4" />
              <span>Start Turn for {nextFarmer.farmerName.split(" ")[0]}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-glow p-6 relative overflow-hidden border border-sky-500/30">
      {/* Background Animated Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left: Active Farmer Info */}
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-600 p-0.5 flex items-center justify-center shadow-lg shadow-sky-950/50 flex-shrink-0 animate-pulse-subtle">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-sky-400">
              <Waves className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE IRRIGATION IN PROGRESS</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Source: {waterGroup?.name}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
              {activeTurn.farmerName}
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-sky-300 rounded border border-slate-700">
                Score: {activeTurn.score}
              </span>
            </h2>

            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>🌾 Crop: <strong className="text-emerald-300">{activeTurn.cropName}</strong></span>
              <span>•</span>
              <span>⚡ Discharge: <strong className="text-sky-300">38,000 L/hr</strong></span>
              <span>•</span>
              <span>📍 Sub-canal / Borewell Outlet #4</span>
            </p>
          </div>
        </div>

        {/* Center: Turn Timer & Progress */}
        <div className="flex-1 max-w-xs lg:px-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Turn Remaining:</span>
            </span>
            <span className="font-mono font-bold text-sky-300 text-sm">
              {remainingMins > 0 ? `${Math.floor(remainingMins / 60)}h ${remainingMins % 60}m` : "Finishing"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 relative">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-sky-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Started {elapsedMinutes}m ago</span>
            <span>Total: {totalDuration}m</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <button
            onClick={() => onCompleteTurn(activeTurn.id || activeTurn._id)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-950/40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Turn</span>
          </button>

          <button
            onClick={() => onSkipTurn(activeTurn.id || activeTurn._id)}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors flex items-center justify-center space-x-1"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>

          <button
            onClick={() => onRaiseDispute(activeTurn)}
            className="px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 text-xs transition-colors flex items-center justify-center space-x-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Dispute</span>
          </button>
        </div>

      </div>

      {/* Next Up Bar */}
      {nextFarmer && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">Next in line:</span>
            <span className="text-emerald-400 font-bold">{nextFarmer.farmerName}</span>
            <span>({nextFarmer.crop} • {nextFarmer.stageName})</span>
          </div>
          <span className="text-[11px] font-mono text-sky-400">
            Estimated turn: {nextFarmer.estimatedTurnText}
          </span>
        </div>
      )}
    </div>
  );
}
