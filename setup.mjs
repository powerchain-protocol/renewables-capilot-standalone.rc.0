import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const overlayRoot = dirname(fileURLToPath(import.meta.url));
const repoUrl = "https://github.com/powerchain-protocol/powerchain-capilot.git";
const defaultTarget = resolve(overlayRoot, "..", "powerchain-capilot");
const requested = process.argv.find((arg) => !arg.startsWith("--") && arg !== process.argv[0] && arg !== process.argv[1]);
const target = resolve(requested || defaultTarget);
const install = process.argv.includes("--install");

function fail(message) {
  console.error(`\n[powerchain-setup] ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  console.log(`\n$ ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0) fail(`${command} failed with exit code ${result.status ?? "unknown"}`);
}

console.log(`[powerchain-setup] overlay: ${overlayRoot}`);
console.log(`[powerchain-setup] target : ${target}`);

if (!existsSync(target)) {
  run("git", ["clone", repoUrl, target], { cwd: dirname(target) });
}

const packageFile = resolve(target, "package.json");
if (!existsSync(packageFile) || !statSync(packageFile).isFile()) {
  fail(`Target is not the PowerChain repository root: ${target}\nExpected ${packageFile}`);
}

if (realpathSync(target) === realpathSync(overlayRoot)) {
  fail("Target cannot be the overlay directory itself.");
}

run(process.execPath, [resolve(overlayRoot, "bootstrap.mjs"), target], { cwd: overlayRoot });

const pkg = JSON.parse(readFileSync(packageFile, "utf8"));
const required = ["overlay:verify", "workspace:doctor", "prisma:generate", "config:doctor", "peers:check", "typecheck", "build:apps", "dev:apps"];
const missing = required.filter((name) => !pkg.scripts?.[name]);
if (missing.length) fail(`Setup verification failed; missing root scripts: ${missing.join(", ")}`);

console.log("\n[powerchain-setup] repository patched and verified");
console.log(`cd ${target}`);

if (install) {
  run("corepack", ["enable"], { cwd: target });
  run("corepack", ["use", "pnpm@11.22.0"], { cwd: target });
  run("pnpm", ["install", "--no-frozen-lockfile"], { cwd: target });
  run("pnpm", ["overlay:verify"], { cwd: target });
  run("pnpm", ["workspace:doctor"], { cwd: target });
} else {
  console.log("\nNext:");
  console.log("  corepack enable");
  console.log("  corepack use pnpm@11.22.0");
  console.log("  pnpm install --no-frozen-lockfile");
  console.log("  pnpm overlay:verify");
  console.log("  pnpm workspace:doctor");
  console.log("  pnpm prisma:generate");
  console.log("  pnpm config:doctor");
  console.log("  pnpm peers:check");
  console.log("  pnpm typecheck");
  console.log("  pnpm build:apps");
  console.log("  pnpm dev:apps");
}
