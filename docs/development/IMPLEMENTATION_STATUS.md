# PowerChain Copilot v1.0.0 — Implementation Status

PowerChain Copilot is implemented as a multi-client, three-trust-zone application baseline. Public Web, authenticated Copilot and privileged Backend are independently deployable and share typed contracts with Expo mobile/PWA and the dedicated desktop workspace.

## Implemented application boundaries

- `apps/web` — public product/access surface on port 3000.
- `apps/copilot` — authenticated operations workspace on port 3001.
- `apps/backend` — privileged API/control plane on port 3002.
- `apps/mobile` — Expo iOS/Android/PWA client consuming the same Backend contracts.
- `apps/desktop` — Next.js enterprise workspace consuming shared services.

## Implemented Copilot contracts

- Server-issued persistent conversations and messages.
- Provider routing for OpenAI, Anthropic, Gemini, DeepSeek and Ollama.
- Bounded document ingestion for PDF/TXT/CSV/JSON with SHA-256 provenance.
- Document text remains private to Backend context and is treated as untrusted data, never system instructions.
- Evidence/provenance records separated from AI inference.
- Reports, operational analytics and privacy-bounded analytics events.
- Renewable intelligence context.
- Review-first execution intents with expiry and review hashes.
- No private-key custody or autonomous signing authority.
- Capability-gated Solana/Helius, Pyth, Birdeye, Jupiter and Sui reads/preparation.
- Liveness/readiness contracts and correlation identifiers.

## Persistence

When `DATABASE_URL` is configured, Backend selects the Prisma/Postgres repository for conversations, messages, reports, evidence, documents, analytics, audit records and execution intents. Development can intentionally use the in-memory repository when persistence is not configured. Production readiness fails closed when required dependencies are missing.

Supabase is treated as the managed Postgres/Storage/Edge platform rather than a second identity authority. Clerk remains the canonical user/session identity boundary. Public operational tables are hardened with RLS plus revoked direct `anon`/`authenticated` table privileges until explicit Data API policies are designed.

## External-state trust

- Solana/Helius: chain/indexed state.
- Pyth: oracle evidence.
- Birdeye: market intelligence.
- Jupiter: unsigned order preparation only.
- Sui: modern gRPC client boundary.
- LLM providers: reasoning/inference only.

External actions become authoritative only after the relevant external system is independently verified.

## Runtime configuration required for production

Production operation requires real credentials/configuration for the features being enabled, including Clerk, PostgreSQL/Supabase, at least one AI provider and any selected blockchain/data providers. Secrets remain server-only.

## Explicitly outside autonomous authority

The repository intentionally does not implement an AI-owned signer or private-key store. Wallet signing, launch authorization, treasury movement and other irreversible blockchain actions remain user/operator-controlled and must pass review and verification.

## Release verification

Run the canonical project toolchain on Node 24.x + pnpm 11.22.0:

```bash
pnpm install
pnpm prisma:generate
pnpm repo:verify
pnpm docs:check
pnpm copilot:check
pnpm contract:check
pnpm typecheck
pnpm build:apps
pnpm smoke:apps
pnpm release:check
```

The generated repo pack is also syntax/config checked in the artifact environment. A full dependency install/build must be run in the target Node 24 + pnpm 11.22 environment because the artifact environment does not provide pnpm.
