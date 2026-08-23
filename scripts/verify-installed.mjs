import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const pkgFile = resolve(root, "package.json");
if (!existsSync(pkgFile)) {
  console.error("Not at a package root.");
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgFile, "utf8"));
const names = ["setup", "upgrade", "fix", "doctor", "overlay:verify", "workspace:doctor", "env:doctor", "prisma:generate", "prisma:validate", "config:doctor", "peers:check", "typecheck", "build:apps", "dev:apps", "start:apps", "check", "ci"];
console.log(`Root: ${root}`);
console.log(`Package: ${pkg.name ?? "unnamed"}`);
for (const name of names) console.log(`${name.padEnd(18)} ${pkg.scripts?.[name] ? "installed ✓" : "MISSING ✗"}`);

const requiredFiles = [
  "apps/web/README.md",
  "apps/copilot/README.md",
  "apps/backend/README.md",
  "scripts/monorepo-installer.mjs",
  "scripts/env-doctor.mjs",
  ".nvmrc",
  ".node-version",
  ".github/workflows/ci.yml",
  "apps/backend/prisma/schema.prisma",
  "apps/backend/prisma.config.ts",
  "apps/backend/supabase/migrations/0001_backend_audit_events.sql",
  "apps/copilot/prisma/schema.prisma",
  "apps/copilot/prisma.config.ts",
  "apps/copilot/supabase/migrations/0001_copilot_defaults.sql",
  "apps/web/src/app/api/v1/auth/session/route.ts",
  "apps/backend/src/app/api/v1/auth/session/route.ts",
  "apps/web/scripts/ensure-prisma.mjs",
  "apps/copilot/scripts/ensure-prisma.mjs",
  "apps/backend/scripts/ensure-prisma.mjs",
  "apps/web/tsconfig.json",
  "apps/web/next-env.d.ts",
  "apps/web/next.config.ts",
  "apps/web/proxy.ts",
  "apps/copilot/tsconfig.json",
  "apps/copilot/next-env.d.ts",
  "apps/copilot/next.config.ts",
  "apps/copilot/proxy.ts",
  "apps/backend/tsconfig.json",
  "apps/backend/next-env.d.ts",
  ".gitignore",
  "packages/auth/package.json",
  "packages/auth/src/index.ts",
];
for (const file of requiredFiles) console.log(`${file.padEnd(42)} ${existsSync(resolve(root, file)) ? "present ✓" : "MISSING ✗"}`);

const appPackageProblems = [];
for (const app of ["web", "copilot", "backend"]) {
  const file = resolve(root, `apps/${app}/package.json`);
  if (!existsSync(file)) { appPackageProblems.push(`apps/${app}/package.json missing`); continue; }
  const appPkg = JSON.parse(readFileSync(file, "utf8"));
  if (appPkg.dependencies?.next !== "16.3.2") appPackageProblems.push(`${app}: next must be 16.3.2`);
  if (!appPkg.devDependencies?.["@types/node"]) appPackageProblems.push(`${app}: @types/node missing`);
  if (!appPkg.devDependencies?.typescript) appPackageProblems.push(`${app}: typescript missing`);
  for (const script of ["dev", "build", "start", "typecheck", "prisma:generate", "prisma:validate"]) {
    if (!appPkg.scripts?.[script]) appPackageProblems.push(`${app}: missing ${script} script`);
  }
  if (app === "copilot" && !appPkg.scripts?.["config:doctor"]) appPackageProblems.push("copilot: missing config:doctor script");
}

const rootScriptProblems = [];
const directAppScripts = {
  "dev:web": "apps/web",
  "dev:copilot": "apps/copilot",
  "dev:backend": "apps/backend",
  "build:web": "apps/web",
  "build:copilot": "apps/copilot",
  "build:backend": "apps/backend",
  "typecheck:web": "apps/web",
  "typecheck:copilot": "apps/copilot",
  "typecheck:backend": "apps/backend",
};
for (const [name, dir] of Object.entries(directAppScripts)) {
  if (!pkg.scripts?.[name]?.includes(`--dir ${dir}`)) rootScriptProblems.push(`${name} must invoke ${dir} directly`);
}
if (pkg.scripts?.["dev:apps"] !== "node scripts/powerchain-workspace.mjs dev") rootScriptProblems.push("dev:apps must use the native PowerChain workspace runner");
if (pkg.scripts?.["start:apps"] !== "node scripts/powerchain-workspace.mjs start") rootScriptProblems.push("start:apps must use the native PowerChain workspace runner");
if (pkg.devDependencies?.concurrently) rootScriptProblems.push("concurrently is no longer required; remove the stale root dependency");
if (pkg.scripts?.["predev:apps"] || pkg.scripts?.["prebuild:apps"]) rootScriptProblems.push("legacy predev:apps/prebuild:apps hooks must be removed; the native runner owns preflight");

const missingScripts = names.filter((name) => !pkg.scripts?.[name]);
const missingFiles = requiredFiles.filter((file) => !existsSync(resolve(root, file)));
const legacy = ["packages/authz", "apps/web/src/app/api/v1/authz", "apps/backend/src/app/api/v1/session"].filter((file) => existsSync(resolve(root, file)));

if (missingScripts.length || missingFiles.length || legacy.length || appPackageProblems.length || rootScriptProblems.length) {
  if (missingScripts.length) console.error(`\nMissing root scripts: ${missingScripts.join(", ")}`);
  if (missingFiles.length) console.error(`Missing overlay files: ${missingFiles.join(", ")}`);
  if (legacy.length) console.error(`Legacy authz paths still present: ${legacy.join(", ")}`);
  if (appPackageProblems.length) console.error(`App package problems: ${appPackageProblems.join("; ")}`);
  if (rootScriptProblems.length) console.error(`Root package orchestration problems: ${rootScriptProblems.join("; ")}`);
  console.error("\nOverlay is not fully installed into this root. Rerun bootstrap.mjs from the overlay directory.");
  process.exit(1);
}

console.log("\nOverlay installation: PASS");
