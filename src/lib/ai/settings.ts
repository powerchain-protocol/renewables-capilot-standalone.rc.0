import type { ModelProfile } from "@/lib/ai/model-registry";

export const AI_PROVIDER_IDS = ["auto", "openai", "anthropic", "google", "deepseek", "lora"] as const;
export type AIProviderPreference = (typeof AI_PROVIDER_IDS)[number];

export type AISettings = {
  provider: AIProviderPreference;
  modelProfile: ModelProfile;
  fallbackEnabled: boolean;
};

export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: "auto",
  modelProfile: "balanced",
  fallbackEnabled: true,
};

export const AI_PROVIDER_LABELS: Record<AIProviderPreference, string> = {
  auto: "Auto route",
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google Gemini",
  deepseek: "DeepSeek",
  lora: "Private LoRA",
};
