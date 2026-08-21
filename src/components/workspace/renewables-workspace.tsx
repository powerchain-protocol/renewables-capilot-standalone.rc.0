"use client";
import { useState } from "react";
import { BarChartIcon, LightningBoltIcon, TokensIcon } from "@radix-ui/react-icons";
import { AppSidebar, MobileSidebar } from "@/components/workspace/app-sidebar";
import { Topbar } from "@/components/workspace/topbar";
import { ContextPanel } from "@/components/workspace/context-panel";
import { MetricCard } from "@/components/workspace/metric-card";
import { ChatPanel } from "@/components/workspace/chat-panel";
import { OperationsPanel } from "@/components/workspace/operations-panel";
import { SystemStatus } from "@/components/workspace/system-status";
import { ConfigurationBanner } from "@/components/workspace/configuration-banner";

export function RenewablesWorkspace(){
  const[mobileNavOpen,setMobileNavOpen]=useState(false);
  return <div className="flex min-h-screen bg-[var(--background)]"><AppSidebar/><MobileSidebar open={mobileNavOpen} onOpenChange={setMobileNavOpen}/><div className="min-w-0 flex-1"><Topbar onMenuClick={()=>setMobileNavOpen(true)}/><div className="flex"><main className="min-w-0 flex-1 p-4 sm:p-6"><div className="mx-auto max-w-[1280px] space-y-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="text-sm font-semibold">Operational overview</div><div className="text-xs text-[var(--muted-foreground)]">Energy, markets and infrastructure context for GRIDLLM</div></div><span className="rounded-full border bg-[var(--card)] px-2.5 py-1 text-[10px] font-bold text-[var(--muted-foreground)]">SAMPLE KPIs · LIVE PROVIDER STATUS</span></div><ConfigurationBanner/><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={LightningBoltIcon} label="Total generation" value="42.8" unit="MWh" delta="+7.2% vs sample baseline"/><MetricCard icon={BarChartIcon} label="Net position" value="+8.3" unit="MWh" delta="Sample surplus" points={[42,55,46,62,69,60,74,71]}/><MetricCard icon={BarChartIcon} label="Local price" value="€82.40" unit="/MWh" delta="Sample market" points={[28,38,33,51,48,56,63,69]}/><MetricCard icon={TokensIcon} label="PWRC reference" value="$0.422" unit="PWRC" delta="Reference only" points={[49,47,55,53,59,57,65,62]}/></section><ChatPanel/><OperationsPanel/><SystemStatus/></div></main><ContextPanel/></div></div></div>
}
