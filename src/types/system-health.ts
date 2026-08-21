export type SystemHealth = {
  ok: boolean;
  services: {
    openai: boolean;
    anthropic: boolean;
    google: boolean;
    deepseek: boolean;
    lora: boolean;
    helius: boolean;
    pyth: boolean;
    supabase: boolean;
  };
  solana: {
    cluster: "devnet" | "testnet" | "mainnet-beta";
    publicRpc: string;
    heliusNetwork: "devnet" | "mainnet-beta";
    heliusConfigured: boolean;
  };
  aiConfiguredCount: number;
  programsConfigured: Record<string, boolean>;
  timestamp?: string;
};
