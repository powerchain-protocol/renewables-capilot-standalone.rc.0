import { BarChartIcon, CubeIcon, DashboardIcon, GlobeIcon, LightningBoltIcon, TokensIcon } from "@radix-ui/react-icons";
const suggestions=[
  ["Review today’s energy operations","Generation, consumption and anomalies",LightningBoltIcon],
  ["Analyze local energy markets","P2P liquidity, spreads and pricing",BarChartIcon],
  ["Forecast next 24 hours","Generation, demand and storage",DashboardIcon],
  ["Audit carbon inventory","Issued, available and retired credits",GlobeIcon],
  ["Analyze PWRC ecosystem","Treasury, settlement and token flows",TokensIcon],
  ["Check PowerChain infrastructure","RPCs, programs, workers and oracles",CubeIcon],
] as const;
export function Suggestions({onSelect}:{onSelect:(value:string)=>void}){return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{suggestions.map(([title,desc,Icon])=><button key={title} onClick={()=>onSelect(title)} className="group rounded-2xl border bg-[var(--card)] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-[var(--muted)] text-emerald-700 transition group-hover:bg-emerald-500/10 dark:text-emerald-300"><Icon/></div><span className="text-[10px] text-[var(--muted-foreground)]">↗</span></div><div className="mt-4 text-sm font-semibold">{title}</div><div className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{desc}</div></button>)}</div>}
