import type { AIProvider, AIProviderId, AIRequest, AIResult } from "./generic/types";
import { OpenAIProvider } from "./generic/openai";
import { AnthropicProvider } from "./generic/anthropic";
import { GeminiProvider } from "./generic/gemini";
import { DeepSeekProvider } from "./generic/deepseek";
import { OllamaProvider } from "./generic/ollama";

export type ProviderFactory = () => AIProvider;

const factories: Partial<Record<AIProviderId, ProviderFactory>> = {
  openai: () => new OpenAIProvider(),
  anthropic: () => new AnthropicProvider(),
  gemini: () => new GeminiProvider(),
  deepseek: () => new DeepSeekProvider(),
  ollama: () => new OllamaProvider(),
};

export function registerAIProvider(id: AIProviderId, factory: ProviderFactory): void {
  factories[id] = factory;
}

export function getAIProvider(id: AIProviderId): AIProvider {
  const factory = factories[id];
  if (!factory) throw new Error(`AI provider not registered: ${id}`);
  return factory();
}

export async function runAI(
  request: AIRequest,
  preferred: AIProviderId[] = ["openai", "anthropic", "gemini", "deepseek", "ollama"],
): Promise<AIResult> {
  const errors: string[] = [];
  for (const id of preferred) {
    const factory = factories[id];
    if (!factory) continue;
    const provider = factory();
    try {
      const health = await provider.health();
      if (!health.ok) {
        errors.push(`${id}: ${health.detail ?? "unhealthy"}`);
        continue;
      }
      return await provider.complete(request);
    } catch (error) {
      errors.push(`${id}: ${String(error)}`);
    }
  }
  throw new Error(`No AI provider completed the request. ${errors.join(" | ")}`);
}

export async function getAIProviderHealth() {
  return Promise.all(
    Object.entries(factories).map(async ([id, factory]) => {
      if (!factory) return { provider: id, ok: false };
      return factory().health();
    }),
  );
}
