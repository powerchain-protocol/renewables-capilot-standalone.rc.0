"use client";
import { BellIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { WalletConnectModal } from "@/components/wallet/wallet-connect-modal";
import { Button } from "@/components/ui/button";
import { useSystemHealth } from "@/hooks/use-system-health";
import { SOLANA_CLUSTER } from "@/lib/solana/config";
import { POWERCHAIN_NETWORK } from "@/lib/constants";
import { AISettingsDialog } from "@/components/settings/ai-settings-dialog";

export function Topbar({onMenuClick}:{onMenuClick:()=>void}){
  const health=useSystemHealth(); const aiReady=(health?.aiConfiguredCount??0)>0;
  return <header className="sticky top-0 z-30 flex h-[64px] items-center gap-3 border-b bg-[color-mix(in_srgb,var(--card)_92%,transparent)] px-4 backdrop-blur-xl sm:px-6"><Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open navigation"><HamburgerMenuIcon/></Button><div className="min-w-0"><h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">Renewables Copilot</h1><p className="hidden text-xs text-[var(--muted-foreground)] sm:block">AI operations workspace for renewable energy and PowerChain infrastructure</p></div><div className="ml-auto flex items-center gap-2"><div className="hidden items-center gap-2 rounded-full border bg-[var(--background)] px-3 py-2 text-xs font-semibold md:flex"><span className={`size-2 rounded-full ${health===null?"bg-slate-400":aiReady?"bg-emerald-500":"bg-amber-500"}`}/> {health===null?"Checking AI":aiReady?`${health?.aiConfiguredCount} AI provider${health?.aiConfiguredCount===1?"":"s"}`:"Configure AI"}</div><div className="hidden rounded-full border bg-[var(--background)] px-3 py-2 text-xs xl:block">PowerChain · {POWERCHAIN_NETWORK}</div><div className="hidden rounded-full border bg-[var(--background)] px-3 py-2 text-xs lg:block">Solana · {SOLANA_CLUSTER}</div><AISettingsDialog compact/><ThemeToggle/><Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Notifications"><BellIcon/></Button><WalletConnectModal/></div></header>;
}
