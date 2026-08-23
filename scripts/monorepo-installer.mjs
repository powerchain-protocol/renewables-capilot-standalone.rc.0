#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync, appendFileSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(process.cwd());
const mode = process.argv[2] || "doctor";
const PNPM = "11.22.0";
const NODE_MIN_MINOR = 19;
const NEXT = "16.3.2";
const TS = "5.9.3";
const NODE_TYPES = "24.3.0";
const PRISMA = "7.9.1";
const SUPABASE = "2.112.3";
const REACT = "19.2.8";
const REACT_TYPES = "19.2.18";
const REACT_DOM_TYPES = "19.2.4";

const apps = [
  { id: "web", dir: "apps/web", port: 3000 },
  { id: "copilot", dir: "apps/copilot", port: 3001 },
  { id: "backend", dir: "apps/backend", port: 3002 },
];

const rootScripts = {
  "dev": "pnpm dev:apps",
  "dev:web": "pnpm --dir apps/web run dev",
  "dev:copilot": "pnpm --dir apps/copilot run dev",
  "dev:backend": "pnpm --dir apps/backend run dev",
  "dev:apps": "node scripts/powerchain-workspace.mjs dev",
  "build": "pnpm build:apps",
  "build:web": "pnpm --dir apps/web run build",
  "build:copilot": "pnpm --dir apps/copilot run build",
  "build:backend": "pnpm --dir apps/backend run build",
  "build:apps": "pnpm build:backend && pnpm build:web && pnpm build:copilot",
  "start:web": "pnpm --dir apps/web run start",
  "start:copilot": "pnpm --dir apps/copilot run start",
  "start:backend": "pnpm --dir apps/backend run start",
  "typecheck:web": "pnpm --dir apps/web run typecheck",
  "typecheck:copilot": "pnpm --dir apps/copilot run typecheck",
  "typecheck:backend": "pnpm --dir apps/backend run typecheck",
  "typecheck:auth": "pnpm --dir packages/auth run typecheck",
  "typecheck:apps": "pnpm typecheck:web && pnpm typecheck:copilot && pnpm typecheck:backend",
  "typecheck": "pnpm typecheck:auth && pnpm typecheck:apps",
  "prisma:generate:web": "pnpm --dir apps/web run prisma:generate",
  "prisma:generate:copilot": "pnpm --dir apps/copilot run prisma:generate",
  "prisma:generate:backend": "pnpm --dir apps/backend run prisma:generate",
  "prisma:generate": "pnpm prisma:generate:web && pnpm prisma:generate:copilot && pnpm prisma:generate:backend",
  "prisma:validate:web": "pnpm --dir apps/web run prisma:validate",
  "prisma:validate:copilot": "pnpm --dir apps/copilot run prisma:validate",
  "prisma:validate:backend": "pnpm --dir apps/backend run prisma:validate",
  "prisma:validate": "pnpm prisma:validate:web && pnpm prisma:validate:copilot && pnpm prisma:validate:backend",
  "config:doctor": "pnpm --dir apps/copilot run config:doctor && pnpm workspace:doctor",
  "workspace:doctor": "node scripts/powerchain-workspace.mjs doctor",
  "peers:check": "node scripts/powerchain-workspace.mjs peers",
  "ports:check": "node scripts/powerchain-workspace.mjs ports",
  "overlay:verify": "node scripts/verify-installed.mjs",
  "clean:next": "node scripts/clean-app-caches.mjs",
  "dev:reset": "pnpm clean:next && pnpm dev:apps",
  "validate": "node scripts/powerchain-workspace.mjs validate",
  "verify:build": "pnpm ci",
  "install:verified": "node scripts/monorepo-installer.mjs install",
  "setup": "node scripts/monorepo-installer.mjs install",
  "upgrade": "node scripts/monorepo-installer.mjs upgrade",
  "fix": "node scripts/monorepo-installer.mjs repair",
  "doctor": "node scripts/monorepo-installer.mjs doctor",
  "preinstall": "node scripts/monorepo-installer.mjs preinstall",
  "postinstall": "node scripts/monorepo-installer.mjs postinstall",
  "start": "pnpm start:apps",
  "start:apps": "node scripts/powerchain-workspace.mjs start",
  "env:doctor": "node scripts/env-doctor.mjs",
  "check": "pnpm overlay:verify && pnpm validate",
  "ci": "pnpm check && pnpm build:apps",
  "clean": "pnpm clean:next"
};

