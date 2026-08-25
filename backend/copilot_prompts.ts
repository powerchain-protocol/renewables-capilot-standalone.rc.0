export const COPILOT_PRODUCT_VERSION = "1.0.0" as const;

export type CopilotPromptCategory = "Operations" | "Assets" | "Energy" | "Treasury" | "Alerts" | "Reports" | "Risk";

export type CanonicalCopilotPrompt = {
  id: string;
  version: typeof COPILOT_PRODUCT_VERSION;
  category: CopilotPromptCategory;
  creditClass: "CHAT_STANDARD" | "CHAT_TOOL" | "ANALYSIS" | "AGENT_RUN" | "REPORT";
  title: string;
  description: string;
  prompt: string;
};

export const COPILOT_PROMPTS: readonly CanonicalCopilotPrompt[] = [
  {
    id: "operations.daily-brief",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "ANALYSIS",
    category: "Operations",
    title: "Daily operating brief",
    description: "Summarize what changed, what needs attention, and what should be reviewed next.",
    prompt: "Prepare my PowerChain daily operating brief. Summarize material changes, open decisions, active alerts, recent verified activity, stale evidence, and the highest-priority review items. Separate verified facts from inference.",
  },
  {
    id: "operations.change-review",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "ANALYSIS",
    category: "Operations",
    title: "Investigate recent changes",
    description: "Explain important operational changes and the evidence behind them.",
    prompt: "Investigate the most material operational changes in the current PowerChain context. Explain what changed, likely causes, confidence, supporting evidence, and what should be reviewed next.",
  },
  {
    id: "assets.performance",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "ANALYSIS",
    category: "Assets",
    title: "Analyze asset performance",
    description: "Review renewable asset health, output, and deviations.",
    prompt: "Analyze current renewable asset performance. Identify underperformance, anomalies, availability issues, forecast variance, and evidence gaps. Rank findings by operational impact.",
  },
  {
    id: "assets.compare",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "ANALYSIS",
    category: "Assets",
    title: "Compare underperforming assets",
    description: "Compare assets requiring attention using normalized evidence.",
    prompt: "Compare the renewable assets currently requiring attention. Normalize for capacity and available operating context, identify common patterns, and show which evidence supports each conclusion.",
  },
  {
    id: "energy.generation",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "ANALYSIS",
    category: "Energy",
    title: "Summarize energy performance",
    description: "Review verified generation, delivery and forecast variance.",
    prompt: "Summarize verified energy performance for the current period. Compare generation and delivery with available forecasts or baselines, identify material variance, and flag stale or unverified measurements.",
  },
  {
    id: "energy.delivery-evidence",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "CHAT_TOOL",
    category: "Energy",
    title: "Review delivery evidence",
    description: "Inspect meter, oracle and reconciliation evidence for energy delivery.",
    prompt: "Review the available energy delivery evidence. Check meter records, oracle attestations, reconciliation state, timestamps, provenance and gaps. Do not treat an AI conclusion as delivery proof.",
  },
  {
    id: "treasury.status",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "CHAT_TOOL",
    category: "Treasury",
    title: "Review treasury status",
    description: "Summarize verified balances, settlements and outstanding review items.",
    prompt: "Review the current treasury and settlement status using verified provider or chain state only. Summarize balances when available, recent settlements, pending intents, reconciliation issues and material risks.",
  },
  {
    id: "treasury.settlements",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "CHAT_TOOL",
    category: "Treasury",
    title: "Explain settlement activity",
    description: "Explain recent settlement events and verification status.",
    prompt: "Explain recent settlement activity. Distinguish submitted, confirmed and reconciled states, identify failures or delays, and link each material conclusion to the available evidence.",
  },
  {
    id: "alerts.prioritize",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "CHAT_TOOL",
    category: "Alerts",
    title: "Prioritize active alerts",
    description: "Rank alerts by urgency, confidence and operational impact.",
    prompt: "Prioritize the current PowerChain alerts. Group related signals, rank them by urgency and impact, identify evidence quality, and recommend the safest next review action for each high-priority item.",
  },
  {
    id: "reports.weekly",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "REPORT",
    category: "Reports",
    title: "Prepare weekly operating report",
    description: "Draft a concise evidence-backed operating report.",
    prompt: "Prepare a weekly PowerChain operating report covering renewable performance, energy, treasury, alerts, completed work, unresolved risk, evidence quality and decisions requiring human review.",
  },
  {
    id: "reports.incident",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "REPORT",
    category: "Reports",
    title: "Build incident evidence report",
    description: "Create an evidence-first incident summary without hiding uncertainty.",
    prompt: "Create an evidence-backed incident report for the most significant unresolved operational issue. Include chronology, affected resources, verified evidence, uncertainty, actions already taken, and recommended next steps.",
  },
  {
    id: "risk.portfolio-review",
    version: COPILOT_PRODUCT_VERSION,
    creditClass: "ANALYSIS",
    category: "Risk",
    title: "Run portfolio risk review",
    description: "Assess operational, data, market and execution risk across the portfolio.",
    prompt: "Run a portfolio risk review across operational, data-integrity, market, counterparty, treasury and execution risks. Separate measured facts from inference, identify stale evidence, and rank risks by severity and confidence.",
  },
] as const;

export function findCopilotPrompt(promptId: string) {
  return COPILOT_PROMPTS.find((prompt) => prompt.id === promptId);
}
