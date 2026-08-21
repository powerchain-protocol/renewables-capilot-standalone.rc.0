export type SkillDomain = "renewables" | "solana" | "powerchain" | "general";
export type SkillDefinition = { id: string; name: string; description: string; domain: SkillDomain; version: string; enabled: boolean; promptRef: string };
