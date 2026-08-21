import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_POWERCHAIN_NETWORK: z.enum(["devnet", "mainnet"]).default("devnet"),
  NEXT_PUBLIC_SOLANA_CLUSTER: z.enum(["devnet", "testnet", "mainnet-beta"]).default("devnet"),
  NEXT_PUBLIC_PWRC_MINT: z.string().default("PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc"),
  NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID: z.string().default("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
});

export const clientEnv = schema.parse({
  NEXT_PUBLIC_POWERCHAIN_NETWORK: process.env.NEXT_PUBLIC_POWERCHAIN_NETWORK,
  NEXT_PUBLIC_SOLANA_CLUSTER: process.env.NEXT_PUBLIC_SOLANA_CLUSTER,
  NEXT_PUBLIC_PWRC_MINT: process.env.NEXT_PUBLIC_PWRC_MINT,
  NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID: process.env.NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});
