import type { AssistantTokenBinding, GridllmMode } from "./types";
export type TokenizedAssistant = {
  id: string;
  name: string;
  description: string;
  modes: GridllmMode[];
  skillIds: string[];
  token: AssistantTokenBinding;
};
export const TOKENIZED_ASSISTANTS: TokenizedAssistant[] = [
  { id: "renewables-operator", name: "Renewables Operator", description: "Analyzes generation, storage, telemetry and operating constraints.", modes: ["analyze","forecast","optimize"], skillIds: ["renewables","solana"], token: { assistantId: "renewables-operator", chain: "solana", assetAddress: null, standard: "none", purpose: "identity", executableAuthority: false } },
  { id: "market-analyst", name: "Local Market Analyst", description: "Analyzes local/P2P price, liquidity, settlement and market evidence.", modes: ["analyze","compare","forecast"], skillIds: ["renewables","powerchain"], token: { assistantId: "market-analyst", chain: "solana", assetAddress: null, standard: "none", purpose: "access", executableAuthority: false } },
];
