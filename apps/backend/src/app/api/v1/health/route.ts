import { isPrismaConfigured, isSupabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      ok: true,
      service: "powerchain-backend",
      version: "1.0.0",
      time: new Date().toISOString(),
      persistence: {
        prisma: isPrismaConfigured ? "configured" : "unconfigured",
        supabase: isSupabaseConfigured ? "configured" : "unconfigured",
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
