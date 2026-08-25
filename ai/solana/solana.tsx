import { createSolanaRpc, type Address } from "@solana/kit";

export type SolanaNetwork = "devnet" | "mainnet";

export type SolanaConfig = {
  network: SolanaNetwork;
  rpcUrl: string;
};

export function getSolanaConfig(network: SolanaNetwork = (process.env.SOLANA_NETWORK as SolanaNetwork) || "devnet"): SolanaConfig {
  const key = network === "mainnet" ? "HELIUS_RPC_URL_MAINNET" : "HELIUS_RPC_URL_DEVNET";
  const rpcUrl = process.env[key] || (network === "mainnet"
    ? "https://api.mainnet-beta.solana.com"
    : "https://api.devnet.solana.com");
  return { network, rpcUrl };
}

export function createPowerChainSolanaRpc(network?: SolanaNetwork) {
  const config = getSolanaConfig(network);
  return createSolanaRpc(config.rpcUrl);
}

export async function fetchLamportBalance(address: string, network?: SolanaNetwork): Promise<bigint> {
  const rpc = createPowerChainSolanaRpc(network);
  const response = await rpc.getBalance(address as Address).send();
  return response.value;
}

export async function fetchLatestBlockhash(network?: SolanaNetwork) {
  return createPowerChainSolanaRpc(network).getLatestBlockhash().send();
}
