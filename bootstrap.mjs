import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const overlayRoot = dirname(fileURLToPath(import.meta.url));
const requestedTarget = process.argv[2] || process.cwd();
const target = resolve(requestedTarget);
const targetPackage = resolve(target, "package.json");

function fail(message) {
  console.error(`\n[powerchain-bootstrap] ${message}`);
  process.exit(1);
}

if (!existsSync(targetPackage) || !statSync(targetPackage).isFile()) {
  fail(`Target is not a monorepo/package root: ${target}\nExpected ${targetPackage}`);
}

if (realpathSync(target) === realpathSync(overlayRoot)) {
  fail("Do not bootstrap into the overlay directory itself. Pass the PowerChain repository root as the target.");
}

console.log(`[powerchain-bootstrap] overlay: ${overlayRoot}`);
console.log(`[powerchain-bootstrap] target : ${target}`);

const apply = spawnSync(process.execPath, [resolve(overlayRoot, "scripts/apply-overlay.mjs"), target], {
  cwd: overlayRoot,
  stdio: "inherit",
  env: process.env,
});
if (apply.status !== 0) fail(`Overlay application failed with exit code ${apply.status ?? "unknown"}`);

const pkg = JSON.parse(readFileSync(targetPackage, "utf8"));
const requiredScripts = [
  "overlay:verify",
  "workspace:doctor",
  "prisma:generate",
  "config:doctor",
  "peers:check",
  "typecheck",
  "build:apps",
  "dev:apps",
];
const missing = requiredScripts.filter((name) => !pkg.scripts?.[name]);
if (missing.length) fail(`Root package.json patch verification failed. Missing scripts: ${missing.join(", ")}`);

for (const file of [
  "scripts/powerchain-workspace.mjs",
  "scripts/clean-app-caches.mjs",
  "apps/backend/package.json",
  "pnpm-workspace.yaml",
]) {
  if (!existsSync(resolve(target, file))) fail(`Required overlay output missing after apply: ${file}`);
}

console.log("\n[powerchain-bootstrap] PASS");
console.log(`Installed root commands: ${requiredScripts.join(", ")}`);
console.log("\nRepository root:");
console.log(`  ${target}`);
console.log("\nNext (run from that repository root):");
console.log("  pnpm overlay:verify");
console.log("  corepack enable");
console.log("  corepack use pnpm@11.22.0");
console.log("  pnpm install --no-frozen-lockfile");
console.log("  pnpm workspace:doctor");
console.log("  pnpm prisma:generate");
console.log("  pnpm config:doctor");
console.log("  pnpm peers:check");
console.log("  pnpm typecheck");
console.log("  pnpm build:apps");
console.log("  pnpm dev:apps");
