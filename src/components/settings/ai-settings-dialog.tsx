"use client";

import { useEffect, useState } from "react";
import { CheckCircledIcon, ExclamationTriangleIcon, GearIcon, LockClosedIcon, ResetIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MODEL_PROFILES, type ModelProfile } from "@/lib/ai/model-registry";
import { AI_PROVIDER_LABELS, type AIProviderPreference } from "@/lib/ai/settings";
import { useAISettings } from "@/hooks/use-ai-settings";

const PROVIDERS: Exclude<AIProviderPreference,"auto">[] = ["openai","anthropic","google","deepseek","lora"];

type ModelResponse = {
  providers: Array<{
    id: Exclude<AIProviderPreference,"auto">;
    label: string;
    configured: boolean;
    models: { quality:string; balanced:string; fast:string };
  }>;
};

export function AISettingsDialog({ compact=false }: { compact?: boolean }) {
  const { settings, setSettings, reset } = useAISettings();
  const [models,setModels]=useState<ModelResponse|null>(null);
  const [open,setOpen]=useState(false);

  useEffect(()=>{
    if(!open)return;
    let alive=true;
    void fetch("/api/models",{cache:"no-store"}).then(r=>r.json()).then(v=>{if(alive)setModels(v)}).catch(()=>{if(alive)setModels(null)});
    return()=>{alive=false};
  },[open]);

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant="ghost" size={compact?"icon":"sm"} className={compact?undefined:"w-full justify-start px-3"} aria-label="AI settings">
        <GearIcon/>{!compact&&"AI settings"}
      </Button>
    </DialogTrigger>
    <DialogContent className="w-[min(94vw,760px)] max-h-[88vh] overflow-y-auto p-0">
      <div className="border-b px-6 py-5">
        <DialogTitle className="text-lg font-bold">GRIDLLM AI settings</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-[var(--muted-foreground)]">Choose routing behavior and model profile. API keys stay server-side and are never stored in the browser.</DialogDescription>
      </div>

      <div className="space-y-6 p-6">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div><div className="text-sm font-semibold">Provider routing</div><div className="text-xs text-[var(--muted-foreground)]">Auto route uses the server allowlist and falls back only when enabled.</div></div>
            <span className="inline-flex items-center gap-1 rounded-full border bg-[var(--muted)] px-2.5 py-1 text-[10px] font-semibold"><LockClosedIcon/> Server secrets</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <button onClick={()=>setSettings(v=>({...v,provider:"auto"}))} className={`rounded-xl border p-3 text-left transition ${settings.provider==="auto"?"border-emerald-500 bg-emerald-500/8 ring-1 ring-emerald-500/20":"hover:bg-[var(--muted)]"}`}>
              <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">Auto route</span><span className="size-2 rounded-full bg-emerald-500"/></div>
              <div className="mt-1 text-xs text-[var(--muted-foreground)]">Recommended provider order with failover.</div>
            </button>
            {PROVIDERS.map(id=>{
              const info=models?.providers.find(p=>p.id===id);
              const configured=info?.configured;
              return <button key={id} onClick={()=>setSettings(v=>({...v,provider:id}))} className={`rounded-xl border p-3 text-left transition ${settings.provider===id?"border-emerald-500 bg-emerald-500/8 ring-1 ring-emerald-500/20":"hover:bg-[var(--muted)]"}`}>
                <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{AI_PROVIDER_LABELS[id]}</span>{configured===true?<CheckCircledIcon className="text-emerald-600"/>:configured===false?<ExclamationTriangleIcon className="text-amber-600"/>:<span className="size-3 animate-pulse rounded-full bg-slate-300"/>}</div>
                <div className="mt-1 truncate text-xs text-[var(--muted-foreground)]">{info?.models[settings.modelProfile==="private-lora"?"balanced":settings.modelProfile]??"Checking configuration…"}</div>
              </button>
            })}
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border bg-[var(--muted)]/40 p-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm"><span className="font-semibold">Default model profile</span><select value={settings.modelProfile} onChange={e=>setSettings(v=>({...v,modelProfile:e.target.value as ModelProfile}))} className="h-10 w-full rounded-lg border bg-[var(--card)] px-3 text-sm">{MODEL_PROFILES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select><span className="block text-xs leading-5 text-[var(--muted-foreground)]">{MODEL_PROFILES.find(p=>p.id===settings.modelProfile)?.description}</span></label>
          <label className="flex items-start gap-3 rounded-xl border bg-[var(--card)] p-3"><input type="checkbox" checked={settings.fallbackEnabled} onChange={e=>setSettings(v=>({...v,fallbackEnabled:e.target.checked}))} className="mt-1 size-4 accent-emerald-700"/><span><span className="block text-sm font-semibold">Provider fallback</span><span className="mt-1 block text-xs leading-5 text-[var(--muted-foreground)]">If the preferred provider fails before streaming begins, route to the next configured provider.</span></span></label>
        </section>

        <section className="rounded-xl border p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Environment keys</div>
          <div className="mt-3 grid gap-x-5 gap-y-2 font-mono text-[11px] sm:grid-cols-2"><span>OPENAI_API_KEY</span><span>ANTHROPIC_API_KEY</span><span>GOOGLE_API_KEY</span><span>DEEPSEEK_API_KEY</span><span>LORA_BASE_URL</span><span>LORA_API_KEY</span></div>
        </section>

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="ghost" size="sm" onClick={reset}><ResetIcon/>Reset defaults</Button>
          <Button size="sm" onClick={()=>setOpen(false)}>Done</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
