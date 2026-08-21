import type { ExternalClient } from "@/types/clients";
export const CLIENT_CATALOG: ExternalClient[] = [
  { id:"openai", name:"OpenAI", category:"ai", status:"unconfigured", serverOnly:true },
  { id:"anthropic", name:"Anthropic", category:"ai", status:"unconfigured", serverOnly:true },
  { id:"google", name:"Google GenAI", category:"ai", status:"unconfigured", serverOnly:true },
  { id:"deepseek", name:"DeepSeek", category:"ai", status:"unconfigured", serverOnly:true },
  { id:"helius", name:"Helius", category:"rpc", status:"unconfigured", serverOnly:true },
  { id:"pyth", name:"Pyth Hermes", category:"oracle", status:"unconfigured", serverOnly:true },
  { id:"supabase", name:"Supabase", category:"database", status:"unconfigured" },
];
