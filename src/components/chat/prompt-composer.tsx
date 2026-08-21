"use client";
import { useState } from "react";
import { BookmarkIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import type { ModelProfile } from "@/lib/ai/model-registry";
import { AI_PROVIDER_LABELS, type AIProviderPreference } from "@/lib/ai/settings";

export function PromptComposer({
  onSend,onSave,disabled=false,profile,provider,onProfileChange,onProviderChange,
}:{
  onSend:(message:string,mode:string)=>void;
  onSave?:(message:string)=>void;
  disabled?:boolean;
  profile:ModelProfile;
  provider:AIProviderPreference;
  onProfileChange:(value:ModelProfile)=>void;
  onProviderChange:(value:AIProviderPreference)=>void;
}){
  const[value,setValue]=useState(""); const[mode,setMode]=useState("analyze");
  function submit(){if(!value.trim()||disabled)return;onSend(value,mode);setValue("")}
  return <div className="rounded-2xl border border-white/20 bg-[var(--card)] p-3 text-[var(--foreground)] shadow-[0_18px_60px_rgba(0,0,0,.16)]">
    <textarea value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}}} rows={3} className="w-full resize-none bg-transparent px-2 py-2 text-[15px] leading-6 outline-none placeholder:text-[var(--muted-foreground)]" placeholder="Ask GRIDLLM about energy operations, P2P markets, carbon, assets or infrastructure…"/>
    <div className="mt-2 flex flex-wrap items-center gap-2 border-t pt-3">
      <Button variant="ghost" size="sm"><PlusIcon/>Data</Button>
      <span className="hidden rounded-lg bg-[var(--muted)] px-2.5 py-1.5 text-xs sm:inline">@ Portfolio</span>
      <span className="hidden rounded-lg bg-[var(--muted)] px-2.5 py-1.5 text-xs sm:inline">Last 24h</span>
      <div className="ml-auto flex items-center gap-2">
        <select value={provider} onChange={e=>onProviderChange(e.target.value as AIProviderPreference)} className="h-8 max-w-[142px] rounded-lg border bg-[var(--card)] px-2 text-xs" aria-label="AI provider">
          {(["auto","openai","anthropic","google","deepseek","lora"] as const).map(id=><option key={id} value={id}>{AI_PROVIDER_LABELS[id]}</option>)}
        </select>
        <select value={profile} onChange={e=>onProfileChange(e.target.value as ModelProfile)} className="hidden h-8 rounded-lg border bg-[var(--card)] px-2 text-xs md:block" aria-label="AI profile"><option value="quality">Quality</option><option value="balanced">Balanced</option><option value="fast">Fast</option><option value="private-lora">Private LoRA</option></select>
        <select value={mode} onChange={e=>setMode(e.target.value)} className="h-8 rounded-lg border bg-[var(--card)] px-2 text-xs" aria-label="Analysis mode"><option value="analyze">Analyze</option><option value="forecast">Forecast</option><option value="compare">Compare</option><option value="optimize">Optimize</option><option value="audit">Audit</option><option value="build">Build</option></select>
        {onSave&&<Button variant="ghost" size="icon" className="size-8" onClick={()=>value.trim()&&onSave(value)} aria-label="Save prompt"><BookmarkIcon/></Button>}
        <Button size="icon" className="size-8" disabled={disabled||!value.trim()} onClick={submit} aria-label="Send"><PaperPlaneIcon/></Button>
      </div>
    </div>
  </div>
}
