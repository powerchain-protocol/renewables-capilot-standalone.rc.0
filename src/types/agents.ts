export type AgentCapability = "analyze" | "forecast" | "audit" | "market" | "infrastructure" | "tokenomics";
export type AgentDefinition = { id: string; name: string; description: string; capabilities: AgentCapability[]; skillIds: string[]; enabled: boolean };
