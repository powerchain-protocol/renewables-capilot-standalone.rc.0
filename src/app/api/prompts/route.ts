import { createServerSupabaseClient } from "@/lib/supabase/server";
import { savedPromptSchema } from "@/lib/schemas/prompts";
import { FALLBACK_PROMPTS } from "@/lib/fallbacks/prompts";

export async function GET() {
  const db = await createServerSupabaseClient();
  if (!db) return Response.json({ prompts: FALLBACK_PROMPTS, source: "fallback" });
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return Response.json({ prompts: FALLBACK_PROMPTS, source: "anonymous" });
  const { data, error } = await db.from("saved_prompts").select("id,title,content,tags,created_at").order("created_at", { ascending: false }).limit(50);
  if (error) return Response.json({ prompts: FALLBACK_PROMPTS, source: "fallback", warning: error.message });
  return Response.json({ prompts: data, source: "supabase" });
}

export async function POST(request: Request) {
  const parsed = savedPromptSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "INVALID_PROMPT" }, { status: 400 });
  const db = await createServerSupabaseClient();
  if (!db) return Response.json({ error: "SUPABASE_NOT_CONFIGURED", localFallbackAllowed: true }, { status: 503 });
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return Response.json({ error: "AUTH_REQUIRED", localFallbackAllowed: true }, { status: 401 });
  const { data, error } = await db.from("saved_prompts").insert({ ...parsed.data, user_id: auth.user.id }).select().single();
  if (error) return Response.json({ error: "SAVE_PROMPT_FAILED", message: error.message }, { status: 500 });
  return Response.json({ prompt: data }, { status: 201 });
}
