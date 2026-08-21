import { safeJsonParse } from "@/utils/helpers";
export function browserGet<T>(key:string, fallback:T):T { if(typeof window==="undefined") return fallback; return safeJsonParse(localStorage.getItem(key) ?? "", fallback); }
export function browserSet<T>(key:string, value:T) { if(typeof window!=="undefined") localStorage.setItem(key, JSON.stringify(value)); }
export function browserRemove(key:string) { if(typeof window!=="undefined") localStorage.removeItem(key); }
