import fs from "node:fs";

const required = [
  "CHANGELOG.md",
  "src/docs/index.ts",
  "src/docs/prisma.md",
  "src/env/server.ts",
  "src/env/shared.ts",
  "src/constants/solana.ts",
  "src/app/api/v1/solana/config/route.ts",
  "docs/SOLANA.md",
  "src/constants/context/index.ts",
  "src/api/v1/cors/index.ts",
  "src/agents/registry.ts",
  "src/skills/registry.ts",
  "src/memory/store.ts",
  "src/components/ui/icons.tsx",
  "scripts/prepare-prisma-output.mjs",
  "docs/PRISMA.md",
  "docs/DEPENDENCIES.md",
  "supabase/migrations/0002_workspace_extensions.sql",
  "vendor/node-domexception/package.json",
];

const forbiddenSourceFiles = [
  "src/generated/prisma/README.md",
];

const missing = required.filter((path) => !fs.existsSync(path));
const forbidden = forbiddenSourceFiles.filter((path) => fs.existsSync(path));

if (missing.length) {
  console.error("Missing required files:", missing);
  process.exit(1);
}

if (forbidden.length) {
  console.error("Generated Prisma output contains source-controlled placeholders:", forbidden);
  process.exit(1);
}

console.log(`structure ok (${required.length} critical paths)`);

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const nextConfig = fs.readFileSync("next.config.ts", "utf8");
const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"));
const dependencies = packageJson.dependencies ?? {};
const legacyWalletDeps = [
  "@solana/wallet-adapter-wallets",
  "@solana/wallet-adapter-walletconnect",
  "@solana/wallet-adapter-phantom",
  "@solana/wallet-adapter-solflare",
].filter((name) => name in dependencies);
if (legacyWalletDeps.length) {
  console.error("Legacy/default wallet adapter dependencies should not be bundled:", legacyWalletDeps);
  process.exit(1);
}
if (nextConfig.includes("optimizePackageImports")) {
  console.error("Experimental optimizePackageImports should remain disabled for this app");
  process.exit(1);
}
if (!(tsconfig.include ?? []).includes(".next/dev/types/**/*.ts")) {
  console.error("tsconfig must include .next/dev/types/**/*.ts for Next.js development route types");
  process.exit(1);
}
const envExample = fs.readFileSync(".env.example", "utf8");
for (const requiredEnv of [
  "NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com",
  "NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL=https://api.mainnet-beta.solana.com",
  "HELIUS_DEVNET_RPC_URL=https://devnet.helius-rpc.com",
  "HELIUS_MAINNET_RPC_URL=https://mainnet.helius-rpc.com",
  "NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID=TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID=TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
]) {
  if (!envExample.includes(requiredEnv)) {
    console.error(`.env.example is missing canonical Solana setting: ${requiredEnv}`);
    process.exit(1);
  }
}
console.log("config invariants ok (Wallet Standard, stable Next config, dev route types, Solana RPC profile)");
