export const MODEL_PROFILES = [
  { id: "quality", label: "Quality", description: "Deep operational, market and infrastructure reasoning" },
  { id: "balanced", label: "Balanced", description: "Default GRIDLLM analysis for daily operations" },
  { id: "fast", label: "Fast", description: "Low-latency summaries, monitoring and triage" },
  { id: "private-lora", label: "Private LoRA", description: "Prefer your private OpenAI-compatible GRIDLLM endpoint" },
] as const;
export type ModelProfile = typeof MODEL_PROFILES[number]["id"];
