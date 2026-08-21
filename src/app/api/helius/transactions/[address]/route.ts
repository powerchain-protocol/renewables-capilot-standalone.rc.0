import { publicKeySchema } from "@/lib/schemas/solana";
import { getEnhancedTransactions } from "@/lib/solana/helius";
export async function GET(_: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  if (!publicKeySchema.safeParse(address).success) return Response.json({ error: "INVALID_SOLANA_ADDRESS" }, { status: 400 });
  try { return Response.json({ transactions: await getEnhancedTransactions(address, 12) }); }
  catch (error) { return Response.json({ error: "HELIUS_ENHANCED_FAILED", message: error instanceof Error ? error.message : "Helius failed" }, { status: 502 }); }
}
