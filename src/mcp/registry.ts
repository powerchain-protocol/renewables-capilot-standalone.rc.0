export type McpCapability = { id:string; name:string; mode:"read"|"prepare"; description:string };
export const MCP_CAPABILITIES:McpCapability[] = [
  {id:"powerchain.energy.read",name:"Energy context",mode:"read",description:"Read normalized renewable operations context."},
  {id:"powerchain.solana.read",name:"Solana context",mode:"read",description:"Read allowlisted Solana RPC and program status."},
  {id:"powerchain.transaction.prepare",name:"Transaction preparation",mode:"prepare",description:"Prepare unsigned, human-reviewable transaction intents only."},
];
