"use client";
import Link from "next/link";
import { BarChartIcon, ChatBubbleIcon, CubeIcon, DashboardIcon, GearIcon, GlobeIcon, LightningBoltIcon, Link2Icon, ReaderIcon, TokensIcon } from "@radix-ui/react-icons";
import { PowerChainLogo } from "@/components/brand/powerchain-logo";
import { AISettingsDialog } from "@/components/settings/ai-settings-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const sections=[
  {label:"AI WORKSPACE",items:[["Copilot",ChatBubbleIcon],["Energy Operations",LightningBoltIcon],["P2P Markets",BarChartIcon],["Forecasting",DashboardIcon],["Carbon Intelligence",GlobeIcon],["Tokenized Assets",CubeIcon],["PWRC Tokenomics",TokensIcon],["Supply Chain",Link2Icon]]},
  {label:"INFRASTRUCTURE",items:[["Solana / SVM",TokensIcon],["Sui Network",GlobeIcon],["Oracles",DashboardIcon],["Programs",CubeIcon],["Monitoring",BarChartIcon]]},
] as const;

function SidebarContent({onNavigate}:{onNavigate?:()=>void}){
  return <div className="flex h-full min-h-0 flex-col"><PowerChainLogo/><nav className="mt-7 min-h-0 flex-1 space-y-6 overflow-y-auto pr-1 pc-scrollbar">{sections.map(s=><div key={s.label}><div className="mb-2 px-2 text-[10px] font-bold tracking-[.12em] text-emerald-700 dark:text-emerald-400">{s.label}</div><div className="space-y-1">{s.items.map(([name,Icon],i)=><button onClick={onNavigate} key={name} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${s.label==="AI WORKSPACE"&&i===0?"bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm":"text-[var(--foreground)] hover:bg-[var(--muted)]"}`}><Icon className="shrink-0"/><span className="truncate">{name}</span></button>)}</div></div>)}</nav><div className="space-y-1 border-t pt-3"><AISettingsDialog/><Link href="/settings" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]"><GearIcon/>Workspace settings</Link><Link href="/pwa" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]"><DashboardIcon/>PWA</Link><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]"><ReaderIcon/>Documentation</button></div></div>
}

export function AppSidebar(){return <aside className="hidden h-screen w-[238px] shrink-0 border-r bg-[var(--card)] p-4 lg:block"><SidebarContent/></aside>}

export function MobileSidebar({open,onOpenChange}:{open:boolean;onOpenChange:(open:boolean)=>void}){
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="left-0 top-0 h-dvh w-[min(86vw,310px)] max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-4"><DialogTitle className="sr-only">PowerChain navigation</DialogTitle><SidebarContent onNavigate={()=>onOpenChange(false)}/></DialogContent></Dialog>
}
