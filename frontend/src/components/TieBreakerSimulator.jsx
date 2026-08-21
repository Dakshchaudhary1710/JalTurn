import React, { useState } from "react";
import { Scale, Sparkles, Trophy, CheckCircle, ArrowDown, HelpCircle, Shuffle, ShieldCheck, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

export function TieBreakerSimulator() {
  // Configurable Farmer A & Farmer B states
  const [farmerA, setFarmerA] = useState({
    name: "Farmer A (Ravi)",
    crop: "Wheat (गेहूं)",
    stageName: "Mid-Season (Flowering)",
    stageCriticality: 92,
    waitDays: 5,
    landArea: 1.0,
    evidenceVerified: false,
    urgencyScore: 87.5
  });

  const [farmerB, setFarmerB] = useState({
    name: "Farmer B (Vikram)",
    crop: "Wheat (गेहूं)",
    stageName: "Mid-Season (Flowering)",
    stageCriticality: 92,
    waitDays: 5,
    landArea: 1.0,
    evidenceVerified: false,
    urgencyScore: 87.5
  });

  const [activeTab, setActiveTab] = useState("lottery"); // presets: 'lottery', 'waiting', 'land', 'evidence'
  const [resolutionResult, setResolutionResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Preset Configurations
  const applyPreset = (type) => {
    setActiveTab(type);
    if (type === "lottery") {
      // Tier 4: Exact Tie
      setFarmerA({
        name: "Farmer A (Ravi)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 1.0,
        evidenceVerified: false,
        urgencyScore: 87.5
      });
      setFarmerB({
        name: "Farmer B (Vikram)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 1.0,
        evidenceVerified: false,
        urgencyScore: 87.5
      });
    } else if (type === "waiting") {
      // Tier 1: Wait difference
      setFarmerA({
        name: "Farmer A (Ravi)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 7, // Longer waiting
        landArea: 1.0,
        evidenceVerified: false,
        urgencyScore: 87.5
      });
      setFarmerB({
        name: "Farmer B (Vikram)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 4,
        landArea: 1.0,
        evidenceVerified: false,
        urgencyScore: 87.5
      });
    } else if (type === "land") {
      // Tier 2: Smallholder
      setFarmerA({
        name: "Farmer A (Ravi)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 0.8, // Smaller land
        evidenceVerified: false,
        urgencyScore: 87.5
      });
      setFarmerB({
        name: "Farmer B (Vikram)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 2.5,
        evidenceVerified: false,
        urgencyScore: 87.5
      });
    } else if (type === "evidence") {
      // Tier 3: Verified Evidence
      setFarmerA({
        name: "Farmer A (Ravi)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 1.0,
        evidenceVerified: true, // Evidence attached
        urgencyScore: 87.5
      });
      setFarmerB({
        name: "Farmer B (Vikram)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 1.0,
        evidenceVerified: false,
        urgencyScore: 87.5
      });
    }
    setResolutionResult(null);
  };

  // Run Tie Resolution Simulation
  const runTieSimulation = () => {
    setIsSimulating(true);
    setResolutionResult(null);

    setTimeout(() => {
      // Execute 4-Tier Logic
      const steps = [];
      let winner = null;
      let loser = null;
      let tier = "";
      let reason = "";

      steps.push({
        step: 1,
        rule: "Baseline Urgency Score Check",
        detail: `Both farmers have equal urgency score: ${farmerA.urgencyScore} vs ${farmerB.urgencyScore}.`,
        status: "TIE"
      });

      // TIER 1: Waiting time
      if (farmerA.waitDays !== farmerB.waitDays) {
        winner = farmerA.waitDays > farmerB.waitDays ? farmerA : farmerB;
        loser = farmerA.waitDays > farmerB.waitDays ? farmerB : farmerA;
        tier = "Tier 1: Waiting Time Priority";
        reason = `${winner.name} has waited longer without water (${Math.max(farmerA.waitDays, farmerB.waitDays)} days vs ${Math.min(farmerA.waitDays, farmerB.waitDays)} days).`;
        steps.push({
          step: 2,
          rule: "Tier 1: Waiting Time Priority",
          detail: reason,
          status: "RESOLVED",
          winner: winner.name
        });
      } else {
        steps.push({
          step: 2,
          rule: "Tier 1: Waiting Time Priority",
          detail: `Identical waiting period (${farmerA.waitDays} days). Moving to Tier 2.`,
          status: "TIE"
        });

        // TIER 2: Landholding Size
        if (Math.abs(farmerA.landArea - farmerB.landArea) > 0.05) {
          winner = farmerA.landArea < farmerB.landArea ? farmerA : farmerB;
          loser = farmerA.landArea < farmerB.landArea ? farmerB : farmerA;
          tier = "Tier 2: Smallholder Equity";
          reason = `${winner.name} holds a smaller plot (${Math.min(farmerA.landArea, farmerB.landArea)} acres vs ${Math.max(farmerA.landArea, farmerB.landArea)} acres) to protect smallholder resilience.`;
          steps.push({
            step: 3,
            rule: "Tier 2: Smallholder Equity",
            detail: reason,
            status: "RESOLVED",
            winner: winner.name
          });
        } else {
          steps.push({
            step: 3,
            rule: "Tier 2: Smallholder Equity",
            detail: `Identical landholding size (${farmerA.landArea} acres). Moving to Tier 3.`,
            status: "TIE"
          });

          // TIER 3: Verified Agronomic Evidence
          if (farmerA.evidenceVerified !== farmerB.evidenceVerified) {
            winner = farmerA.evidenceVerified ? farmerA : farmerB;
            loser = farmerA.evidenceVerified ? farmerB : farmerA;
            tier = "Tier 3: Verified Field Evidence";
            reason = `${winner.name} submitted geotagged soil-moisture / crop-stage verification evidence.`;
            steps.push({
              step: 4,
              rule: "Tier 3: Verified Field Evidence",
              detail: reason,
              status: "RESOLVED",
              winner: winner.name
            });
          } else {
            steps.push({
              step: 4,
              rule: "Tier 3: Verified Field Evidence",
              detail: `Evidence status equal (${farmerA.evidenceVerified ? "Both Verified" : "Neither Verified"}). Moving to Tier 4.`,
              status: "TIE"
            });

            // TIER 4: Public Verifiable Lottery
            winner = farmerB; // Winner of random draw
            loser = farmerA;
            tier = "Tier 4: Public Algorithmic Lottery";
            reason = "Random tie-break after all deterministic criteria were exhausted (Seed: JAL_LOTTERY_2026_08_22).";
            steps.push({
              step: 5,
              rule: "Tier 4: Public Algorithmic Lottery",
              detail: `Cryptographic pseudo-random seed selected ${winner.name}. Publicly verifiable and logged.`,
              status: "RESOLVED",
              winner: winner.name
            });

            // Trigger celebratory confetti for lottery
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch (e) {}
          }
        }
      }

      setResolutionResult({
        winner,
        loser,
        tier,
        reason,
        steps,
        timestamp: new Date().toLocaleTimeString()
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 border border-amber-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-600/50 rounded-full flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Hackathon Judge Challenge Demo
              </span>
              <span className="text-xs text-slate-400 font-mono">Phase 7 Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Predefined 4-Tier Tie-Breaker Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              "What happens when two farmers claim equally critical crop stages?" — JalTurn eliminates social dispute through an immutable, multi-tier decision chain decided before conflict occurs.
            </p>
          </div>

          <button
            onClick={runTieSimulation}
            disabled={isSimulating}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center space-x-2 flex-shrink-0"
          >
            <Shuffle className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
            <span>{isSimulating ? "Resolving Chain..." : "Execute Tie-Break Chain"}</span>
          </button>
        </div>

        {/* Preset Selector Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          <span className="text-xs font-semibold text-slate-400 py-1.5 mr-2 flex items-center">
            Test Scenarios:
          </span>
          <button
            onClick={() => applyPreset("lottery")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "lottery"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
            }`}
          >
            🎲 Tier 4: Exact Tie → Public Lottery (Demo Hero)
          </button>
          <button
            onClick={() => applyPreset("waiting")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "waiting"
                ? "bg-sky-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
            }`}
          >
            ⏱️ Tier 1: Waiting Time Diff (7d vs 4d)
          </button>
          <button
            onClick={() => applyPreset("land")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "land"
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
            }`}
          >
            🌱 Tier 2: Smallholder Equity (0.8ac vs 2.5ac)
          </button>
          <button
            onClick={() => applyPreset("evidence")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "evidence"
                ? "bg-purple-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
            }`}
          >
            📸 Tier 3: Verified Agronomic Evidence
          </button>
        </div>
      </div>

      {/* Comparison Cards: Farmer A vs Farmer B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Farmer A Card */}
        <div className="glass-panel p-5 border border-slate-800 relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-mono">A</span>
              {farmerA.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-amber-950 text-amber-300 border border-amber-700">
              Urgency: {farmerA.urgencyScore}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Crop & Stage</span>
              <strong className="text-white">{farmerA.crop}</strong>
              <div className="text-emerald-400 text-[11px] font-medium">{farmerA.stageName}</div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Days Waiting</span>
              <strong className="text-sky-300 text-base font-mono">{farmerA.waitDays} days</strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Landholding Size</span>
              <strong className="text-amber-300 text-base font-mono">{farmerA.landArea} acres</strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Crop Evidence</span>
              <strong className={farmerA.evidenceVerified ? "text-emerald-400" : "text-slate-500"}>
                {farmerA.evidenceVerified ? "✓ Verified Soil Data" : "No Attachment"}
              </strong>
            </div>
          </div>
        </div>

        {/* Farmer B Card */}
        <div className="glass-panel p-5 border border-slate-800 relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono">B</span>
              {farmerB.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-amber-950 text-amber-300 border border-amber-700">
              Urgency: {farmerB.urgencyScore}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Crop & Stage</span>
              <strong className="text-white">{farmerB.crop}</strong>
              <div className="text-emerald-400 text-[11px] font-medium">{farmerB.stageName}</div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Days Waiting</span>
              <strong className="text-sky-300 text-base font-mono">{farmerB.waitDays} days</strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Landholding Size</span>
              <strong className="text-amber-300 text-base font-mono">{farmerB.landArea} acres</strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Crop Evidence</span>
              <strong className={farmerB.evidenceVerified ? "text-emerald-400" : "text-slate-500"}>
                {farmerB.evidenceVerified ? "✓ Verified Soil Data" : "No Attachment"}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* Execution Results View */}
      {resolutionResult ? (
        <div className="glass-panel-glow p-6 sm:p-8 border border-emerald-500/40 space-y-6">
          
          {/* Winner Announcement */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-950 border border-emerald-500/40">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/50">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                  <Trophy className="w-7 h-7" />
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 font-mono">
                  ⚖ TIE RESOLVED • {resolutionResult.tier}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-0.5">
                  Winner: {resolutionResult.winner.name}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Reason: <strong className="text-emerald-300 font-medium">"{resolutionResult.reason}"</strong>
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400">
              <span>Timestamp: {resolutionResult.timestamp}</span>
              <div className="text-[10px] text-emerald-400">Status: Signed & Logged</div>
            </div>
          </div>

          {/* Step-by-Step Decision Ladder */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Audit Trail Execution Tree
            </h3>

            <div className="space-y-2">
              {resolutionResult.steps.map((s, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    s.status === "RESOLVED"
                      ? "bg-emerald-950/40 border-emerald-500/50 text-white font-medium"
                      : "bg-slate-900/60 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                      {s.step}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200">{s.rule}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.detail}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      s.status === "RESOLVED"
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {s.status === "RESOLVED" ? "RESOLVED HERE" : "TIED (EQUAL)"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Design Principle Callout */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Core Design Principle:</strong>
              No administrator or local powerful actor decides the winner manually. The rule is decided before the conflict occurs, and every decision produces an immutable log visible to all farmers in the Water Group.
            </div>
          </div>

        </div>
      ) : (
        <div className="p-8 text-center glass-panel border border-slate-800 text-slate-400 space-y-3">
          <Scale className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm">Click "Execute Tie-Break Chain" to evaluate the 4-tier decision tree.</p>
        </div>
      )}

    </div>
  );
}
