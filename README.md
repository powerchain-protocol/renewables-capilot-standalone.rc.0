<div align="center">
  <img src="public/brand/logo-green.png" alt="PowerChain" width="220" />

# PowerChain Renewables Copilot

**AI-native renewable energy operations, market intelligence, tokenized-asset analysis, and PowerChain infrastructure monitoring.**

Built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **GRIDLLM**, multi-provider AI, **Solana/SVM**, **Helius**, **Pyth**, **Supabase**, and **Prisma**.
</div>

---

## Overview

Renewables Copilot is a modular AI operations workspace for renewable-energy teams. It combines operational context, local/P2P market intelligence, tokenized energy and carbon workflows, PWRC/Solana infrastructure, saved analytical prompts, and provider-aware GRIDLLM conversations in one professional application shell.

The product is designed around a strict execution boundary:

> **AI can analyze, forecast, compare, recommend, and prepare. User wallets retain signing authority.**

Operational demo values are explicitly labelled as sample data until a live telemetry adapter supplies production measurements.

## Core features

| Area | Capabilities |
| --- | --- |
| **Renewables Copilot** | Streaming GRIDLLM chat, task modes, contextual suggestions, saved prompts, Stop/Clear controls, model-profile routing |
| **Energy operations** | Portfolio KPIs, generation/consumption/storage views, asset context, operational insights, forecasting-ready data boundaries |
| **Local & P2P markets** | Market snapshots, bid/ask context, local premium analysis, settlement-oriented recommendations |
| **Tokenized assets** | PWRC context, tokenized-energy/carbon analysis prompts, provenance-oriented data boundaries, non-custodial action preparation |
| **Multi-provider AI** | OpenAI, Anthropic, Google GenAI, DeepSeek, and private OpenAI-compatible LoRA routing with explicit fallback policy |
| **Agents & skills** | Renewables, Solana, PowerChain, market-analysis and infrastructure skill registries with typed agent metadata |
| **Solana / SVM** | Wallet Standard discovery, `@solana/web3.js`, devnet/mainnet-beta profiles, SPL Token, Token-2022 and ATA identifiers |
| **Helius & Pyth** | Server-only Helius RPC/Enhanced API access, public Solana read fallback, Pyth/Hermes oracle adapter boundary |
| **Persistence** | Supabase Auth/Postgres/RLS, Prisma 7 PostgreSQL adapter, migrations, seeds, saved prompts and user preferences |
| **UI system** | Full-height three-column dashboard shell, independently scrollable content, fixed left/right sidebars, light/dark themes, Radix/shadcn-style primitives, Web3 Icons, loading/error/not-found states |
| **PWA & account surfaces** | PWA route, profiles, accounts, balances, settings, wallet management and responsive mobile navigation |
| **Security** | Server-only secrets, resilient env parsing, bounded uploads/WebSockets, dependency auditing, fail-closed provider behavior |

## Dashboard shell and scrolling

The desktop workspace uses a full-height three-column shell:

```text
Left navigation      Dashboard content                 Right context
238 px               flexible                         296 px
full viewport        independently scrollable         full viewport
fixed shell          footer follows content           fixed shell
nav list scrolls                                       white in light theme
```

Only the navigation list inside the left sidebar scrolls independently. The sidebars themselves remain pinned to the viewport while the central dashboard content scrolls. The dashboard footer is anchored to the bottom on short pages and follows the content naturally on long pages.

## Application architecture

```text
Browser
├── PowerChain application shell
├── Renewables Copilot / GRIDLLM
├── Energy, market, asset and infrastructure views
├── Wallet Standard provider
├── Saved prompts / local fallback
└── Light / dark / responsive UI
        │
        ▼
Next.js server
├── /api/chat
├── /api/v1/ai/openai/responses
├── /api/v1/solana/*
├── /api/helius/*
├── /api/v1/prompts
├── /api/v1/config
├── /api/v1/agents
├── /api/v1/skills
└── /api/health
        │
        ▼
Service layer
├── GRIDLLM provider router
│   ├── OpenAI
│   ├── Anthropic
│   ├── Google GenAI
│   ├── DeepSeek
│   └── Private LoRA
├── Solana / Helius / Pyth
├── Supabase / Prisma / PostgreSQL
└── PowerChain program configuration
```

### Execution model

