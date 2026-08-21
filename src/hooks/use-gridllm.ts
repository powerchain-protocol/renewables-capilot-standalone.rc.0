"use client";
import { useCallback, useRef, useState } from "react";
import type { ModelProfile } from "@/lib/ai/model-registry";
import type { AIProviderPreference } from "@/lib/ai/settings";

export type ChatMessage = { id:string; role:"user"|"assistant"; content:string };

export function useGridLLM() {
  const [messages,setMessages] = useState<ChatMessage[]>([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);
  const [activeProvider,setActiveProvider] = useState<string|null>(null);
  const [activeModel,setActiveModel] = useState<string|null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => { abortRef.current?.abort(); abortRef.current = null; setLoading(false); }, []);
  const clear = useCallback(() => { stop(); setMessages([]); setError(null); setActiveProvider(null); setActiveModel(null); }, [stop]);

  const send = useCallback(async (message:string, mode="analyze", context:Record<string,unknown>={}, modelProfile:ModelProfile="balanced", providerPreference:AIProviderPreference="auto", fallbackEnabled=true) => {
    const content = message.trim();
    if (!content || loading) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const user = { id:crypto.randomUUID(), role:"user" as const, content };
    const assistantId = crypto.randomUUID();
    setMessages(v => [...v,user,{id:assistantId,role:"assistant",content:""}]);
    setLoading(true); setError(null); setActiveProvider(null); setActiveModel(null);
    try {
      const res = await fetch("/api/v1/chat", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({message:content,mode,modelProfile,providerPreference,fallbackEnabled,context}), signal:controller.signal });
      if (!res.ok) { const body = await res.json().catch(()=>({})); throw new Error(body.message || body.error || `Chat failed (${res.status})`); }
      setActiveProvider(res.headers.get("x-gridllm-provider")); setActiveModel(res.headers.get("x-gridllm-model"));
      const reader = res.body?.getReader(); if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder();
      for (;;) { const {done,value}=await reader.read(); if(done) break; const text=decoder.decode(value,{stream:true}); setMessages(v=>v.map(m=>m.id===assistantId?{...m,content:m.content+text}:m)); }
    } catch (cause) {
      if (controller.signal.aborted) { setMessages(v=>v.map(m=>m.id===assistantId&&m.content===""?{...m,content:"Generation stopped."}:m)); }
      else { setError(cause instanceof Error?cause.message:"Chat failed"); setMessages(v=>v.map(m=>m.id===assistantId&&m.content===""?{...m,content:"GRIDLLM is unavailable. Check AI Settings and provider configuration, then retry."}:m)); }
    } finally { if (abortRef.current===controller) abortRef.current=null; setLoading(false); }
  }, [loading]);

  return { messages, loading, error, send, stop, clear, activeProvider, activeModel };
}
