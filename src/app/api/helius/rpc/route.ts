import { heliusRpcSchema } from "@/lib/schemas/solana";
import { solanaRpcWithFallback } from "@/lib/solana/rpc";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const parsed = heliusRpcSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "INVALID_RPC_REQUEST" }, { status: 400 });
  try { const response = await solanaRpcWithFallback(parsed.data.method, parsed.data.params); return Response.json(response); }
  catch (error) { return Response.json({ error: "SOLANA_RPC_FAILED", message: error instanceof Error ? error.message : "RPC failed" }, { status: 502 }); }
}