const appScripts = (port, copilot = false) => ({
  dev: `NEXT_TELEMETRY_DISABLED=1 next dev --turbopack -p ${port}`,
  build: "NEXT_TELEMETRY_DISABLED=1 next build",
  start: `NEXT_TELEMETRY_DISABLED=1 next start -p ${port}`,
  typecheck: "tsc --noEmit",
  "prisma:generate": "node scripts/ensure-prisma.mjs generate",
  "prisma:validate": "node scripts/ensure-prisma.mjs validate",
  predev: "node scripts/ensure-prisma.mjs generate",
  prebuild: "node scripts/ensure-prisma.mjs generate",
  pretypecheck: "node scripts/ensure-prisma.mjs generate",
  ...(copilot ? { "config:doctor": "tsx scripts/config-doctor.ts" } : {}),
});

function fatal(message) {
  console.error(`\n[powerchain-installer] ${message}`);
  process.exit(1);
}
function readJson(file) { return JSON.parse(readFileSync(file, "utf8")); }
function writeJson(file, value) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(value, null, 2) + "\n"); }
function run(command, args, cwd = root) {
  console.log(`\n$ ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, { cwd, stdio: "inherit", env: process.env });
  if (result.status !== 0) fatal(`${command} failed with exit code ${result.status ?? "unknown"}`);
}
function validNode() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  return major === 24 && minor >= NODE_MIN_MINOR;
}
function packageFile(dir = ".") { return resolve(root, dir, "package.json"); }


function readJsoncText(input) {
  const noComments = input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(noComments);
}

function ensureTsconfig(app) {
  const file = resolve(root, app.dir, "tsconfig.json");
  let current = {};
  if (existsSync(file)) {
    try { current = readJsoncText(readFileSync(file, "utf8")); }
    catch { current = {}; }
  }
  const compiler = current.compilerOptions || {};
  const plugins = Array.isArray(compiler.plugins) ? [...compiler.plugins] : [];
  if (!plugins.some((item) => item?.name === "next")) plugins.push({ name: "next" });
  const restrictedTypes = Array.isArray(compiler.types)
    ? [...new Set([...compiler.types, "node", "react", "react-dom"])]
    : ["node", "react", "react-dom"];
  current.compilerOptions = {
    ...compiler,
    module: "esnext",
    moduleResolution: "bundler",
    noEmit: true,
    esModuleInterop: true,
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: "react-jsx",
    incremental: true,
    skipLibCheck: true,
    plugins,
    types: restrictedTypes,
    paths: { ...(compiler.paths || {}), "@/*": ["./src/*"] },
  };
  current.include = [...new Set([...(current.include || []), "next-env.d.ts", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "src/**/*.ts", "src/**/*.tsx", "*.ts"] )];
  current.exclude = [...new Set([...(current.exclude || []), "node_modules"] )];
  writeJson(file, current);

  const nextEnv = resolve(root, app.dir, "next-env.d.ts");
  if (!existsSync(nextEnv)) writeFileSync(nextEnv, '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// This file is generated/maintained for Next.js TypeScript support.\n');
}

function ensureAppGitignore(app) {
  const file = resolve(root, app.dir, ".gitignore");
  let source = existsSync(file) ? readFileSync(file, "utf8") : "";
  const entries = [".next/", "src/generated/prisma/", "*.tsbuildinfo", ".env*", "!.env.example"];
  const missing = entries.filter((x) => !source.split(/\r?\n/).some((line) => line.trim() === x));
  if (missing.length) {
    if (source && !source.endsWith("\n")) source += "\n";
    source += `${source.trim() ? "\n" : ""}# PowerChain app-generated files\n${missing.join("\n")}\n`;
    writeFileSync(file, source);
  }
}

function ensureRootManifest() {
  const file = packageFile();
  if (!existsSync(file)) fatal(`package.json missing at ${root}`);
  const pkg = readJson(file);
  pkg.private = true;
  pkg.packageManager = `pnpm@${PNPM}`;
  pkg.engines = { ...(pkg.engines || {}), node: ">=24.19.0 <25" };
  pkg.workspaces = ["apps/*", "packages/*", "programs/*"];
  pkg.scripts = { ...(pkg.scripts || {}), ...rootScripts };
  delete pkg.scripts["predev:apps"];
  delete pkg.scripts["prebuild:apps"];
  if (pkg.devDependencies?.concurrently) {
    delete pkg.devDependencies.concurrently;
    if (!Object.keys(pkg.devDependencies).length) delete pkg.devDependencies;
  }
  writeJson(file, pkg);
}

