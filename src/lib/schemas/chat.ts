import { z } from "zod";
export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(12000),
  mode: z.enum(["analyze", "forecast", "compare", "optimize", "audit", "build"]).default("analyze"),
  modelProfile: z.enum(["quality", "balanced", "fast", "private-lora"]).default("balanced"),
  providerPreference: z.enum(["auto", "openai", "anthropic", "google", "deepseek", "lora"]).default("auto"),
  fallbackEnabled: z.boolean().default(true),
  context: z.record(z.string(), z.unknown()).optional(),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;
