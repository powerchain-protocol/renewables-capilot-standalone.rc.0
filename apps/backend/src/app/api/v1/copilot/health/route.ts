import { COPILOT_URL } from "@/lib/urls";
export const dynamic="force-dynamic";
export async function GET(request:Request){const copilot = COPILOT_URL;const upstream=await fetch(`${copilot}/api/health`,{headers:{cookie:request.headers.get("cookie")||""},cache:"no-store"}).catch(()=>null);if(!upstream)return Response.json({ok:false,status:"unavailable"},{status:503});return new Response(await upstream.text(),{status:upstream.status,headers:{"content-type":upstream.headers.get("content-type")||"application/json","cache-control":"no-store"}})}
