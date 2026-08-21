import { serverEnv } from "@/env/server";
import { normalizeOptionalUrl } from "@/env/shared";
import { getOpenAIConfigSummary } from "@/api/openai/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrlInvalid = Boolean(rawSupabaseUrl?.trim() && !normalizeOptionalUrl(rawSupabaseUrl));

  return Response.json(
    {
      ok: true,
      integrations: {
        openai: getOpenAIConfigSummary(),
        supabase: {
          configured: Boolean(
            serverEnv.NEXT_PUBLIC_SUPABASE_URL && serverEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
          ),
          invalidPublicUrl: supabaseUrlInvalid,
        },
        helius: { configured: Boolean(serverEnv.HELIUS_API_KEY) },
        pyth: { configured: Boolean(serverEnv.PYTH_HERMES_URL) },
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
