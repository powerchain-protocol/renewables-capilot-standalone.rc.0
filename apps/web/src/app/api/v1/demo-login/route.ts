import { NextResponse } from "next/server";
import { createDemoSession } from "@/lib/auth/demo-session";

export async function POST() {
  if (process.env.NODE_ENV === "production" && process.env.DEMO_AUTH_ENABLED !== "true") {
    return NextResponse.json({ error: "DEMO_DISABLED" }, { status: 403 });
  }

  const role = "demo" as const;
  const token = await createDemoSession(role);
  const base = (process.env.NODE_ENV === "production" ? process.env.COPILOT_APP_URL : process.env.COPILOT_APP_LOCAL_URL)
    || process.env.COPILOT_APP_URL
    || process.env.COPILOT_APP_LOCAL_URL
    || "http://localhost:3001";

  const response = NextResponse.json({ ok: true, role, redirect: `${base.replace(/\/$/, "")}/dashboard` });
  response.cookies.set("pc_demo_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
    ...(process.env.NODE_ENV === "production" ? { domain: process.env.AUTH_COOKIE_DOMAIN || ".powerchain.app" } : {}),
  });
  return response;
}
