import type { SkillDefinition } from "@/types/skills";
export const SKILLS: SkillDefinition[] = [
  {id:"renewables",name:"Renewables",description:"Energy operations, markets, forecasting and storage",domain:"renewables",version:"1.0.0",enabled:true,promptRef:"src/skills/renewables.md"},
  {id:"solana",name:"Solana",description:"SVM, transactions, programs, RPC and wallet review",domain:"solana",version:"1.0.0",enabled:true,promptRef:"src/skills/solana.md"},
  {id:"powerchain",name:"PowerChain",description:"PWRC, tokenized energy, carbon and PowerChain infrastructure",domain:"powerchain",version:"1.0.0",enabled:true,promptRef:"src/skills/powerchain.md"},
];
