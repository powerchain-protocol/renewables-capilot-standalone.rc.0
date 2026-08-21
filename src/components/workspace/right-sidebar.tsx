"use client";

import { Card } from "@/components/ui/card";
import { PwrcCoin } from "@/components/brand/pwrc-coin";
import { SolanaIcon } from "@/components/ui/icons";
import { useAgents } from "@/hooks/use-agents";
import { useSkills } from "@/hooks/use-skills";
import { useSystemHealth } from "@/hooks/use-system-health";
import { SOLANA_CLUSTER } from "@/lib/solana/config";

const assets = [
  ["Solar Farm North", "4.2 MW"],
  ["Wind Site West", "12.1 MW"],
  ["Battery North", "2.0 MWh / 72%"],
  ["Microgrid 03", "+1.8 MWh"],
] as const;

export function RightSidebar() {
  const health = useSystemHealth();
  const { enabled: agents } = useAgents();
  const { enabled: skills } = useSkills();
  const aiCount = health?.aiConfiguredCount ?? 0;

  const rows = [
    ["Portfolio", "All assets", true],
    ["Time Range", "Last 24 hours", true],
    ["AI Providers", health ? `${aiCount} configured` : "Checking…", health ? aiCount > 0 : null],
    ["Helius", health ? (health.services.helius ? "Configured" : "Public RPC fallback") : "Checking…", health ? health.services.helius : null],
  ] as const;

  return (
    <aside
      className="hidden h-dvh w-[296px] shrink-0 overflow-hidden border-l bg-[var(--right-sidebar)] xl:flex xl:flex-col"
      aria-label="Workspace context"
    >
      <div className="flex h-[64px] shrink-0 items-center justify-between border-b px-4">
        <div>
          <div className="text-xs font-bold tracking-[0.08em]">WORKSPACE CONTEXT</div>
          <div className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">Live configuration & portfolio</div>
        </div>
        <span className="rounded-full border bg-[var(--card)] px-2 py-1 text-[9px] font-semibold text-[var(--muted-foreground)]">LIVE</span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-hidden p-3.5">
        <Card className="p-3.5">
          <div className="flex items-center gap-2 rounded-xl border bg-[var(--card)] p-2.5">
            <SolanaIcon size={22} />
            <div>
              <div className="text-xs font-semibold">Solana</div>
              <div className="text-[11px] text-[var(--muted-foreground)]">{SOLANA_CLUSTER}</div>
            </div>
            <span className="ml-auto size-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3 space-y-3">
            {rows.map(([label, value, state]) => (
              <div key={label} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold">{label}</div>
                  <div className="truncate text-[11px] text-[var(--muted-foreground)]">{value}</div>
                </div>
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${state === true ? "bg-emerald-500" : state === false ? "bg-amber-500" : "bg-slate-400"}`} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold">GRIDLLM RUNTIME</div>
            <span className="text-[10px] text-[var(--muted-foreground)]">Policy-bound</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-[var(--muted)] p-2.5">
              <div className="text-lg font-bold">{agents.length}</div>
              <div className="text-[10px] text-[var(--muted-foreground)]">Agents</div>
            </div>
            <div className="rounded-lg bg-[var(--muted)] p-2.5">
              <div className="text-lg font-bold">{skills.length}</div>
              <div className="text-[10px] text-[var(--muted-foreground)]">Skills</div>
            </div>
          </div>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold">ACTIVE ASSETS</div>
            <span className="text-[10px] text-[var(--muted-foreground)]">Sample</span>
          </div>
          <div className="mt-3 space-y-2.5">
            {assets.map(([name, value]) => (
              <div key={name} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold">{name}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">{value}</div>
                </div>
                <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-3.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold">PWRC TOKEN</div>
            <span className="rounded-full border px-2 py-1 text-[9px] font-semibold text-[var(--muted-foreground)]">REFERENCE</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <PwrcCoin size={52} />
            <div>
              <div className="font-bold">PWRC</div>
              <div className="text-[11px] text-[var(--muted-foreground)]">PowerChain Token</div>
              <div className="mt-0.5 text-lg font-bold">$0.422</div>
            </div>
          </div>
          <a href="/balances" className="mt-3 block w-full rounded-lg border py-2 text-center text-xs font-semibold transition hover:bg-[var(--muted)]">View PWRC analytics →</a>
        </Card>
      </div>
    </aside>
  );
}
