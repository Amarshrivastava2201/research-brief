import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Terminal
} from "lucide-react";

export default function StatusView({ API, onStatusChange }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkStatus = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await axios.get(`${API}/status`, { timeout: 8000 });
      const elapsed = Math.round(performance.now() - start);
      setStatus(res.data);
      setLatency(elapsed);
      setLastChecked(new Date());
      if (onStatusChange) {
        onStatusChange(res.data.server === "Running" && res.data.database === "Connected");
      }
    } catch (err) {
      setStatus({
        server: "Offline / Unreachable",
        database: "Unknown",
        llm: "Unknown",
        error: err.message
      });
      setLatency(null);
      setLastChecked(new Date());
      if (onStatusChange) onStatusChange(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusBadge = (val, successWord = "Connected") => {
    const isOk = val === successWord || val === "Running" || val === "Healthy" || val === "Ready";
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
        isOk 
          ? "bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]" 
          : "bg-rose-950/70 text-rose-400 border border-rose-500/40"
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isOk ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></span>
        {val ? val.toUpperCase() : "UNKNOWN"}
      </span>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0c0c10] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-white tracking-tight">System Telemetry & Health</h2>
            <p className="text-xs font-mono text-zinc-400">
              Live diagnostics across Express API gateway, MongoDB persistence layer, and Groq inference engine.
            </p>
          </div>
        </div>

        <button
          onClick={checkStatus}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "POLLING..." : "RUN HEALTH CHECK"}</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* API Server Card */}
        <div className="p-6 rounded-2xl bg-[#0c0c10] border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <Server className="w-5 h-5" />
            </div>
            {status ? getStatusBadge(status.server, "Running") : <span className="text-xs font-mono text-zinc-600">POLLING...</span>}
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">Backend API Gateway</h3>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">Express.js REST runtime</p>
          </div>
          <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400 space-y-1">
            <p className="flex justify-between">
              <span>Endpoint:</span>
              <span className="text-zinc-300">{API}</span>
            </p>
            {latency !== null && (
              <p className="flex justify-between">
                <span>Latency:</span>
                <span className="text-emerald-400 font-bold">{latency} ms</span>
              </p>
            )}
          </div>
        </div>

        {/* MongoDB Card */}
        <div className="p-6 rounded-2xl bg-[#0c0c10] border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            {status ? getStatusBadge(status.database, "Connected") : <span className="text-xs font-mono text-zinc-600">POLLING...</span>}
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">Database Store</h3>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">Local MongoDB 127.0.0.1</p>
          </div>
          <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400 space-y-1">
            <p className="flex justify-between">
              <span>Host:</span>
              <span className="text-zinc-300">mongodb://127.0.0.1:27017</span>
            </p>
            <p className="flex justify-between">
              <span>Buffer:</span>
              <span className="text-emerald-400">Non-blocking resilient</span>
            </p>
          </div>
        </div>

        {/* Groq LLM Card */}
        <div className="p-6 rounded-2xl bg-[#0c0c10] border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            {status ? getStatusBadge(status.llm, "Connected") : <span className="text-xs font-mono text-zinc-600">POLLING...</span>}
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">Inference Engine</h3>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">Ultra-low latency Groq LPU</p>
          </div>
          <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400 space-y-1">
            <p className="flex justify-between">
              <span>Model:</span>
              <span className="text-cyan-400 font-bold">gpt-oss-20b</span>
            </p>
            <p className="flex justify-between">
              <span>Mode:</span>
              <span className="text-zinc-300">JSON extraction</span>
            </p>
          </div>
        </div>
      </div>

      {/* Info & Diagnostics Log */}
      <div className="p-6 rounded-2xl bg-[#0c0c10] border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h4 className="font-heading text-sm font-bold text-white">Architecture Specs</h4>
          </div>
          {lastChecked && (
            <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Checked {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-zinc-400">
          <div className="space-y-2">
            <p><strong className="text-zinc-300">Scraping Engine:</strong> Cheerio + Browser User-Agent normalization</p>
            <p><strong className="text-zinc-300">Context Window:</strong> 12,000 characters slice across multi-source batch</p>
          </div>
          <div className="space-y-2">
            <p><strong className="text-zinc-300">Client Runtime:</strong> React 19 + Vite 7 + Tailwind CSS (Cyberpunk Dark)</p>
            <p><strong className="text-zinc-300">CORS Policy:</strong> Enabled for local & remote origins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
