import { serverEnv } from "@/env/server";

export function getOpenAIConfigSummary() {
  return {
    configured: Boolean(serverEnv.OPENAI_API_KEY),
    baseUrl: serverEnv.OPENAI_BASE_URL,
    responsesUrl: serverEnv.OPENAI_RESPONSES_URL,
    chatgptCompatibilityUrl: serverEnv.CHATGPT_API_URL,
    models: { quality: serverEnv.OPENAI_MODEL_QUALITY, balanced: serverEnv.OPENAI_MODEL, fast: serverEnv.OPENAI_MODEL_FAST },
  };
}
