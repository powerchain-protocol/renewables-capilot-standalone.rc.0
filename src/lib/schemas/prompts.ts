import { z } from "zod";
export const savedPromptSchema = z.object({ id: z.string().uuid().optional(), title: z.string().trim().min(1).max(120), content: z.string().trim().min(1).max(12000), tags: z.array(z.string().max(32)).max(12).default([]) });
export type SavedPromptInput = z.infer<typeof savedPromptSchema>;
