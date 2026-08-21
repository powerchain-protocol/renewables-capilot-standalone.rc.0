import { HELIUS_RPC_ENDPOINTS, SOLANA_RPC_ENDPOINTS } from "./solana";

export const POWERCHAIN_NETWORKS = ["devnet", "mainnet"] as const;
export const SOLANA_CLUSTERS = ["devnet", "testnet", "mainnet-beta"] as const;
export const DEFAULT_SOLANA_COMMITMENT = "confirmed" as const;
export { SOLANA_RPC_ENDPOINTS, HELIUS_RPC_ENDPOINTS };
