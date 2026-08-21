import Link from "next/link";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { POWERCHAIN_NETWORK } from "@/lib/constants";
import { SOLANA_CLUSTER } from "@/lib/solana/config";

export function DashboardFooter() {
  return (
    <footer className="shrink-0 border-t bg-[var(--card)]/80 px-4 py-4 backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 text-xs text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold text-[var(--foreground)]">PowerChain Renewables Copilot</span>
          <span>© 2026 PowerChain</span>
          <span className="hidden h-3 w-px bg-[var(--border)] sm:block" aria-hidden="true" />
          <span>{POWERCHAIN_NETWORK}</span>
          <span>Solana {SOLANA_CLUSTER}</span>
        </div>

        <nav className="flex flex-wrap items-center gap-3" aria-label="Dashboard footer">
          <Link className="transition hover:text-[var(--foreground)]" href="/settings">Settings</Link>
          <Link className="transition hover:text-[var(--foreground)]" href="/pwa">PWA</Link>
          <a
            className="inline-flex items-center gap-1 transition hover:text-[var(--foreground)]"
            href="/api/v1/health"
            target="_blank"
            rel="noreferrer"
          >
            API health <ExternalLinkIcon />
          </a>
        </nav>
      </div>
    </footer>
  );
}
