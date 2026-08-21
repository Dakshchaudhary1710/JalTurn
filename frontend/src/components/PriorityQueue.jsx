import React, { useState } from "react";
import { 
  HelpCircle, 
  Droplet, 
  Clock, 
  Scale, 
  CheckCircle, 
  SlidersHorizontal, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles,
  Info,
  Calendar,
  Layers
} from "lucide-react";

export function PriorityQueue({
  queue = [],
  onSelectFarmerForExplain,
  onRecalculate,
  onStartTurnForFarmer,
  onToggleEvidence,
  onOpenTieSimulatorWith
}) {
  const [showWeightSliders, setShowWeightSliders] = useState(false);
  const [weights, setWeights] = useState({
    w1_stageCriticality: 0.60,
    w2_waitingScore: 0.25,
    w3_smallholderFairness: 0.15
  });
  const [filterQuery, setFilterQuery] = useState("");

  const handleWeightChange = (key, val) => {
    const updated = { ...weights, [key]: parseFloat(val) };
    setWeights(updated);
  };

  const handleApplyWeights = () => {
    onRecalculate(weights);
  };

  const filteredQueue = queue.filter(item => 
    item.farmerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.crop.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.stageName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="glass-panel p-5 sm:p-6 border border-slate-800 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Dynamic Priority Queue
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono bg-slate-800 text-emerald-400 rounded-full border border-emerald-800/40">
              {queue.length} plots queued
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative order computed from FAO-56 stage criticality, days waiting, and smallholder equity.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Search farmer / crop..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 w-40 sm:w-48"
          />

          {/* Weight Adjuster Button */}
          <button
            onClick={() => setShowWeightSliders(!showWeightSliders)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center space-x-1.5 ${
              showWeightSliders
                ? "bg-sky-950/80 text-sky-300 border-sky-600"
                : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tune Weights</span>
          </button>

          {/* Recalculate Button */}
          <button
            onClick={() => onRecalculate(weights)}
            title="Recalculate Urgency based on current live state"
            className="px-3.5 py-2 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-950/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* Weight Tuner Panel (Expandable) */}
      {showWeightSliders && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-900/60 space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Sparkles className="w-4 h-4" />
              Interactive Formula Weight Tuner (Field Calibration Mode)
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Total: {((weights.w1_stageCriticality + weights.w2_waitingScore + weights.w3_smallholderFairness) * 100).toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            
            {/* W1: Stage Criticality */}
            <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between font-medium">
                <span className="text-emerald-400">W1: Crop Stage Criticality</span>
                <span className="font-mono font-bold">{(weights.w1_stageCriticality * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={weights.w1_stageCriticality}
                onChange={(e) => handleWeightChange("w1_stageCriticality", e.target.value)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">FAO-56 water-stress sensitivity index</p>
            </div>

            {/* W2: Waiting Score */}
            <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between font-medium">
                <span className="text-sky-400">W2: Waiting Time Score</span>
                <span className="font-mono font-bold">{(weights.w2_waitingScore * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.6"
                step="0.05"
                value={weights.w2_waitingScore}
                onChange={(e) => handleWeightChange("w2_waitingScore", e.target.value)}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Days without irrigation cycle</p>
            </div>

            {/* W3: Smallholder Fairness */}
            <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between font-medium">
                <span className="text-amber-400">W3: Smallholder Fairness</span>
                <span className="font-mono font-bold">{(weights.w3_smallholderFairness * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={weights.w3_smallholderFairness}
                onChange={(e) => handleWeightChange("w3_smallholderFairness", e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Inverse landholding protection</p>
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                const def = { w1_stageCriticality: 0.60, w2_waitingScore: 0.25, w3_smallholderFairness: 0.15 };
                setWeights(def);
                onRecalculate(def);
              }}
              className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white rounded bg-slate-800"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleApplyWeights}
              className="px-3 py-1 text-[11px] bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded shadow"
            >
              Apply Calibration
            </button>
          </div>
        </div>
      )}

      {/* Queue List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Rank</th>
              <th className="py-3 px-3">Farmer & Land</th>
              <th className="py-3 px-3">Crop & Stage</th>
              <th className="py-3 px-3">Waiting</th>
              <th className="py-3 px-3">Urgency Score</th>
              <th className="py-3 px-3">Est. Turn</th>
              <th className="py-3 px-3 text-right">Explain / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredQueue.map((item, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;

              return (
                <tr
                  key={item.id || item.plotId}
                  className={`hover:bg-slate-900/60 transition-colors ${
                    isFirst ? "bg-emerald-950/20 border-l-2 border-l-emerald-500" : ""
                  }`}
                >
                  {/* Rank Badge */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-extrabold text-xs shadow ${
                          idx === 0
                            ? "bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/40"
                            : idx === 1
                            ? "bg-sky-600 text-white"
                            : idx === 2
                            ? "bg-amber-600 text-white"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        #{item.rank || idx + 1}
                      </span>
                    </div>
                  </td>

                  {/* Farmer Details */}
                  <td className="py-3.5 px-3">
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        {item.farmerName}
                        {item.evidenceVerified && (
                          <span title="Agronomic Evidence Verified" className="text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                        <span>{item.landArea} acres ({item.farmerCategory || "Marginal"})</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">{item.farmerPhone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Crop & Stage */}
                  <td className="py-3.5 px-3">
                    <div>
                      <div className="font-semibold text-emerald-300 text-xs flex items-center gap-1">
                        🌾 {item.crop}
                        <span className="text-[10px] font-mono text-slate-400">({item.daysSinceSowing} DAS)</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {item.stageName}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400" title="Stage Criticality">
                          {item.stageCriticality}/100
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Waiting Days */}
                  <td className="py-3.5 px-3">
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" />
                        <span>{item.waitDays} days</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Score: <span className="font-mono text-sky-300 font-semibold">{item.waitingScore}</span>
                      </div>
                    </div>
                  </td>

                  {/* Urgency Score */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-extrabold font-mono text-white">
                          {item.urgencyScore}
                        </span>
                        <span className="text-[10px] text-slate-500">/100</span>
                      </div>
                      {/* Score Mini Bar */}
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.urgencyScore >= 85
                              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                              : item.urgencyScore >= 70
                              ? "bg-gradient-to-r from-sky-500 to-emerald-400"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${Math.min(100, item.urgencyScore)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Est Turn */}
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-900 border border-slate-800 text-sky-300 font-mono">
                      {item.estimatedTurnText}
                    </span>
                  </td>

                  {/* Explainability & Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Explain button */}
                      <button
                        onClick={() => onSelectFarmerForExplain(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-700/80 text-xs font-semibold transition-colors flex items-center space-x-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Why #{item.rank || idx + 1}?</span>
                      </button>

                      {/* Test Tie with this farmer */}
                      {idx > 0 && (
                        <button
                          onClick={() => onOpenTieSimulatorWith(filteredQueue[0], item)}
                          title="Simulate tie against #1 farmer"
                          className="px-2 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 text-xs transition-colors hidden lg:inline-flex items-center space-x-1"
                        >
                          <Scale className="w-3 h-3" />
                          <span>Tie Test</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Insight */}
      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            Formula: <strong className="text-slate-200">0.60×StageCriticality + 0.25×WaitingScore + 0.15×SmallholderFairness</strong>
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
          <span>● Live Auto-Sync Active</span>
        </div>
      </div>

    </div>
  );
}
