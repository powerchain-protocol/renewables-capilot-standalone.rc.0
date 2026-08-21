"use client";

import { useEffect } from "react";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6">
      <div className="w-full max-w-md rounded-2xl border bg-[var(--card)] p-6 shadow-sm">
        <div className="grid size-11 place-items-center rounded-xl bg-amber-500/10 text-amber-600"><ExclamationTriangleIcon /></div>
        <h1 className="mt-4 text-xl font-bold">Renewables Copilot could not load this view</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          The workspace hit an unexpected application error. Retry the view; if the issue continues, check configuration and service health.
        </p>
        {error.digest && <p className="mt-3 font-mono text-[10px] text-[var(--muted-foreground)]">Reference: {error.digest}</p>}
        <div className="mt-5 flex gap-2">
          <Button onClick={reset}><ReloadIcon /> Try again</Button>
          <Button asChild variant="outline"><a href="/settings">Open settings</a></Button>
        </div>
      </div>
    </main>
  );
}
