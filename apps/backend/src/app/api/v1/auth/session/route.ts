import { z } from "zod";
import { POWERCHAIN_ROLES, isPowerChainRole, resolveRole } from "@powerchain/auth";
import { WEB_URL } from "@/lib/urls";

export const dynamic = "force-dynamic";

const sessionSchema = z.object({
  authenticated: z.boolean(),
  role: z.enum(POWERCHAIN_ROLES).optional(),
  kind: z.string().optional(),
  status: z.string().optional(),
  user: z.object({
    id: z.string(),
    email: z.string().email().nullable().optional(),
    name: z.string().nullable().optional(),
  }).optional(),
});

export async function GET(request: Request) {
  const response = await fetch(`${WEB_URL}/api/v1/auth/session`, {
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
  const role = isPowerChainRole(payload.role) ? payload.role : resolveRole(payload.user?.email);
  return Response.json({ ...payload, role }, { headers: { "cache-control": "no-store" } });
}
