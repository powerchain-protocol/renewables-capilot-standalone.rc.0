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
