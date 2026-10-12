import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import LinkManager from "./components/LinkManager";
import ResearchBriefView from "./components/ResearchBriefView";
import HistoryView from "./components/HistoryView";
import StatusView from "./components/StatusView";
import LoadingState from "./components/LoadingState";
import { Zap, Shield, BookOpen, Terminal, Sparkles } from "lucide-react";

function App() {
  const [links, setLinks] = useState([]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [serverOk, setServerOk] = useState(true);
  const [toast, setToast] = useState(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/api/research`);
      setHistory(Array.isArray(res.data) ? res.data : []);
      setServerOk(true);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setServerOk(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    if (!links || links.length === 0) {
      showToast("warning", "No inputs staged", "Please add at least 1 URL before generating.");
      return;
    }

    if (links.length > 5) {
      showToast("warning", "Exceeded input limit", "Maximum 5 source links allowed per synthesis run.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API}/api/research`, {
        links: links
      });

      setResult(response.data);
      fetchHistory();
      setActiveTab("home");
      showToast("success", "Synthesis Complete", "Research brief generated and committed to vault.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submission error:", error);
      const errMsg = error.response?.data?.error || error.message || "Failed to generate research brief.";
      showToast("error", "Generation Failed", errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrief = async (id) => {
    try {
      await axios.delete(`${API}/api/research/${id}`);
      setHistory(prev => prev.filter(item => item._id !== id));
      if (result && result._id === id) {
        setResult(null);
      }
      showToast("info", "Record Deleted", "The research brief was removed from vault.");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("error", "Delete Failed", "Could not delete brief from server.");
    }
  };

  const handleSelectHistoryItem = (item) => {
    setResult(item);
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setResult(null);
    setLinks([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#08080a] bg-grid-pattern text-zinc-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        serverOk={serverOk}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* Hero Header (shown when no result or during loading) */}
            {!result && !loading && (
              <div className="text-center py-8 sm:py-12 max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-1 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CROSS-SOURCE INTELLIGENCE ENGINE</span>
                </div>
                
                <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Autonomous Web <span className="text-cyan-400 neon-text-glow">Research Synthesis</span>
                </h1>
                
                <p className="text-xs sm:text-sm font-mono text-zinc-400 leading-relaxed max-w-xl mx-auto">
                  Aggregate and cross-reference up to 5 sources. Scrapes live DOM, highlights evidence citations, detects factual contradictions, and builds an audit checklist.
                </p>

                {/* Features pills */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0e0e12] border border-zinc-800">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Real-time DOM Extraction</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0e0e12] border border-zinc-800">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contradiction Detection</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0e0e12] border border-zinc-800">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Markdown Export</span>
                  </span>
                </div>
              </div>
            )}

            {/* Loading Pipeline State */}
            {loading && (
              <LoadingState linksCount={links.length} />
            )}

            {/* Result View or Link Manager */}
            {!loading && (
              <>
                {result ? (
                  <div className="space-y-6">
                    <ResearchBriefView
                      brief={result}
                      onReset={handleReset}
                      onShowToast={showToast}
                    />

                    {/* Secondary option to run another research with current or new links */}
                    <div className="pt-6 border-t border-zinc-900 text-center">
                      <button
                        onClick={handleReset}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
                      >
                        ← Stage new sources for another synthesis run
                      </button>
                    </div>
                  </div>
                ) : (
                  <LinkManager
                    links={links}
                    setLinks={setLinks}
                    onSubmit={handleSubmit}
                    loading={loading}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <HistoryView
            history={history}
            onSelectBrief={handleSelectHistoryItem}
            onDeleteBrief={handleDeleteBrief}
            onShowToast={showToast}
          />
        )}

        {/* STATUS TAB */}
        {activeTab === "status" && (
          <StatusView
            API={API}
            onStatusChange={(isOk) => setServerOk(isOk)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900/80 py-6 text-center text-xs font-mono text-zinc-600 bg-[#08080a]/80">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 ResearchBrief AI. Multi-source research synthesis terminal.</p>
          <div className="flex items-center gap-3 text-zinc-500">
            <span className="text-cyan-400">Groq LPU Acceleration</span>
            <span>•</span>
            <span>MongoDB Document Store</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
