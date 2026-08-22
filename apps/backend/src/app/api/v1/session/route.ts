import { z } from "zod";
import { resolveRole } from "@powerchain/authz";
import { WEB_URL } from "@/lib/urls";

export const dynamic = "force-dynamic";

const sessionSchema = z.object({
  authenticated: z.boolean(),
  role: z.string().optional(),
  kind: z.string().optional(),
  status: z.string().optional(),
  user: z.object({
    id: z.string(),
    email: z.string().email().nullable().optional(),
    name: z.string().nullable().optional(),
  }).optional(),
});

export async function GET(request: Request) {
  const response = await fetch(`${WEB_URL}/api/v1/authz/session`, {
    headers: { cookie: request.headers.get("cookie") ?? "" },
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) {
    return Response.json({ authenticated: false, role: "viewer", status: "unavailable" }, { status: 401 });
  }

  const parsed = sessionSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ authenticated: false, role: "viewer", status: "invalid-upstream-session" }, { status: 502 });
  }

  const payload = parsed.data;
  return Response.json(
    { ...payload, role: payload.role ?? resolveRole(payload.user?.email) },
    { headers: { "cache-control": "no-store" } },
  );
}
