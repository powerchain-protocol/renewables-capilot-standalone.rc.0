import { z } from "zod";
import { AI_MAX_PROMPT_CHARS } from "@/constants/ai";

export const openAIResponseRequestSchema = z.object({
  input: z.string().trim().min(1).max(AI_MAX_PROMPT_CHARS),
  profile: z.enum(["quality", "balanced", "fast"]).default("balanced"),
});

export type OpenAIResponseRequest = z.infer<typeof openAIResponseRequestSchema>;
