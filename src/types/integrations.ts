export type IntegrationHealth = {
  id: "openai" | "anthropic" | "google" | "deepseek" | "lora" | "supabase" | "helius" | "pyth" | "solana";
  configured: boolean;
  state: "ready" | "optional" | "invalid" | "disabled";
  detail?: string;
};
