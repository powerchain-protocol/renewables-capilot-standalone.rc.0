#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const strict = process.argv.includes("--strict");
const files = [
  ".env",
  ".env.local",
  "apps/web/.env.local",
  "apps/copilot/.env.local",
  "apps/backend/.env.local",
];

function parseEnv(file) {
  if (!existsSync(file)) return {};
  const out = {};
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    out[key] = value;
  }
  return out;
}

const fileEnv = Object.assign({}, ...files.map((name) => parseEnv(resolve(root, name))));
const env = { ...fileEnv, ...process.env };
const errors = [];
const warnings = [];
const value = (key) => String(env[key] ?? "").trim();
const isProd = value("NODE_ENV") === "production";

function error(message) { errors.push(message); }
function warn(message) { warnings.push(message); }
function url(key, fallback, { publicValue = false } = {}) {
  const raw = value(key) || fallback;
  try {
    const parsed = new URL(raw);
    if (!['http:', 'https:'].includes(parsed.protocol)) error(`${key} must use http:// or https://`);
    if (publicValue && /SECRET|SERVICE_ROLE|DATABASE/.test(key)) error(`${key} must not expose a server secret`);
    return parsed;
  } catch { error(`${key} is not a valid URL: ${raw || '<empty>'}`); return null; }
}

const nodeEnv = value("NODE_ENV") || "development";
if (!['development','test','production'].includes(nodeEnv)) error(`NODE_ENV must be development, test, or production; found '${nodeEnv}'`);
if (nodeEnv === "developemnt") error("NODE_ENV typo: use 'development'");
for (const [key, raw] of Object.entries(env)) if (typeof raw === 'string' && raw.includes('http;//')) error(`${key} contains 'http;//'; use 'http://'`);

const web = url("WEB_APP_LOCAL_URL", "http://localhost:3000");
const copilot = url("COPILOT_APP_LOCAL_URL", "http://localhost:3001");
const backend = url("BACKEND_APP_LOCAL_URL", "http://localhost:3002");
for (const [key, expected] of [["WEB_APP_LOCAL_URL",3000],["COPILOT_APP_LOCAL_URL",3001],["BACKEND_APP_LOCAL_URL",3002]]) {
  const parsed = url(key, `http://localhost:${expected}`);
  if (parsed?.hostname === 'localhost' && Number(parsed.port || (parsed.protocol === 'https:' ? 443 : 80)) !== expected) warn(`${key} normally uses localhost:${expected}`);
}
if (web && copilot && web.href === copilot.href) error("Web and Copilot URLs must be different applications");
if (copilot && backend && copilot.href === backend.href) error("Copilot and Backend URLs must be different applications");

const cluster = value("NEXT_PUBLIC_SOLANA_CLUSTER") || "devnet";
if (!['devnet','mainnet-beta'].includes(cluster)) error(`NEXT_PUBLIC_SOLANA_CLUSTER must be devnet or mainnet-beta; found '${cluster}'`);
const network = value("NEXT_PUBLIC_POWERCHAIN_NETWORK") || (cluster === 'mainnet-beta' ? 'mainnet' : 'devnet');
if (!['devnet','mainnet'].includes(network)) error(`NEXT_PUBLIC_POWERCHAIN_NETWORK must be devnet or mainnet; found '${network}'`);
if (network === 'mainnet' && cluster !== 'mainnet-beta') warn("PowerChain mainnet is paired with a non-mainnet Solana cluster");

if (value("CAPILOT_APP_URL")) warn("CAPILOT_APP_URL is deprecated; migrate to COPILOT_APP_URL");
if (isProd) {
  for (const key of ["WEB_APP_URL","COPILOT_APP_URL","BACKEND_APP_URL"]) if (!value(key)) error(`${key} is required in production`);
  if (!value("BETTER_AUTH_SECRET")) error("BETTER_AUTH_SECRET is required in production");
  if (value("DEMO_AUTH_ENABLED") === 'true') error("DEMO_AUTH_ENABLED must be false in production unless an explicit controlled demo deployment is intended");
  if (['','change-me-in-production'].includes(value("DEMO_SESSION_SECRET"))) error("DEMO_SESSION_SECRET must be replaced in production");
}

const dbConfigured = Boolean(value("DATABASE_URL") || value("WEB_DATABASE_URL") || value("COPILOT_DATABASE_URL") || value("BACKEND_DATABASE_URL"));
const supabaseConfigured = Boolean(value("SUPABASE_URL") || value("NEXT_PUBLIC_SUPABASE_URL"));
if (!dbConfigured) warn("No database URL configured; persistence-backed routes may return unavailable until Prisma/Postgres is configured");
if (supabaseConfigured && !value("NEXT_PUBLIC_SUPABASE_ANON_KEY")) warn("Supabase URL is configured without NEXT_PUBLIC_SUPABASE_ANON_KEY");
if (value("SUPABASE_SERVICE_ROLE_KEY") && value("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")) error("Never expose a Supabase service-role key through NEXT_PUBLIC_* variables");

console.log("PowerChain environment doctor");
console.log(`mode: ${nodeEnv}${strict ? ' (strict)' : ''}`);
console.log(`web: ${web?.href ?? 'invalid'}`);
console.log(`copilot: ${copilot?.href ?? 'invalid'}`);
console.log(`backend: ${backend?.href ?? 'invalid'}`);
console.log(`network: ${network} / Solana ${cluster}`);
for (const message of warnings) console.warn(`WARN: ${message}`);
for (const message of errors) console.error(`ERROR: ${message}`);
if (errors.length || (strict && warnings.length)) process.exit(1);
console.log("Environment contract: PASS");
