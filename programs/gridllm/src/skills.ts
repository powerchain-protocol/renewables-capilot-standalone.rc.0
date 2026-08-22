export type GridllmSkillBinding = {
  id: string;
  executable: false;
  requiresEvidence: boolean;
};

export const GRIDLLM_SKILL_BINDINGS: GridllmSkillBinding[] = [
  { id: "renewables", executable: false, requiresEvidence: true },
  { id: "powerchain", executable: false, requiresEvidence: true },
  { id: "solana", executable: false, requiresEvidence: true },
];
