import fs from "node:fs";
import path from "node:path";

const overlay = path.resolve(import.meta.dirname, "..");
const target = path.resolve(process.argv[2] || ".");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readJsonc(file) {
  const input = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  let output = "";
  let inString = false;
  let escape = false;
  let lineComment = false;
  let blockComment = false;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    const next = input[i + 1];
    if (lineComment) {
      if (ch === "\n") { lineComment = false; output += ch; }
      continue;
    }
    if (blockComment) {
      if (ch === "*" && next === "/") { blockComment = false; i += 1; }
      else if (ch === "\n") output += ch;
      continue;
    }
    if (inString) {
      output += ch;
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; output += ch; continue; }
    if (ch === "/" && next === "/") { lineComment = true; i += 1; continue; }
    if (ch === "/" && next === "*") { blockComment = true; i += 1; continue; }
    output += ch;
  }
  let cleaned = "";
  inString = false; escape = false;
  for (let i = 0; i < output.length; i += 1) {
    const ch = output[i];
    if (inString) {
      cleaned += ch;
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; cleaned += ch; continue; }
    if (ch === ",") {
      let j = i + 1;
      while (j < output.length && /\s/.test(output[j])) j += 1;
      if (output[j] === "}" || output[j] === "]") continue;
    }
    cleaned += ch;
  }
  return JSON.parse(cleaned);
}

function mergeJson(targetFile, patchFile) {
  if (!fs.existsSync(targetFile) || !fs.existsSync(patchFile)) return false;
  const current = readJson(targetFile);
  const patch = readJson(patchFile);
  const mergeKeys = new Set(["scripts", "dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]);
  for (const [key, value] of Object.entries(patch)) {
    if (mergeKeys.has(key) && value && typeof value === "object" && !Array.isArray(value)) current[key] = { ...(current[key] || {}), ...value };
    else current[key] = value;
  }
  fs.writeFileSync(targetFile, JSON.stringify(current, null, 2) + "\n");
  console.log("merged", path.relative(target, targetFile));
  return true;
}

function mergeTsconfig(targetFile, templateFile) {
  if (!fs.existsSync(templateFile)) return false;
  const patch = readJson(templateFile);
  const current = fs.existsSync(targetFile) ? readJsonc(targetFile) : {};
  const currentCompiler = current.compilerOptions || {};
  const patchCompiler = patch.compilerOptions || {};
  const currentPlugins = Array.isArray(currentCompiler.plugins) ? currentCompiler.plugins : [];
  const patchPlugins = Array.isArray(patchCompiler.plugins) ? patchCompiler.plugins : [];
  const plugins = [...currentPlugins];
  for (const plugin of patchPlugins) {
    if (!plugins.some((item) => JSON.stringify(item) === JSON.stringify(plugin))) plugins.push(plugin);
  }
  const restrictedTypes = Array.isArray(currentCompiler.types)
    ? [...new Set([...currentCompiler.types, "node", "react", "react-dom"])]
    : undefined;
  current.compilerOptions = {
    ...patchCompiler,
    ...currentCompiler,
    module: "esnext",
    moduleResolution: "bundler",
    noEmit: true,
    esModuleInterop: true,
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: "react-jsx",
    incremental: true,
    skipLibCheck: true,
    paths: { ...(currentCompiler.paths || {}), ...(patchCompiler.paths || {}) },
    plugins,
    ...(restrictedTypes ? { types: restrictedTypes } : {}),
  };
  current.include = [...new Set([...(current.include || []), ...(patch.include || [])])];
  current.exclude = [...new Set([...(current.exclude || []), ...(patch.exclude || [])])];
  fs.writeFileSync(targetFile, JSON.stringify(current, null, 2) + "\n");
  console.log("merged", path.relative(target, targetFile), "(Next/Node TypeScript defaults)");
  return true;
}

const GITIGNORE_ENTRIES = [
  "node_modules/",
  ".pnpm-store/",
  ".turbo/",
  ".cache/",
  ".next/",
  ".open-next/",
  ".vercel/",
  ".wrangler/",
  "dist/",
  "out/",
  "coverage/",
  "*.tsbuildinfo",
  "*.log",
  ".DS_Store",
  ".env*",
  "!.env.example",
  "!**/.env.example",
  "**/src/generated/prisma/",
];

function ensureGitignore(file) {
  const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const lines = existing.split(/\r?\n/);
  const normalized = new Set(lines.map((line) => line.trim()).filter(Boolean));
  const missing = GITIGNORE_ENTRIES.filter((entry) => !normalized.has(entry));
  if (!missing.length) return;
  const prefix = existing && !existing.endsWith("\n") ? "\n" : "";
  const section = `${prefix}${existing.trim() ? "\n# PowerChain generated/local files\n" : "# PowerChain generated/local files\n"}${missing.join("\n")}\n`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, section);
  console.log("updated", path.relative(target, file), "(.gitignore)");
}


function ensureAppPackage(file, name) {
  if (fs.existsSync(file)) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({
    name,
    version: "1.0.0",
    private: true,
    packageManager: "pnpm@11.22.0",
    engines: { node: ">=24.19.0 <25" },
    scripts: {},
    dependencies: {},
    devDependencies: {},
  }, null, 2) + "\n");
  console.log("created", path.relative(target, file));
}

