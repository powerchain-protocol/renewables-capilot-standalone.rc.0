"use client";

import * as React from "react";

export function DemoAccountCard() {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function enter() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/demo-login", { method: "POST" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Demo access unavailable");
      window.location.assign(body.redirect);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Demo access unavailable");
    } finally {
      setBusy(false);
    }
  }

  return <section className="rounded-xl border border-emerald-900/10 bg-emerald-50/60 p-4 dark:bg-emerald-950/20">
    <div className="text-sm font-semibold">Demo account</div>
    <p className="mt-1 text-xs leading-5 text-black/55 dark:text-white/55">Read-only guided access with the dedicated demo role. Demo sessions never inherit operator or admin capabilities.</p>
    <button type="button" onClick={() => void enter()} disabled={busy} className="mt-3 h-10 w-full rounded-lg bg-[#064e3b] px-4 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Opening…" : "Open demo workspace"}</button>
    {error ? <p className="mt-2 text-xs text-red-600" role="alert">{error}</p> : null}
  </section>;
}
