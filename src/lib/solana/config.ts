import { clusterApiUrl, type Cluster } from "@solana/web3.js";
import { clientEnv } from "@/env/client";
import { PROGRAM_IDS, PWRC_MINT, TOKEN_2022_PROGRAM_ID } from "@/lib/constants";
export const SOLANA_CLUSTER = clientEnv.NEXT_PUBLIC_SOLANA_CLUSTER as Cluster;
export const PUBLIC_SOLANA_RPC = clusterApiUrl(SOLANA_CLUSTER);
export const solanaConfig = { cluster: SOLANA_CLUSTER, publicRpc: PUBLIC_SOLANA_RPC, pwrcMint: PWRC_MINT, token2022ProgramId: TOKEN_2022_PROGRAM_ID, programs: PROGRAM_IDS } as const;
