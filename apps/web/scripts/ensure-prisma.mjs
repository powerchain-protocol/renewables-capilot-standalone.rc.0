import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const schema = resolve(cwd, "prisma/schema.prisma");
const command = process.argv[2] === "validate" ? "validate" : "generate";

if (!existsSync(schema)) {
  console.log(`[powerchain] prisma ${command}: no schema, skipped`);
  process.exit(0);
}

const result = spawnSync("pnpm", ["exec", "prisma", command], {
  cwd,
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(`[powerchain] prisma ${command} failed: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
