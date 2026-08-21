import { config } from "dotenv";

async function main() {
  config({ path: ".env.local", override: false });
  config({ path: ".env", override: false });

  const [{ serverEnv }, { normalizeOptionalUrl }] = await Promise.all([
    import("../src/env/server"),
    import("../src/env/shared"),
  ]);

  const checks = [
    [
      "Supabase URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      normalizeOptionalUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    ],
    [
      "OpenAI base URL",
      process.env.OPENAI_BASE_URL ?? serverEnv.OPENAI_BASE_URL,
      normalizeOptionalUrl(process.env.OPENAI_BASE_URL ?? serverEnv.OPENAI_BASE_URL),
    ],
    [
      "OpenAI responses URL",
      process.env.OPENAI_RESPONSES_URL ?? serverEnv.OPENAI_RESPONSES_URL,
      normalizeOptionalUrl(process.env.OPENAI_RESPONSES_URL ?? serverEnv.OPENAI_RESPONSES_URL),
    ],
  ] as const;

  let failed = false;
  for (const [name, raw, normalized] of checks) {
    const configured = typeof raw === "string" && raw.trim().length > 0;
    const state = !configured ? "optional/unconfigured" : normalized ? "valid" : "INVALID";
    console.log(`${name}: ${state}`);
    if (configured && !normalized) failed = true;
  }

  console.log(`OpenAI key: ${serverEnv.OPENAI_API_KEY ? "configured" : "unconfigured"}`);
  console.log(`Helius key: ${serverEnv.HELIUS_API_KEY ? "configured" : "unconfigured"}`);

  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Configuration doctor failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
