export type WorkspaceContext = {
  portfolio: string;
  timeRange: "1h" | "24h" | "7d" | "30d";
  network: "solana" | "sui" | "cross-chain";
  liveData: boolean;
  assetIds: string[];
};

export const DEFAULT_WORKSPACE_CONTEXT: WorkspaceContext = {
  portfolio: "all-assets",
  timeRange: "24h",
  network: "solana",
  liveData: true,
  assetIds: [],
};
