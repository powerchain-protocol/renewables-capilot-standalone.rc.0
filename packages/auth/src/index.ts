export const POWERCHAIN_ROLES = ["admin", "operator", "analyst", "viewer", "demo"] as const;
export type PowerChainRole = (typeof POWERCHAIN_ROLES)[number];

export type Capability =
  | "copilot.access"
  | "copilot.execute.review"
  | "reports.write"
  | "wallet.connect"
  | "balances.read"
  | "tokens.read"
  | "integrations.read"
  | "integrations.manage"
  | "admin.manage";

const ROLE_CAPABILITIES: Record<PowerChainRole, ReadonlySet<Capability>> = {
  admin: new Set(["copilot.access", "copilot.execute.review", "reports.write", "wallet.connect", "balances.read", "tokens.read", "integrations.read", "integrations.manage", "admin.manage"]),
  operator: new Set(["copilot.access", "copilot.execute.review", "reports.write", "wallet.connect", "balances.read", "tokens.read", "integrations.read"]),
  analyst: new Set(["copilot.access", "reports.write", "balances.read", "tokens.read", "integrations.read"]),
  viewer: new Set(["copilot.access", "balances.read", "tokens.read", "integrations.read"]),
  demo: new Set(["copilot.access", "balances.read", "tokens.read", "integrations.read"]),
};

export function isPowerChainRole(value: unknown): value is PowerChainRole {
  return typeof value === "string" && (POWERCHAIN_ROLES as readonly string[]).includes(value);
}

export function can(role: PowerChainRole, capability: Capability) {
  return ROLE_CAPABILITIES[role].has(capability);
}

export function resolveRole(email?: string | null, env: Record<string, string | undefined> = process.env): PowerChainRole {
  if (!email) return "viewer";
  const normalized = email.trim().toLowerCase();
  const includes = (key: string) => (env[key] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);

  if (includes("ADMIN_EMAILS")) return "admin";
  if (includes("OPERATOR_EMAILS")) return "operator";
  if (includes("ANALYST_EMAILS")) return "analyst";
  return "viewer";
}
