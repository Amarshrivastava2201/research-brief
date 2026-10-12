import { useState, useEffect } from "react";
import { Globe, Cpu, CheckCircle2, ShieldAlert, Terminal, Zap } from "lucide-react";

export default function LoadingState({ linksCount = 1 }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Target URL Retrieval", desc: `Executing HTTP GET across ${linksCount} target source(s)...`, icon: Globe },
    { title: "DOM Sanitization & Stripping", desc: "Removing scripts, ad blocks, navigation markup, and headers...", icon: Cpu },
    { title: "Cross-Claim Discrepancy Analysis", desc: "Corroborating overlapping claims & identifying divergence points...", icon: ShieldAlert },
    { title: "Brief Compilation & Tagging", desc: "Generating structured findings, citation quotes & verification checklist...", icon: Zap }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 3500);
    const timer2 = setTimeout(() => setCurrentStep(2), 7500);
    const timer3 = setTimeout(() => setCurrentStep(3), 13000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full bg-[#0c0c10] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden neon-border-pulse">
      {/* Background neon ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/40">
          <Terminal className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-white tracking-tight">Synthesizing Research Brief</h3>
          <p className="text-xs font-mono text-zinc-400">Executing multi-source analysis pipeline...</p>
        </div>
      </div>

      {/* Steps List */}
      <div className="grid gap-3 my-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div
              key={idx}
              className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? "bg-[#141418] border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : isDone
                  ? "bg-[#08080a] border-zinc-800 text-zinc-400"
                  : "bg-[#08080a]/40 border-zinc-900 opacity-40"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                ) : (
                  <Icon className="w-4 h-4 text-zinc-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-mono font-bold ${isCurrent ? "text-cyan-300" : isDone ? "text-zinc-300" : "text-zinc-600"}`}>
                    {step.title}
                  </p>
                  {isCurrent && (
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider animate-pulse">
                      PROCESSING...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      COMPLETE
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shimmer neon line */}
      <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
        <div 
          className="bg-cyan-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ width: `${Math.min(95, (currentStep + 1) * 24)}%` }}
        ></div>
      </div>
    </div>
  );
}
