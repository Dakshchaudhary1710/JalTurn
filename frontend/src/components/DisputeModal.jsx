import React, { useState } from "react";
import { X, AlertTriangle, ShieldCheck, CheckCircle2, MessageSquare, Send } from "lucide-react";

export function DisputeModal({
  isOpen,
  onClose,
  activeTurn,
  selectedFarmer,
  waterGroupId,
  onSubmitDispute
}) {
  const [reasonCategory, setReasonCategory] = useState("PUMP_FAILURE");
  const [customDetails, setCustomDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const targetFarmer = selectedFarmer || (activeTurn ? {
    farmerId: activeTurn.farmerId,
    farmerName: activeTurn.farmerName,
    crop: activeTurn.cropName,
    plotId: activeTurn.plotId
  } : {
    farmerId: "farmer-general",
    farmerName: "Active Turn Farmer",
    crop: "General Irrigation",
    plotId: "plot-general"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullReason = `[${reasonCategory}] ${customDetails || "Standard dispute raised via WUA terminal."}`;

    try {
      await onSubmitDispute({
        farmerId: targetFarmer.farmerId || "farmer-general",
        turnId: activeTurn?.id || activeTurn?._id || "turn-general",
        waterGroupId: waterGroupId || "wg-01",
        reason: fullReason
      });
      onClose();
    } catch (err) {
      console.error("Dispute error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-7 relative border border-amber-500/40 shadow-2xl shadow-slate-950">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-amber-950/80 border border-amber-600 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/60 rounded-full">
                Phase 1 & 8 Ledger
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">Raise Formal Turn Dispute</h2>
            <p className="text-xs text-slate-400">
              Target: <strong className="text-slate-200">{targetFarmer.farmerName}</strong> ({targetFarmer.crop})
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Dispute Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Disagreement Category
            </label>
            <div className="space-y-1.5">
              {[
                { id: "PUMP_FAILURE", label: "Pump Breakdown / Voltage Drop During Scheduled Turn" },
                { id: "SOWING_MISMATCH", label: "Contested Sowing Date or Agronomic Stage Misreport" },
                { id: "DROUGHT_EMERGENCY", label: "Acute Crop Wilting / Soil Moisture Sensor Anomaly" },
                { id: "ABSENT_SKIP", label: "Farmer was absent; requested queue re-slotting" },
                { id: "OTHER_ARBITRATION", label: "Other Water User Association Consensus Matter" }
              ].map(cat => (
                <label
                  key={cat.id}
                  className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    reasonCategory === cat.id
                      ? "bg-amber-950/50 border-amber-500/70 text-amber-200"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={reasonCategory === cat.id}
                    onChange={(e) => setReasonCategory(e.target.value)}
                    className="accent-amber-500"
                  />
                  <span className="font-medium text-xs">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Details / Explanation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Field Notes / Witness Statements
            </label>
            <textarea
              rows="3"
              placeholder="Provide specific notes (e.g., tube-well electricity cut from 11:30 AM to 12:15 PM, flow interrupted for 45 minutes)..."
              value={customDetails}
              onChange={(e) => setCustomDetails(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500 placeholder-slate-500"
            ></textarea>
          </div>

          {/* Transparency Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              Every dispute is logged immutably in the <strong>Public Turn History</strong>. The WUA coordinator and group members review and resolve via algorithmic recalculation.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold flex items-center space-x-1.5 shadow-lg shadow-amber-950/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Log Public Dispute"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
