import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />
  };

  const borderMap = {
    success: "border-emerald-500/40 bg-[#0c0c10]/95 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.15)]",
    error: "border-rose-500/40 bg-[#0c0c10]/95 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]",
    warning: "border-amber-500/40 bg-[#0c0c10]/95 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    info: "border-cyan-500/40 bg-[#0c0c10]/95 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${borderMap[toast.type || "info"]}`}>
        {iconMap[toast.type || "info"]}
        <div className="flex-1 pr-1 font-mono">
          {toast.title && <p className="font-bold text-xs text-white mb-0.5">{toast.title}</p>}
          <p className="text-[11px] text-zinc-300 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer p-0.5 rounded hover:bg-zinc-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