function cleanRootOrchestration(file) {
  if (!fs.existsSync(file)) return;
  const pkg = readJson(file);
  let changed = false;
  for (const script of ["predev:apps", "prebuild:apps"]) {
    if (pkg.scripts?.[script]) { delete pkg.scripts[script]; changed = true; }
  }
  if (pkg.devDependencies?.concurrently) {
    delete pkg.devDependencies.concurrently;
    if (!Object.keys(pkg.devDependencies).length) delete pkg.devDependencies;
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
    console.log("cleaned stale root orchestration", path.relative(target, file));
  }
}

function removeLegacyAuthz() {
  const packageFiles = [
    path.join(target, "package.json"),
    path.join(target, "apps/web/package.json"),
    path.join(target, "apps/copilot/package.json"),
    path.join(target, "apps/backend/package.json"),
  ];
  for (const file of packageFiles) {
    if (!fs.existsSync(file)) continue;
    const pkg = readJson(file);
    let changed = false;
    for (const key of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
      if (pkg[key]?.["@powerchain/authz"]) {
        delete pkg[key]["@powerchain/authz"];
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
      console.log("removed legacy @powerchain/authz from", path.relative(target, file));
    }
  }

  const legacyPackage = path.join(target, "packages/authz");
  const legacyPackageJson = path.join(legacyPackage, "package.json");
  if (fs.existsSync(legacyPackageJson)) {
    try {
      const pkg = readJson(legacyPackageJson);
      if (pkg.name === "@powerchain/authz") {
        fs.rmSync(legacyPackage, { recursive: true, force: true });
        console.log("removed legacy packages/authz");
      }
    } catch {}
  }

  const legacyRoute = path.join(target, "apps/web/src/app/api/v1/authz");
  if (fs.existsSync(legacyRoute)) {
    fs.rmSync(legacyRoute, { recursive: true, force: true });
    console.log("removed legacy /api/v1/authz route");
  }

  const legacyBackendSession = path.join(target, "apps/backend/src/app/api/v1/session");
  if (fs.existsSync(legacyBackendSession)) {
    fs.rmSync(legacyBackendSession, { recursive: true, force: true });
    console.log("removed legacy Backend /api/v1/session route");
  }
}

function ensureWorkspaceConfig(file) {
  let source = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  let lines = source ? source.split(/\r?\n/) : [];

  function blockEnd(start) {
    let i = start + 1;
    while (i < lines.length && (lines[i].trim() === "" || /^\s/.test(lines[i]))) i += 1;
    return i;
  }

  function ensurePackages() {
    let index = lines.findIndex((line) => /^packages:\s*$/.test(line));
    if (index < 0) { lines.unshift("packages:", "  - apps/*", "  - packages/*", "  - programs/*", ""); return; }
    let end = blockEnd(index);
    for (const item of ["apps/*", "packages/*", "programs/*"]) {
      const exists = lines.slice(index + 1, end).some((line) => line.replace(/["']/g, "").trim() === `- ${item}`);
      if (!exists) { lines.splice(end, 0, `  - ${item}`); end += 1; }
    }
  }

  function ensureOverride() {
    let index = lines.findIndex((line) => /^overrides:\s*$/.test(line));
    if (index < 0) { if (lines.at(-1)?.trim()) lines.push(""); lines.push("overrides:", "  utf-8-validate: 5.0.10"); return; }
    const end = blockEnd(index);
    const has = lines.slice(index + 1, end).some((line) => /^\s+utf-8-validate:\s*/.test(line));
    if (!has) lines.splice(index + 1, 0, "  utf-8-validate: 5.0.10");
  }


  function ensureMinimumReleaseAgeExcludes() {
    const required = [
      "next@16.3.2",
      "@next/env@16.3.2",
      "@next/swc-darwin-arm64@16.3.2",
      "@next/swc-darwin-x64@16.3.2",
      "@next/swc-linux-arm64-gnu@16.3.2",
      "@next/swc-linux-arm64-musl@16.3.2",
      "@next/swc-linux-x64-gnu@16.3.2",
      "@next/swc-linux-x64-musl@16.3.2",
      "@next/swc-win32-arm64-msvc@16.3.2",
      "@next/swc-win32-x64-msvc@16.3.2",
    ];
    let index = lines.findIndex((line) => /^minimumReleaseAgeExclude:\s*$/.test(line));
    if (index < 0) {
      if (lines.at(-1)?.trim()) lines.push("");
      lines.push("minimumReleaseAgeExclude:", ...required.map((item) => `  - "${item}"`));
      return;
    }
    let end = blockEnd(index);
    for (const item of required) {
      const exists = lines.slice(index + 1, end).some((line) => line.replace(/["']/g, "").trim() === `- ${item}`);
      if (!exists) { lines.splice(end, 0, `  - "${item}"`); end += 1; }
    }
  }

  function ensurePeerRule() {
    let peer = lines.findIndex((line) => /^peerDependencyRules:\s*$/.test(line));
    if (peer < 0) { if (lines.at(-1)?.trim()) lines.push(""); lines.push("peerDependencyRules:", "  allowedVersions:", '    utf-8-validate: ">=5.0.2"'); return; }
    let peerEnd = blockEnd(peer);
    let allowed = lines.findIndex((line, i) => i > peer && i < peerEnd && /^\s{2}allowedVersions:\s*$/.test(line));
    if (allowed < 0) { lines.splice(peer + 1, 0, "  allowedVersions:", '    utf-8-validate: ">=5.0.2"'); return; }
    let allowedEnd = allowed + 1;
    while (allowedEnd < lines.length && (lines[allowedEnd].trim() === "" || /^\s{4,}/.test(lines[allowedEnd]))) allowedEnd += 1;
    const has = lines.slice(allowed + 1, allowedEnd).some((line) => /^\s{4}utf-8-validate:\s*/.test(line));
    if (!has) lines.splice(allowed + 1, 0, '    utf-8-validate: ">=5.0.2"');
  }

  ensurePackages();
  ensureOverride();
  ensurePeerRule();
  ensureMinimumReleaseAgeExcludes();
  source = lines.join(eol).replace(/(?:\r?\n){3,}/g, eol + eol).replace(/\s*$/, eol);
  fs.writeFileSync(file, source);
  console.log("merged", path.relative(target, file));
}


const APP_README_SECTION = `<!-- powerchain:applications:start -->
## Applications

| Application | Local | Production | Description |
| --- | --- | --- | --- |
| **PowerChain Web** | \`http://localhost:3000\` | \`https://web.powerchain.app\` | Public product and account gateway for PowerChain. Provides the marketing site, product preview, SaaS pricing, Better Auth sign-in/sign-up, demo access, role-aware routing, Wallet Standard connection, newsletter/events and review-first Solana Pay checkout. It is the default user entry point. |
| **PowerChain Renewables Copilot** | \`http://localhost:3001\` | \`https://copilot.powerchain.app\` | Authenticated AI operations workspace for renewable generation, storage, local/P2P energy markets, tokenized energy, carbon, PWRC and Solana infrastructure. GRIDLLM provides persistent conversations/reports, source-aware Live/Demo/TBA analysis, provenance and policy/evidence/simulation review. Copilot prepares and recommends; the connected wallet signs. |
| **PowerChain Backend** | \`http://localhost:3002\` | \`https://api.powerchain.app\` | Server-only API/control-plane boundary for health/config/session routing, protected API orchestration, Copilot forwarding, integrations, request IDs and server-only provider concerns. It has no end-user UI and no signing authority. |
| **PowerChain Skills** | — | — | Operator-facing domain references for renewables, PowerChain, Solana and assistant operating rules. Runtime skill and agent contracts remain typed in shared packages/programs. |
| **PowerChain Auth** | — | — | Shared \`@powerchain/auth\` role and capability contracts used by Web, Copilot and Backend. Authentication/session persistence remains app-owned. |

### Product flow

\`\`\`text
Web → Sign in / Demo access → role/session resolution → Copilot → evidence/human review → wallet signature → Backend/provider/Solana settlement
\`\`\`

The deployable applications remain separate by responsibility: Web owns public acquisition/authentication, Copilot owns the operator workspace, and Backend owns server-side orchestration. Prisma is the default relational ORM and Supabase is the default managed Postgres/platform integration where configured.

### Clone and run

\`\`\`bash
git clone https://github.com/powerchain-protocol/powerchain-capilot.git
cd powerchain-capilot

# Place the self-contained powerchain-bootstrap.mjs in this repository root.
# It installs and verifies the overlay without requiring a sibling overlay directory.
node powerchain-bootstrap.mjs .

corepack enable
corepack use pnpm@11.22.0
pnpm install --no-frozen-lockfile
pnpm overlay:verify
pnpm workspace:doctor
pnpm prisma:generate
pnpm prisma:validate
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm build:apps
pnpm dev:apps

# Subsequent maintenance no longer needs the external overlay:
pnpm setup      # repository-native install/repair
pnpm upgrade    # repair + validate + production builds
pnpm fix        # idempotent manifest/workspace repair
pnpm doctor     # structural diagnostics
pnpm check      # structure + env + Prisma + peers + typecheck
pnpm ci         # check + all production app builds
\`\`\`
<!-- powerchain:applications:end -->`;

function ensureRootReadmeApplications(file) {
  const start = "<!-- powerchain:applications:start -->";
  const end = "<!-- powerchain:applications:end -->";
  let source = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "# PowerChain\n";
  if (source.includes(start) && source.includes(end)) {
    const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
    source = source.replace(pattern, APP_README_SECTION);
  } else {
    const titleEnd = source.indexOf("\n", source.startsWith("# ") ? 0 : -1);
    if (titleEnd >= 0) source = `${source.slice(0, titleEnd + 1)}\n${APP_README_SECTION}\n${source.slice(titleEnd + 1)}`;
    else source = `${source.trim()}\n\n${APP_README_SECTION}\n`;
  }
  fs.writeFileSync(file, source.replace(/(?:\r?\n){4,}/g, "\n\n\n"));
  console.log("updated", path.relative(target, file), "(applications section)");
}

if (!fs.existsSync(path.join(target, "package.json"))) {
  console.error(`Target is not a package root: ${target}`);
  process.exit(1);
}

const skip = new Set([
  "README.md",
  "bootstrap.mjs",
  "setup.mjs",
  "install-current.mjs",
  "install.sh",
  "package.patch.json",
  "pnpm-workspace.patch.yaml",
  "apps/web/package.patch.json",
  "apps/copilot/package.patch.json",
  "apps/web/tsconfig.json",
  "apps/copilot/tsconfig.json",
  "scripts/apply-overlay.mjs",
]);


removeLegacyAuthz();

const preserveExisting = new Set([
  "apps/web/prisma/schema.prisma",
  "apps/web/prisma.config.ts",
  "apps/web/src/lib/db.ts",
  "apps/copilot/prisma/schema.prisma",
  "apps/copilot/prisma.config.ts",
]);

for (const file of fs.readdirSync(overlay, { recursive: true, withFileTypes: true })) {
  if (!file.isFile()) continue;
  const abs = path.join(file.parentPath, file.name);
  const rel = path.relative(overlay, abs);
  if (skip.has(rel)) continue;
  const dest = path.join(target, rel);
  if (preserveExisting.has(rel) && fs.existsSync(dest)) {
    console.log("preserved", rel);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(abs, dest);
  console.log("updated", rel);
}

ensureAppPackage(path.join(target, "apps/web/package.json"), "@powerchain/web");
ensureAppPackage(path.join(target, "apps/copilot/package.json"), "@powerchain/copilot");

const rootPatched = mergeJson(path.join(target, "package.json"), path.join(overlay, "package.patch.json"));
cleanRootOrchestration(path.join(target, "package.json"));
if (!rootPatched) {
  console.error("fatal: root package.json was not patched");
  process.exit(1);
}
if (!mergeJson(path.join(target, "apps/web/package.json"), path.join(overlay, "apps/web/package.patch.json"))) console.warn("warning: apps/web/package.json not found; web patch skipped");
if (!mergeJson(path.join(target, "apps/copilot/package.json"), path.join(overlay, "apps/copilot/package.patch.json"))) console.warn("warning: apps/copilot/package.json not found; copilot patch skipped");
mergeTsconfig(path.join(target, "apps/web/tsconfig.json"), path.join(overlay, "apps/web/tsconfig.json"));
mergeTsconfig(path.join(target, "apps/copilot/tsconfig.json"), path.join(overlay, "apps/copilot/tsconfig.json"));
ensureGitignore(path.join(target, ".gitignore"));
for (const app of ["web", "copilot", "backend"]) ensureGitignore(path.join(target, `apps/${app}/.gitignore`));
ensureWorkspaceConfig(path.join(target, "pnpm-workspace.yaml"));
ensureRootReadmeApplications(path.join(target, "README.md"));

const rootPackage = readJson(path.join(target, "package.json"));
const requiredRootScripts = ["setup", "upgrade", "fix", "doctor", "overlay:verify", "workspace:doctor", "env:doctor", "prisma:generate", "prisma:validate", "config:doctor", "peers:check", "typecheck", "build:apps", "dev:apps", "start:apps", "check", "ci"];
const missingRootScripts = requiredRootScripts.filter((name) => !rootPackage.scripts?.[name]);
if (missingRootScripts.length) {
  console.error(`fatal: root package.json verification failed; missing scripts: ${missingRootScripts.join(", ")}`);
  process.exit(1);
}

console.log("\nOverlay applied and verified. Package-name filters are not required.");
console.log(`Root commands installed: ${requiredRootScripts.join(", ")}`);
console.log("Run: pnpm install --no-frozen-lockfile && pnpm check");
