"use client";
import { BookmarkIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
export function SavedPrompts({onSelect}:{onSelect?:(content:string)=>void}){const{prompts}=useSavedPrompts();return <section className="rounded-xl border bg-[var(--card)] p-3"><div className="flex items-center gap-2 text-sm font-semibold"><BookmarkIcon/>Saved prompts <span className="ml-auto text-xs font-normal text-[var(--muted-foreground)]">{prompts.length}</span></div><div className="mt-2 space-y-1">{prompts.length===0?<p className="text-xs text-[var(--muted-foreground)]">Save a useful analysis prompt to reuse it here.</p>:prompts.slice(0,6).map(prompt=><Button key={prompt.id} variant="ghost" size="sm" className="h-auto w-full justify-start whitespace-normal py-2 text-left" onClick={()=>onSelect?.(prompt.content)}>{prompt.title}</Button>)}</div></section>}