```text
Observe → Analyze → Forecast / Compare → Recommend
        → Prepare review object → Simulate / Validate
        → Human review → Wallet signature → Settlement
```

The AI/server layer does **not** own private keys and must not sign user transactions.

## Technology stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js `16.3.1`, React `19.2.8` |
| Language | TypeScript `5.9.3` |
| Styling | Tailwind CSS `4.3.3`, Radix UI, shadcn-style primitives |
| Package manager | Corepack + pnpm `11.22.0` |
| Runtime | Node.js `>=24.19.0 <25` |
| AI | AI SDK `7`, OpenAI Responses API, Anthropic, Google GenAI, DeepSeek, private LoRA |
| Blockchain | `@solana/web3.js`, Wallet Standard, SPL Token / Token-2022 |
| Infrastructure | Helius RPC/API, Pyth/Hermes |
| Database | Supabase PostgreSQL/RLS + Prisma `7.9.1` |
| Validation | Zod `4.4.3` |
| Networking | Axios, bounded `ws` server utility |
| Icons | Radix Icons + `@web3icons/react` |

## Quick start

### Requirements

- Node.js `24.19.x`
- Corepack
- pnpm `11.22.0`

### Install

```bash
corepack enable
corepack use pnpm@11.22.0
pnpm install
cp .env.example .env.local
pnpm telemetry:disable
pnpm dev
```

Open `http://localhost:3000`.

### Validate the workspace

```bash
pnpm prisma:generate
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm prisma:validate
pnpm security:check
pnpm build
```

`DATABASE_URL` is not required for Prisma client generation, but it **is required** for real database operations.

## Configuration

The application separates browser-safe configuration from server-only credentials. Optional integrations degrade to a visible **Unconfigured** state instead of crashing module evaluation.

### Minimum local configuration

```env
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_POWERCHAIN_NETWORK=devnet
NEXT_PUBLIC_SOLANA_CLUSTER=devnet

NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL=https://api.mainnet-beta.solana.com

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

### Server-only integrations

```env
# OpenAI / GRIDLLM
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_RESPONSES_URL=https://api.openai.com/v1/responses
CHATGPT_API_URL=https://api.openai.com/v1/responses

# Helius
HELIUS_API_KEY=
HELIUS_RPC_NETWORK=devnet
HELIUS_DEVNET_RPC_URL=https://devnet.helius-rpc.com
HELIUS_MAINNET_RPC_URL=https://mainnet.helius-rpc.com

# Database
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose provider keys, database credentials, Helius keys, or Supabase service-role credentials through `NEXT_PUBLIC_*` variables.

See [Configuration](docs/CONFIGURATION.md), [OpenAI](docs/OPENAI.md), [Solana](docs/SOLANA.md), and [Database](docs/DATABASE.md) for complete setup.

## Solana / PowerChain identity

The public configuration registry includes:

- Solana **devnet**, **testnet**, and **mainnet-beta** RPC profiles
- SPL Token Program
- SPL Token-2022 Program
- Associated Token Program
- canonical PWRC mint configuration
- environment-backed PowerChain program IDs

Unknown PowerChain program IDs remain blank until a deployment is verified. The application does not fabricate addresses to make a feature appear deployed.

## AI provider model

GRIDLLM uses server-controlled provider and model profiles rather than accepting unrestricted browser-supplied model IDs or API URLs.

```text
Auto route
├── OpenAI
├── Anthropic
├── Google GenAI
├── DeepSeek
└── Private LoRA

Profiles
├── Quality
├── Balanced
├── Fast
└── Private LoRA
```

Provider keys remain server-side. Fallback is explicit and can be disabled by the user. If no configured provider succeeds, the API fails closed rather than inventing a response.

## Source structure

```text
src/
├── app/                 # Next.js application and API routes
├── api/                 # typed client/server API helpers
├── agents/              # GRIDLLM agent registry
├── skills/              # renewable/Solana/PowerChain skill definitions
├── memory/              # non-secret memory boundary
├── env/                 # resilient client/server environment parsing
├── constants/           # networks, programs, routes, workspace context
├── data/                # deterministic sample/catalog data
├── hooks/               # wallet, users, prompts, agents, skills, demo state
├── components/          # workspace, chat, settings, wallet and UI components
├── lib/                 # AI, Solana, Supabase, Pyth and DB adapters
├── schemas/             # Zod request/domain schemas
├── storage/             # browser persistence helpers
├── types/               # shared domain/API/action types
├── mcp/                 # model-context capabilities
└── mpc/                 # custody/MPC policy boundary; disabled by default

packages/
├── components/          # reusable UI surface
└── pages/               # reusable error/not-found/page shells

supabase/                # migrations + seed
prisma/                  # Prisma schema
scripts/                 # validation, config and maintenance tooling
docs/                    # canonical long-form documentation
```

