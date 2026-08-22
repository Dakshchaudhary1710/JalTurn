import React, { useState } from "react";
import {
  Scale,
  Trophy,
  Shuffle,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../services/api.js";

export function TieBreakerSimulator() {
  const [farmersList, setFarmersList] = useState([]);
  
  // Configurable Farmer A & Farmer B states
  // Configurable Farmer A & Farmer B states
  const [farmerA, setFarmerA] = useState({
    name: "Farmer A (Ravi)",
    crop: "Wheat (गेहूं)",
    stageName: "Mid-Season (Flowering)",
    stageCriticality: 92,
    waitDays: 5,
    landArea: 1.0,
    evidenceVerified: false,
    urgencyScore: 87.5,
  });

  const [farmerB, setFarmerB] = useState({
    name: "Farmer B (Vikram)",
    crop: "Wheat (गेहूं)",
    stageName: "Mid-Season (Flowering)",
    stageCriticality: 92,
    waitDays: 5,
    landArea: 1.0,
    evidenceVerified: false,
    urgencyScore: 87.5,
  });

  const [activeTab, setActiveTab] = useState("lottery");
  const [resolutionResult, setResolutionResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  React.useEffect(() => {
    async function loadFarmers() {
      try {
        const res = await api.getFarmers();
        if (res.success) setFarmersList(res.farmers);
      } catch (e) {
        console.error(e);
      }
    }
    loadFarmers();
  }, []);

  const handleFarmerChange = (type, farmerId) => {
    const f = farmersList.find(f => f.id === farmerId);
    if (!f) return;
    const targetSet = type === "A" ? setFarmerA : setFarmerB;
    targetSet({
      name: f.name,
      crop: f.cropName || f.crop,
      stageName: f.stageName || "Initial",
      stageCriticality: f.stageCriticality || 50,
      waitDays: f.daysSinceLastWater || 0,
      landArea: f.landArea || 1.0,
      evidenceVerified: f.evidenceVerified || false,
      urgencyScore: f.urgencyScore || 50,
    });
    setActiveTab("custom");
    setResolutionResult(null);
  };

  // --------------------------------------------------
  // PRESET CONFIGURATIONS
  // --------------------------------------------------

  const applyPreset = (type) => {
    setActiveTab(type);
    setResolutionResult(null);

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
        urgencyScore: 87.5,
      });

      setFarmerB({
        name: "Farmer B (Vikram)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 1.0,
        evidenceVerified: false,
        urgencyScore: 87.5,
      });
    } else if (type === "waiting") {
      // Tier 1: Waiting time difference
      setFarmerA({
        name: "Farmer A (Ravi)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 7,
        landArea: 1.0,
        evidenceVerified: false,
        urgencyScore: 87.5,
      });

      setFarmerB({
        name: "Farmer B (Vikram)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 4,
        landArea: 1.0,
        evidenceVerified: false,
        urgencyScore: 87.5,
      });
    } else if (type === "land") {
      // Tier 2: Smallholder equity
      setFarmerA({
        name: "Farmer A (Ravi)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 0.8,
        evidenceVerified: false,
        urgencyScore: 87.5,
      });

      setFarmerB({
        name: "Farmer B (Vikram)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 2.5,
        evidenceVerified: false,
        urgencyScore: 87.5,
      });
    } else if (type === "evidence") {
      // Tier 3: Verified evidence
      setFarmerA({
        name: "Farmer A (Ravi)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 1.0,
        evidenceVerified: true,
        urgencyScore: 87.5,
      });

      setFarmerB({
        name: "Farmer B (Vikram)",
        crop: "Wheat (गेहूं)",
        stageName: "Mid-Season (Flowering)",
        stageCriticality: 92,
        waitDays: 5,
        landArea: 1.0,
        evidenceVerified: false,
        urgencyScore: 87.5,
      });
    }
  };

  // --------------------------------------------------
  // TIE-BREAKER ENGINE
  // --------------------------------------------------

  const runTieSimulation = () => {
    setIsSimulating(true);
    setResolutionResult(null);

    setTimeout(() => {
      const steps = [];

      let winner = null;
      let loser = null;
      let tier = "";
      let reason = "";

      // ----------------------------------------------
      // BASELINE
      // ----------------------------------------------

      steps.push({
        step: 1,
        rule: "Baseline Urgency Score",
        detail: `Farmer A: ${farmerA.urgencyScore} vs Farmer B: ${farmerB.urgencyScore}.`,
        status:
          farmerA.urgencyScore === farmerB.urgencyScore
            ? "TIE"
            : "RESOLVED",
      });

      // ----------------------------------------------
      // TIER 1 — WAITING TIME
      // ----------------------------------------------

      if (farmerA.urgencyScore !== farmerB.urgencyScore) {
        winner =
          farmerA.urgencyScore > farmerB.urgencyScore
            ? farmerA
            : farmerB;

        loser =
          farmerA.urgencyScore > farmerB.urgencyScore
            ? farmerB
            : farmerA;

        tier = "Baseline Urgency";
        reason = `${winner.name} has the higher irrigation urgency score.`;

        steps.push({
          step: 2,
          rule: "Baseline Urgency Resolution",
          detail: reason,
          status: "RESOLVED",
          winner: winner.name,
        });
      } else {
        steps.push({
          step: 2,
          rule: "Tier 1: Waiting Time Priority",
          detail:
            farmerA.waitDays !== farmerB.waitDays
              ? "Waiting periods differ. Longer waiting time receives priority."
              : `Identical waiting period (${farmerA.waitDays} days). Moving to Tier 2.`,
          status:
            farmerA.waitDays !== farmerB.waitDays
              ? "RESOLVED"
              : "TIE",
        });

        if (farmerA.waitDays !== farmerB.waitDays) {
          winner =
            farmerA.waitDays > farmerB.waitDays
              ? farmerA
              : farmerB;

          loser =
            farmerA.waitDays > farmerB.waitDays
              ? farmerB
              : farmerA;

          tier = "Tier 1: Waiting Time Priority";

          reason = `${winner.name} has waited longer without irrigation (${winner.waitDays} days).`;

          steps[1] = {
            step: 2,
            rule: "Tier 1: Waiting Time Priority",
            detail: reason,
            status: "RESOLVED",
            winner: winner.name,
          };
        } else {
          // ------------------------------------------
          // TIER 2 — SMALLHOLDER EQUITY
          // ------------------------------------------

          if (
            Math.abs(farmerA.landArea - farmerB.landArea) > 0.05
          ) {
            winner =
              farmerA.landArea < farmerB.landArea
                ? farmerA
                : farmerB;

            loser =
              farmerA.landArea < farmerB.landArea
                ? farmerB
                : farmerA;

            tier = "Tier 2: Smallholder Equity";

            reason = `${winner.name} has the smaller landholding (${winner.landArea} acres vs ${loser.landArea} acres).`;

            steps.push({
              step: 3,
              rule: "Tier 2: Smallholder Equity",
              detail: reason,
              status: "RESOLVED",
              winner: winner.name,
            });
          } else {
            steps.push({
              step: 3,
              rule: "Tier 2: Smallholder Equity",
              detail: `Identical landholding size (${farmerA.landArea} acres). Moving to Tier 3.`,
              status: "TIE",
            });

            // ----------------------------------------
            // TIER 3 — VERIFIED EVIDENCE
            // ----------------------------------------

            if (
              farmerA.evidenceVerified !==
              farmerB.evidenceVerified
            ) {
              winner = farmerA.evidenceVerified
                ? farmerA
                : farmerB;

              loser = farmerA.evidenceVerified
                ? farmerB
                : farmerA;

              tier = "Tier 3: Verified Field Evidence";

              reason = `${winner.name} submitted verified agronomic field evidence.`;

              steps.push({
                step: 4,
                rule: "Tier 3: Verified Field Evidence",
                detail: reason,
                status: "RESOLVED",
                winner: winner.name,
              });
            } else {
              steps.push({
                step: 4,
                rule: "Tier 3: Verified Field Evidence",
                detail: `Evidence status equal (${
                  farmerA.evidenceVerified
                    ? "Both Verified"
                    : "Neither Verified"
                }). Moving to Tier 4.`,
                status: "TIE",
              });

              // ----------------------------------------
              // TIER 4 — PUBLIC RANDOMIZED DRAW
              // ----------------------------------------

              const randomValue = Math.random();

              if (randomValue < 0.5) {
                winner = farmerA;
                loser = farmerB;
              } else {
                winner = farmerB;
                loser = farmerA;
              }

              tier = "Tier 4: Public Randomized Draw";

              const drawId =
                `JAL-${Date.now()}-${Math.floor(
                  Math.random() * 100000
                )}`;

              reason = `All deterministic criteria were equal. A randomized draw selected ${winner.name}.`;

              steps.push({
                step: 5,
                rule: "Tier 4: Public Randomized Draw",
                detail: `${winner.name} selected by randomized draw. Draw Reference: ${drawId}.`,
                status: "RESOLVED",
                winner: winner.name,
              });

              // Confetti for final randomized resolution
              try {
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              } catch (error) {
                // Ignore confetti errors
              }
            }
          }
        }
      }

      // ----------------------------------------------
      // FINAL RESULT
      // ----------------------------------------------

      setResolutionResult({
        winner,
        loser,
        tier,
        reason,
        steps,
        timestamp: new Date().toLocaleTimeString(),
      });

      setIsSimulating(false);
    }, 600);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 border border-amber-500/30 relative overflow-hidden">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>

            {/* Feature Badge */}
            <div className="flex items-center space-x-2">

              <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-600/50 rounded-full flex items-center gap-1.5">

                <Scale className="w-3.5 h-3.5" />

                Fairness Engine

              </span>

              <span className="text-xs text-slate-400 font-mono">
                Transparent Decision System
              </span>

            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2" style={{color:"#ffffff"}}>
              Tie-Breaker
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl leading-relaxed">
              When two farmers have equal irrigation priority, JalTurn
              resolves the conflict through a predefined and transparent
              four-tier decision process.
            </p>

          </div>

          {/* Resolve Button */}
          <button
            onClick={runTieSimulation}
            disabled={isSimulating}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center space-x-2 flex-shrink-0"
          >

            <Shuffle
              className={`w-4 h-4 ${
                isSimulating ? "animate-spin" : ""
              }`}
            />

            <span>
              {isSimulating
                ? "Resolving..."
                : "Run Fairness Check"}
            </span>

          </button>

        </div>

        {/* Custom Selector */}
        <div className="mt-4 flex gap-4 border-t border-slate-800/80 pt-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Farmer A</label>
            <select
              onChange={(e) => handleFarmerChange("A", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded px-2 py-1 focus:border-emerald-500"
            >
              <option value="">-- Choose from real farmers --</option>
              {farmersList.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Farmer B</label>
            <select
              onChange={(e) => handleFarmerChange("B", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded px-2 py-1 focus:border-emerald-500"
            >
              <option value="">-- Choose from real farmers --</option>
              {farmersList.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">

          <span className="text-xs font-semibold text-slate-400 py-1.5 mr-2 flex items-center">
            Test Scenarios (Mock Data):
          </span>

          {/* Tier 4 */}
          <button
            onClick={() => applyPreset("lottery")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "lottery"
                ? "bg-amber-500 text-white font-bold"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
            }`}
          >
            🎲 Exact Tie → Randomized Draw
          </button>

          {/* Tier 1 */}
          <button
            onClick={() => applyPreset("waiting")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "waiting"
                ? "bg-sky-500 text-white font-bold"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
            }`}
          >
            ⏱️ Tier 1: Waiting Time
          </button>

          {/* Tier 2 */}
          <button
            onClick={() => applyPreset("land")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "land"
                ? "bg-emerald-500 text-white font-bold"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
            }`}
          >
            🌱 Tier 2: Smallholder Equity
          </button>

          {/* Tier 3 */}
          <button
            onClick={() => applyPreset("evidence")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "evidence"
                ? "bg-purple-500 text-white font-bold"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
            }`}
          >
            📸 Tier 3: Verified Evidence
          </button>

        </div>
      </div>

      {/* Farmer Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Farmer A */}
        <div className="glass-panel p-5 border border-slate-800 relative">

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">

            <span className="text-sm font-bold text-white flex items-center gap-2">

              <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-mono">
                A
              </span>

              {farmerA.name}

            </span>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-amber-950 text-amber-300 border border-amber-700">
              Urgency: {farmerA.urgencyScore}
            </span>

          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                Crop & Stage
              </span>

              <strong className="text-white">
                {farmerA.crop}
              </strong>

              <div className="text-emerald-400 text-[11px] font-medium">
                {farmerA.stageName}
              </div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                Days Waiting
              </span>

              <strong className="text-sky-300 text-base font-mono">
                {farmerA.waitDays} days
              </strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                Landholding Size
              </span>

              <strong className="text-amber-300 text-base font-mono">
                {farmerA.landArea} acres
              </strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                Crop Evidence
              </span>

              <strong
                className={
                  farmerA.evidenceVerified
                    ? "text-emerald-400"
                    : "text-slate-400"
                }
              >
                {farmerA.evidenceVerified
                  ? "✓ Verified Field Data"
                  : "No Attachment"}
              </strong>
            </div>

          </div>
        </div>

        {/* Farmer B */}
        <div className="glass-panel p-5 border border-slate-800 relative">

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">

            <span className="text-sm font-bold text-white flex items-center gap-2">

              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono">
                B
              </span>

              {farmerB.name}

            </span>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-amber-950 text-amber-300 border border-amber-700">
              Urgency: {farmerB.urgencyScore}
            </span>

          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                Crop & Stage
              </span>

              <strong className="text-white">
                {farmerB.crop}
              </strong>

              <div className="text-emerald-400 text-[11px] font-medium">
                {farmerB.stageName}
              </div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                Days Waiting
              </span>

              <strong className="text-sky-300 text-base font-mono">
                {farmerB.waitDays} days
              </strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                Landholding Size
              </span>

              <strong className="text-amber-300 text-base font-mono">
                {farmerB.landArea} acres
              </strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">
                Crop Evidence
              </span>

              <strong
                className={
                  farmerB.evidenceVerified
                    ? "text-emerald-400"
                    : "text-slate-400"
                }
              >
                {farmerB.evidenceVerified
                  ? "✓ Verified Field Data"
                  : "No Attachment"}
              </strong>
            </div>

          </div>
        </div>
      </div>

      {/* Resolution Result */}
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
                  Reason:{" "}
                  <strong className="text-emerald-300 font-medium">
                    "{resolutionResult.reason}"
                  </strong>
                </p>

              </div>

            </div>

            <div className="text-right font-mono text-xs text-slate-400">

              <span>
                Timestamp: {resolutionResult.timestamp}
              </span>

              <div className="text-[10px] text-emerald-400">
                Decision Recorded
              </div>

            </div>

          </div>

          {/* Decision Ladder */}
          <div className="space-y-3">

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Decision Audit Trail
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

                      <div className="font-semibold text-slate-200">
                        {s.rule}
                      </div>

                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {s.detail}
                      </div>

                    </div>

                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      s.status === "RESOLVED"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {s.status === "RESOLVED"
                      ? "RESOLVED HERE"
                      : "TIED"}
                  </span>

                </div>

              ))}

            </div>
          </div>

          {/* Design Principle */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">

            <ShieldCheck className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />

            <div>

              <strong className="text-white block mb-0.5">
                Fairness by Design
              </strong>

              JalTurn resolves equal-priority claims using predefined
              rules rather than discretionary manual selection. Each
              decision can be recorded in the system audit trail for
              transparency.

            </div>

          </div>

        </div>

      ) : (

        <div className="p-8 text-center glass-panel border border-slate-800 text-slate-400 space-y-3">

          <Scale className="w-10 h-10 text-slate-300 mx-auto" />

          <p className="text-sm">
            Select a scenario and run the fairness check to evaluate
            the 4-tier decision process.
          </p>

        </div>

      )}

    </div>
  );
}