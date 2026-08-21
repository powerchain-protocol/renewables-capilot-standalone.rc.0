"use client";

import { useEffect, useState } from "react";

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
};

export function useSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => void fetch("/api/health", { cache: "no-store" })
      .then((response) => response.json())
      .then((value) => { if (active) setHealth(value); })
      .catch(() => { if (active) setHealth(null); });

    load();
    const id = setInterval(load, 30_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return health;
}
