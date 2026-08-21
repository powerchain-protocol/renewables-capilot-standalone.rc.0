import { getOpenAIClient } from "./client";
import { serverEnv } from "@/env/server";
import { AI_REQUEST_TIMEOUT_MS } from "@/constants/ai";
import { AppError, ERROR_CODES } from "@/utils/errors";

export type OpenAIProfile = "quality" | "balanced" | "fast";

export function getOpenAIModelForProfile(profile: OpenAIProfile) {
  if (profile === "quality") return serverEnv.OPENAI_MODEL_QUALITY;
  if (profile === "fast") return serverEnv.OPENAI_MODEL_FAST;
  return serverEnv.OPENAI_MODEL;
}

export async function createOpenAIResponse(input: string, model: string) {
  const client = getOpenAIClient();
  if (!client) throw new AppError(ERROR_CODES.providerUnavailable, "OpenAI is not configured", 503);

  return client.responses.create(
    { model, input },
    { signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS) },
  );
}

export async function createOpenAIResponseForProfile(input: string, profile: OpenAIProfile) {
  return createOpenAIResponse(input, getOpenAIModelForProfile(profile));
}
