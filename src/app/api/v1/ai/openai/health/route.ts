import { getOpenAIConfigSummary } from "@/api/openai/config";

export const runtime = "nodejs";
export async function GET() {
  return Response.json({ ok: true, openai: getOpenAIConfigSummary() }, { headers: { "cache-control": "no-store" } });
}
