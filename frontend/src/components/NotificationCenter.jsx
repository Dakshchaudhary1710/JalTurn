import React from "react";
import { X, Bell, Droplet, Scale, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export function NotificationCenter({
  isOpen,
  onClose,
  notifications = [],
  onClear
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 max-w-md w-full z-50 bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Live Notification Center</h2>
            <p className="text-[11px] text-slate-400">JalTurn In-App & Village Broadcast Alerts</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No active unread notifications.
          </div>
        ) : (
          notifications.map((n, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all ${
                n.type === "URGENT_TURN"
                  ? "bg-emerald-950/40 border-emerald-500/50 text-white"
                  : n.type === "TIE_ALERT"
                  ? "bg-amber-950/40 border-amber-500/40 text-amber-200"
                  : "bg-slate-900/80 border-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-xs text-white">
                  {n.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{n.body}</p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
        <span className="text-slate-500">Auto-push to registered SIMs</span>
        <button
          onClick={onClear}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
        >
          Mark All Read
        </button>
      </div>

    </div>
  );
}