function ensureAppManifest(app) {
  const file = packageFile(app.dir);
  const pkg = existsSync(file) ? readJson(file) : { name: `@powerchain/${app.id}`, version: "1.0.0", private: true };
  pkg.private = true;
  pkg.packageManager = `pnpm@${PNPM}`;
  pkg.engines = { ...(pkg.engines || {}), node: ">=24.19.0 <25" };
  pkg.scripts = { ...(pkg.scripts || {}), ...appScripts(app.port, app.id === "copilot") };
  pkg.dependencies = {
    ...(pkg.dependencies || {}),
    "@powerchain/auth": "workspace:*",
    "@prisma/adapter-pg": PRISMA,
    "@prisma/client": PRISMA,
    "@supabase/supabase-js": SUPABASE,
    next: NEXT,
    pg: "8.23.0",
    react: REACT,
    "react-dom": REACT,
    zod: pkg.dependencies?.zod || "4.4.3",
  };
  if (app.id !== "backend") {
    pkg.dependencies["@supabase/ssr"] = "0.12.4";
  }
  if (app.id === "web") {
    pkg.dependencies["better-auth"] = "1.6.29";
    pkg.dependencies["@better-auth/prisma-adapter"] = "1.6.29";
  }
  if (app.id === "copilot") {
    pkg.dependencies["@radix-ui/react-icons"] = pkg.dependencies?.["@radix-ui/react-icons"] || "1.3.2";
    pkg.dependencies["@web3icons/react"] = pkg.dependencies?.["@web3icons/react"] || "4.1.21";
  }
  pkg.devDependencies = {
    ...(pkg.devDependencies || {}),
    "@types/node": NODE_TYPES,
    "@types/pg": "8.23.1",
    "@types/react": REACT_TYPES,
    "@types/react-dom": REACT_DOM_TYPES,
    dotenv: "17.4.2",
    prisma: PRISMA,
    typescript: TS,
    ...(app.id === "copilot" ? { tsx: "4.23.12" } : {}),
  };
  delete pkg.dependencies?.["@powerchain/authz"];
  delete pkg.devDependencies?.["@powerchain/authz"];
  writeJson(file, pkg);
}

