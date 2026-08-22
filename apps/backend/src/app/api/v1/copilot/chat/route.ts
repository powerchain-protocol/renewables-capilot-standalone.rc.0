import { COPILOT_URL } from "@/lib/urls";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "x-gridllm-provider",
  "x-gridllm-model",
  "x-gridllm-chat-id",
  "x-gridllm-chat-title",
  "x-gridllm-trace-id",
  "x-gridllm-generated-at",
  "x-gridllm-confidence",
  "x-gridllm-evidence-state",
  "x-gridllm-data-mode",
  "x-gridllm-source-ids",
];

export async function POST(request: Request) {
  const copilot = COPILOT_URL;
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  const upstream = await fetch(`${copilot}/api/v1/chat`, {
    method: "POST",
    headers: {
      "content-type": request.headers.get("content-type") || "application/json",
      accept: request.headers.get("accept") || "text/plain, application/json",
      cookie: request.headers.get("cookie") || "",
      "x-request-id": requestId,
    },
    body: await request.text(),
    cache: "no-store",
  }).catch(() => null);

  if (!upstream) {
    return Response.json(
      { error: "COPILOT_UNAVAILABLE", message: "Copilot runtime is unavailable.", requestId },
      { status: 503, headers: { "x-request-id": requestId } },
    );
  }

  const headers = new Headers();
  for (const key of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }
  headers.set("cache-control", "no-store");
  headers.set("x-request-id", requestId);

  return new Response(upstream.body, { status: upstream.status, headers });
}
