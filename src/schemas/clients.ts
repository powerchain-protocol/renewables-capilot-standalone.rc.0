import { z } from "zod";
export const clientIdSchema = z.enum(["openai","anthropic","google","deepseek","lora","helius","pyth","supabase"]);
