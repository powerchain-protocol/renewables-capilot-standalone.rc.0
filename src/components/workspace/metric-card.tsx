import type { ComponentType } from "react";
import { Card } from "@/components/ui/card";

export function MetricCard({label,value,unit,delta,icon:Icon,points=[35,48,44,58,53,66,62,79]}:{label:string;value:string;unit?:string;delta?:string;icon?:ComponentType<{className?:string}>;points?:number[]}){
  const path=points.map((v,i)=>`${(i/(points.length-1))*100},${100-v}`).join(" ");
  return <Card className="group overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div className="text-[11px] font-semibold uppercase tracking-[.08em] text-[var(--muted-foreground)]">{label}</div>{Icon&&<div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/8 text-emerald-700 dark:text-emerald-300"><Icon/></div>}</div><div className="mt-2 flex items-end gap-1"><div className="text-2xl font-bold tracking-tight">{value}</div>{unit&&<div className="pb-1 text-xs text-[var(--muted-foreground)]">{unit}</div>}</div>{delta&&<div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">{delta}</div>}<svg viewBox="0 0 100 30" preserveAspectRatio="none" className="mt-3 h-8 w-full overflow-visible" aria-hidden="true"><polyline points={path} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="text-emerald-600/70"/></svg></Card>
}
