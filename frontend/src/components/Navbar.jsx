import { History, Activity, Terminal, Zap } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, historyCount = 0, serverOk = true }) {
  const tabs = [
    {
      id: "home",
      label: "Synthesize",
      shortLabel: "Run",
      icon: Zap,
      badge: null
    },
    {
      id: "history",
      label: "Vault",
      shortLabel: "Vault",
      icon: History,
      badge: historyCount > 0 ? historyCount : null
    },
    {
      id: "status",
      label: "Diagnostics",
      shortLabel: "Status",
      icon: Activity,
      badge: null
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center group-hover:border-cyan-400/80 group-hover:shadow-[0_0_16px_rgba(6,182,212,0.4)] transition-all duration-300">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm sm:text-lg text-white tracking-tight">
                RESEARCH<span className="text-cyan-400">BRIEF</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                AI.ENGINE
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 hidden md:block">Multi-source contradiction & synthesis terminal</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-0.5 sm:gap-1 bg-[#121215] p-1 rounded-xl border border-zinc-800 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-zinc-500"}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {tab.badge !== null && (
                  <span
                    className={`ml-0.5 sm:ml-1 text-[9px] sm:text-[10px] font-mono font-bold px-1 sm:px-1.5 py-0.2 rounded ${
                      isActive
                        ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status Dot Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121215] border border-zinc-800 text-xs font-mono text-zinc-400">
          <span className={`w-2 h-2 rounded-full ${serverOk ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" : "bg-amber-400"}`}></span>
          <span className="text-[11px]">{serverOk ? "SYSTEM ONLINE" : "CONNECTING..."}</span>
        </div>
      </div>
    </header>
  );
}
