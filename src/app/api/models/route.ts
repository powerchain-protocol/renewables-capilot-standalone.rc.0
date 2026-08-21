import { MODEL_PROFILES } from "@/lib/ai/model-registry";
import { providerConfigured, providerModel, type AIProviderName } from "@/lib/ai/providers";
import { AI_PROVIDER_LABELS } from "@/lib/ai/settings";

const providers: AIProviderName[] = ["openai", "anthropic", "google", "deepseek", "lora"];

export async function GET() {
  return Response.json({
    profiles: MODEL_PROFILES,
    providers: providers.map((id) => ({
      id,
      label: AI_PROVIDER_LABELS[id],
      configured: providerConfigured(id),
      models: {
        quality: providerModel(id, "quality"),
        balanced: providerModel(id, "balanced"),
        fast: providerModel(id, "fast"),
      },
    })),
  }, { headers: { "cache-control": "no-store" } });
}
