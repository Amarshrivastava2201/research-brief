import { useState } from "react";
import { Link2, Plus, Trash2, Globe, Sparkles, ExternalLink, ArrowRight, Layers, FileText, Zap } from "lucide-react";
import { getDomain, isValidUrl, cleanUrl, SAMPLE_TOPICS } from "../utils/urlHelper";

export default function LinkManager({ links, setLinks, onSubmit, loading }) {
  const [singleInput, setSingleInput] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const maxLinks = 5;

  const handleAddSingle = (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const trimmed = singleInput.trim();
    if (!trimmed) return;

    if (!isValidUrl(trimmed)) {
      setErrorMsg("Please enter a valid website URL (e.g., https://example.com/article)");
      return;
    }

    const formatted = cleanUrl(trimmed);
    if (links.includes(formatted)) {
      setErrorMsg("This URL is already in your sources list.");
      return;
    }

    if (links.length >= maxLinks) {
      setErrorMsg(`Maximum of ${maxLinks} links reached. Remove one to add another.`);
      return;
    }

    setLinks([...links, formatted]);
    setSingleInput("");
  };

  const handleApplyBulk = () => {
    setErrorMsg("");
    const parsed = bulkText
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .map(cleanUrl);

    if (parsed.length === 0) {
      setErrorMsg("No links found in the text box.");
      return;
    }

    const valid = parsed.filter(isValidUrl);
    if (valid.length === 0) {
      setErrorMsg("None of the lines appear to be valid URLs.");
      return;
    }

    const combined = Array.from(new Set([...links, ...valid])).slice(0, maxLinks);
    setLinks(combined);
    setBulkText("");
    setIsBulkMode(false);
  };

  const handleRemove = (indexToRemove) => {
    setLinks(links.filter((_, i) => i !== indexToRemove));
    setErrorMsg("");
  };

  const handleClearAll = () => {
    setLinks([]);
    setErrorMsg("");
  };

  const handleLoadSample = (sample) => {
    setLinks(sample.links);
    setErrorMsg("");
  };

  return (
    <div className="w-full bg-[#0c0c10] border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle top neon border accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <Link2 className="w-4 h-4" />
            </span>
            <h2 className="font-heading text-xl font-bold text-white tracking-tight">Source Inputs</h2>
          </div>
          <p className="text-xs font-mono text-zinc-400">
            Feed 1 to 5 URLs for multi-source discrepancy evaluation & executive brief compilation.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center bg-[#141418] px-3 py-1.5 rounded-lg border border-zinc-800">
          <div className="flex gap-1.5">
            {Array.from({ length: maxLinks }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < links.length
                    ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-110"
                    : "bg-zinc-800 border border-zinc-700"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-zinc-300 ml-1.5">
            {links.length} / {maxLinks}
          </span>
        </div>
      </div>

      {/* Input Form */}
      <div className="mt-6 space-y-4">
        {!isBulkMode ? (
          <form onSubmit={handleAddSingle} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="https://example.com/article-or-report..."
                value={singleInput}
                onChange={(e) => {
                  setSingleInput(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                disabled={links.length >= maxLinks || loading}
                className="w-full pl-10 pr-4 py-3 bg-[#08080a] border border-zinc-800 rounded-xl text-xs sm:text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={links.length >= maxLinks || !singleInput.trim() || loading}
              className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-zinc-700 font-mono text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <textarea
              rows="4"
              placeholder="Paste URLs here, one per line..."
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              disabled={loading}
              className="w-full p-3.5 bg-[#08080a] border border-zinc-800 rounded-xl text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleApplyBulk}
                disabled={!bulkText.trim() || loading}
                className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold cursor-pointer transition-colors disabled:opacity-40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                Apply Links
              </button>
              <button
                type="button"
                onClick={() => setIsBulkMode(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs font-mono cursor-pointer transition-colors border border-zinc-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Mode switcher & helper */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
          <button
            type="button"
            onClick={() => setIsBulkMode(!isBulkMode)}
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer font-medium"
          >
            {isBulkMode ? "Switch to single URL input" : "Or batch paste multiple links"}
          </button>
          {links.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={loading}
              className="text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="text-xs font-mono text-rose-400 bg-rose-950/40 border border-rose-500/30 px-3 py-2 rounded-lg">
            {errorMsg}
          </p>
        )}
      </div>

      {/* Added Links List */}
      <div className="mt-6">
        {links.length === 0 ? (
          <div className="p-8 border border-dashed border-zinc-800/80 rounded-xl text-center flex flex-col items-center justify-center bg-[#09090c]/50">
            <Globe className="w-8 h-8 text-zinc-700 mb-2" />
            <p className="font-heading text-sm font-semibold text-zinc-300">No sources staged</p>
            <p className="text-xs font-mono text-zinc-500 mt-1 max-w-sm">
              Add target URLs or click a sample topic below to test immediately.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {links.map((link, idx) => {
              const domain = getDomain(link);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#08080a] border border-zinc-800/80 hover:border-cyan-500/40 transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 shrink-0">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-[11px] font-mono text-zinc-400 border border-zinc-800 shrink-0">
                      {domain}
                    </span>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-zinc-300 truncate hover:text-cyan-400 hover:underline flex items-center gap-1"
                      title={link}
                    >
                      <span>{link}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-cyan-400" />
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    disabled={loading}
                    className="text-zinc-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer shrink-0"
                    title="Remove source"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preset Sample Topics */}
      <div className="mt-8 pt-6 border-t border-zinc-800/80">
        <p className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Load Test Subjects</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_TOPICS.map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleLoadSample(topic)}
              disabled={loading}
              className="text-left p-3.5 rounded-xl bg-[#09090d] hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <p className="font-heading text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors">
                  {topic.title}
                </p>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">{topic.links.length} verified sources</p>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 mt-2.5 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Load sources <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono text-zinc-500">
          {links.length === 0
            ? "Stage at least 1 URL to trigger compilation"
            : `Ready to synthesize ${links.length} source${links.length > 1 ? "s" : ""}`}
        </p>
        <button
          onClick={onSubmit}
          disabled={links.length === 0 || loading}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-heading font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.55)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{loading ? "Processing Pipeline..." : "Generate Research Brief"}</span>
        </button>
      </div>
    </div>
  );
}
