import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import net from "node:net";

const root = process.cwd();
const APPS = [
  { id: "web", dir: "apps/web", port: 3000 },
  { id: "copilot", dir: "apps/copilot", port: 3001 },
  { id: "backend", dir: "apps/backend", port: 3002 },
];
const NEXT_VERSION = "16.3.2";
const NEXT_AGE_EXCLUDES = [
  `next@${NEXT_VERSION}`,
  `@next/env@${NEXT_VERSION}`,
  `@next/swc-darwin-arm64@${NEXT_VERSION}`,
  `@next/swc-darwin-x64@${NEXT_VERSION}`,
  `@next/swc-linux-arm64-gnu@${NEXT_VERSION}`,
  `@next/swc-linux-arm64-musl@${NEXT_VERSION}`,
  `@next/swc-linux-x64-gnu@${NEXT_VERSION}`,
  `@next/swc-linux-x64-musl@${NEXT_VERSION}`,
  `@next/swc-win32-arm64-msvc@${NEXT_VERSION}`,
  `@next/swc-win32-x64-msvc@${NEXT_VERSION}`,
];

function fail(message) {
  console.error(`\n[powerchain] ${message}`);
  process.exitCode = 1;
}
function note(message) { console.log(`[powerchain] ${message}`); }
function packageFor(app) {
  const file = resolve(root, app.dir, "package.json");
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8"));
}
function selected(target) {
  if (!target) return APPS;
  const app = APPS.find((item) => item.id === target);
  if (!app) throw new Error(`Unknown app '${target}'. Expected web, copilot, or backend.`);
  return [app];
}
function run(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit", env: process.env, ...options });
    child.on("error", rejectPromise);
    child.on("exit", (code, signal) => {
      if (signal) rejectPromise(new Error(`${command} terminated by ${signal}`));
      else if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}
async function runApp(app, script) {
  const pkg = packageFor(app);
  if (!pkg) throw new Error(`${app.dir}/package.json is missing`);
  if (!pkg.scripts?.[script]) throw new Error(`${app.dir} has no '${script}' script`);
  console.log(`\n[powerchain] ${script}: ${app.id} (${pkg.name ?? "unnamed"})`);
  await run("pnpm", ["--dir", app.dir, "run", script]);
}
function validNode() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  return major === 24 && minor >= 19;
}
function portIsFree(port) {
  return new Promise((resolvePromise) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolvePromise(false));
    server.listen({ host: "127.0.0.1", port, exclusive: true }, () => server.close(() => resolvePromise(true)));
  });
}
async function ports(target, { failWhenBusy = false } = {}) {
  let ok = true;
  for (const app of selected(target)) {
    const free = await portIsFree(app.port);
    console.log(`${app.id.padEnd(8)} :${app.port} ${free ? "free ✓" : "busy ✗"}`);
    if (!free) ok = false;
  }
  if (!ok && failWhenBusy) throw new Error("One or more application ports are already in use. Stop the existing server or run 'pnpm ports:check'.");
  return ok;
}
function checkWorkspaceFile() {
  const workspace = resolve(root, "pnpm-workspace.yaml");
  if (!existsSync(workspace)) { fail("pnpm-workspace.yaml missing"); return; }
  const source = readFileSync(workspace, "utf8");
  for (const pattern of ["apps/*", "packages/*", "programs/*"]) if (!source.includes(pattern)) fail(`pnpm-workspace.yaml missing '${pattern}'`);
  if (!source.includes("utf-8-validate") || !source.includes("5.0.10")) fail("pnpm-workspace.yaml missing utf-8-validate 5.0.10 compatibility override");
  for (const item of NEXT_AGE_EXCLUDES) if (!source.includes(item)) fail(`pnpm-workspace.yaml missing vetted minimumReleaseAge exception '${item}'`);
}
async function doctor() {
  console.log("PowerChain workspace doctor\n");
  console.log(`Node: ${process.version}${validNode() ? " ✓" : " ✗ expected >=24.19.0 <25"}`);
  if (!validNode()) process.exitCode = 1;
  console.log(`pnpm packageManager: ${JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).packageManager ?? "not declared"}`);
  if (process.env.NODE_OPTIONS?.includes("--inspect")) console.log("NODE_OPTIONS: debugger/inspect enabled (informational)");

  for (const app of APPS) {
    const pkg = packageFor(app);
    if (!pkg) { fail(`${app.dir}/package.json missing`); continue; }
    const scripts = ["dev", "build", "typecheck"].filter((name) => pkg.scripts?.[name]);
    const next = pkg.dependencies?.next ?? pkg.devDependencies?.next ?? "not declared";
    console.log(`${app.id.padEnd(8)} ${String(pkg.name ?? "unnamed").padEnd(36)} port ${app.port} · Next ${next} · ${scripts.join(", ") || "no lifecycle scripts"}`);
    if (next !== NEXT_VERSION) fail(`${app.dir} must use Next ${NEXT_VERSION}; found ${next}`);
    if (!pkg.scripts?.dev || !pkg.scripts?.build || !pkg.scripts?.typecheck) fail(`${app.dir} must define dev, build and typecheck scripts`);
    if (pkg.dependencies?.["@powerchain/auth"] !== "workspace:*") fail(`${app.dir} must depend on @powerchain/auth workspace:*`);
    for (const dependency of ["@prisma/client", "@supabase/supabase-js"]) {
      if (!pkg.dependencies?.[dependency]) fail(`${app.dir} missing default persistence dependency ${dependency}`);
    }
    if (!pkg.devDependencies?.["@types/node"]) fail(`${app.dir} missing @types/node; process/Node globals may fail in next.config.ts or proxy.ts`);
    for (const requiredFile of ["tsconfig.json", "next-env.d.ts", "next.config.ts", "proxy.ts"]) {
      if (!existsSync(resolve(root, app.dir, requiredFile))) fail(`${app.dir}/${requiredFile} missing`);
    }
    const tsconfigFile = resolve(root, app.dir, "tsconfig.json");
    if (existsSync(tsconfigFile)) {
      try {
        const tsconfig = JSON.parse(readFileSync(tsconfigFile, "utf8"));
        const compiler = tsconfig.compilerOptions || {};
        if (compiler.moduleResolution !== "bundler") fail(`${app.dir}/tsconfig.json must use moduleResolution=bundler for Next.js`);
        if (!Array.isArray(compiler.plugins) || !compiler.plugins.some((plugin) => plugin?.name === "next")) fail(`${app.dir}/tsconfig.json missing Next.js TypeScript plugin`);
        const include = Array.isArray(tsconfig.include) ? tsconfig.include : [];
        if (!include.includes("*.ts")) fail(`${app.dir}/tsconfig.json should include root TypeScript files such as proxy.ts and next.config.ts`);
      } catch (error) {
        fail(`${app.dir}/tsconfig.json is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  const authPackage = resolve(root, "packages/auth/package.json");
  if (!existsSync(authPackage)) fail("packages/auth/package.json missing");
  else if (JSON.parse(readFileSync(authPackage, "utf8")).name !== "@powerchain/auth") fail("packages/auth must be named @powerchain/auth");
  if (existsSync(resolve(root, "packages/authz"))) fail("legacy packages/authz must be removed; rerun overlay bootstrap");
  checkWorkspaceFile();
  if (!process.exitCode) console.log("\nWorkspace contract: PASS");
}
async function preflight(target) {
  await doctor();
  if (process.exitCode) throw new Error("Workspace doctor failed");
  await ports(target, { failWhenBusy: true });
}
async function prisma() {
  for (const app of [APPS[2], APPS[1], APPS[0]]) {
    const schema = resolve(root, app.dir, "prisma/schema.prisma");
    if (!existsSync(schema)) { note(`skip prisma: ${app.id} has no schema`); continue; }
    const pkg = packageFor(app);
    if (pkg?.scripts?.["prisma:generate"]) await runApp(app, "prisma:generate");
    else { console.log(`\n[powerchain] prisma generate: ${app.id}`); await run("pnpm", ["--dir", app.dir, "exec", "prisma", "generate"]); }
  }
}

async function prismaValidate() {
  for (const app of [APPS[2], APPS[1], APPS[0]]) {
    const schema = resolve(root, app.dir, "prisma/schema.prisma");
    if (!existsSync(schema)) { note(`skip prisma validate: ${app.id} has no schema`); continue; }
    const pkg = packageFor(app);
    if (pkg?.scripts?.["prisma:validate"]) await runApp(app, "prisma:validate");
    else { console.log(`\n[powerchain] prisma validate: ${app.id}`); await run("pnpm", ["--dir", app.dir, "exec", "prisma", "validate"]); }
  }
}

async function config() {
  const app = APPS[1];
  const pkg = packageFor(app);
  if (pkg?.scripts?.["config:doctor"]) await runApp(app, "config:doctor");
  else note("Copilot has no config:doctor script; running workspace checks only.");
  await doctor();
}
async function typecheck() {
  await doctor();
  if (process.exitCode) throw new Error("Workspace doctor failed");
  await prisma();
  note("recursive workspace typecheck");
  await run("pnpm", ["-r", "--if-present", "typecheck"]);
}
async function peers() {
  checkWorkspaceFile();
  if (process.exitCode) throw new Error("Workspace peer policy is invalid");
  const lockfile = resolve(root, "pnpm-lock.yaml");
  if (!existsSync(lockfile)) throw new Error("pnpm-lock.yaml is missing; run pnpm install first");
  const lock = readFileSync(lockfile, "utf8");
  if (/utf-8-validate@6\./.test(lock)) throw new Error("Lockfile still contains utf-8-validate 6.x; run pnpm install --no-frozen-lockfile after applying the overlay");
  const hasUtf8 = /utf-8-validate@/.test(lock);
  if (hasUtf8 && !/utf-8-validate@5\.0\.10/.test(lock)) throw new Error("Lockfile contains utf-8-validate but not the vetted 5.0.10 compatibility version");
  console.log(`Peer compatibility policy: PASS (${hasUtf8 ? "utf-8-validate 5.0.10" : "utf-8-validate not present"}; workspace policy retained)`);
}
async function build(target) {
  await doctor();
  if (process.exitCode) throw new Error("Workspace doctor failed");
  await prisma();
  const order = target ? selected(target) : [APPS[2], APPS[0], APPS[1]];
  for (const app of order) await runApp(app, "build");
}
async function dev(target) {
  await doctor();
  if (process.exitCode) throw new Error("Workspace doctor failed");
  await prisma();
  await ports(target, { failWhenBusy: true });
  const apps = selected(target);
  if (apps.length === 1) return runApp(apps[0], "dev");
  note("starting Web :3000 · Copilot :3001 · Backend :3002");
  const children = apps.map((app) => {
    const pkg = packageFor(app);
    if (!pkg?.scripts?.dev) throw new Error(`${app.dir} has no dev script`);
    return spawn("pnpm", ["--dir", app.dir, "run", "dev"], { cwd: root, stdio: "inherit", env: process.env });
  });
  const stop = (signal) => { for (const child of children) if (!child.killed) child.kill(signal); };
  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));
  const code = await new Promise((resolvePromise) => {
    let remaining = children.length; let firstFailure = 0;
    for (const child of children) child.on("exit", (exitCode) => {
      if (exitCode && !firstFailure) { firstFailure = exitCode; stop("SIGTERM"); }
      remaining -= 1; if (remaining === 0) resolvePromise(firstFailure);
    });
  });
  if (code) throw new Error(`one or more dev servers exited with ${code}`);
}

async function start(target) {
  await doctor();
  if (process.exitCode) throw new Error("Workspace doctor failed");
  const apps = selected(target);
  if (apps.length === 1) return runApp(apps[0], "start");
  note("starting production servers: Web :3000 · Copilot :3001 · Backend :3002");
  const children = apps.map((app) => {
    const pkg = packageFor(app);
    if (!pkg?.scripts?.start) throw new Error(`${app.dir} has no start script`);
    return spawn("pnpm", ["--dir", app.dir, "run", "start"], { cwd: root, stdio: "inherit", env: process.env });
  });
  const stop = (signal) => { for (const child of children) if (!child.killed) child.kill(signal); };
  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));
  const code = await new Promise((resolvePromise) => {
    let remaining = children.length; let firstFailure = 0;
    for (const child of children) child.on("exit", (exitCode) => {
      if (exitCode && !firstFailure) { firstFailure = exitCode; stop("SIGTERM"); }
      remaining -= 1; if (remaining === 0) resolvePromise(firstFailure);
    });
  });
  if (code) throw new Error(`one or more production servers exited with ${code}`);
}


async function validateWorkspace() {
  await doctor();
  if (process.exitCode) throw new Error("Workspace doctor failed");
  await run(process.execPath, ["scripts/env-doctor.mjs"]);
  await prisma();
  await prismaValidate();
  await peers();
  note("recursive workspace typecheck");
  await run("pnpm", ["-r", "--if-present", "typecheck"]);
  console.log("\nPowerChain validation: PASS");
}

const [command = "doctor", target] = process.argv.slice(2);
try {
  if (command === "doctor") await doctor();
  else if (command === "preflight") await preflight(target);
  else if (command === "ports") await ports(target);
  else if (command === "prisma") await prisma();
  else if (command === "prisma-validate") await prismaValidate();
  else if (command === "config") await config();
  else if (command === "peers") await peers();
  else if (command === "typecheck") await typecheck();
  else if (command === "validate") await validateWorkspace();
  else if (command === "build") await build(target);
  else if (command === "dev") await dev(target);
  else if (command === "start") await start(target);
  else throw new Error(`Unknown workspace command '${command}'`);
} catch (error) {
  console.error(`\n[powerchain] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
