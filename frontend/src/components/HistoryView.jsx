import { useState, useMemo } from "react";
import { 
  Search, 
  History, 
  Calendar, 
  Tag, 
  ArrowRight, 
  Copy, 
  Check, 
  Layers,
  Trash2,
  Terminal
} from "lucide-react";
import { formatBriefToMarkdown, copyToClipboard } from "../utils/exportUtils";

export default function HistoryView({ history, onSelectBrief, onDeleteBrief, onShowToast }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    history.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(t => tags.add(t));
      }
    });
    return Array.from(tags);
  }, [history]);

  // Filtered history
  const filtered = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = 
        !searchTerm.trim() ||
        (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.links && item.links.some(l => l.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [history, searchTerm, selectedTag]);

  const handleQuickCopy = async (e, item) => {
    e.stopPropagation();
    const md = formatBriefToMarkdown(item);
    const ok = await copyToClipboard(md);
    if (ok) {
      setCopiedId(item._id || item.createdAt);
      if (onShowToast) onShowToast("success", "Copied", "Markdown brief copied to clipboard.");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDelete = (e, item) => {
    e.stopPropagation();
    if (onDeleteBrief) {
      onDeleteBrief(item._id);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Search & Header */}
      <div className="bg-[#0c0c10] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white tracking-tight">Intelligence Vault</h2>
              <p className="text-xs font-mono text-zinc-400">Archive of historical syntheses & cross-verified research documents</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-zinc-900 text-cyan-400 border border-zinc-800 self-start sm:self-center">
            {history.length} {history.length === 1 ? "RECORD" : "RECORDS"}
          </span>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vault records by keywords, tags, or URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#08080a] border border-zinc-800 rounded-xl text-xs sm:text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
          />
        </div>

        {/* Tags filter list */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/80">
            <span className="text-[11px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags:
            </span>
            <button
              onClick={() => setSelectedTag("")}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-medium transition-all cursor-pointer ${
                !selectedTag
                  ? "bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-medium transition-all cursor-pointer ${
                  selectedTag === tag
                    ? "bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* History Items List */}
      {filtered.length === 0 ? (
        <div className="bg-[#0c0c10] border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <Layers className="w-10 h-10 text-zinc-700 mb-3" />
          <h3 className="font-heading text-base font-bold text-zinc-300">Vault empty</h3>
          <p className="text-xs font-mono text-zinc-500 mt-1 max-w-sm">
            {searchTerm || selectedTag
              ? "No archives match your active filter parameters."
              : "Generate research briefs from the Synthesize tab to build your vault."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3.5">
          {filtered.map((item, idx) => {
            const isCopied = copiedId === (item._id || item.createdAt);
            const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString() : "Unknown date";
            const sourcesCount = item.links?.length || 0;

            return (
              <div
                key={item._id || idx}
                onClick={() => onSelectBrief(item)}
                className="group p-5 rounded-2xl bg-[#0c0c10] border border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
                    <span className="flex items-center gap-1 font-medium text-cyan-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px]">
                      {sourcesCount} {sourcesCount === 1 ? "source" : "sources"}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-200 line-clamp-2 leading-relaxed font-sans">
                    {item.summary || "No summary preview available."}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((t, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-0.2 rounded text-[10px] font-mono font-medium bg-zinc-900 text-cyan-300/80 border border-zinc-800"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => handleQuickCopy(e, item)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-800"
                    title="Quick Copy Markdown"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                  </button>

                  {onDeleteBrief && item._id && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer border border-zinc-800 hover:border-rose-500/30"
                      title="Delete brief"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="px-3.5 py-2 rounded-xl bg-zinc-900 group-hover:bg-cyan-400 text-cyan-400 group-hover:text-black font-mono text-xs font-bold flex items-center gap-1.5 border border-zinc-800 group-hover:border-cyan-400 transition-all">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
