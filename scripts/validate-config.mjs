const requiredPublic = {
  NEXT_PUBLIC_PWRC_MINT: /^PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc$/,
  NEXT_PUBLIC_TOKEN_2022_PROGRAM_ID: /^TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb$/,
};

let failed = false;
for (const [name, pattern] of Object.entries(requiredPublic)) {
  const value = process.env[name];
  if (!value || !pattern.test(value)) {
    console.error(`${name} is missing or does not match the canonical PowerChain profile.`);
    failed = true;
  }
}

const configuredAIProviders = [
  process.env.OPENAI_API_KEY && 'OpenAI',
  process.env.ANTHROPIC_API_KEY && 'Anthropic',
  process.env.GOOGLE_API_KEY && 'Google GenAI',
  process.env.DEEPSEEK_API_KEY && 'DeepSeek',
  process.env.LORA_BASE_URL && process.env.LORA_API_KEY && 'Private LoRA',
].filter(Boolean);

if (configuredAIProviders.length === 0) {
  console.warn('No AI provider configured: /api/chat will fail closed until OpenAI, Anthropic, Google GenAI, DeepSeek, or LoRA is configured.');
} else {
  console.log(`AI providers configured: ${configuredAIProviders.join(', ')}`);
}

const providerOrder = (process.env.AI_PROVIDER_ORDER ?? 'openai,anthropic,google,deepseek,lora')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const supportedProviders = new Set(['openai', 'anthropic', 'google', 'deepseek', 'lora']);
const invalidProviders = providerOrder.filter((provider) => !supportedProviders.has(provider));
if (invalidProviders.length > 0) {
  console.error(`AI_PROVIDER_ORDER contains unsupported providers: ${invalidProviders.join(', ')}`);
  failed = true;
}

if (!process.env.HELIUS_API_KEY) console.warn('HELIUS_API_KEY not configured: standard read RPC can use public fallback; enhanced Helius endpoints remain unavailable.');
if (!process.env.PYTH_HERMES_URL || !process.env.PYTH_API_KEY) console.warn('Pyth not configured: oracle helpers remain unavailable until PYTH_HERMES_URL and PYTH_API_KEY are set.');
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) console.warn('Supabase not configured: saved prompts use the local fallback.');
if (!process.env.DATABASE_URL) console.warn('DATABASE_URL not configured: Prisma server queries are unavailable.');

if (failed) process.exit(1);
console.log('PowerChain public configuration validated.');
