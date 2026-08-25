import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Transaction } from "@mysten/sui/transactions";

export type SuiNetwork = "devnet" | "testnet" | "mainnet";

const DEFAULTS: Record<SuiNetwork, string> = {
  devnet: "https://fullnode.devnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
  mainnet: "https://fullnode.mainnet.sui.io:443",
};

export function createPowerChainSuiClient(network: SuiNetwork = "mainnet") {
  const envKey = `SUI_GRPC_URL_${network.toUpperCase()}`;
  return new SuiGrpcClient({
    network,
    baseUrl: process.env[envKey] ?? DEFAULTS[network],
  });
}

export async function fetchSuiBalance(owner: string, network: SuiNetwork = "mainnet") {
  const { balance } = await createPowerChainSuiClient(network).getBalance({ owner });
  return balance;
}

export function createSuiTransaction() {
  return new Transaction();
}

// Sui Foundation JSON-RPC is deprecated/disabled. This adapter deliberately uses
// the current gRPC client surface instead of the legacy JSON-RPC SuiClient path.
