"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/api/client";

type ConfigHealth = { ok: boolean; integrations: { openai: { configured:boolean; baseUrl:string; responsesUrl:string; chatgptCompatibilityUrl?:string }; supabase:{configured:boolean; invalidPublicUrl:boolean}; helius:{configured:boolean}; pyth:{configured:boolean} } };

export function useConfigHealth() {
  const [data, setData] = useState<ConfigHealth | null>(null);
  useEffect(() => { let active = true; void apiRequest<ConfigHealth>("/api/v1/config").then((result) => { if (active && result.ok) setData(result.data); }); return () => { active = false; }; }, []);
  return data;
}
