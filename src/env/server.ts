import { z } from "zod";

const optionalString = z.preprocess((v) => v === "" ? undefined : v, z.string().optional());
const optionalUrl = z.preprocess((v) => v === "" ? undefined : v, z.string().url().optional());

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: optionalString,
  OPENAI_API_KEY: optionalString,
  OPENAI_MODEL_QUALITY: z.string().default("gpt-5.6-sol"),
  OPENAI_MODEL: z.string().default("gpt-5.6-terra"),
  OPENAI_MODEL_FAST: z.string().default("gpt-5.6-luna"),
  ANTHROPIC_API_KEY: optionalString,
  ANTHROPIC_MODEL_QUALITY: z.string().default("claude-opus-5"),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-5"),
  ANTHROPIC_MODEL_FAST: z.string().default("claude-haiku-4-5-20251001"),
  GOOGLE_API_KEY: optionalString,
  GOOGLE_MODEL_QUALITY: z.string().default("gemini-3.7-flash"),
  GOOGLE_MODEL: z.string().default("gemini-3.6-flash"),
  GOOGLE_MODEL_FAST: z.string().default("gemini-3.5-flash-lite"),
  DEEPSEEK_API_KEY: optionalString,
  DEEPSEEK_MODEL_QUALITY: z.string().default("deepseek-reasoner"),
  DEEPSEEK_MODEL: z.string().default("deepseek-chat"),
  DEEPSEEK_MODEL_FAST: z.string().default("deepseek-chat"),
  AI_PROVIDER_ORDER: z.string().default("openai,anthropic,google,deepseek,lora"),
  LORA_BASE_URL: optionalUrl,
  LORA_API_KEY: optionalString,
  LORA_MODEL: z.string().default("gridllm-renewables-lora"),
  HELIUS_API_KEY: optionalString,
  HELIUS_RPC_NETWORK: z.enum(["mainnet", "devnet"]).default("devnet"),
  PYTH_HERMES_URL: optionalUrl,
  PYTH_API_KEY: optionalString,
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  UPLOAD_MAX_BYTES: z.coerce.number().int().positive().default(10_485_760),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const serverEnv: ServerEnv = serverEnvSchema.parse(process.env);
