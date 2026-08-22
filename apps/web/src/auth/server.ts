import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

let cached: ReturnType<typeof betterAuth> | null = null;

function origin(value: string | undefined, fallback: string) {
  return (value?.trim() || fallback).replace(/\/$/, "");
}

export function getAuth() {
  if (cached) return cached;

  const production = process.env.NODE_ENV === "production";
  const secret = process.env.BETTER_AUTH_SECRET || (!production ? "powerchain-web-development-secret-change-me-32chars" : "");
  if (!secret) throw new Error("BETTER_AUTH_SECRET is required in production");
  if (!db) throw new Error("WEB_DATABASE_URL is required for Better Auth");

  const webUrl = origin(production ? process.env.WEB_APP_URL : process.env.WEB_APP_LOCAL_URL, "http://localhost:3000");
  const copilotUrl = origin(production ? process.env.COPILOT_APP_URL : process.env.COPILOT_APP_LOCAL_URL, "http://localhost:3001");
  const backendUrl = origin(production ? process.env.BACKEND_APP_URL : process.env.BACKEND_APP_LOCAL_URL, "http://localhost:3002");
  const cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim() || ".powerchain.app";

  const google = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }
    : undefined;

  cached = betterAuth({
    appName: "PowerChain",
    baseURL: webUrl,
    secret,
    database: prismaAdapter(db, { provider: "postgresql" }),
    emailAndPassword: { enabled: true, minPasswordLength: 10 },
    socialProviders: google ? { google } : {},
    user: { modelName: "WebUser" },
    session: { modelName: "WebSession" },
    account: { modelName: "WebAccount" },
    verification: { modelName: "WebVerification" },
    trustedOrigins: [webUrl, copilotUrl, backendUrl],
    advanced: production
      ? {
          useSecureCookies: true,
          crossSubDomainCookies: {
            enabled: true,
            domain: cookieDomain,
          },
        }
      : undefined,
  });

  return cached;
}
