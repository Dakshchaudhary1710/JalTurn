const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

import React, { useState, useEffect } from "react";
import { UserPlus, Sprout, Calendar, Phone, MapPin, Scale, CheckCircle2, ShieldCheck, Sparkles, Droplets, Info } from "lucide-react";
import { CROPS } from "../utils/cropDatabase.js";

export function FarmerRegistration({
  waterGroups = [],
  selectedGroupId,
  onRegisterFarmer,
  onCancel
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    waterGroupId: selectedGroupId || "wg-01",
    crop: "wheat",
    sowingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // default 60 days ago
    landArea: 1.0,
    daysSinceLastWater: 14,
    evidenceVerified: false,
    notes: ""
  });

  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Recompute live urgency preview whenever form fields change
  useEffect(() => {
    const cropConfig = CROPS[formData.crop] || CROPS.wheat;
    const sowing = new Date(formData.sowingDate);
    const today = new Date();
    const daysSinceSowing = Math.max(1, Math.floor((today - sowing) / (1000 * 60 * 60 * 24)) + 1);

    // Determine stage
    let stageKey = "initial";
    let stage = cropConfig.stages.initial;
    if (daysSinceSowing <= cropConfig.stages.initial.endDay) {
      stageKey = "initial";
      stage = cropConfig.stages.initial;
    } else if (daysSinceSowing <= cropConfig.stages.development.endDay) {
      stageKey = "development";
      stage = cropConfig.stages.development;
    } else if (daysSinceSowing <= cropConfig.stages.midSeason.endDay) {
      stageKey = "midSeason";
      stage = cropConfig.stages.midSeason;
    } else if (daysSinceSowing <= cropConfig.stages.lateSeason.endDay) {
      stageKey = "lateSeason";
      stage = cropConfig.stages.lateSeason;
    } else {
      stageKey = "harvestReady";
      stage = {
        name: "Harvest Ready / Post-Maturity",
        criticality: 10,
        kc: 0.25,
        description: "Crop mature. Low moisture requirement."
      };
    }

    // Waiting score
    const waitDays = Number(formData.daysSinceLastWater) || 0;
    const waitRatio = waitDays / (cropConfig.irrigationIntervalDays || 18);
    const waitingScore = Math.min(100, Math.max(10, Math.round(waitRatio * 70)));

    // Smallholder score
    const land = Math.max(0.1, Number(formData.landArea) || 1.0);
    const smallholderScore = Math.min(100, Math.max(15, Math.round(100 * (1.8 / (0.8 + land)))));

    // Composite urgency
    const rawUrgency = 0.60 * stage.criticality + 0.25 * waitingScore + 0.15 * smallholderScore;

    setPreview({
      cropName: cropConfig.name,
      daysSinceSowing,
      stageName: stage.name,
      stageCriticality: stage.criticality,
      kc: stage.kc,
      waitingScore,
      smallholderScore,
      urgencyScore: Number(rawUrgency.toFixed(2)),
      description: stage.description
    });
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (onRegisterFarmer) {
        await onRegisterFarmer(formData);
      }
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
      }, 3000);
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.message || "Unable to register farmer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 border border-sky-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Farmer & Plot Registration
            </h1>

          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 flex items-center justify-between text-xs sm:text-sm shadow-xl">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              <strong>Registration successful!</strong> {formData.name} added with preview urgency score <strong>{preview?.urgencyScore}</strong>. Authoritative queue updated.
            </span>
          </div>
        </div>
      )}

      {/* Main Registration Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Container (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 glass-panel p-6 border border-slate-800 space-y-4">
          
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
            Farmer & Plot Particulars
          </h2>

          {/* Farmer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Farmer Full Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rameshwar Singh (रामेश्वर)"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mobile Number (Feature Phone / SIM)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 pl-8 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Used for Automated SMS & IVR voice alerts</p>
            </div>

            {/* Water Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Water User Group / Source
              </label>
              <select
                value={formData.waterGroupId}
                onChange={(e) => handleChange("waterGroupId", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              >
                {waterGroups.map(g => (
                  <option key={g.id || g._id} value={g.id || g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Standing Crop
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(CROPS).map(cropKey => {
                const c = CROPS[cropKey];
                const isSelected = formData.crop === cropKey;
                return (
                  <button
                    key={cropKey}
                    type="button"
                    onClick={() => handleChange("crop", cropKey)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-emerald-950/80 border-emerald-500 text-white shadow-md shadow-emerald-950/50"
                        : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                    }`}
                  >
                    <div className="font-bold text-xs truncate text-white">{c.name.split(" ")[0]}</div>
                    <div className="text-[10px] text-slate-400">{c.season} • {c.totalDurationDays}d</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sowing Date & Landholding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sowing Date (बुवाई की तारीख)
              </label>
              <input
                type="date"
                required
                value={formData.sowingDate}
                onChange={(e) => handleChange("sowingDate", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Automatically derives days since sowing (DAS)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Landholding Size (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                required
                value={formData.landArea}
                onChange={(e) => handleChange("landArea", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Marginal farmers (&le;1-2 acres) receive equity protection
              </p>
            </div>
          </div>

          {/* Days Since Last Water */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Days Since Last Watering (पानी दिए दिन)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                required
                value={formData.daysSinceLastWater}
                onChange={(e) => handleChange("daysSinceLastWater", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Evidence Checkbox */}
            <div className="flex items-center pt-5">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.evidenceVerified}
                  onChange={(e) => handleChange("evidenceVerified", e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-900 accent-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-300">
                  Attach Verified Soil / Field Evidence
                </span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/50 transition-all flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? "Registering..." : "Register Farmer & Plot"}</span>
            </button>
          </div>

        </form>

        {/* Live Urgency Engine Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="glass-panel-glow p-6 border border-emerald-500/30 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Phase 2 Engine Live Preview
              </span>
              <span className="text-[11px] font-mono text-slate-400">FAO-56 Calculator</span>
            </div>

            {/* Big Score Dial */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Predicted Urgency Score
              </div>
              <div className="text-4xl font-extrabold font-mono text-emerald-400 mt-1">
                {preview?.urgencyScore || "--"} <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                {preview?.cropName} • {preview?.daysSinceSowing} Days Since Sowing
              </div>
            </div>

            {/* Calculated Breakdown Items */}
            <div className="space-y-3 text-xs">
              
              {/* Stage Criticality */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-300">1. Stage Criticality</span>
                  <span className="font-mono font-bold text-emerald-400">{preview?.stageCriticality}/100</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Stage: <strong className="text-slate-200">{preview?.stageName}</strong> (Kc = {preview?.kc})
                </div>
              </div>

              {/* Waiting Score */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-300">2. Waiting Score</span>
                  <span className="font-mono font-bold text-sky-400">{preview?.waitingScore}/100</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Waiting: <strong className="text-slate-200">{formData.daysSinceLastWater} days</strong> without water
                </div>
              </div>

              {/* Smallholder Fairness */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-300">3. Smallholder Equity</span>
                  <span className="font-mono font-bold text-amber-400">{preview?.smallholderScore}/100</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Plot: <strong className="text-slate-200">{formData.landArea} acres</strong> (Marginal equity boost)
                </div>
              </div>

            </div>

            {/* Stage Agronomic Note */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
              <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>{preview?.description}</div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
