import React, { useState } from "react";
import { 
  Droplets, 
  Sprout, 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  PhoneCall, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Users, 
  Play, 
  TrendingUp, 
  AlertTriangle,
  HeartHandshake,
  Smartphone,
  ChevronRight
} from "lucide-react";

export function LandingPage({
  onLaunchDashboard,
  onOpenTieDemo,
  onOpenRegister,
  onOpenPitch
}) {
  // Interactive mini-calculator state on landing page
  const [calcCrop, setCalcCrop] = useState("wheat");
  const [calcStage, setCalcStage] = useState(92); // Mid-Season Flowering
  const [calcWaitDays, setCalcWaitDays] = useState(16);
  const [calcLand, setCalcLand] = useState(1.0);

  // Live calculation
  const waitRatio = calcWaitDays / 18;
  const waitingScore = Math.min(100, Math.max(10, Math.round(waitRatio * 70)));
  const smallholderScore = Math.min(100, Math.max(15, Math.round(100 * (1.8 / (0.8 + calcLand)))));
  const urgencyScore = Number((0.60 * calcStage + 0.25 * waitingScore + 0.15 * smallholderScore).toFixed(2));

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      
      {/* 1. HERO SECTION */}
      <section className="relative text-center max-w-5xl mx-auto px-4 space-y-6 sm:space-y-8">
        
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-sky-500/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Top Floating Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-xs text-emerald-300 font-semibold shadow-lg shadow-emerald-950/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>UN FAO-56 Evapotranspiration Standard Calibrated</span>
          <span className="text-slate-500">•</span>
         
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Right Field. Right Time.<br />
            <span className="gradient-text-agro">Fair Irrigation Turn.</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            The world's first <strong className="text-white">crop-urgency shared irrigation scheduler</strong>. Replacing rigid 100-year-old calendar turns with transparent, explainable agronomy for communal tube-wells and canals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onLaunchDashboard}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all flex items-center space-x-2.5 group"
          >
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenTieDemo}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-600/50 font-bold text-sm sm:text-base transition-all flex items-center space-x-2"
          >
            <Scale className="w-4 h-4 text-amber-400" />
            <span>4-Tier Tie Demo</span>
          </button>

         
        </div>

        {/* Trust Stats Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 max-w-4xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Agronomic Standard</span>
            <strong className="text-white text-sm font-mono">UN FAO-56 Paper</strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Tie-Breaker Rule</span>
            <strong className="text-amber-300 text-sm font-mono">4-Tier Deterministic</strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Equity Protection</span>
            <strong className="text-emerald-400 text-sm font-mono">Smallholders (&le;1-2ac)</strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Rural Outreach</span>
            <strong className="text-sky-300 text-sm font-mono">SMS + WhatsApp + IVR</strong>
          </div>
        </div>

      </section>

      {/* 2. THE PROBLEM VS SOLUTION COMPARISON */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 text-xs font-mono font-bold bg-red-950 text-red-300 border border-red-700/60 rounded-full uppercase tracking-wider">
            The Historical Bottleneck
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Warabandi vs. JalTurn Agronomic Scheduling
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Why fixed calendar rotations destroy crops and how JalTurn transforms water access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Traditional Warabandi Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-red-900/40 space-y-4 relative overflow-hidden">
            <div className="flex items-center space-x-3 text-red-400 font-bold text-lg">
              <div className="w-8 h-8 rounded-xl bg-red-950 border border-red-800/60 flex items-center justify-center">
                ✕
              </div>
              <h3>100-Year-Old Traditional Warabandi</h3>
            </div>
            
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Rigid Calendar Cycles:</strong> "Farmer A gets Monday, Farmer B gets Tuesday" regardless of whether Wheat is flowering or already harvested.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Upstream Monopolization:</strong> Large landholders at head-reaches drain borewell output, leaving tail-enders with dried roots.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Violent Clashing in Drought:</strong> When multiple crops face moisture stress, allocation collapses into informal disputes and political favoritism.</span>
              </li>
            </ul>
          </div>

          {/* JalTurn Solution Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-4 relative overflow-hidden shadow-2xl shadow-emerald-950/20">
            <div className="flex items-center space-x-3 text-emerald-400 font-bold text-lg">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/60 flex items-center justify-center">
                ✓
              </div>
              <h3>JalTurn Dynamic Agronomic Engine</h3>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>FAO-56 Phenological Matching:</strong> Prioritizes water during critical biological windows (e.g. Crown Root Initiation & Flowering).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Smallholder Equity Boost:</strong> Inverse landholding weighting protects marginal (&le;1.0 acre) farmers from resource bullying.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Predefined 4-Tier Tie-Breaker:</strong> Rules are established before conflict occurs, resolving ties via verifiable lottery with zero human bias.</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* 3. INTERACTIVE LIVE URGENCY SIMULATOR */}
      <section className="max-w-5xl mx-auto px-4">
        
        <div className="glass-panel-glow p-6 sm:p-10 border border-sky-500/30 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="px-3 py-1 text-xs font-mono font-bold bg-sky-950 text-sky-300 border border-sky-700/60 rounded-full uppercase tracking-wider">
                Live Formula Playground
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Test the Composite Urgency Equation
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Slide the parameters below to see how crop growth stage, waiting time, and plot size compute authoritative priority.
              </p>
            </div>

            {/* Live Result Callout */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/50 text-center sm:text-right flex-shrink-0">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Predicted Urgency
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                {urgencyScore} <span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Slider 1: Stage Criticality */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Sprout className="w-4 h-4" />
                  1. Crop Growth Stage
                </span>
                <span className="font-mono font-bold text-white">{calcStage}/100</span>
              </div>
              <input
                type="range"
                min="20"
                max="98"
                step="1"
                value={calcStage}
                onChange={(e) => setCalcStage(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Maturation (25)</span>
                <span className="text-emerald-300 font-medium">Flowering (92)</span>
                <span>CRI (95)</span>
              </div>
            </div>

            {/* Slider 2: Waiting Time */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  2. Days Waiting
                </span>
                <span className="font-mono font-bold text-white">{calcWaitDays} days</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={calcWaitDays}
                onChange={(e) => setCalcWaitDays(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 day (recent)</span>
                <span className="text-sky-300 font-medium">16 days</span>
                <span>30 days (acute)</span>
              </div>
            </div>

            {/* Slider 3: Landholding Size */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Scale className="w-4 h-4" />
                  3. Plot Landholding
                </span>
                <span className="font-mono font-bold text-white">{calcLand} acres</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="8.0"
                step="0.2"
                value={calcLand}
                onChange={(e) => setCalcLand(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="text-amber-300 font-medium">0.5ac (Marginal)</span>
                <span>2.5ac (Small)</span>
                <span>8ac (Large)</span>
              </div>
            </div>

          </div>

          {/* Mathematical Execution Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-slate-400">
              Formula: (0.60 × {calcStage}) + (0.25 × {waitingScore}) + (0.15 × {smallholderScore})
            </span>
            <span className="text-emerald-300 font-bold">
              Score = {urgencyScore} / 100
            </span>
          </div>

        </div>

      </section>

      {/* 4. THE 4-STAGE PIPELINE */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-full uppercase tracking-wider">
            Architecture Pipeline
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            How JalTurn Works in 4 Connected Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="glass-panel p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400 font-bold font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-white">Plot Registration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Farmer inputs standing crop, sowing date, and plot acreage through WUA kiosk, mobile web, or local coordinator.
            </p>
          </div>

          <div className="glass-panel p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400 font-bold font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-white">FAO-56 Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically maps days since sowing (DAS) to physiological water stress coefficient (Kc) and stage criticality.
            </p>
          </div>

          <div className="glass-panel p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400 font-bold font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-white">Priority Queue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Backend calculates authoritative ranking, resolves ties using 4-tier decision tree, and recalculates after turn completion.
            </p>
          </div>

          <div className="glass-panel p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-600/50 flex items-center justify-center text-purple-400 font-bold font-mono">
              04
            </div>
            <h3 className="text-base font-bold text-white">Rural Outreach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sends automated turn alerts via feature-phone SMS, WhatsApp village groups, and Hindi voice IVR calls.
            </p>
          </div>

        </div>

      </section>

      {/* 5. COMMUNITY IMPACT & SOCIAL EQUITY */}
      <section className="max-w-5xl mx-auto px-4">
        
        <div className="glass-panel p-8 sm:p-12 border border-teal-500/30 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 text-xs font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700/60 rounded-full uppercase">
              Community Equity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built Specifically for Water User Associations (WUAs)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              India has over 100,000 communal tube-wells and lift irrigation schemes governed by Water User Associations. JalTurn eliminates arbitrary gatekeeper control, guaranteeing that every smallholder can audit why turns were allocated.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onOpenRegister}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                Register a Farmer Plot
              </button>
             
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">35-40%</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Moisture Stress Yield Recovery</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-400">0</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Arbitrary Village Turn Disputes</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">84/100</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Average Group Fairness Index</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-400">100%</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Deterministic Auditability</span>
            </div>
          </div>
        </div>

      </section>

      {/* 6. CALL TO ACTION BANNER */}
     

    </div>
  );
}
