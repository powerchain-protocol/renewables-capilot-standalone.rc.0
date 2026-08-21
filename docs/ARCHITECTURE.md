# Architecture

```text
Browser
├── App shell / Tailwind / Radix / shadcn-style components
├── Light / dark theme
├── GRIDLLM conversation + suggestions + saved prompts
├── AI Settings (provider preference / profile / fallback)
├── Solana wallet provider + custom connect modal
└── local prompt fallback
        │
        ▼
Next.js server routes
├── /api/chat
│    └── GRIDLLM Provider Router
│         ├── OpenAI
│         ├── Anthropic
│         ├── Google GenAI
│         ├── DeepSeek
│         └── OpenAI-compatible private LoRA
├── /api/models ───── configured provider/model status
├── /api/health ───── application/provider/chain configuration health
├── /api/helius
│    ├── RPC ──────── Helius → public Solana read fallback
│    └── Enhanced ─── Helius only; fail closed when unavailable
├── /api/prompts ──── Supabase / explicit local fallback
└── /api/programs ─── canonical + environment-backed identifiers
        │
        ▼
Infrastructure
├── Supabase PostgreSQL / Auth / RLS
├── Prisma server ORM / PostgreSQL adapter
├── Helius / Solana RPC
├── PowerChain programs
└── AI providers
```

## AI boundary

The UI submits a task-oriented profile and optional provider preference, not arbitrary credentials or unrestricted model configuration. The server resolves the approved model and provider order. This prevents browser-side API-key exposure and limits accidental cost/model escalation.

Provider fallback only occurs before the response stream is committed. A failed or missing provider therefore cannot silently switch midway through a streamed answer.

## Blockchain boundary

The AI layer has no signing authority. Solana wallet state stays in the wallet provider. Future transaction-generating tools should produce an unsigned review object, simulate it, display exact instructions/fees/recipients, and hand the final payload to the user's wallet.

## Data boundary

Bundled operational figures are demonstration data and are labelled accordingly. `/api/health`, provider configuration and RPC results are live states. Production telemetry must enter through explicit data adapters rather than replacing demo values invisibly.

## Database boundary

Supabase migration SQL owns RLS, grants and database policy. Prisma mirrors the same application schema for typed server-side access. `DATABASE_URL` is optional while generating Prisma Client but required for database operations.


## Modular workspace extensions

Added canonical `src/env`, `src/constants`, `src/api/v1`, `src/schemas`, `src/data`, `src/storage`, `src/agents`, `src/skills`, `src/memory`, `src/mpc`, wallet/user/demo hooks, reusable page/error/loading boundaries, Supabase workspace migrations/seeds, and Web3 Icons integration (`@web3icons/react@4.1.21`). Existing runtime modules are wrapped/re-exported rather than duplicated.


## Expanded source boundaries

```text
src/
├── env/                 # validated server/client environment access
├── constants/           # assets, networks, programs, routes, workspace context
├── api/v1/              # versioned API service contracts and CORS
├── actions/             # action registry and risk metadata
├── agents/              # GRIDLLM agent registry
├── skills/              # domain skill registry + markdown instructions
├── memory/              # non-secret transient memory boundary
├── mcp/                 # model-context capabilities
├── mpc/                 # custody/MPC policy boundary (disabled by default)
├── schemas/             # canonical validation exports
├── data/                # deterministic sample/catalog data
├── storage/             # browser storage helpers
├── clients/             # application client registry
├── hooks/               # user/wallet/agent/skill/prompt/demo hooks
├── components/          # workspace, messages, settings and UI primitives
└── lib/                 # concrete AI, Solana, Pyth, Supabase and DB adapters

packages/
├── components/          # reusable UI re-export surface
└── pages/               # reusable page/error/not-found surfaces
```

Dependency direction remains `UI -> hooks/services -> domain adapters -> providers`. Browser code does not import server secrets. Wallet signing is outside AI and server authority.
