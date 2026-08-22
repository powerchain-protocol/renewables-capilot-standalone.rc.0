import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { can, type Capability, type PowerChainRole } from "@powerchain/authz";
import { BACKEND_URL, WEB_URL } from "@/lib/env/urls";

export async function requireRole(capability: Capability) {
  const incoming = await headers();
  const response = await fetch(`${BACKEND_URL}/api/v1/session`, { headers: { cookie: incoming.get("cookie") || "" }, cache: "no-store" }).catch(() => null);
  if (!response?.ok) redirect(`${WEB_URL}/signin`);
  const session = await response.json() as { authenticated: boolean; role: PowerChainRole };
  if (!session.authenticated || !can(session.role, capability)) redirect(`${WEB_URL}/signin`);
  return session;
}
