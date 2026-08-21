export type WorkspaceDoc = {
  slug: string;
  title: string;
  description: string;
  path: string;
};

export const WORKSPACE_DOCS: readonly WorkspaceDoc[] = [
  { slug: "changelog", title: "Changelog", description: "Release history and install-hardening changes.", path: "/CHANGELOG.md" },
  { slug: "getting-started", title: "Getting Started", description: "Install, configure and start Renewables Copilot.", path: "/docs/GETTING_STARTED.md" },
  { slug: "prisma", title: "Prisma", description: "Generated client lifecycle and database commands.", path: "/docs/PRISMA.md" },
  { slug: "dependencies", title: "Dependencies", description: "pnpm policy, build approvals and deprecation handling.", path: "/docs/DEPENDENCIES.md" },
  { slug: "ai", title: "AI", description: "GRIDLLM model routing and provider boundaries.", path: "/docs/AI.md" },
  { slug: "solana", title: "Solana", description: "Wallet, RPC, Helius and PowerChain program configuration.", path: "/docs/SOLANA.md" },
  { slug: "security", title: "Security", description: "Secrets, signing, RLS and fail-closed behavior.", path: "/docs/SECURITY.md" },
] as const;
