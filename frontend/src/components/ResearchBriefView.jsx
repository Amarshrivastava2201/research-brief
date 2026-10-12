import { useState } from "react";
import { 
  Copy, 
  Check, 
  Download, 
  Printer, 
  BookOpen, 
  Quote, 
  ExternalLink, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  Tag, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Terminal,
  Zap
} from "lucide-react";
import { formatBriefToMarkdown, copyToClipboard, downloadMarkdown } from "../utils/exportUtils";
import { getDomain } from "../utils/urlHelper";

export default function ResearchBriefView({ brief, onReset, onShowToast }) {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  if (!brief) return null;

  const handleCopy = async () => {
    const md = formatBriefToMarkdown(brief);
    const ok = await copyToClipboard(md);
    if (ok) {
      setCopied(true);
      if (onShowToast) onShowToast("success", "Copied to clipboard", "Research brief formatted as Markdown has been copied.");
      setTimeout(() => setCopied(false), 2500);
    } else {
      if (onShowToast) onShowToast("error", "Copy failed", "Could not write to clipboard.");
    }
  };

  const handleDownload = () => {
    const md = formatBriefToMarkdown(brief);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadMarkdown(md, `research-brief-${dateStr}.md`);
    if (onShowToast) onShowToast("success", "Downloaded", "Research brief saved as markdown file.");
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Word count & read time estimate
  const wordCount = (brief.summary || "").split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const totalChecklist = brief.verifyChecklist?.length || 0;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Top Action Bar */}
      <div className="bg-[#0c0c10] border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              SYNTHESIZED: {brief.createdAt ? new Date(brief.createdAt).toLocaleString() : "Just now"}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">~{readTimeMinutes} min read</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
            Synthesized Intelligence Brief
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>New Search</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-750"
            title="Copy as Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? "Copied!" : "Copy Markdown"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export (.md)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <section className="bg-[#0c0c10] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white tracking-tight">Executive Summary</h3>
          </div>

          {/* Tags */}
          {brief.tags && brief.tags.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1.5">
              {brief.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950/50 text-cyan-300 border border-cyan-500/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-zinc-200 text-sm sm:text-base leading-relaxed sm:leading-loose font-normal">
          {brief.summary}
        </p>

        {/* Mobile Tags */}
        {brief.tags && brief.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-800/80 sm:hidden flex flex-wrap gap-1.5">
            {brief.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950/50 text-cyan-300 border border-cyan-500/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Key Findings & Insights */}
      <section className="bg-[#0c0c10] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white tracking-tight">Key Findings & Corroborated Claims</h3>
              <p className="text-xs font-mono text-zinc-500">Structured extracted insights backed by origin attribution</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-zinc-900 text-cyan-400 border border-zinc-800">
            {brief.keyPoints?.length || 0} CLAIMS
          </span>
        </div>

        <div className="grid gap-4">
          {brief.keyPoints && brief.keyPoints.length > 0 ? (
            brief.keyPoints.map((kp, i) => {
              const domain = kp.source ? getDomain(kp.source) : "";
              return (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-[#08080a] border border-zinc-800/90 hover:border-cyan-500/30 transition-all space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 shrink-0 mt-0.5">
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 className="font-heading text-sm font-semibold text-zinc-100 leading-snug">
                      {kp.point}
                    </h4>
                  </div>

                  {/* Quoted Snippet */}
                  {kp.snippet && (
                    <div className="pl-4 border-l-2 border-cyan-400 bg-zinc-900/60 py-2.5 pr-3 rounded-r-lg my-2">
                      <div className="flex gap-2">
                        <Quote className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 opacity-80" />
                        <p className="text-xs font-mono text-zinc-300 italic leading-relaxed">
                          "{kp.snippet.trim()}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Source Attribution Link */}
                  {kp.source && (
                    <div className="flex items-center justify-end pt-1">
                      <a
                        href={kp.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 transition-colors"
                      >
                        <span className="text-[11px] text-zinc-500">Source:</span>
                        <span className="font-medium">{domain || kp.source}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs font-mono text-zinc-500 italic">No key findings extracted.</p>
          )}
        </div>
      </section>

      {/* Conflicts & Contradictions */}
      <section className="bg-[#0c0c10] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800/80 mb-5">
          <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white tracking-tight">Cross-Source Discrepancies & Divergences</h3>
            <p className="text-xs font-mono text-zinc-500">Conflicting numbers, disputed statements, or conflicting assessments</p>
          </div>
        </div>

        {brief.conflicts && brief.conflicts.length > 0 ? (
          <div className="space-y-3">
            {brief.conflicts.map((conflict, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-mono leading-relaxed">{conflict}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm font-mono">
              No conflicting assertions or divergent statistics identified across target sources.
            </p>
          </div>
        )}
      </section>

      {/* Verification Checklist */}
      <section className="bg-[#0c0c10] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white tracking-tight">Fact-Check Audit Checklist</h3>
              <p className="text-xs font-mono text-zinc-500">Unconfirmed assertions requiring secondary verification</p>
            </div>
          </div>
          {totalChecklist > 0 && (
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
              checkedCount === totalChecklist && totalChecklist > 0
                ? "bg-emerald-950 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                : "bg-zinc-900 text-zinc-400 border-zinc-800"
            }`}>
              {checkedCount} / {totalChecklist} AUDITED
            </span>
          )}
        </div>

        {brief.verifyChecklist && brief.verifyChecklist.length > 0 ? (
          <div className="space-y-2.5">
            {brief.verifyChecklist.map((item, i) => {
              const isChecked = !!checkedItems[i];
              return (
                <div
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? "bg-emerald-950/20 border-emerald-500/40 text-zinc-400"
                      : "bg-[#08080a] border-zinc-800 text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-zinc-500 hover:text-emerald-400 transition-colors"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-600" />
                    )}
                  </button>
                  <span className={`text-xs sm:text-sm font-mono leading-relaxed ${isChecked ? "line-through text-zinc-500" : ""}`}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs font-mono text-zinc-500 italic">No specific audit items flagged.</p>
        )}
      </section>

      {/* Sources Reviewed */}
      {brief.links && brief.links.length > 0 && (
        <section className="bg-[#0c0c10] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Parsed Target Sources ({brief.links.length})
          </h3>
          <div className="grid gap-2">
            {brief.links.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#08080a] border border-zinc-800 hover:border-cyan-500/40 text-xs font-mono text-zinc-300 hover:text-cyan-400 transition-all group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-5 h-5 rounded bg-zinc-900 text-zinc-400 flex items-center justify-center text-[10px] font-bold border border-zinc-800">
                    {i + 1}
                  </span>
                  <span className="truncate">{link}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
