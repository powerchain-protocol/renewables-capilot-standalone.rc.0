"use client";

import { apiRequest } from "@/api/client";
import { usePolling } from "@/hooks/use-polling";

type ConfigHealth = {
  ok: boolean;
  integrations: {
    openai: { configured:boolean; baseUrl:string; responsesUrl:string; chatgptCompatibilityUrl?:string };
    supabase:{configured:boolean; invalidPublicUrl:boolean};
    helius:{configured:boolean};
    pyth:{configured:boolean};
  };
};

async function loadConfig(signal: AbortSignal) {
  const result = await apiRequest<ConfigHealth>("/api/v1/config", { signal }, undefined, 8_000);
  if (!result.ok) throw new Error(result.error.message);
  return result.data;
}

export function useConfigHealthState() {
  return usePolling(loadConfig, 60_000);
}

export function useConfigHealth() {
  return useConfigHealthState().data;
}
