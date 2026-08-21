import React from "react";
import { X, HelpCircle, Award, Scale, Clock, Sprout, ArrowRight, ShieldCheck, CheckCircle2, FileText } from "lucide-react";

export function ExplainabilityModal({
  farmerData,
  topFarmer,
  onClose
}) {
  if (!farmerData) return null;

  const weights = farmerData.weights || {
    w1_stageCriticality: 0.60,
    w2_waitingScore: 0.25,
    w3_smallholderFairness: 0.15
  };

  const isRankOne = farmerData.rank === 1 || !topFarmer || topFarmer.id === farmerData.id;

  return (
    <div className="modal-overlay">
      <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto border border-sky-500/30 shadow-2xl shadow-slate-950">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                Rank #{farmerData.rank || 2}
              </span>
              <span className="text-xs text-slate-400">JalTurn Explainability Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Why am I #{farmerData.rank || 2}?
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Transparent algorithmic breakdown for <strong className="text-white">{farmerData.farmerName}</strong> ({farmerData.crop} • {farmerData.landArea} acres)
            </p>
          </div>
        </div>

        {/* Plain Language Summary Card */}
        <div className={`p-4 rounded-xl mb-6 border ${
          isRankOne 
            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200" 
            : "bg-sky-950/40 border-sky-500/40 text-sky-200"
        }`}>
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold block text-white mb-1">
                {isRankOne ? "Priority Rank #1 Granted:" : "Agronomic Decision Summary:"}
              </span>
              {farmerData.comparativeWhy || farmerData.explanation}
            </div>
          </div>
        </div>

        {/* 3 Core Metric Breakdown Cards */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Normalized Multi-Factor Scoring Components
          </h3>

          {/* Metric 1: Stage Criticality */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sprout className="w-4 h-4" />
                1. FAO-56 Crop Stage Criticality (60% Weight)
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {farmerData.stageCriticality} <span className="text-slate-500 text-xs">/100</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${farmerData.stageCriticality}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Stage: <strong className="text-slate-200">{farmerData.stageName}</strong> (Kc = {farmerData.kc || 1.15})</span>
              <span className="font-mono text-emerald-300 font-semibold">
                Contributes: {(farmerData.stageCriticality * weights.w1_stageCriticality).toFixed(2)} pts
              </span>
            </div>
          </div>

          {/* Metric 2: Waiting Time */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-sky-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                2. Waiting Time Score (25% Weight)
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {farmerData.waitingScore} <span className="text-slate-500 text-xs">/100</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${farmerData.waitingScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Days without irrigation: <strong className="text-slate-200">{farmerData.waitDays} days</strong></span>
              <span className="font-mono text-sky-300 font-semibold">
                Contributes: {(farmerData.waitingScore * weights.w2_waitingScore).toFixed(2)} pts
              </span>
            </div>
          </div>

          {/* Metric 3: Smallholder Fairness */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                3. Smallholder Equity Score (15% Weight)
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {farmerData.smallholderScore} <span className="text-slate-500 text-xs">/100</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${farmerData.smallholderScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Plot Landholding: <strong className="text-slate-200">{farmerData.landArea} acres</strong></span>
              <span className="font-mono text-amber-300 font-semibold">
                Contributes: {(farmerData.smallholderScore * weights.w3_smallholderFairness).toFixed(2)} pts
              </span>
            </div>
          </div>

        </div>

        {/* Calculation Formula Math Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
            Authoritative Equation Execution
          </div>
          <div className="font-mono text-xs sm:text-sm text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="text-emerald-400 font-bold">Urgency Score</span> = (0.60 × {farmerData.stageCriticality}) + (0.25 × {farmerData.waitingScore}) + (0.15 × {farmerData.smallholderScore})
            <div className="text-right text-emerald-300 font-extrabold text-base mt-1">
              = {farmerData.urgencyScore} / 100
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            Immutable Audit Trail ID: #JAL-{farmerData.plotId}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
