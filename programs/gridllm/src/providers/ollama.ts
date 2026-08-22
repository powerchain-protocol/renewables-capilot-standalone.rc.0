export const DEFAULT_OLLAMA_OPENAI_BASE_URL = "http://127.0.0.1:11434/v1";
export type OllamaConfig = { enabled: boolean; baseURL: string; model: string; apiKey: string };
export function ollamaConfig(env: Record<string, string | undefined>): OllamaConfig {
  return {
    enabled: env.OLLAMA_ENABLED?.trim().toLowerCase() === "true",
    baseURL: env.OLLAMA_BASE_URL?.trim() || DEFAULT_OLLAMA_OPENAI_BASE_URL,
    model: env.OLLAMA_MODEL?.trim() || "gpt-oss:20b",
    apiKey: env.OLLAMA_API_KEY?.trim() || "ollama",
  };
}
