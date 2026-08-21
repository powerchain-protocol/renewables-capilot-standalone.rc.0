const canonical = {
  NEXT_PUBLIC_PWRC_MINT: "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc",
  NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  NEXT_PUBLIC_ASSOCIATED_TOKEN_PROGRAM_ID: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
};

const rpcDefaults = {
  NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL: "https://api.devnet.solana.com",
  NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL: "https://api.testnet.solana.com",
  NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL: "https://api.mainnet-beta.solana.com",
  SOLANA_DEVNET_RPC_URL: "https://api.devnet.solana.com",
  SOLANA_TESTNET_RPC_URL: "https://api.testnet.solana.com",
  SOLANA_MAINNET_RPC_URL: "https://api.mainnet-beta.solana.com",
  HELIUS_DEVNET_RPC_URL: "https://devnet.helius-rpc.com",
  HELIUS_MAINNET_RPC_URL: "https://mainnet.helius-rpc.com",
  HELIUS_API_BASE_URL: "https://api.helius.xyz",
};

let failed = false;

for (const [name, expected] of Object.entries(canonical)) {
  const value = process.env[name] || expected;
  if (value !== expected) {
    console.error(`${name} does not match the canonical PowerChain/Solana profile.`);
    failed = true;
  }
}

function validateUrl(name, fallback, { optional = false } = {}) {
  const raw = process.env[name];
  if (optional && !raw) return;
  const value = raw || fallback;
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) throw new Error("unsupported protocol");
  } catch {
    console.error(`${name} is not a valid HTTP(S) URL.`);
    failed = true;
  }
}

for (const [name, fallback] of Object.entries(rpcDefaults)) validateUrl(name, fallback);
validateUrl("NEXT_PUBLIC_SUPABASE_URL", undefined, { optional: true });
validateUrl("LORA_BASE_URL", undefined, { optional: true });
validateUrl("PYTH_HERMES_URL", undefined, { optional: true });

const configuredAIProviders = [
  process.env.OPENAI_API_KEY && "OpenAI",
  process.env.ANTHROPIC_API_KEY && "Anthropic",
  process.env.GOOGLE_API_KEY && "Google GenAI",
  process.env.DEEPSEEK_API_KEY && "DeepSeek",
  process.env.LORA_BASE_URL && process.env.LORA_API_KEY && "Private LoRA",
].filter(Boolean);

if (configuredAIProviders.length === 0) {
  console.warn("No AI provider configured: /api/chat will fail closed until an AI provider is configured.");
} else {
  console.log(`AI providers configured: ${configuredAIProviders.join(", ")}`);
}

const providerOrder = (process.env.AI_PROVIDER_ORDER ?? "openai,anthropic,google,deepseek,lora")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const supportedProviders = new Set(["openai", "anthropic", "google", "deepseek", "lora"]);
const invalidProviders = providerOrder.filter((provider) => !supportedProviders.has(provider));
if (invalidProviders.length > 0) {
  console.error(`AI_PROVIDER_ORDER contains unsupported providers: ${invalidProviders.join(", ")}`);
  failed = true;
}

const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? "devnet";
if (!["devnet", "testnet", "mainnet-beta"].includes(cluster)) {
  console.error("NEXT_PUBLIC_SOLANA_CLUSTER must be devnet, testnet, or mainnet-beta.");
  failed = true;
}

if (!process.env.HELIUS_API_KEY) {
  console.warn("HELIUS_API_KEY not configured: read RPC uses the canonical Solana fallback; Helius enhanced APIs are unavailable.");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  console.warn("Supabase not configured: authentication/persistence features use their supported local/disabled fallback.");
}
if (!process.env.DATABASE_URL) console.warn("DATABASE_URL not configured: Prisma server queries are unavailable.");

if (failed) process.exit(1);
console.log(`PowerChain configuration validated for Solana ${cluster}.`);
