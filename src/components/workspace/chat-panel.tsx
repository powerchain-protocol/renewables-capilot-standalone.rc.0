"use client";
import { useGridLLM } from "@/hooks/use-gridllm";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
import { SavedPrompts } from "@/components/messages/saved-prompts";
import { useAISettings } from "@/hooks/use-ai-settings";
import { PromptComposer } from "@/components/chat/prompt-composer";
import { Suggestions } from "@/components/chat/suggestions";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";
import { Card } from "@/components/ui/card";

export function ChatPanel(){
  const{messages,loading,error,send,activeProvider,activeModel}=useGridLLM();
  const{prompts,save}=useSavedPrompts();
  const{settings,setSettings}=useAISettings();
  async function savePrompt(content:string){await save({title:content.slice(0,60),content,tags:["gridllm"]})}
  const run=(message:string,mode="analyze")=>send(message,mode,{scope:"portfolio",period:"24h",network:"solana"},settings.modelProfile,settings.provider,settings.fallbackEnabled);

  return <div className="space-y-4">
    <div className="overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_10%_20%,rgba(52,211,153,.16),transparent_34%),linear-gradient(135deg,#061b13,#082d20_58%,#04100b)] p-4 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-[190px_1fr]">
        <div className="flex items-center gap-3 md:block"><div className="flex size-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-lg font-black">G</div><div className="md:mt-4"><div className="font-bold">GRIDLLM</div><div className="text-xs leading-5 text-emerald-100/70">Renewable energy intelligence and infrastructure copilot</div><div className="mt-3 hidden items-center gap-2 text-[10px] text-emerald-100/60 md:flex"><span className="size-1.5 rounded-full bg-emerald-400"/> Evidence-aware · human-controlled execution</div></div></div>
        <PromptComposer onSend={(m,mode)=>void run(m,mode)} onSave={(m)=>void savePrompt(m)} disabled={loading} profile={settings.modelProfile} provider={settings.provider} onProfileChange={modelProfile=>setSettings(v=>({...v,modelProfile}))} onProviderChange={provider=>setSettings(v=>({...v,provider}))}/>
      </div>
    </div>

    {messages.length===0&&<><Suggestions onSelect={(v)=>void run(v)}/>{prompts.length>0&&<SavedPrompts onSelect={(content)=>void run(content)}/>}</>}

    <div className="space-y-3">{messages.map((m,index)=><Card key={m.id} className={`p-4 ${m.role==="user"?"ml-auto max-w-[85%] bg-[var(--muted)]":"max-w-[95%]"}`}><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]"><span>{m.role==="user"?"You":"GRIDLLM"}</span>{m.role==="assistant"&&index===messages.length-1&&activeProvider&&<><span>·</span><span className="normal-case tracking-normal">{activeProvider}{activeModel?` / ${activeModel}`:""}</span></>}</div><div className="whitespace-pre-wrap text-sm leading-6">{m.content||"…"}</div></Card>)}{loading&&messages.at(-1)?.content===""&&<ChatSkeleton/>}{error&&<div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-600 dark:text-red-300">{error}</div>}</div>
  </div>;
}
