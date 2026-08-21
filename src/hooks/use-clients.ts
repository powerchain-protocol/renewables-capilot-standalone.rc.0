"use client";
import { useMemo } from "react";
import { CLIENT_CATALOG } from "@/data/clients";
import { useSystemHealth, type SystemHealth } from "@/hooks/use-system-health";
export function useClients() { const health=useSystemHealth(); return useMemo(()=>CLIENT_CATALOG.map(client=>({ ...client, status: health ? resolve(client.id, health.services) : "unconfigured" as const })),[health]); }
function resolve(id:string, services:SystemHealth["services"]) { return id in services && services[id as keyof typeof services] ? "configured" as const : "unconfigured" as const; }
