import { chatRequestSchema } from "@/lib/schemas/chat";
import { createAIStream } from "@/lib/ai/providers";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const parsed = chatRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "INVALID_CHAT_REQUEST", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const result = await createAIStream(parsed.data);
    return new Response(result.stream, { headers: { "content-type": "text/plain; charset=utf-8", "x-gridllm-provider": result.provider, "x-gridllm-model": result.model, "cache-control": "no-store" } });
  } catch (error) {
    return Response.json({ error: "AI_PROVIDER_UNAVAILABLE", message: error instanceof Error ? error.message : "AI provider unavailable" }, { status: 503 });
  }
}
