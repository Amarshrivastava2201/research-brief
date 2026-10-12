export function getDomain(urlString) {
  try {
    const url = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return urlString;
  }
}

export function isValidUrl(string) {
  try {
    const url = new URL(string.trim().startsWith("http") ? string.trim() : `https://${string.trim()}`);
    return Boolean(url.hostname && url.hostname.includes("."));
  } catch {
    return false;
  }
}

export function cleanUrl(url) {
  let trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = "https://" + trimmed;
  }
  return trimmed;
}

export const SAMPLE_TOPICS = [
  {
    title: "AI & Autonomous Agents",
    icon: "Bot",
    links: [
      "https://en.wikipedia.org/wiki/Artificial_intelligence",
      "https://en.wikipedia.org/wiki/Intelligent_agent",
      "https://en.wikipedia.org/wiki/Reinforcement_learning"
    ]
  },
  {
    title: "Quantum Computing",
    icon: "Cpu",
    links: [
      "https://en.wikipedia.org/wiki/Quantum_computing",
      "https://en.wikipedia.org/wiki/Qubit",
      "https://en.wikipedia.org/wiki/Quantum_supremacy"
    ]
  },
  {
    title: "Clean Energy & Fusion",
    icon: "Zap",
    links: [
      "https://en.wikipedia.org/wiki/Nuclear_fusion",
      "https://en.wikipedia.org/wiki/Fusion_power",
      "https://en.wikipedia.org/wiki/Tokamak"
    ]
  }
];
