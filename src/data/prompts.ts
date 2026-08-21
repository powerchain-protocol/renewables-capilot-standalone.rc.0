export const STARTER_PROMPTS = [
  { id:"ops", title:"Operations review", content:"Review renewable generation, demand, storage state and anomalies for the selected portfolio." },
  { id:"market", title:"Local market analysis", content:"Analyze local and P2P energy market spreads, liquidity and settlement opportunities." },
  { id:"carbon", title:"Carbon audit", content:"Audit carbon credit inventory, provenance, allocation and retirement state." },
  { id:"infra", title:"Infrastructure health", content:"Check Solana, Sui, oracle, RPC, worker and indexing health for PowerChain." },
] as const;