function ensureWorkspace() {
  const file = resolve(root, "pnpm-workspace.yaml");
  let source = existsSync(file) ? readFileSync(file, "utf8") : "";
  const snippets = [
    ["packages:", "packages:\n  - apps/*\n  - packages/*\n  - programs/*"],
    ["overrides:", "overrides:\n  utf-8-validate: 5.0.10"],
    ["peerDependencyRules:", 'peerDependencyRules:\n  allowedVersions:\n    utf-8-validate: \">=5.0.2\"'],
  ];
  for (const [needle, block] of snippets) if (!source.includes(needle)) source += `${source.trim() ? "\n\n" : ""}${block}\n`;
  for (const item of ["apps/*", "packages/*", "programs/*"]) if (!source.includes(item)) source = source.replace(/packages:\s*\n/, (m) => `${m}  - ${item}\n`);
  if (!/utf-8-validate:\s*5\.0\.10/.test(source)) {
    if (source.includes("overrides:")) source = source.replace(/overrides:\s*\n/, (m) => `${m}  utf-8-validate: 5.0.10\n`);
  }
  const ageItems = [
    `next@${NEXT}`, `@next/env@${NEXT}`, `@next/swc-darwin-arm64@${NEXT}`, `@next/swc-darwin-x64@${NEXT}`,
    `@next/swc-linux-arm64-gnu@${NEXT}`, `@next/swc-linux-arm64-musl@${NEXT}`, `@next/swc-linux-x64-gnu@${NEXT}`,
    `@next/swc-linux-x64-musl@${NEXT}`, `@next/swc-win32-arm64-msvc@${NEXT}`, `@next/swc-win32-x64-msvc@${NEXT}`,
  ];
  if (!source.includes("minimumReleaseAgeExclude:")) source += `\nminimumReleaseAgeExclude:\n${ageItems.map((x) => `  - \"${x}\"`).join("\n")}\n`;
  else {
    const missing = ageItems.filter((x) => !source.includes(x));
    if (missing.length) source = source.replace(/minimumReleaseAgeExclude:\s*\n/, (m) => `${m}${missing.map((x) => `  - \"${x}\"\n`).join("")}`);
  }
  writeFileSync(file, source.replace(/\n{3,}/g, "\n\n").replace(/\s*$/, "\n"));
}

function ensureGitignore() {
  const file = resolve(root, ".gitignore");
  let source = existsSync(file) ? readFileSync(file, "utf8") : "";
  const entries = ["node_modules/", ".pnpm-store/", ".turbo/", ".next/", ".open-next/", ".vercel/", ".wrangler/", "dist/", "out/", "coverage/", "*.tsbuildinfo", "*.log", ".DS_Store", ".env*", "!.env.example", "!**/.env.example", "**/src/generated/prisma/"];
  const missing = entries.filter((x) => !source.split(/\r?\n/).some((line) => line.trim() === x));
  if (missing.length) {
    if (source && !source.endsWith("\n")) source += "\n";
    source += `${source.trim() ? "\n" : ""}# PowerChain generated/local files\n${missing.join("\n")}\n`;
    writeFileSync(file, source);
  }
}

function removeLegacy() {
  const legacy = resolve(root, "packages/authz");
  if (existsSync(legacy)) rmSync(legacy, { recursive: true, force: true });
}

function repair() {
  ensureRootManifest();
  for (const app of apps) {
    ensureAppManifest(app);
    ensureTsconfig(app);
    ensureAppGitignore(app);
  }
  ensureWorkspace();
  ensureGitignore();
  removeLegacy();
  console.log("[powerchain-installer] manifests/workspace repaired");
}

function doctor() {
  let problems = [];
  if (!validNode()) problems.push(`Node ${process.version}; expected >=24.19.0 <25`);
  const rootPkg = existsSync(packageFile()) ? readJson(packageFile()) : null;
  if (!rootPkg) problems.push("root package.json missing");
  else {
    for (const [name, script] of Object.entries(rootScripts)) if (!rootPkg.scripts?.[name]) problems.push(`root script '${name}' missing`);
    if (rootPkg.packageManager !== `pnpm@${PNPM}`) problems.push(`packageManager must be pnpm@${PNPM}`);
  }
  for (const app of apps) {
    const file = packageFile(app.dir);
    if (!existsSync(file)) { problems.push(`${app.dir}/package.json missing`); continue; }
    const pkg = readJson(file);
    if (pkg.dependencies?.next !== NEXT) problems.push(`${app.id}: next ${pkg.dependencies?.next || "missing"}; expected ${NEXT}`);
    if (!pkg.devDependencies?.["@types/node"]) problems.push(`${app.id}: @types/node missing`);
    if (!pkg.scripts?.dev || !pkg.scripts?.build || !pkg.scripts?.typecheck) problems.push(`${app.id}: lifecycle scripts incomplete`);
    const tsconfig = resolve(root, app.dir, "tsconfig.json");
    if (!existsSync(tsconfig)) problems.push(`${app.id}: tsconfig.json missing`);
    const nextEnv = resolve(root, app.dir, "next-env.d.ts");
    if (!existsSync(nextEnv)) problems.push(`${app.id}: next-env.d.ts missing`);
  }
  for (const file of ["scripts/powerchain-workspace.mjs", "scripts/verify-installed.mjs", "scripts/env-doctor.mjs", "packages/auth/package.json", "pnpm-workspace.yaml", ".nvmrc", ".node-version"]) if (!existsSync(resolve(root, file))) problems.push(`${file} missing`);
  if (problems.length) {
    console.error("PowerChain monorepo doctor: FAIL");
    for (const problem of problems) console.error(`- ${problem}`);
    process.exit(1);
  }
  console.log("PowerChain monorepo doctor: PASS");
  for (const app of apps) console.log(`- ${app.id.padEnd(8)} ${app.dir} :${app.port}`);
}

function install({ upgrade = false } = {}) {
  repair();
  if (!validNode()) fatal(`Node ${process.version} is unsupported; use Node >=24.19.0 <25`);
  run("corepack", ["enable"]);
  run("corepack", ["use", `pnpm@${PNPM}`]);
  run("pnpm", ["install", "--no-frozen-lockfile"]);
  run("pnpm", ["overlay:verify"]);
  run("pnpm", ["workspace:doctor"]);
  run("pnpm", ["prisma:generate"]);
  run("pnpm", ["prisma:validate"]);
  run("pnpm", ["peers:check"]);
  run("pnpm", ["typecheck"]);
  if (upgrade) run("pnpm", ["build:apps"]);
  console.log(`\nPowerChain monorepo ${upgrade ? "upgrade" : "install"}: PASS`);
}

function preinstall() {
  if (!validNode()) fatal(`Node ${process.version} is unsupported; use Node >=24.19.0 <25`);
  console.log(`[powerchain-installer] Node ${process.version} ✓`);
}

function postinstall() {
  console.log("[powerchain-installer] dependencies installed; generate Prisma with 'pnpm prisma:generate' or run 'pnpm validate'.");
}

if (mode === "doctor") doctor();
else if (mode === "repair") repair();
else if (mode === "install") install();
else if (mode === "upgrade") install({ upgrade: true });
else if (mode === "preinstall") preinstall();
else if (mode === "postinstall") postinstall();
else fatal(`Unknown mode '${mode}'. Use doctor|repair|install|upgrade|preinstall|postinstall.`);
