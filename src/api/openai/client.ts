import OpenAI from "openai";
import { serverEnv } from "@/env/server";

let singleton: OpenAI | null = null;

export function getOpenAIClient() {
  if (!serverEnv.OPENAI_API_KEY) return null;
  singleton ??= new OpenAI({ apiKey: serverEnv.OPENAI_API_KEY, baseURL: serverEnv.OPENAI_BASE_URL });
  return singleton;
}
