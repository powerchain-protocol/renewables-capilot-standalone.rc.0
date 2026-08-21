export type ActionRisk = "read" | "prepare" | "sign" | "irreversible";
export type PowerChainAction = {
  id: string;
  label: string;
  domain: "ai" | "energy" | "carbon" | "solana" | "wallet" | "system";
  risk: ActionRisk;
  requiresWallet: boolean;
  requiresReview: boolean;
};
