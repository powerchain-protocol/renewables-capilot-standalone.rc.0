import { serverEnv } from "@/env/server";
import { solanaConfig } from "@/lib/solana/config";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    cluster: solanaConfig.cluster,
    publicRpc: solanaConfig.publicRpc,
    rpc: solanaConfig.rpc,
    mint: {
      pwrc: solanaConfig.pwrcMint,
    },
    programs: {
      splToken: solanaConfig.splTokenProgramId,
      token2022: solanaConfig.token2022ProgramId,
      associatedToken: solanaConfig.associatedTokenProgramId,
      powerchain: solanaConfig.programs,
    },
    helius: {
      configured: Boolean(serverEnv.HELIUS_API_KEY),
      network: serverEnv.HELIUS_RPC_NETWORK,
      rpcBase: serverEnv.HELIUS_RPC_NETWORK === "mainnet" || serverEnv.HELIUS_RPC_NETWORK === "mainnet-beta"
        ? serverEnv.HELIUS_MAINNET_RPC_URL
        : serverEnv.HELIUS_DEVNET_RPC_URL,
      apiBase: serverEnv.HELIUS_API_BASE_URL,
    },
  }, { headers: { "cache-control": "no-store" } });
}
