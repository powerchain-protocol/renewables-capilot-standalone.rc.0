"use client";
import { STARTER_PROMPTS } from "@/data/prompts";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
export function usePrompts() { const saved=useSavedPrompts(); return { starter:STARTER_PROMPTS, ...saved }; }
