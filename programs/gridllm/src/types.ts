export type GridllmProviderId = "openai" | "anthropic" | "google" | "deepseek" | "lora" | "ollama";
export type GridllmMode = "analyze" | "forecast" | "compare" | "optimize" | "audit" | "build";
export type EvidenceState = "verified" | "partial" | "unavailable" | "demo";
export type ExecutionReviewState = "draft" | "policy-required" | "simulation-required" | "ready" | "stale" | "rejected";
export type AssistantTokenBinding = {
  assistantId: string;
  chain: "solana" | "sui";
  assetAddress: string | null;
  standard: "token-2022" | "sui-coin" | "none";
  purpose: "identity" | "access" | "credits";
  executableAuthority: false;
};
export type GridllmProvenance = {
  provider: GridllmProviderId;
  model: string;
  dataMode: "live" | "mock" | "tba";
  generatedAt: string;
  confidence: number;
  evidenceState: EvidenceState;
  sourceIds: string[];
};
