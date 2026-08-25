import { WEB_URL, COPILOT_URL, BACKEND_URL } from "@/lib/urls";
export const dynamic="force-dynamic";
export function GET(){return Response.json({webUrl:WEB_URL,copilotUrl:COPILOT_URL,backendUrl:BACKEND_URL,network:process.env.NEXT_PUBLIC_POWERCHAIN_NETWORK??"devnet",cluster:process.env.NEXT_PUBLIC_SOLANA_CLUSTER??"devnet",hosting:{primary:process.env.HOSTING_PRIMARY??"vercel",secondary:process.env.HOSTING_SECONDARY??"cloudflare",emergency:process.env.HOSTING_EMERGENCY??"aws"}},{headers:{"cache-control":"no-store"}})}
