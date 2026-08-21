import { z } from "zod";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  SOLANA_RPC_ENDPOINTS,
  SPL_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "@/constants/solana";
import { CANONICAL_PWRC_MINT } from "@/constants/assets";
import { optionalUrl, urlWithFallback } from "./shared";

const schema = z.object({
  NEXT_PUBLIC_POWERCHAIN_NETWORK: z.enum(["devnet", "mainnet"]).catch("devnet"),
  NEXT_PUBLIC_SOLANA_CLUSTER: z.enum(["devnet", "testnet", "mainnet-beta"]).catch("devnet"),
  NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL: urlWithFallback(SOLANA_RPC_ENDPOINTS.devnet),
  NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL: urlWithFallback(SOLANA_RPC_ENDPOINTS.testnet),
  NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL: urlWithFallback(SOLANA_RPC_ENDPOINTS["mainnet-beta"]),
  NEXT_PUBLIC_PWRC_MINT: z.string().trim().min(1).catch(CANONICAL_PWRC_MINT),
  NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID: z.string().trim().min(1).catch(SPL_TOKEN_PROGRAM_ID),
  NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID: z.string().trim().min(1).catch(TOKEN_2022_PROGRAM_ID),
  NEXT_PUBLIC_ASSOCIATED_TOKEN_PROGRAM_ID: z.string().trim().min(1).catch(ASSOCIATED_TOKEN_PROGRAM_ID),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.preprocess(
    (value) => typeof value === "string" && value.trim() ? value.trim() : undefined,
    z.string().optional(),
  ),
});

const rawClientEnv = {
  NEXT_PUBLIC_POWERCHAIN_NETWORK: process.env.NEXT_PUBLIC_POWERCHAIN_NETWORK,
  NEXT_PUBLIC_SOLANA_CLUSTER: process.env.NEXT_PUBLIC_SOLANA_CLUSTER,
  NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL,
  NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL,
  NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL,
  NEXT_PUBLIC_PWRC_MINT: process.env.NEXT_PUBLIC_PWRC_MINT,
  NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID: process.env.NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID,
  NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID: process.env.NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID,
  NEXT_PUBLIC_ASSOCIATED_TOKEN_PROGRAM_ID: process.env.NEXT_PUBLIC_ASSOCIATED_TOKEN_PROGRAM_ID,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

export type ClientEnv = z.infer<typeof schema>;

/**
 * Never throw from a client-imported module because of an optional integration.
 * This specifically prevents malformed Supabase placeholders from taking down
 * WalletProvider/AppProviders during Turbopack module evaluation.
 */
const parsedClientEnv = schema.safeParse(rawClientEnv);

export const clientEnv: ClientEnv = parsedClientEnv.success
  ? parsedClientEnv.data
  : schema.parse({
      NEXT_PUBLIC_POWERCHAIN_NETWORK: "devnet",
      NEXT_PUBLIC_SOLANA_CLUSTER: "devnet",
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined,
    });

export const clientIntegrationWarnings = {
  supabaseUrlInvalid: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && !clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  ),
};
