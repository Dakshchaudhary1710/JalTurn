import React, { useState } from "react";
import { X, Smartphone, MessageSquare, PhoneCall, Radio, Check, Volume2, VolumeX } from "lucide-react";

export function SMSMockModal({
  isOpen,
  onClose,
  activeFarmer
}) {
  const [activeChannel, setActiveChannel] = useState("SMS"); // SMS, WHATSAPP, IVR
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const farmerName = activeFarmer?.farmerName || "Rameshwar Singh";
  const crop = activeFarmer?.crop || "Wheat";
  const score = activeFarmer?.urgencyScore || "91.4";
  const estTurn = activeFarmer?.estimatedTurnText || "In 2h 15m";

  const handleSimulateIVR = () => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(
        `Namaskar ${farmerName} ji. JalTurn sachiv se suchna. Aapke ${crop} khet ke liye paani ki bari agle do ghante me tay ki gayi hai. Urgency score ${score} hai. Bari swikarne ke liye ek dabayein.`
      );
      msg.rate = 0.9;
      msg.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(msg);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 4000);
    }
  };

  const handleStopIVR = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel max-w-lg w-full p-6 relative border border-sky-500/40 shadow-2xl shadow-slate-950">
        
        {/* Close Button */}
        <button
          onClick={() => {
            handleStopIVR();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-sky-900/60 border border-sky-600 flex items-center justify-center text-sky-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Rural Multi-Channel Alert Simulator</h2>
            <p className="text-xs text-slate-400">Phase 10 — Feature Phone SMS, WhatsApp & IVR Outreach</p>
          </div>
        </div>

        {/* Channel Switcher */}
        <div className="flex rounded-xl bg-slate-900 p-1 mb-5 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveChannel("SMS")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
              activeChannel === "SMS" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Feature Phone SMS</span>
          </button>

          <button
            onClick={() => setActiveChannel("WHATSAPP")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
              activeChannel === "WHATSAPP" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveChannel("IVR")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
              activeChannel === "IVR" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>IVR Voice Call</span>
          </button>
        </div>

        {/* Simulated Mobile Mock Display */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner font-sans">
          
          {activeChannel === "SMS" && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500 font-mono flex justify-between">
                <span>SENDER: VM-JALTURN</span>
                <span>TODAY, 10:14 AM</span>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
                <p className="font-bold text-emerald-400">JALTURN IRRIGATION ALERT:</p>
                <p className="mt-1">
                  Kisan {farmerName} ji, aapke {crop} plot ke liye tubewell turn schedule ho gayi hai.
                </p>
                <p className="mt-1 text-sky-300">
                  • Priority Rank: #1 (Urgency: {score})<br />
                  • Estimated Turn: {estTurn}<br />
                  • Source: Borewell #04
                </p>
                <p className="mt-2 text-slate-400 text-[10px]">
                  Reply 1 to CONFIRM, Reply 2 to PASS turn to next farmer.
                </p>
              </div>
            </div>
          )}

          {activeChannel === "WHATSAPP" && (
            <div className="space-y-3">
              <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-700/50 text-xs text-slate-200 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-emerald-300">
                  <span>🌾 JalTurn Rampur Water User Group</span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-white">💧 Turn Scheduled: {farmerName}</div>
                  <div className="text-slate-300">Crop: {crop} • Flowering Stage (Critical)</div>
                  <div className="text-emerald-400 font-mono font-bold">Urgency Score: {score}/100</div>
                  <div className="text-sky-300 text-[11px]">Est. Start: {estTurn}</div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    Reason: Highest FAO-56 crop sensitivity and waiting interval.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChannel === "IVR" && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <PhoneCall className={`w-7 h-7 ${isPlayingAudio ? "animate-bounce" : ""}`} />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Automated Voice Call (IVR in Hindi / Regional)</div>
                <p className="text-xs text-slate-400 mt-1">
                  "Kisan {farmerName} ji, aapke {crop} plot ke liye tubewell turn schedule ho gayi hai..."
                </p>
              </div>

              <div className="flex justify-center gap-2 pt-2">
                {!isPlayingAudio ? (
                  <button
                    onClick={handleSimulateIVR}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Audio Voice Simulation</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopIVR}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Call Simulation</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-slate-400 text-center mt-4">
          Bypasses digital literacy barriers so even farmers with basic ₹1,000 keypad feature phones receive real-time scheduling turns.
        </p>

      </div>
    </div>
  );
}
