import axios from "axios";
import { serverEnv } from "@/lib/config/env";

function rpcBase() {
  return serverEnv.HELIUS_RPC_NETWORK === "mainnet" ? "https://mainnet.helius-rpc.com" : "https://devnet.helius-rpc.com";
}

export function heliusRpcUrl() {
  if (!serverEnv.HELIUS_API_KEY) return null;
  return `${rpcBase()}/?api-key=${encodeURIComponent(serverEnv.HELIUS_API_KEY)}`;
}

export async function getEnhancedTransactions(address: string, limit = 10) {
  if (!serverEnv.HELIUS_API_KEY) throw new Error("HELIUS_NOT_CONFIGURED");
  const url = `https://api.helius.xyz/v0/addresses/${encodeURIComponent(address)}/transactions`;
  const response = await axios.get(url, {
    params: {
      "api-key": serverEnv.HELIUS_API_KEY,
      limit: Math.min(Math.max(limit, 1), 50),
    },
    timeout: 12_000,
  });
  return response.data;
}
