# PowerChain Renewables Copilot

A production-oriented Next.js AI workspace for **GRIDLLM**, renewable-energy operations, local/P2P energy markets, PowerChain tokenomics, Solana/SVM infrastructure and tokenized assets.

## Documentation

- [Documentation index](docs/README.md)
- [Getting started](docs/GETTING_STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [AI & GRIDLLM](docs/AI.md)
- [Solana & Web3](docs/SOLANA.md)
- [Database](docs/DATABASE.md)
- [UI/UX](docs/UI_UX.md)
- [Security](docs/SECURITY.md)
- [Changelog](CHANGELOG.md)
- [Contributors](CONTRIBUTORS.md)

## Stack

- Next.js `16.3.1`, React `19.2.8`, TypeScript `5.9.3`
- Tailwind CSS `4.3.3`, shadcn-style primitives, Radix UI and Radix Icons
- pnpm `11.22.0` through Corepack, Node `24.19.x`
- `@solana/web3.js` with Wallet Standard discovery (Phantom/Solflare when installed; no all-wallet aggregator)
- Helius RPC + Enhanced Transactions through server-only application routes
- Supabase Auth/Postgres/RLS plus Prisma `7.9.1` with the PostgreSQL driver adapter
- Vercel AI SDK `7` provider routing for OpenAI, Anthropic, Google GenAI, DeepSeek and private OpenAI-compatible LoRA models
- official `openai`, `@anthropic-ai/sdk` and `@google/genai` SDKs available for provider-specific extensions
- `axios` and `bs58` available for integrations and base58 payload/signature utilities

## UI/UX upgrades

The application is designed as an AI operations console rather than a chat widget embedded in a dashboard:

- responsive desktop sidebar plus mobile navigation drawer
- sticky glass topbar with wallet, Solana network and live provider status
- PowerChain light/dark themes with system preference support
- GRIDLLM composer with provider, model-profile, analysis-mode and context controls
- AI Settings dialog with live provider configuration state
- Quality / Balanced / Fast / Private LoRA profiles instead of exposing raw provider model IDs as the primary UX
- provider fallback toggle and server-controlled provider allowlist/order
- saved prompts and prompt suggestions
- improved metric cards, sparklines, energy operations, local market, infrastructure and context panels
- sample telemetry is explicitly labelled; live health/configuration status is not fabricated
- accessible focus states, reduced-motion handling and responsive card layouts

## Install

```bash
corepack enable
corepack use pnpm@11.22.0
pnpm install
cp .env.example .env.local
pnpm telemetry:disable
pnpm dev
```

`package.json` is pinned to `pnpm@11.22.0`. The workspace uses pnpm's `allowBuilds` policy so approved native/build-script dependencies are explicit in `pnpm-workspace.yaml`. `strictDepBuilds` is enabled.

If pnpm reports a newly introduced package with a build script that is not yet reviewed, inspect it before approval and then run:

```bash
pnpm approve-builds
```

Do not blindly approve every dependency. The repository already allowlists Prisma engines/client, Prisma, Sharp, esbuild, bufferutil, utf-8-validate, bigint-buffer, blake-hash, protobufjs and tiny-secp256k1.

### Next.js telemetry

Telemetry is disabled at all three levels used by this project:

- `.env.example`: `NEXT_TELEMETRY_DISABLED=1`
- `next.config.ts`: defaults `NEXT_TELEMETRY_DISABLED` to `1`
- `dev`, `build` and `start` scripts set `NEXT_TELEMETRY_DISABLED=1`

You can also persist the Next.js preference locally with:

```bash
pnpm telemetry:disable
```

## Prisma install fix

`prisma generate` must be able to run during `postinstall` before a developer has configured a database. `prisma.config.ts` therefore uses:

```ts
datasource: {
  url: process.env.DATABASE_URL ?? "",
}
```

This intentionally makes `DATABASE_URL` optional for **client generation only**. Real database operations still require a valid PostgreSQL/Supabase connection string.

After creating `.env.local`:

```bash
pnpm prisma:generate
pnpm prisma:validate
pnpm db:test
pnpm prisma:studio
```

The Supabase SQL migration remains the database-policy source of truth because it contains RLS and grants that Prisma schema files cannot express. Prisma mirrors the application tables for typed server queries.

## AI providers

`/api/chat` uses a single server-side GRIDLLM routing layer. Browser code never receives provider secrets.

Default provider order:

```env
AI_PROVIDER_ORDER=openai,anthropic,google,deepseek,lora
```

Supported providers:

| Provider | Required secret | Quality | Balanced | Fast |
|---|---|---|---|---|
| OpenAI | `OPENAI_API_KEY` | `OPENAI_MODEL_QUALITY` | `OPENAI_MODEL` | `OPENAI_MODEL_FAST` |
| Anthropic | `ANTHROPIC_API_KEY` | `ANTHROPIC_MODEL_QUALITY` | `ANTHROPIC_MODEL` | `ANTHROPIC_MODEL_FAST` |
| Google GenAI | `GOOGLE_API_KEY` | `GOOGLE_MODEL_QUALITY` | `GOOGLE_MODEL` | `GOOGLE_MODEL_FAST` |
| DeepSeek | `DEEPSEEK_API_KEY` | `DEEPSEEK_MODEL_QUALITY` | `DEEPSEEK_MODEL` | `DEEPSEEK_MODEL_FAST` |
| Private LoRA | `LORA_API_KEY` + `LORA_BASE_URL` | uses `LORA_MODEL` | uses `LORA_MODEL` | uses `LORA_MODEL` |

AI Settings lets the user select **Auto route**, a preferred provider, a model profile and whether provider fallback is permitted. The server remains authoritative over keys, model IDs and provider order.

Provider failure before streaming can fall through to another configured provider when fallback is enabled. If no configured provider succeeds, `/api/chat` fails closed with an unavailable response; the UI does not invent an answer.

## Dependency warning cleanup

The previous all-wallet package pulled dozens of adapters the application did not use. The current release goes one step further and relies on Wallet Standard discovery through `@solana/wallet-adapter-react`, so Phantom and Solflare can be discovered at runtime without bundling their legacy per-wallet SDK adapters. This reduces the remaining old UUID/transitive wallet graph while keeping signing browser-wallet owned.

WalletConnect is intentionally not bundled in the default Solana wallet path. The application uses Wallet Standard discovery through `@solana/wallet-adapter-react`; add a separate WalletConnect adapter only if that flow is required and integration-tested.

## Helius + Solana

- `HELIUS_API_KEY` is server-only.
- standard allowlisted JSON-RPC reads prefer Helius and may fall back to the public Solana RPC.
- Helius Enhanced API features fail clearly when Helius is not configured; they do not fabricate a public-RPC equivalent.
- PWRC mint plus SPL Token, Token-2022, and Associated Token Program IDs are canonical public configuration.
- browser RPC URLs are explicit for devnet, testnet, and mainnet-beta.
- `/api/v1/solana/config` exposes non-secret runtime network metadata for diagnostics.
- PowerChain application program IDs remain environment-driven and blank until an actual verified deployment exists.


### Optional Supabase boot behavior

Supabase is optional during local UI development. Leave `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` blank if the project is not connected yet. Malformed placeholder URLs are treated as unconfigured at runtime so the workspace can boot, while `pnpm config:validate` still reports them as invalid.

### Solana network switch

```env
# Development
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
HELIUS_RPC_NETWORK=devnet

# Production/mainnet
# NEXT_PUBLIC_SOLANA_CLUSTER=mainnet-beta
# HELIUS_RPC_NETWORK=mainnet-beta
```

Never expose `HELIUS_API_KEY` as a `NEXT_PUBLIC_*` variable.

## Supabase

Saved prompts use Supabase when configured and localStorage as an explicit local fallback. The migration enables RLS and uses ownership policies for authenticated records. Do not expose a Supabase service-role/secret key to browser code.

## Safety boundary

GRIDLLM can analyze, forecast, compare, recommend and prepare. It **cannot sign wallet transactions**. Executable blockchain operations must terminate in a human-readable transaction review followed by the connected wallet's approval.

## Validation

```bash
pnpm typecheck
pnpm build
pnpm config:validate
pnpm prisma:validate
pnpm peers:check
```

See [`docs/VALIDATION.md`](docs/VALIDATION.md) for checks performed while generating this artifact and the remaining network-enabled verification step.


## Modular workspace extensions

Added canonical `src/env`, `src/constants`, `src/api/v1`, `src/schemas`, `src/data`, `src/storage`, `src/agents`, `src/skills`, `src/memory`, `src/mpc`, wallet/user/demo hooks, reusable page/error/loading boundaries, Supabase workspace migrations/seeds, and Web3 Icons integration (`@web3icons/react@4.1.21`). Existing runtime modules are wrapped/re-exported rather than duplicated.
## Install hardening

The project intentionally keeps `src/generated/prisma/` out of source control. `postinstall` runs `pnpm prisma:generate`, which first removes only the generated output directory and then regenerates it. This prevents stale placeholders or interrupted installs from causing Prisma ORM 7 output-directory errors.

The default Solana wallet bundle uses Wallet Standard discovery. Compatible Phantom and Solflare wallets appear automatically when installed and unlocked. The legacy Solana WalletConnect adapter and direct per-wallet SDK adapters are not bundled by default because their older dependency graphs introduce unnecessary transitive packages.

See `docs/PRISMA.md` and `docs/DEPENDENCIES.md` for maintenance details.

### Maintenance docs

- `CHANGELOG.md` — canonical release history
- `docs/PRISMA.md` — Prisma ORM 7 generation lifecycle
- `docs/DEPENDENCIES.md` — pnpm approvals and deprecation policy
- `src/docs/` — typed application documentation registry


## Runtime configuration troubleshooting

If a local `.env.local` still contains placeholder values, Renewables Copilot no longer fails at module evaluation. A malformed `NEXT_PUBLIC_SUPABASE_URL` disables Supabase and shows a configuration warning instead.

```bash
pnpm config:doctor
pnpm security:why
pnpm peers:check
```

OpenAI production traffic uses the Responses API (`https://api.openai.com/v1/responses`) through server-only routes. See `docs/OPENAI.md`, `docs/CONFIGURATION.md`, and `docs/SECURITY_DEPENDENCIES.md`.
