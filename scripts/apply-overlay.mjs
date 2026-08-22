import fs from "node:fs";
import path from "node:path";

const overlay = path.resolve(import.meta.dirname, "..");
const target = path.resolve(process.argv[2] || ".");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
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

### Product flow

\`\`\`text
Web → Sign in / Demo access → role/session resolution → Copilot → evidence/human review → wallet signature → Backend/provider/Solana settlement
\`\`\`

The deployable applications remain separate by responsibility: Web owns public acquisition/authentication, Copilot owns the operator workspace, and Backend owns server-side orchestration.

### Clone and run

\`\`\`bash
git clone https://github.com/powerchain-protocol/powerchain-capilot.git
cd powerchain-capilot
corepack enable
corepack use pnpm@11.22.0
pnpm install --no-frozen-lockfile
pnpm workspace:doctor
pnpm prisma:generate
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm build:apps
pnpm dev:apps
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
  "package.patch.json",
  "pnpm-workspace.patch.yaml",
  "apps/web/package.patch.json",
  "apps/copilot/package.patch.json",
  "scripts/apply-overlay.mjs",
]);

for (const file of fs.readdirSync(overlay, { recursive: true, withFileTypes: true })) {
  if (!file.isFile()) continue;
  const abs = path.join(file.parentPath, file.name);
  const rel = path.relative(overlay, abs);
  if (skip.has(rel)) continue;
  const dest = path.join(target, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(abs, dest);
  console.log("updated", rel);
}

const rootPatched = mergeJson(path.join(target, "package.json"), path.join(overlay, "package.patch.json"));
if (!rootPatched) {
  console.error("fatal: root package.json was not patched");
  process.exit(1);
}
if (!mergeJson(path.join(target, "apps/web/package.json"), path.join(overlay, "apps/web/package.patch.json"))) console.warn("warning: apps/web/package.json not found; web patch skipped");
if (!mergeJson(path.join(target, "apps/copilot/package.json"), path.join(overlay, "apps/copilot/package.patch.json"))) console.warn("warning: apps/copilot/package.json not found; copilot patch skipped");
ensureWorkspaceConfig(path.join(target, "pnpm-workspace.yaml"));
ensureRootReadmeApplications(path.join(target, "README.md"));

const rootPackage = readJson(path.join(target, "package.json"));
const requiredRootScripts = ["workspace:doctor", "prisma:generate", "config:doctor", "peers:check", "typecheck", "build:apps", "dev:apps"];
const missingRootScripts = requiredRootScripts.filter((name) => !rootPackage.scripts?.[name]);
if (missingRootScripts.length) {
  console.error(`fatal: root package.json verification failed; missing scripts: ${missingRootScripts.join(", ")}`);
  process.exit(1);
}

console.log("\nOverlay applied and verified. Package-name filters are not required.");
console.log(`Root commands installed: ${requiredRootScripts.join(", ")}`);
console.log("Run: pnpm install --no-frozen-lockfile && pnpm workspace:doctor");
