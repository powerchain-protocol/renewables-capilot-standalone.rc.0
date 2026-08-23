"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/auth/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function safeCopilotTarget(requested: string | null) {
  const fallback = `${process.env.NEXT_PUBLIC_COPILOT_APP_URL || "http://localhost:3001"}/dashboard`;
  if (!requested) return fallback;
  try {
    const candidate = new URL(requested);
    const allowed = new Set([
      new URL(process.env.NEXT_PUBLIC_COPILOT_APP_URL || "http://localhost:3001").origin,
      "http://localhost:3001",
      "https://copilot.powerchain.app",
    ]);
    return allowed.has(candidate.origin) ? candidate.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function SignInForm({ compact = false }: { compact?: boolean }) {
  const params = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ tone: "error" | "success"; text: string } | null>(null);
  const target = safeCopilotTarget(params.get("next"));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage(null);
    try {
      const result = await authClient.signIn.email({
        email: String(form.get("email") || ""),
        password: String(form.get("password") || ""),
      });
      if (result.error) {
        setMessage({ tone: "error", text: result.error.message || "Check your credentials." });
        return;
      }
      setMessage({ tone: "success", text: "Signed in. Opening Renewables Copilot…" });
      window.location.assign(target);
    } catch {
      setMessage({ tone: "error", text: "Authentication service is unavailable. Try again shortly." });
    } finally {
      setLoading(false);
    }
  }

  return <form onSubmit={submit} className="grid gap-4" aria-busy={loading}>
    <div><label className="mb-1.5 block text-sm font-medium" htmlFor="email">Email address</label><Input id="email" name="email" type="email" autoComplete="email" inputMode="email" required placeholder="you@company.com" /></div>
    <div><label className="mb-1.5 block text-sm font-medium" htmlFor="password">Password</label><Input id="password" name="password" type="password" autoComplete="current-password" required minLength={10} placeholder="Enter your password" /></div>
    {message ? <p role={message.tone === "error" ? "alert" : "status"} className={`text-sm ${message.tone === "error" ? "text-red-600" : "text-emerald-700"}`}>{message.text}</p> : null}
    <Button size="lg" disabled={loading}>{loading ? "Signing in…" : "Sign in and open Copilot"}</Button>
    {!compact ? <p className="text-center text-xs text-black/50 dark:text-white/45">Account authentication is separate from wallet connection.</p> : null}
  </form>;
}
