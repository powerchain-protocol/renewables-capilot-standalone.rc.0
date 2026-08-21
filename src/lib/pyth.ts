import { serverEnv } from "@/env/server";
export type PythPrice = { id:string; price:string; conf:string; expo:number; publishTime:number };
export async function getPythLatestPrice(feedIds: string[]): Promise<PythPrice[]> {
  if (!serverEnv.PYTH_HERMES_URL) return [];
  const url = new URL("/v2/updates/price/latest", serverEnv.PYTH_HERMES_URL);
  for (const id of feedIds) url.searchParams.append("ids[]", id);
  const response = await fetch(url, { headers: serverEnv.PYTH_API_KEY ? { Authorization:`Bearer ${serverEnv.PYTH_API_KEY}` } : undefined, cache:"no-store" });
  if (!response.ok) throw new Error(`PYTH_HTTP_${response.status}`);
  const body = await response.json() as { parsed?: Array<{id:string; price:{price:string;conf:string;expo:number;publish_time:number}}> };
  return (body.parsed ?? []).map(({id,price})=>({id,price:price.price,conf:price.conf,expo:price.expo,publishTime:price.publish_time}));
}
