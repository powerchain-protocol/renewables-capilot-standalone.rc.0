/** Canonical Solana network and program constants used by PowerChain. */
export const SOLANA_RPC_ENDPOINTS = {
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
  "mainnet-beta": "https://api.mainnet-beta.solana.com",
} as const;

export const HELIUS_RPC_ENDPOINTS = {
  devnet: "https://devnet.helius-rpc.com",
  "mainnet-beta": "https://mainnet.helius-rpc.com",
} as const;

export const HELIUS_API_BASE_URL = "https://api.helius.xyz";

// Original SPL Token Program.
export const SPL_TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

// SPL Token Extensions / Token-2022 Program.
export const TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

// Associated Token Account Program.
export const ASSOCIATED_TOKEN_PROGRAM_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

export const SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";
