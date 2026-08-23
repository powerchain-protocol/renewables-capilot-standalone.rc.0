import { isPowerChainRole, type PowerChainRole } from "@powerchain/auth";

const encoder = new TextEncoder();

type DemoPayload = { role: PowerChainRole; sub: string; exp: number };

function base64url(bytes: ArrayBuffer) {
  return Buffer.from(bytes).toString("base64url");
}

async function key(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function secret() {
  const configured = process.env.DEMO_SESSION_SECRET?.trim();
  if (process.env.NODE_ENV === "production" && !configured) throw new Error("DEMO_SESSION_SECRET is required when demo auth is enabled in production");
  return configured || "powerchain-development-demo-secret";
}

export async function createDemoSession(role: PowerChainRole) {
  const payload: DemoPayload = { role, sub: `demo-${role}`, exp: Date.now() + 8 * 60 * 60 * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = await crypto.subtle.sign("HMAC", await key(secret()), encoder.encode(encoded));
  return `${encoded}.${base64url(signature)}`;
}

export async function verifyDemoSession(token?: string | null): Promise<DemoPayload | null> {
  if (!token) return null;
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const valid = await crypto.subtle.verify(
      "HMAC",
      await key(secret()),
      Buffer.from(signature, "base64url"),
      encoder.encode(encoded),
    );
    if (!valid) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<DemoPayload>;
    if (!isPowerChainRole(payload.role) || typeof payload.sub !== "string" || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload as DemoPayload;
  } catch {
    return null;
  }
}
