import type { AgentDefinition } from "@/types/agents";
export const AGENTS: AgentDefinition[] = [
  {id:"renewables-operator",name:"Renewables Operator",description:"Generation, demand, storage and anomaly analysis",capabilities:["analyze","forecast"],skillIds:["renewables","powerchain"],enabled:true},
  {id:"market-analyst",name:"Energy Market Analyst",description:"Local/P2P market, spread and settlement analysis",capabilities:["analyze","market"],skillIds:["renewables","solana"],enabled:true},
  {id:"infrastructure-auditor",name:"Infrastructure Auditor",description:"RPC, program, oracle and indexing diagnostics",capabilities:["audit","infrastructure"],skillIds:["solana","powerchain"],enabled:true},
];
