"use client";
import { useCallback, useEffect, useState } from "react";
export type SavedPrompt={id:string;title:string;content:string;tags:string[]};
const KEY="powerchain.saved-prompts.v1";
export function useSavedPrompts(){const[prompts,setPrompts]=useState<SavedPrompt[]>([]); useEffect(()=>{void fetch("/api/prompts").then(r=>r.json()).then(b=>setPrompts(b.prompts??[])).catch(()=>{try{setPrompts(JSON.parse(localStorage.getItem(KEY)||"[]"))}catch{}})},[]); const save=useCallback(async(input:Omit<SavedPrompt,"id">)=>{const local={...input,id:crypto.randomUUID()}; try{const r=await fetch("/api/prompts",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(input)}); if(r.ok){const b=await r.json(); setPrompts(v=>[b.prompt,...v]); return b.prompt;}}catch{} setPrompts(v=>{const next=[local,...v]; localStorage.setItem(KEY,JSON.stringify(next)); return next}); return local;},[]); return{prompts,save};}
