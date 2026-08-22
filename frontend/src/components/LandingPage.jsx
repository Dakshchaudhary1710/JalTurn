import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Sprout,
  Scale,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
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
  const [calcCrop, setCalcCrop] = useState("wheat");
  const [calcStage, setCalcStage] = useState(92);
  const [calcWaitDays, setCalcWaitDays] = useState(16);
  const [calcLand, setCalcLand] = useState(1.0);

  const waitRatio = calcWaitDays / 18;
  const waitingScore = Math.min(100, Math.max(10, Math.round(waitRatio * 70)));
  const smallholderScore = Math.min(100, Math.max(15, Math.round(100 * (1.8 / (0.8 + calcLand)))));
  const urgencyScore = Number((0.60 * calcStage + 0.25 * waitingScore + 0.15 * smallholderScore).toFixed(2));

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">


      {/* 1. HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative text-center max-w-5xl mx-auto px-4 space-y-6 sm:space-y-8"
      >

        {/* Soft glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10" style={{background:"radial-gradient(ellipse, rgba(94,140,118,0.12) 0%, rgba(94,128,153,0.08) 100%)"}}></div>

        {/* Hero Badge Text Only */}
        <div className="text-xs font-semibold" style={{color:"#d4f0e4"}}>
          UN FAO-56 Evapotranspiration Standard Calibrated
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight" style={{color:"#ffffff", textShadow:"0 2px 24px rgba(0,0,0,0.5)"}}>
            Right Field. Right Time.<br />
            <span style={{background:"linear-gradient(135deg,#6FCCA0,#7BB8D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>Fair Irrigation Turn.</span>
          </h1>
          <p className="text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal" style={{color:"rgba(255,255,255,0.82)", textShadow:"0 1px 8px rgba(0,0,0,0.4)"}}>
            The world's first <strong style={{color:"#ffffff"}}>crop-urgency shared irrigation scheduler</strong>. Replacing rigid 100-year-old calendar turns with transparent, explainable agronomy for communal tube-wells and canals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenRegister}
            className="px-8 py-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 flex items-center space-x-2.5 shadow-2xl"
            style={{background:"linear-gradient(135deg,#5E8C76,#5E8099)", color:"white", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(94,140,118,0.45)"}}
          >
            <Sprout className="w-4 h-4" />
            <span>Register Farmer</span>
          </button>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left" style={{borderTop:"1px solid rgba(255,255,255,0.15)"}}>
          {[
            {label:"Agronomic Standard", value:"UN FAO-56 Paper", color:"#6FCCA0"},
            {label:"Tie-Breaker Rule", value:"4-Tier Deterministic", color:"#F5C87A"},
            {label:"Equity Protection", value:"Smallholders (≤1-2ac)", color:"#6FCCA0"},
            {label:"Rural Outreach", value:"SMS + WhatsApp + IVR", color:"#7BB8D4"},
          ].map((s,i) => (
            <div key={i} className="p-3.5 rounded-xl" style={{background:"rgba(0,0,0,0.35)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.12)"}}>
              <span className="text-[11px] block" style={{color:"rgba(255,255,255,0.55)"}}>{s.label}</span>
              <strong className="text-sm font-mono" style={{color:s.color}}>{s.value}</strong>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 2. PROBLEM VS SOLUTION */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 space-y-8"
      >
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 text-xs font-mono font-bold rounded-full uppercase tracking-wider" style={{background:"rgba(220,80,80,0.18)", color:"#FF8A8A", border:"1px solid rgba(220,80,80,0.35)"}}>
            The Historical Bottleneck
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold" style={{color:"#F5ECD7", textShadow:"0 2px 12px rgba(0,0,0,0.5)"}}>
            Warabandi vs. JalTurn Agronomic Scheduling
          </h2>
          <p className="text-xs sm:text-sm" style={{color:"rgba(220,210,190,0.85)"}}>
            Why fixed calendar rotations destroy crops and how JalTurn transforms water access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="p-6 sm:p-8 rounded-3xl space-y-4" style={{background:"rgba(253,250,245,0.92)", border:"1px solid rgba(176,64,64,0.30)"}}>
            <div className="flex items-center space-x-3 font-bold text-lg" style={{color:"#B04040"}}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:"rgba(176,64,64,0.10)", border:"1px solid rgba(176,64,64,0.25)"}}>✕</div>
              <h3>100-Year-Old Traditional Warabandi</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm" style={{color:"#3A3630"}}>
              {[
                ["Rigid Calendar Cycles:", "\"Farmer A gets Monday, Farmer B gets Tuesday\" regardless of whether Wheat is flowering or already harvested."],
                ["Upstream Monopolization:", "Large landholders at head-reaches drain borewell output, leaving tail-enders with dried roots."],
                ["Violent Clashing in Drought:", "When multiple crops face moisture stress, allocation collapses into informal disputes and political favoritism."],
              ].map(([b,t],i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="font-bold" style={{color:"#B04040"}}>✕</span>
                  <span><strong style={{color:"#1A1814"}}>{b}</strong> {t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* JalTurn */}
          <div className="p-6 sm:p-8 rounded-3xl space-y-4 shadow-lg" style={{background:"rgba(253,250,245,0.92)", border:"1px solid rgba(94,140,118,0.5)"}}>
            <div className="flex items-center space-x-3 font-bold text-lg" style={{color:"#4A7260"}}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:"rgba(94,140,118,0.12)", border:"1px solid rgba(94,140,118,0.3)"}}>✓</div>
              <h3>JalTurn Dynamic Agronomic Engine</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm" style={{color:"#3A3630"}}>
              {[
                ["FAO-56 Phenological Matching:", "Prioritizes water during critical biological windows (e.g. Crown Root Initiation & Flowering)."],
                ["Smallholder Equity Boost:", "Inverse landholding weighting protects marginal (≤1.0 acre) farmers from resource bullying."],
                ["Predefined Tie-Breaker:", "Rules are established before conflict occurs, resolving ties via verifiable lottery with zero human bias."],
              ].map(([b,t],i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="font-bold" style={{color:"#4A7260"}}>✓</span>
                  <span><strong style={{color:"#1A1814"}}>{b}</strong> {t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* 3. INTERACTIVE URGENCY SIMULATOR */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-4"
      >
        <div className="glass-panel-glow p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6" style={{borderBottom:"1px solid rgba(200,186,162,0.5)"}}>
            <div>
              <span className="px-3 py-1 text-xs font-mono font-bold rounded-full uppercase tracking-wider" style={{background:"rgba(94,128,153,0.12)", color:"#3A5C6D", border:"1px solid rgba(94,128,153,0.3)"}}>
                Live Formula Playground
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2" style={{color:"#ffffff"}}>
                Test the Composite Urgency Equation
              </h2>
              <p className="text-xs sm:text-sm mt-1" style={{color:"#94a3b8"}}>
                Slide the parameters below to see how crop growth stage, waiting time, and plot size compute authoritative priority.
              </p>
            </div>
            <div className="p-4 rounded-2xl text-center sm:text-right flex-shrink-0" style={{background:"rgba(253,250,245,0.9)", border:"1px solid rgba(94,140,118,0.4)"}}>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{color:"#94a3b8"}}>Predicted Urgency</span>
              <div className="text-3xl sm:text-4xl font-black font-mono" style={{color:"#5E8C76"}}>
                {urgencyScore} <span className="text-xs font-normal" style={{color:"#94a3b8"}}>/100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {label:"1. Crop Growth Stage", icon:<Sprout className="w-4 h-4"/>, color:"#5E8C76", val:calcStage, set:setCalcStage, min:20, max:98, step:1, unit:"/100", left:"Maturation (25)", mid:"Flowering (92)", right:"CRI (95)", accent:"#5E8C76"},
              {label:"2. Days Waiting", icon:<Clock className="w-4 h-4"/>, color:"#5E8099", val:calcWaitDays, set:setCalcWaitDays, min:1, max:30, step:1, unit:" days", left:"1 day (recent)", mid:"16 days", right:"30 days (acute)", accent:"#5E8099"},
              {label:"3. Plot Landholding", icon:<Scale className="w-4 h-4"/>, color:"#A07830", val:calcLand, set:setCalcLand, min:0.2, max:8.0, step:0.2, unit:" acres", left:"0.5ac (Marginal)", mid:"", right:"8ac (Large)", accent:"#A07830"},
            ].map((s,i) => (
              <div key={i} className="p-4 rounded-2xl space-y-2" style={{background:"rgba(245,240,230,0.7)", border:"1px solid rgba(200,186,162,0.5)"}}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1" style={{color:s.color}}>{s.icon}{s.label}</span>
                  <span className="font-mono font-bold" style={{color:"#1e293b"}}>{s.val}{s.unit}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                  onChange={(e) => s.set(Number(e.target.value))}
                  className="w-full cursor-pointer" style={{accentColor:s.accent}} />
                <div className="flex justify-between text-[10px]" style={{color:"#475569"}}>
                  <span>{s.left}</span>{s.mid && <span style={{color:s.accent, fontWeight:700}}>{s.mid}</span>}<span>{s.right}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{background:"rgba(245,240,230,0.7)", border:"1px solid rgba(200,186,162,0.5)"}}>
            <span style={{color:"#475569", fontWeight:600}}>Formula: (0.60 × {calcStage}) + (0.25 × {waitingScore}) + (0.15 × {smallholderScore})</span>
            <span className="font-bold" style={{color:"#5E8C76"}}>Score = {urgencyScore} / 100</span>
          </div>
        </div>
      </motion.section>

      {/* 4. 4-STAGE PIPELINE */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut", staggerChildren: 0.1 }}
        className="max-w-6xl mx-auto px-4 space-y-8"
      >
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 text-xs font-mono font-bold rounded-full uppercase tracking-wider" style={{background:"rgba(111,204,160,0.15)", color:"#6FCCA0", border:"1px solid rgba(111,204,160,0.30)"}}>
            Architecture Pipeline
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold" style={{color:"#F5ECD7", textShadow:"0 2px 12px rgba(0,0,0,0.5)"}}>
            How JalTurn Works in 4 Connected Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {num:"01", title:"Plot Registration", desc:"Farmer inputs standing crop, sowing date, and plot acreage through WUA kiosk, mobile web, or local coordinator.", accent:"#5E8099", bg:"rgba(94,128,153,0.10)"},
            {num:"02", title:"FAO-56 Engine", desc:"Dynamically maps days since sowing (DAS) to physiological water stress coefficient (Kc) and stage criticality.", accent:"#5E8C76", bg:"rgba(94,140,118,0.10)"},
            {num:"03", title:"Priority Queue", desc:"Backend calculates authoritative ranking, resolves ties using 4-tier decision tree, and recalculates after turn completion.", accent:"#A07830", bg:"rgba(160,120,48,0.10)"},
            {num:"04", title:"Rural Outreach", desc:"Sends automated turn alerts via feature-phone SMS, WhatsApp village groups, and Hindi voice IVR calls.", accent:"#7A6A98", bg:"rgba(122,106,152,0.10)"},
          ].map((s,i) => (
            <div key={i} className="glass-panel p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono" style={{background:s.bg, border:`1px solid ${s.accent}40`, color:s.accent}}>{s.num}</div>
              <h3 className="text-base font-bold" style={{color:"#ffffff"}}>{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{color:"#cbd5e1"}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 5. COMMUNITY IMPACT */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-4"
      >
        <div className="glass-panel p-8 sm:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center" style={{border:"1px solid rgba(94,140,118,0.30)"}}>
          <div className="space-y-4">
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-full uppercase" style={{background:"rgba(94,140,118,0.12)", color:"#3A5C4D", border:"1px solid rgba(94,140,118,0.3)"}}>
              Community Equity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold" style={{color:"#ffffff"}}>
              Built Specifically for Water User Associations (WUAs)
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{color:"#cbd5e1"}}>
              India has over 100,000 communal tube-wells and lift irrigation schemes governed by Water User Associations. JalTurn eliminates arbitrary gatekeeper control, guaranteeing that every smallholder can audit why turns were allocated.
            </p>
            <button
              onClick={onOpenRegister}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md"
              style={{background:"#5E8C76"}}
            >
              Register a Farmer Plot
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            {[
              {val:"35-40%", label:"Moisture Stress Yield Recovery", color:"#5E8C76"},
              {val:"0", label:"Arbitrary Village Turn Disputes", color:"#5E8099"},
              {val:"84/100", label:"Average Group Fairness Index", color:"#A07830"},
              {val:"100%", label:"Deterministic Auditability", color:"#5E8C76"},
            ].map((s,i) => (
              <div key={i} className="p-4 rounded-2xl" style={{background:"rgba(245,240,230,0.7)", border:"1px solid rgba(200,186,162,0.5)"}}>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono" style={{color:s.color}}>{s.val}</div>
                <span className="text-[11px] mt-1 block" style={{color:"#94a3b8"}}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

    </div>
  );
}
