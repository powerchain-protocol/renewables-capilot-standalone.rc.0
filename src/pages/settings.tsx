import { AISettingsDialog } from "@/components/settings/ai-settings-dialog";
import { Card } from "@/components/ui/card";
import { SolanaIcon, SuiIcon } from "@/components/ui/icons";
import { solanaConfig } from "@/lib/solana/config";
import { PageShell } from "../../packages/pages/page-shell";

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t py-2.5 first:border-t-0">
      <span className="shrink-0 text-xs text-[var(--muted-foreground)]">{label}</span>
      <code className="min-w-0 break-all text-right text-[11px]">{value}</code>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <PageShell
      title="Workspace settings"
      description="Configure AI routing, data-source boundaries, Solana network context and signing behavior."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="text-sm font-semibold">AI & GRIDLLM</div>
          <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
            Provider selection and model profile are user preferences; API credentials remain server-side.
          </p>
          <div className="mt-4"><AISettingsDialog /></div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold">Networks</div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <SolanaIcon size={24} />
              <div className="min-w-0">
                <div className="text-sm font-medium">Solana / SVM</div>
                <div className="text-xs text-[var(--muted-foreground)]">Active cluster: {solanaConfig.cluster}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <SuiIcon size={24} />
              <div>
                <div className="text-sm font-medium">Sui</div>
                <div className="text-xs text-[var(--muted-foreground)]">Secondary asset and settlement adapter</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 md:col-span-2">
          <div className="text-sm font-semibold">Solana configuration</div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Public browser RPCs are configurable per cluster. Helius API keys remain server-only and are never rendered here.
          </p>
          <div className="mt-4 grid gap-x-8 lg:grid-cols-2">
            <div>
              <ConfigRow label="Devnet RPC" value={solanaConfig.rpc.devnet} />
              <ConfigRow label="Mainnet-beta RPC" value={solanaConfig.rpc.mainnetBeta} />
              <ConfigRow label="PWRC mint" value={solanaConfig.pwrcMint} />
            </div>
            <div>
              <ConfigRow label="SPL Token" value={solanaConfig.splTokenProgramId} />
              <ConfigRow label="Token-2022" value={solanaConfig.token2022ProgramId} />
              <ConfigRow label="Associated Token" value={solanaConfig.associatedTokenProgramId} />
            </div>
          </div>
        </Card>

        <Card className="p-5 md:col-span-2">
          <div className="text-sm font-semibold">Execution safety</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[["AI", "Analyze + prepare"], ["Policy", "Validate + simulate"], ["Wallet", "User signs"]].map(([title, description]) => (
              <div key={title} className="rounded-xl bg-[var(--muted)] p-3">
                <div className="text-xs font-semibold">{title}</div>
                <div className="mt-1 text-xs text-[var(--muted-foreground)]">{description}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
