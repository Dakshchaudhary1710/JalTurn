import React, { useState } from "react";
import { History, CheckCircle2, PlayCircle, Scale, AlertTriangle, UserPlus, Filter, ShieldCheck } from "lucide-react";

export function TurnHistory({
  turns = [],
  logs = [],
  disputes = []
}) {
  const [filterType, setFilterType] = useState("ALL"); // ALL, TURNS, TIES, DISPUTES

  // Combine and sort events
  const allEvents = [
    ...turns.map(t => ({
      id: t.id || t._id,
      type: t.status === "COMPLETED" ? "TURN_COMPLETED" : t.status === "IN_PROGRESS" ? "TURN_STARTED" : "TURN_SKIPPED",
      title: `${t.farmerName} — Water Turn ${t.status.toLowerCase().replace('_', ' ')}`,
      detail: `Crop: ${t.cropName} • Score: ${t.score} • Duration: ${t.durationMinutes}m ${t.tieBreakReason ? `(${t.tieBreakReason})` : ''}`,
      timestamp: t.completedAt || t.startedAt || t.createdAt,
      badgeColor: t.status === "COMPLETED" ? "emerald" : "sky"
    })),
    ...logs.map(l => ({
      id: l.id,
      type: l.type,
      title: l.message,
      detail: l.metadata?.turnId ? `Turn Reference: #${l.metadata.turnId}` : "Water group consensus log",
      timestamp: l.timestamp,
      badgeColor: l.type === "TIE_RESOLVED" ? "amber" : l.type === "DISPUTE_RAISED" ? "red" : "slate"
    })),
    ...disputes.map(d => ({
      id: d.id || d._id,
      type: "DISPUTE",
      title: `Dispute by ${d.farmerName}: "${d.reason}"`,
      detail: d.resolutionNote ? `Resolution: ${d.resolutionNote} (${d.status})` : `Status: ${d.status}`,
      timestamp: d.createdAt,
      badgeColor: d.status === "RESOLVED" ? "purple" : "amber"
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filtered = allEvents.filter(e => {
    if (filterType === "TURNS") return e.type.includes("TURN");
    if (filterType === "TIES") return e.type.includes("TIE");
    if (filterType === "DISPUTES") return e.type.includes("DISPUTE");
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-700/50 rounded-full flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Public Ledger & Audit Trail
            </span>
            <span className="text-xs text-slate-400 font-mono">Immutable Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Turn History & Transparent Consensus
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Every pump start, completed cycle, tie resolution, and dispute is recorded in real time. Eliminates backroom deals and informal favoritism.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === "ALL" ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilterType("TURNS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === "TURNS" ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Turns
          </button>
          <button
            onClick={() => setFilterType("TIES")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === "TIES" ? "bg-amber-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Tie Breaks
          </button>
          <button
            onClick={() => setFilterType("DISPUTES")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === "DISPUTES" ? "bg-purple-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Disputes
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="relative pl-6 sm:pl-8 border-l border-slate-800 space-y-6">
          {filtered.map((item, idx) => {
            let IconComponent = CheckCircle2;
            let iconColor = "text-emerald-400 bg-emerald-950 border-emerald-600/40";

            if (item.type === "TURN_STARTED") {
              IconComponent = PlayCircle;
              iconColor = "text-sky-400 bg-sky-950 border-sky-600/40";
            } else if (item.type === "TIE_RESOLVED" || item.type.includes("TIE")) {
              IconComponent = Scale;
              iconColor = "text-amber-400 bg-amber-950 border-amber-600/40";
            } else if (item.type.includes("DISPUTE")) {
              IconComponent = AlertTriangle;
              iconColor = "text-purple-400 bg-purple-950 border-purple-600/40";
            } else if (item.type.includes("REGISTERED")) {
              IconComponent = UserPlus;
              iconColor = "text-teal-400 bg-teal-950 border-teal-600/40";
            }

            const formattedTime = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const formattedDate = new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });

            return (
              <div key={item.id + idx} className="relative group">
                {/* Timeline Icon Node */}
                <div className={`absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-full border flex items-center justify-center ${iconColor} shadow-md`}>
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Event Card */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <strong className="text-slate-200">{formattedTime}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
