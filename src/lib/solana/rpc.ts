import { serverEnv } from "@/lib/config/env";
import { heliusNetwork, heliusRpcUrl } from "@/lib/solana/helius";

type RpcResponse<T> = { result?: T; error?: { message?: string } };

async function jsonRpc<T>(url: string, method: string, params: unknown[]) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: crypto.randomUUID(), method, params }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`RPC_HTTP_${response.status}`);
  const body = await response.json() as RpcResponse<T>;
  if (body.error) throw new Error(body.error.message ?? "RPC_ERROR");
  return body.result as T;
}

function publicFallbackRpc() {
  const network = heliusNetwork();
  return network === "mainnet-beta" ? serverEnv.SOLANA_MAINNET_RPC_URL : serverEnv.SOLANA_DEVNET_RPC_URL;
}

export async function solanaRpcWithFallback<T>(method: string, params: unknown[] = []) {
  const helius = heliusRpcUrl();
  if (helius) {
    try {
      return { result: await jsonRpc<T>(helius, method, params), source: "helius" as const, network: heliusNetwork() };
    } catch {
      // Fail over only for allowlisted read-style JSON-RPC methods handled by the API schema.
    }
  }

  return {
    result: await jsonRpc<T>(publicFallbackRpc(), method, params),
    source: "public-rpc" as const,
    network: heliusNetwork(),
  };
}
