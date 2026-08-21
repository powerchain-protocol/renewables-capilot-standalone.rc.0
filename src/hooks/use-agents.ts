"use client";
import { AGENTS } from "@/agents/registry";
export function useAgents() { return { agents:AGENTS, enabled:AGENTS.filter(a=>a.enabled) }; }
