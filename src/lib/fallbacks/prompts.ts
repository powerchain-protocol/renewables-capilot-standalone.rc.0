export const FALLBACK_PROMPTS = [
  { id: "seed-ops", title: "Daily operations review", content: "Review today's generation, consumption, storage and operational anomalies.", tags: ["energy", "operations"] },
  { id: "seed-market", title: "Local market analysis", content: "Analyze local P2P energy liquidity, spreads and the best settlement window.", tags: ["market", "p2p"] },
] as const;
