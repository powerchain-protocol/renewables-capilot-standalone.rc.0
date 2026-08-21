import { streamText, type LanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { serverEnv } from "@/lib/config/env";
import { GRIDLLM_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import type { ModelProfile } from "@/lib/ai/model-registry";
import type { AIProviderPreference } from "@/lib/ai/settings";

export type AIProviderName = Exclude<AIProviderPreference, "auto">;
export type ChatInput = {
  message: string;
  mode: string;
  modelProfile: ModelProfile;
  providerPreference: AIProviderPreference;
  fallbackEnabled: boolean;
  context?: Record<string, unknown>;
};

type ProviderResult = { provider: AIProviderName; model: string; stream: ReadableStream<Uint8Array> };

function userInput(input: ChatInput) {
  return `Mode: ${input.mode}\nContext: ${JSON.stringify(input.context ?? {})}\n\n${input.message}`;
}

function profileModel(profile: ModelProfile, quality: string, balanced: string, fast: string) {
  if (profile === "quality") return quality;
  if (profile === "fast") return fast;
  return balanced;
}

export function providerConfigured(provider: AIProviderName) {
  switch (provider) {
    case "openai": return Boolean(serverEnv.OPENAI_API_KEY);
    case "anthropic": return Boolean(serverEnv.ANTHROPIC_API_KEY);
    case "google": return Boolean(serverEnv.GOOGLE_API_KEY);
    case "deepseek": return Boolean(serverEnv.DEEPSEEK_API_KEY);
    case "lora": return Boolean(serverEnv.LORA_BASE_URL && serverEnv.LORA_API_KEY);
  }
}

export function providerModel(provider: AIProviderName, profile: ModelProfile) {
  switch (provider) {
    case "openai": return profileModel(profile, serverEnv.OPENAI_MODEL_QUALITY, serverEnv.OPENAI_MODEL, serverEnv.OPENAI_MODEL_FAST);
    case "anthropic": return profileModel(profile, serverEnv.ANTHROPIC_MODEL_QUALITY, serverEnv.ANTHROPIC_MODEL, serverEnv.ANTHROPIC_MODEL_FAST);
    case "google": return profileModel(profile, serverEnv.GOOGLE_MODEL_QUALITY, serverEnv.GOOGLE_MODEL, serverEnv.GOOGLE_MODEL_FAST);
    case "deepseek": return profileModel(profile, serverEnv.DEEPSEEK_MODEL_QUALITY, serverEnv.DEEPSEEK_MODEL, serverEnv.DEEPSEEK_MODEL_FAST);
    case "lora": return serverEnv.LORA_MODEL;
  }
}

function languageModel(provider: AIProviderName, modelId: string): LanguageModel {
  switch (provider) {
    case "openai": return createOpenAI({ apiKey: serverEnv.OPENAI_API_KEY })(modelId);
    case "anthropic": return createAnthropic({ apiKey: serverEnv.ANTHROPIC_API_KEY })(modelId);
    case "google": return createGoogleGenerativeAI({ apiKey: serverEnv.GOOGLE_API_KEY })(modelId);
    case "deepseek": return createDeepSeek({ apiKey: serverEnv.DEEPSEEK_API_KEY })(modelId);
    case "lora": {
      const compatible = createOpenAICompatible({
        name: "gridllm-lora",
        apiKey: serverEnv.LORA_API_KEY,
        baseURL: serverEnv.LORA_BASE_URL!,
        includeUsage: true,
      });
      return compatible(modelId);
    }
  }
}

function configuredOrder(): AIProviderName[] {
  const valid = new Set<AIProviderName>(["openai", "anthropic", "google", "deepseek", "lora"]);
  const parsed = serverEnv.AI_PROVIDER_ORDER.split(",").map(v => v.trim()).filter((v): v is AIProviderName => valid.has(v as AIProviderName));
  return [...new Set(parsed.length ? parsed : ["openai", "anthropic", "google", "deepseek", "lora"])] as AIProviderName[];
}

function attemptOrder(input: ChatInput): AIProviderName[] {
  const base = configuredOrder();
  const preferred: AIProviderName | null = input.modelProfile === "private-lora"
    ? "lora"
    : input.providerPreference === "auto" ? null : input.providerPreference;
  if (!preferred) return base;
  if (!input.fallbackEnabled) return [preferred];
  return [preferred, ...base.filter(provider => provider !== preferred)];
}

async function openProviderStream(provider: AIProviderName, input: ChatInput): Promise<ProviderResult> {
  if (!providerConfigured(provider)) throw new Error(`${provider.toUpperCase()}_NOT_CONFIGURED`);
  const model = providerModel(provider, input.modelProfile);
  const result = streamText({
    model: languageModel(provider, model),
    system: GRIDLLM_SYSTEM_PROMPT,
    prompt: userInput(input),
  });

  // Pull the first token before returning so provider/auth failures can fall back
  // instead of failing after HTTP headers have already been sent to the browser.
  const iterator = result.textStream[Symbol.asyncIterator]();
  const first = await iterator.next();
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done && first.value) controller.enqueue(encoder.encode(first.value));
        for (;;) {
          const next = await iterator.next();
          if (next.done) break;
          if (next.value) controller.enqueue(encoder.encode(next.value));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel() {
      await iterator.return?.();
    },
  });
  return { provider, model, stream };
}

export async function createAIStream(input: ChatInput) {
  const errors: string[] = [];
  for (const provider of attemptOrder(input)) {
    try { return await openProviderStream(provider, input); }
    catch (error) { errors.push(error instanceof Error ? error.message : `${provider} failed`); }
  }
  throw new Error(errors.join(" | ") || "NO_AI_PROVIDER_CONFIGURED");
}
