export function formatBriefToMarkdown(brief) {
  if (!brief) return "";

  const date = brief.createdAt ? new Date(brief.createdAt).toLocaleString() : new Date().toLocaleString();
  
  let md = `# Research Brief\n\n`;
  md += `> **Generated on:** ${date}  \n`;
  if (brief.tags && brief.tags.length > 0) {
    md += `> **Tags:** ${brief.tags.join(", ")}  \n`;
  }
  md += `\n---\n\n`;

  md += `## 1. Executive Summary\n\n`;
  md += `${brief.summary || "No summary provided."}\n\n`;

  md += `## 2. Key Insights & Findings\n\n`;
  if (brief.keyPoints && brief.keyPoints.length > 0) {
    brief.keyPoints.forEach((kp, idx) => {
      md += `### ${idx + 1}. ${kp.point}\n`;
      if (kp.source) md += `- **Source:** ${kp.source}\n`;
      if (kp.snippet) md += `> "${kp.snippet.trim()}"\n`;
      md += `\n`;
    });
  } else {
    md += `_No specific key points identified._\n\n`;
  }

  md += `## 3. Conflicting Claims & Contradictions\n\n`;
  if (brief.conflicts && brief.conflicts.length > 0) {
    brief.conflicts.forEach(c => {
      md += `- ⚠️ ${c}\n`;
    });
    md += `\n`;
  } else {
    md += `_No conflicting claims or contradictions detected across sources._\n\n`;
  }

  md += `## 4. Verification Checklist\n\n`;
  if (brief.verifyChecklist && brief.verifyChecklist.length > 0) {
    brief.verifyChecklist.forEach(item => {
      md += `- [ ] ${item}\n`;
    });
    md += `\n`;
  } else {
    md += `_No immediate verification items required._\n\n`;
  }

  md += `## 5. Sources & References\n\n`;
  if (brief.links && brief.links.length > 0) {
    brief.links.forEach((l, idx) => {
      md += `${idx + 1}. [${l}](${l})\n`;
    });
    md += `\n`;
  }

  md += `---\n*Report generated via ResearchBrief AI*\n`;
  return md;
}

export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  } else {
    // Fallback for non-secure contexts
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      textArea.remove();
      return true;
    } catch {
      textArea.remove();
      return false;
    }
  }
}

export function downloadMarkdown(content, filename = "research-brief.md") {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
