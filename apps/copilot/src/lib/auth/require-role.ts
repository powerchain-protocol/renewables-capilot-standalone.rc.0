import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { can, isPowerChainRole, type Capability, type PowerChainRole } from "@powerchain/auth";
import { BACKEND_URL, WEB_URL } from "@/lib/env/urls";

type SessionPayload = { authenticated: boolean; role: PowerChainRole; kind?: string };

export async function requireRole(capability: Capability): Promise<SessionPayload> {
  const incoming = await headers();
  const response = await fetch(`${BACKEND_URL}/api/v1/auth/session`, {
    headers: { cookie: incoming.get("cookie") || "" },
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) redirect(`${WEB_URL}/signin`);

  const payload = await response.json().catch(() => null) as Partial<SessionPayload> | null;
  if (!payload?.authenticated || !isPowerChainRole(payload.role) || !can(payload.role, capability)) {
    redirect(`${WEB_URL}/signin`);
  }

  return payload as SessionPayload;
}
