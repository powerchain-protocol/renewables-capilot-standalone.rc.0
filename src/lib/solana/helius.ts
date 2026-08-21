import axios from "axios";
import { serverEnv } from "@/lib/config/env";

function rpcBase() {
  return serverEnv.HELIUS_RPC_NETWORK === "mainnet" || serverEnv.HELIUS_RPC_NETWORK === "mainnet-beta"
    ? serverEnv.HELIUS_MAINNET_RPC_URL
    : serverEnv.HELIUS_DEVNET_RPC_URL;
}

export function heliusRpcUrl() {
  if (!serverEnv.HELIUS_API_KEY) return null;
  return `${rpcBase().replace(/\/$/, "")}/?api-key=${encodeURIComponent(serverEnv.HELIUS_API_KEY)}`;
}

export function heliusNetwork() {
  return serverEnv.HELIUS_RPC_NETWORK === "mainnet" || serverEnv.HELIUS_RPC_NETWORK === "mainnet-beta"
    ? "mainnet-beta"
    : "devnet";
}

export async function getEnhancedTransactions(address: string, limit = 10) {
  if (!serverEnv.HELIUS_API_KEY) throw new Error("HELIUS_NOT_CONFIGURED");
  const base = serverEnv.HELIUS_API_BASE_URL.replace(/\/$/, "");
  const url = `${base}/v0/addresses/${encodeURIComponent(address)}/transactions`;
  const response = await axios.get(url, {
    params: {
      "api-key": serverEnv.HELIUS_API_KEY,
      limit: Math.min(Math.max(limit, 1), 50),
    },
    timeout: 12_000,
  });
  return response.data;
}
