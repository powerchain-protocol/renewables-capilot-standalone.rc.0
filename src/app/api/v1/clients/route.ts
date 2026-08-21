import { providerConfigured } from "@/lib/ai/providers";
import { serverEnv } from "@/env/server";
export function GET(){return Response.json({clients:[
  {id:"openai",configured:providerConfigured("openai"),serverOnly:true},
  {id:"anthropic",configured:providerConfigured("anthropic"),serverOnly:true},
  {id:"google",configured:providerConfigured("google"),serverOnly:true},
  {id:"deepseek",configured:providerConfigured("deepseek"),serverOnly:true},
  {id:"lora",configured:providerConfigured("lora"),serverOnly:true},
  {id:"helius",configured:Boolean(serverEnv.HELIUS_API_KEY),serverOnly:true},
  {id:"pyth",configured:Boolean(serverEnv.PYTH_HERMES_URL&&serverEnv.PYTH_API_KEY),serverOnly:true},
  {id:"supabase",configured:Boolean(serverEnv.NEXT_PUBLIC_SUPABASE_URL&&serverEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),serverOnly:false},
]},{headers:{"cache-control":"no-store"}})}
