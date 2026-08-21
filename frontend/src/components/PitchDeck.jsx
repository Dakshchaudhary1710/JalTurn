import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Droplets, 
  Scale, 
  Sprout, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Users, 
  Layers, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  Maximize2,
  Minimize2,
  FileSpreadsheet
} from "lucide-react";

export function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    // Slide 1: Title & Hero
    {
      badge: "Hackathon 2026 Presentation",
      title: "JalTurn: Fair, Agronomic Shared Irrigation Scheduling",
      subtitle: "Right field. Right time. Fair turn.",
      content: (
        <div className="space-y-6 text-center max-w-3xl mx-auto py-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 mx-auto flex items-center justify-center shadow-2xl shadow-emerald-950/60 animate-pulse-subtle">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Jal<span className="text-emerald-400">Turn</span>
            </h1>
            <p className="text-lg sm:text-xl text-sky-300 font-medium mt-2">
              Transforming Communal Tube-well & Canal Turns with Explainable Crop Science
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
              FAO-56 Evapotranspiration
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
              4-Tier Deterministic Tie-Breaker
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
              Smallholder Equity Protection
            </span>
          </div>
        </div>
      )
    },

    // Slide 2: The Core Problem
    {
      badge: "The Problem Space",
      title: "The Failure of Rigid Rotations ('Warabandi')",
      subtitle: "Why 100-year-old fixed schedules destroy crops and fuel social conflict",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-4">
          <div className="p-5 rounded-2xl bg-red-950/30 border border-red-800/40 space-y-3">
            <div className="text-red-400 font-bold text-base">1. Agronomic Blindness</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional Warabandi allocates turns on fixed calendar days (e.g. "Farmer A every Monday"). It ignores whether Wheat is in critical flowering (Kc 1.15) or already matured (Kc 0.25).
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-3">
            <div className="text-amber-400 font-bold text-base">2. Upstream Dominance</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Large, affluent landholders with upstream plots monopolize borewell and canal discharge. Marginal farmers (&le;1 acre) suffer permanent yield losses.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-sky-400 font-bold text-base">3. Clashing & Ties</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When two farmers simultaneously demand water during drought, disputes escalate into physical violence and informal panchayat stalemates.
            </p>
          </div>
        </div>
      )
    },

    // Slide 3: Agronomic Reality
    {
      badge: "Science First",
      title: "Crop Water Needs Are Highly Non-Linear",
      subtitle: "Missing irrigation during critical stages causes irreversible 40-60% yield collapse",
      content: (
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Based on <strong className="text-white">FAO Irrigation & Drainage Paper 56 (FAO-56)</strong>, crops exhibit acute water-stress vulnerability spikes at specific physiological stages:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono">Stage 1</span>
              <div className="font-bold text-white">Crown Root (CRI)</div>
              <div className="text-emerald-400 font-mono">Criticality: 95/100</div>
              <div className="text-[10px] text-slate-400">20-25 DAS (Wheat)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono">Stage 2</span>
              <div className="font-bold text-white">Tillering & Jointing</div>
              <div className="text-sky-400 font-mono">Criticality: 70/100</div>
              <div className="text-[10px] text-slate-400">Active elongation</div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-1">
              <span className="text-[10px] text-emerald-400 font-mono">Stage 3 (PEAK)</span>
              <div className="font-bold text-emerald-300">Flowering & Filling</div>
              <div className="text-emerald-400 font-mono font-bold">Criticality: 92/100</div>
              <div className="text-[10px] text-slate-300">Moisture deficit = Shriveled grain</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono">Stage 4</span>
              <div className="font-bold text-white">Maturation & Dough</div>
              <div className="text-amber-400 font-mono">Criticality: 30/100</div>
              <div className="text-[10px] text-slate-400">Withhold irrigation</div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Solution Architecture
    {
      badge: "The JalTurn Solution",
      title: "End-to-End System Architecture",
      subtitle: "Connecting field registration, agronomy computation, authoritative queue, and rural outreach",
      content: (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-sky-600/40 text-sky-300">
              <span className="font-bold block text-white">1. Ingestion</span>
              Farmer + Plot Sowing + Land Area
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-600/40 text-emerald-300">
              <span className="font-bold block text-white">2. Engine</span>
              FAO-56 Criticality + Wait + Equity
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-amber-600/40 text-amber-300">
              <span className="font-bold block text-white">3. Priority Queue</span>
              Authoritative Backend Queue + 4-Tier Tie-Break
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-purple-600/40 text-purple-300">
              <span className="font-bold block text-white">4. Outreach</span>
              Feature Phone SMS + WhatsApp + Hindi IVR
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center font-sans">
            Authoritative order is strictly computed on the backend to prevent frontend tampering.
          </p>
        </div>
      )
    },

    // Slide 5: The Composite Formula
    {
      badge: "Core Algorithm",
      title: "The Master Urgency Equation",
      subtitle: "A balanced, field-calibrated composite score combining physiology, waiting, and equity",
      content: (
        <div className="space-y-4 py-2">
          <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center space-y-3">
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">
              Mathematical Specification
            </div>
            <div className="text-base sm:text-xl font-bold font-mono text-emerald-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              Urgency = (0.60 × StageCriticality) + (0.25 × WaitingScore) + (0.15 × SmallholderEquity)
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">60% Crop Need</strong>
              FAO-56 phenological water stress coefficient (Kc & stage criticality 0-100).
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong className="text-sky-400 block mb-1">25% Waiting Time</strong>
              Days elapsed since last irrigation relative to ideal cycle duration.
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong className="text-amber-400 block mb-1">15% Smallholder Equity</strong>
              Inverse landholding weighting to prevent large farms from crowding out marginal plots.
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Authoritative Priority Queue
    {
      badge: "Phase 3 Heart",
      title: "Authoritative Dynamic Queue",
      subtitle: "Continuous live recomputation as turns complete and crops progress",
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white">Dynamic Queue Operations:</div>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li><strong className="text-emerald-400">Queue Recalculation:</strong> Automatically triggered when a turn completes, resetting the watered plot's waiting score to 0.</li>
              <li><strong className="text-sky-400">Estimated Turn In:</strong> Continuously computes remaining discharge time per acre (~1 hr/acre).</li>
              <li><strong className="text-amber-400">Interactive Weight Calibration:</strong> Allows Water User Associations to tune formula weights based on local drought severity.</li>
            </ul>
          </div>
        </div>
      )
    },

    // Slide 7: Phase 6 Explainability
    {
      badge: "Judge Favorite",
      title: "Phase 6 — 'Why am I #2?' Explainability",
      subtitle: "Building trust through total algorithmic clarity",
      content: (
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/50 text-xs text-sky-200 space-y-2">
            <span className="font-bold text-white block text-sm">Every farmer can tap their score:</span>
            <p className="italic leading-relaxed">
              "Your score (66.2) is lower than Rameshwar Singh (85.3) because their Wheat crop is in active flowering (Criticality 92 vs 52) and has waited 19 days vs your 10 days."
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Crop Stage</span>
              <strong className="text-emerald-400 text-sm">52 / 100</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Waiting Time</span>
              <strong className="text-sky-400 text-sm">80 / 100</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Smallholder Equity</span>
              <strong className="text-amber-400 text-sm">90 / 100</strong>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: Phase 7 Tie Breaker
    {
      badge: "Zero-Conflict Protocol",
      title: "Phase 7 — Predefined 4-Tier Tie-Breaker",
      subtitle: "Deciding the rule BEFORE the conflict occurs",
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500">Tier 1</span>
              <div className="font-bold text-sky-300">Longer Wait Time</div>
              <div className="text-[10px] text-slate-400 mt-1">Days without irrigation</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500">Tier 2</span>
              <div className="font-bold text-amber-300">Smaller Landholding</div>
              <div className="text-[10px] text-slate-400 mt-1">Protects marginal plots</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500">Tier 3</span>
              <div className="font-bold text-purple-300">Verified Evidence</div>
              <div className="text-[10px] text-slate-400 mt-1">Soil moisture / photo</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50">
              <span className="text-[10px] font-mono text-emerald-400">Tier 4</span>
              <div className="font-bold text-emerald-300">Public Lottery</div>
              <div className="text-[10px] text-slate-300 mt-1">Cryptographic draw</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            No local politician or pump operator decides. The protocol executes automatically and logs the winner to the village ledger.
          </p>
        </div>
      )
    },

    // Slide 9: Phase 8 Public Ledger
    {
      badge: "Transparency",
      title: "Phase 8 — Public Turn Ledger",
      subtitle: "'Everyone can see what happened.'",
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white">Immutable Event Stream:</div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="text-emerald-300">✓ 10:30 AM — Rameshwar Singh: Water turn completed (Plot #01)</div>
              <div className="text-sky-300">✓ 12:15 PM — Suresh Patel: Water turn started (Discharge active)</div>
              <div className="text-amber-300">⚖ 02:00 PM — Tie resolved between Anita & Vikram (Method: Public Lottery)</div>
              <div className="text-purple-300">⚠ 04:10 PM — Dispute raised by Mohan Lal (Logged & under WUA review)</div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 10: Phase 9 Fairness
    {
      badge: "Equity Metrics",
      title: "Phase 9 — Group Fairness Indicator",
      subtitle: "Monitoring community balance and smallholder inclusion",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-center text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Average Wait</span>
            <strong className="text-xl font-bold font-mono text-white mt-1 block">4.2 days</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Longest Wait</span>
            <strong className="text-xl font-bold font-mono text-white mt-1 block">6.1 days</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Small Farmers</span>
            <strong className="text-xl font-bold font-mono text-emerald-400 mt-1 block">42%</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/50">
            <span className="text-teal-400 block text-[10px]">Fairness Index</span>
            <strong className="text-xl font-bold font-mono text-teal-300 mt-1 block">84 / 100</strong>
          </div>
        </div>
      )
    },

    // Slide 11: Phase 10 Low-Tech Outreach
    {
      badge: "Rural Accessibility",
      title: "Phase 10 — Multi-Channel Rural Outreach",
      subtitle: "Overcoming digital literacy barriers for every farmer",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-sky-400 text-sm">1. Feature Phone SMS</div>
            <p className="text-slate-400">
              Basic text message with turn time, rank, and "Reply 1 to Confirm". Works on ₹1,000 keypad handsets.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 text-sm">2. WhatsApp Broadcast</div>
            <p className="text-slate-400">
              Village water group card with crop stage badge, urgency score, and discharge schedule.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-amber-400 text-sm">3. Regional IVR Call</div>
            <p className="text-slate-400">
              Automated Hindi / vernacular voice call announcing upcoming turn and capturing voice confirmation.
            </p>
          </div>
        </div>
      )
    },

    // Slide 12: Scalability & Policy Alignment
    {
      badge: "Macro Impact",
      title: "Policy Alignment & Scalability",
      subtitle: "Plug-and-play for Water User Associations, PMKSY, and Jal Jeevan Mission",
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">Water Savings</strong>
              Prevents over-irrigation on matured plots and channels water to drought-sensitive phenological stages.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-sky-400 block mb-1">Dispute Reduction</strong>
              Transfers discretion from arbitrary humans to transparent, explainable agronomic consensus.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-amber-400 block mb-1">WUA Modernization</strong>
              Equips 100,000+ communal tube-wells and lift irrigation schemes with zero extra hardware.
            </div>
          </div>
        </div>
      )
    },

    // Slide 13: Summary & Live Demo
    {
      badge: "Ready for Judges",
      title: "JalTurn: Live Hackathon Demo",
      subtitle: "Experience the real-time crop engine, queue recomputation, and tie-breaker",
      content: (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-teal-950/60 to-slate-950 border border-emerald-500/50 text-center space-y-4 py-6">
          <Sparkles className="w-10 h-10 text-emerald-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            "Fair turns driven by crop science, not social leverage."
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Switch back to the <strong>Water Group Dashboard</strong>, <strong>Register a Farmer</strong>, or launch the <strong>Tie-Breaker Simulator</strong> to test the live prototype!
          </p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto" : ""}`}>
      
      {/* Presentation Header Bar */}
      <div className="flex items-center justify-between glass-panel p-4 border border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 text-xs font-mono font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-600/50 rounded-full">
            SLIDE {currentSlide + 1} / {slides.length}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Use Left/Right arrow keys or click Next
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center space-x-1"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="glass-panel p-6 sm:p-10 border border-slate-800 min-h-[480px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Slide Top Badge & Heading */}
        <div>
          <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono uppercase tracking-wider bg-slate-900 text-sky-400 border border-sky-800/60 rounded-full">
            {slide.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {slide.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {slide.subtitle}
          </p>
        </div>

        {/* Slide Body Content */}
        <div className="my-6">
          {slide.content}
        </div>

        {/* Slide Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              currentSlide === 0
                ? "opacity-30 cursor-not-allowed bg-slate-900 text-slate-500"
                : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5 overflow-x-auto px-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === idx
                    ? "bg-emerald-400 w-6"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
                title={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              currentSlide === slides.length - 1
                ? "opacity-30 cursor-not-allowed bg-slate-900 text-slate-500"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40"
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
}
