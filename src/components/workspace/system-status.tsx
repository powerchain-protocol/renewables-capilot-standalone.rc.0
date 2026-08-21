"use client";

import { CheckCircledIcon, CubeIcon, MagicWandIcon, ReloadIcon } from "@radix-ui/react-icons";
import { SolanaIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useSystemHealthState } from "@/hooks/use-system-health";

function freshness(value: Date | null) {
  if (!value) return "Not checked";
  const seconds = Math.max(0, Math.round((Date.now() - value.getTime()) / 1000));
  return seconds < 5 ? "Updated now" : `Updated ${seconds}s ago`;
}

export function SystemStatus() {
  const { data: health, loading, refreshing, error, updatedAt, refresh } = useSystemHealthState();
  const ai = health ? health.aiConfiguredCount > 0 : null;
  const statuses = [
    {
      name: "AI routing",
      state: ai,
      detail: health ? `${health.aiConfiguredCount} provider${health.aiConfiguredCount === 1 ? "" : "s"}` : "",
      icon: <MagicWandIcon />,
    },
    {
      name: "Solana RPC",
      state: health ? true : null,
      detail: health ? `${health.solana.cluster} · ${health.solana.heliusConfigured ? "Helius primary" : "public fallback"}` : "",
      icon: <SolanaIcon size={18} />,
    },
    {
      name: "Helius",
      state: health ? health.services.helius : null,
      detail: health?.services.helius ? `${health.solana.heliusNetwork} enhanced API` : "Optional enhanced data",
      icon: <span className="font-black">H</span>,
    },
    {
      name: "Pyth",
      state: health ? health.services.pyth : null,
      detail: health?.services.pyth ? "Hermes configured" : "Optional oracle",
      icon: <span className="font-black">P</span>,
    },
    {
      name: "Programs",
      state: health ? Object.values(health.programsConfigured).some(Boolean) : null,
      detail: health ? `${Object.values(health.programsConfigured).filter(Boolean).length} PowerChain programs` : "",
      icon: <CubeIcon />,
    },
    {
      name: "App API",
      state: error ? false : health?.ok ?? null,
      detail: error ? "Health endpoint unavailable" : health?.ok ? "Operational" : "Checking",
      icon: <CheckCircledIcon />,
    },
  ];

  return (
    <section className="border-t pt-4" aria-label="System status">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider">System status</div>
          <div className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">
            {error ? error : loading ? "Checking services…" : freshness(updatedAt)}
          </div>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refresh()} disabled={refreshing} aria-label="Refresh system status">
          <ReloadIcon className={refreshing ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>
      <div className="grid gap-3 text-xs sm:grid-cols-2 xl:grid-cols-6">
        {statuses.map(({ name, state, detail, icon }) => (
          <div key={name} className="rounded-xl border bg-[var(--card)] p-3 transition hover:-translate-y-0.5 hover:shadow-sm">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--muted)]">{icon}</span>
              <div className="min-w-0">
                <div className="font-semibold">{name}</div>
                <div className={`mt-0.5 ${state === true ? "text-emerald-600" : state === false ? "text-amber-600" : "text-[var(--muted-foreground)]"}`}>
                  ● {state === true ? "Ready" : state === false ? "Needs attention" : "Checking"}
                </div>
              </div>
            </div>
            {detail && <div className="mt-2 truncate text-[10px] text-[var(--muted-foreground)]" title={detail}>{detail}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
