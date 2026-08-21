import type { Cluster } from "@solana/web3.js";
import { clientEnv } from "@/env/client";
import { PROGRAM_IDS, PWRC_MINT } from "@/lib/constants";

export const SOLANA_CLUSTER = clientEnv.NEXT_PUBLIC_SOLANA_CLUSTER as Cluster;

export const PUBLIC_SOLANA_RPC = (() => {
  switch (SOLANA_CLUSTER) {
    case "mainnet-beta":
      return clientEnv.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL;
    case "testnet":
      return clientEnv.NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL;
    default:
      return clientEnv.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL;
  }
})();

export const solanaConfig = {
  cluster: SOLANA_CLUSTER,
  publicRpc: PUBLIC_SOLANA_RPC,
  rpc: {
    devnet: clientEnv.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL,
    testnet: clientEnv.NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL,
    mainnetBeta: clientEnv.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL,
  },
  pwrcMint: PWRC_MINT,
  splTokenProgramId: clientEnv.NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID,
  token2022ProgramId: clientEnv.NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID,
  associatedTokenProgramId: clientEnv.NEXT_PUBLIC_ASSOCIATED_TOKEN_PROGRAM_ID,
  programs: PROGRAM_IDS,
} as const;
