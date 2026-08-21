import { serverEnv } from "@/lib/config/env";
import { PROGRAM_IDS } from "@/lib/constants";
import { providerConfigured } from "@/lib/ai/providers";

export async function GET() {
  const ai = {
    openai: providerConfigured("openai"),
    anthropic: providerConfigured("anthropic"),
    google: providerConfigured("google"),
    deepseek: providerConfigured("deepseek"),
    lora: providerConfigured("lora"),
  };
  return Response.json({
    ok: true,
    services: {
      ...ai,
      helius: Boolean(serverEnv.HELIUS_API_KEY),
      pyth: Boolean(serverEnv.PYTH_HERMES_URL && serverEnv.PYTH_API_KEY),
      supabase: Boolean(serverEnv.NEXT_PUBLIC_SUPABASE_URL && serverEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    },
    aiConfiguredCount: Object.values(ai).filter(Boolean).length,
    programsConfigured: Object.fromEntries(Object.entries(PROGRAM_IDS).map(([k,v]) => [k, Boolean(v)])),
    timestamp: new Date().toISOString(),
  }, { headers: { "cache-control": "no-store" } });
}
