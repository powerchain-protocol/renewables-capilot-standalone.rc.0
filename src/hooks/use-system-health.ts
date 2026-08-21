"use client";

import { useSystemHealthContext } from "@/components/providers/system-health-provider";
export type { SystemHealth } from "@/types/system-health";

export function useSystemHealthState() {
  return useSystemHealthContext();
}

/** Backwards-compatible data-only hook. Prefer useSystemHealthState for new UI. */
export function useSystemHealth() {
  return useSystemHealthContext().data;
}