## Security model

Key invariants:

- API, model, database and Helius secrets are server-only.
- AI and backend services cannot sign for user wallets.
- Supabase RLS controls browser-visible database rows.
- malformed optional integrations do not crash the application.
- WebSocket payloads are bounded and compression is disabled in the reusable WS server boundary.
- uploaded parser-sensitive image formats are restricted defensively.
- dependency build scripts are explicitly governed by pnpm `allowBuilds`.
- program IDs, mint addresses, chain IDs and wallet identity are validated independently of presentation icons.

See [Security](docs/SECURITY.md) and [Dependency Security](docs/SECURITY_DEPENDENCIES.md).

## Documentation

| Guide | Description |
| --- | --- |
| [Documentation index](docs/README.md) | Complete documentation map |
| [Getting Started](docs/GETTING_STARTED.md) | Installation and first run |
| [Architecture](docs/ARCHITECTURE.md) | Runtime boundaries and module ownership |
| [AI & GRIDLLM](docs/AI.md) | Providers, agents, skills and memory |
| [OpenAI](docs/OPENAI.md) | Responses API integration and model profiles |
| [Configuration](docs/CONFIGURATION.md) | Environment parsing and diagnostics |
| [Solana & Web3](docs/SOLANA.md) | Wallet, RPC, Helius and token-program configuration |
| [Database](docs/DATABASE.md) | Supabase, Prisma, migrations and RLS |
| [UI/UX](docs/UI_UX.md) | Product shell and responsive interaction system |
| [Security](docs/SECURITY.md) | Application security boundaries |
| [Dependency Security](docs/SECURITY_DEPENDENCIES.md) | Dependabot and pnpm remediation policy |
| [Validation](docs/VALIDATION.md) | Validation status and local verification |
| [Changelog](docs/CHANGELOG.md) | Version history |
| [Release Notes](docs/RELEASE_NOTES.md) | Current implementation release details |
| [Contributing](docs/CONTRIBUTING.md) | Contribution workflow |
| [Contributors](docs/CONTRIBUTORS.md) | Contributor policy and attribution |

## Development principles

1. **Runtime truth over mock presentation.** Sample data must remain visibly labelled.
2. **One source of truth per domain.** New folders wrap/re-export canonical modules instead of duplicating environment, Solana, or database logic.
3. **Fail closed for privileged behavior.** Missing AI, Helius, database, or program configuration must never fabricate successful execution.
4. **Non-custodial by design.** User wallets own approval and signing.
5. **Explicit chain identity.** Network, program, mint, token-program and account identity must be validated before execution.
6. **Security before dependency convenience.** Build scripts, overrides, audits and lockfile changes are reviewed explicitly.

---

<div align="center">
  <strong>PowerChain Renewables Copilot</strong><br />
  Renewable intelligence · Local energy markets · Tokenized assets · Solana infrastructure · GRIDLLM
</div>

## Troubleshooting

### `config:doctor` reports top-level await / CJS transform

The repository version of `scripts/config-doctor.ts` runs through an async `main()` function and does not use top-level `await`. Run:

```bash
pnpm config:doctor
```

### Web3 Icons `NetworkIcon` TypeScript error

The UI intentionally uses static `NetworkSolana`, `NetworkSui`, and `TokenUSDC` exports. Do not replace them with the dynamic `NetworkIcon network=...` wrapper unless the installed Web3 Icons type surface is verified. Static exports are also preferable for bundle tree-shaking.

### `pnpm peers check` and `utf-8-validate`

The workspace resolves `utf-8-validate` to `5.0.10`, which satisfies the optional `ws@7` `^5.0.2` peer and the newer `ws@8` `>=5.0.2` peer. After changing dependency policy, regenerate the lockfile once with `pnpm install --no-frozen-lockfile`, then return CI to `--frozen-lockfile`.
