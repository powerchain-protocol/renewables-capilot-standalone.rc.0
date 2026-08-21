"use client";
import { CheckCircledIcon, CubeIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { SolanaIcon } from "@/components/ui/icons";
import { useSystemHealth } from "@/hooks/use-system-health";

export function SystemStatus(){
  const health=useSystemHealth();
  const ai=health?(health.aiConfiguredCount>0):null;
  const statuses=[
    {name:"AI routing",state:ai,detail:health?`${health.aiConfiguredCount} providers`:"",icon:<MagicWandIcon/>},
    {name:"Helius / Solana",state:health?health.services.helius:null,detail:health?.services.helius?"Enhanced RPC":"Public RPC fallback",icon:<SolanaIcon size={18}/>},
    {name:"Pyth",state:health?health.services.pyth:null,detail:health?.services.pyth?"Hermes configured":"Optional oracle",icon:<span className="font-black">P</span>},
    {name:"Programs",state:health?Object.values(health.programsConfigured).some(Boolean):null,detail:health?`${Object.values(health.programsConfigured).filter(Boolean).length} configured`:"",icon:<CubeIcon/>},
    {name:"App API",state:health?.ok??null,detail:health?.ok?"Operational":"Checking",icon:<CheckCircledIcon/>},
  ];
  return <section className="grid gap-3 border-t pt-4 text-xs sm:grid-cols-2 xl:grid-cols-5">{statuses.map(({name,state,detail,icon})=><div key={name} className="rounded-xl border bg-[var(--card)] p-3 transition hover:-translate-y-0.5 hover:shadow-sm"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-[var(--muted)]">{icon}</span><div><div className="font-semibold">{name}</div><div className={`mt-0.5 ${state===true?"text-emerald-600":state===false?"text-amber-600":"text-[var(--muted-foreground)]"}`}>● {state===true?"Ready":state===false?"Needs config":"Checking"}</div></div></div>{detail&&<div className="mt-2 truncate text-[10px] text-[var(--muted-foreground)]">{detail}</div>}</div>)}</section>;
}
