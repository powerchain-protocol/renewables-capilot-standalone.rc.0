"use client";
import { useCallback, useState } from "react";
import type { ModelProfile } from "@/lib/ai/model-registry";
import type { AIProviderPreference } from "@/lib/ai/settings";

export type ChatMessage={id:string;role:"user"|"assistant";content:string};

export function useGridLLM(){
  const [messages,setMessages]=useState<ChatMessage[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [activeProvider,setActiveProvider]=useState<string|null>(null);
  const [activeModel,setActiveModel]=useState<string|null>(null);

  const send=useCallback(async(
    message:string,
    mode="analyze",
    context:Record<string,unknown>={},
    modelProfile:ModelProfile="balanced",
    providerPreference:AIProviderPreference="auto",
    fallbackEnabled=true,
  )=>{
    if(!message.trim()||loading)return;
    const user={id:crypto.randomUUID(),role:"user" as const,content:message.trim()};
    const assistantId=crypto.randomUUID();
    setMessages(v=>[...v,user,{id:assistantId,role:"assistant",content:""}]);
    setLoading(true); setError(null); setActiveProvider(null); setActiveModel(null);
    try{
      const res=await fetch("/api/chat",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({message:user.content,mode,modelProfile,providerPreference,fallbackEnabled,context}),
      });
      if(!res.ok){const body=await res.json().catch(()=>({})); throw new Error(body.message||body.error||"Chat failed");}
      setActiveProvider(res.headers.get("x-gridllm-provider"));
      setActiveModel(res.headers.get("x-gridllm-model"));
      const reader=res.body?.getReader(); if(!reader)throw new Error("No response stream");
      const decoder=new TextDecoder();
      for(;;){const {done,value}=await reader.read(); if(done)break; const text=decoder.decode(value,{stream:true}); setMessages(v=>v.map(m=>m.id===assistantId?{...m,content:m.content+text}:m));}
    }catch(e){
      setError(e instanceof Error?e.message:"Chat failed");
      setMessages(v=>v.map(m=>m.id===assistantId?{...m,content:"GRIDLLM is unavailable. Configure at least one AI provider in the server environment and retry."}:m));
    }finally{setLoading(false)}
  },[loading]);

  return{messages,loading,error,send,activeProvider,activeModel};
}
