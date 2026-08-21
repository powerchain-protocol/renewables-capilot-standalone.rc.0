"use client";

import { createContext, useContext, type ReactNode } from "react";
import { apiRequest } from "@/api/client";
import { usePolling, type PollingState } from "@/hooks/use-polling";
import type { SystemHealth } from "@/types/system-health";

const SystemHealthContext = createContext<PollingState<SystemHealth> | null>(null);

async function loadHealth(signal: AbortSignal) {
  const result = await apiRequest<SystemHealth>("/api/health", { signal }, undefined, 8_000);
  if (!result.ok) throw new Error(result.error.message);
  return result.data;
}

export function SystemHealthProvider({ children }: { children: ReactNode }) {
  const state = usePolling(loadHealth, 30_000);
  return <SystemHealthContext.Provider value={state}>{children}</SystemHealthContext.Provider>;
}

export function useSystemHealthContext() {
  const value = useContext(SystemHealthContext);
  if (!value) throw new Error("useSystemHealthContext must be used inside SystemHealthProvider");
  return value;
}
