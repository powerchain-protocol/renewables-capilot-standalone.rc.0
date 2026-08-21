import fs from "node:fs";

const required = [
  "CHANGELOG.md",
  "src/docs/index.ts",
  "src/docs/prisma.md",
  "src/env/server.ts",
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
