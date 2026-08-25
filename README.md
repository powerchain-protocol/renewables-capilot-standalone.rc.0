# PowerChain Copilot

**Version 1.0.0** · Renewable infrastructure AI operations workspace.

PowerChain is organized into independent trust zones: public Web (`:3000`), authenticated Copilot (`:3001`), privileged Backend (`:3002`), Expo mobile/PWA, and an optional dedicated desktop shell. Copilot resolves bounded context, analyzes evidence, prepares reviewable execution intents, and never receives autonomous wallet-signing authority.

## Applications

| App | Port | Purpose |
| --- | ---: | --- |
| `apps/web` | 3000 | public product, whitepaper, Clerk sign-in/access |
| `apps/copilot` | 3001 | conversations, documents, analytics, reports, evidence, execution review |
| `apps/backend` | 3002 | auth/capability checks, APIs, persistence, parsing, provider routing, verification |
| `apps/mobile` | Expo | iOS / Android / PWA operational client |
| `apps/desktop` | Next.js | dedicated desktop workspace retained for enterprise surfaces |


## App experience

The v1.0.0 light-first app system now shares one visual language across Expo mobile/PWA, authenticated Copilot web and Next.js desktop. Mobile primary navigation is `Copilot · Command Center · Assets · Alerts · Profile`, with Review & Approve, Treasury, Reports and Energy Overview as nested operational routes. Design references live in `docs/design/`.


## Copilot Chat UX

The canonical v1.0.0 mobile chat now includes a 2,000-character multiline composer, integrated searchable/bookmarkable Prompt Library, stop-generation control, structured `Context → Generate → Verify` streaming stages, near-bottom-only auto-follow, lightweight completed-message formatting, collapsed evidence/provenance, response feedback, and explicit confirmation before conversation deletion. See `docs/COPILOT-CHAT-UX.md`.

## PWRC-backed Copilot credits

Copilot v1.0.0 now defines a PWRC-funded message-credit system. The canonical launch baseline is **1 Message Credit Unit (MCU) = 10,000 PWRC**. At the initial reference price supplied for PWRC, **$0.000002/PWRC**, one MCU is **$0.02**. Prompt Library entries carry a credit class, the composer displays the estimated PWRC charge, and structured streaming supports `credits.reserved`, `credits.settled`, and `credits.released` lifecycle events.

PWRC is funded/verified on-chain, while per-message consumption remains in an immutable private ledger. A settled assistant response receives a tokenized usage receipt containing hashes and settlement metadata; raw prompts/responses are not published on-chain. See `docs/COPILOT-PWRC-CREDITS.md`.

Recommended launch classes are: standard chat `10,000 PWRC`, tool-assisted chat `20,000`, deep analysis `50,000`, agent run `100,000`, and report generation `250,000`. These are server policy defaults, not autonomous model decisions.

## Core invariant

```text
AI observes/analyzes/prepares → policy checks → human review → wallet/operator authorizes → external state verifies → audit/provenance records
```

## Quick start

Requires Node 24.x and pnpm 11.22.0.

```bash
corepack enable
corepack use pnpm@11.22.0
pnpm install
pnpm prisma:generate
pnpm dev:apps
```

Then open `http://localhost:3000`, `http://localhost:3001`, and health at `http://localhost:3002/api/health`. Copy `.env.example` to your environment and configure Clerk, Postgres/Supabase and at least one AI provider. In development, Backend can start without Clerk/DB using explicit development fallback; production readiness fails closed.

## Verification

```bash
pnpm repo:verify
pnpm docs:check
pnpm copilot:check
pnpm contract:check
pnpm env:doctor
pnpm deps:doctor
pnpm typecheck
pnpm build:apps
pnpm smoke:apps
pnpm release:check
```

## Documentation

- `docs/POWERCHAIN_COPILOT_WHITEPAPER.md` — product/security contract
- `docs/architecture/COPILOT_APPLICATION.md` — application trust boundaries
- `docs/api/API_V1.md` and `docs/api/openapi.yaml` — HTTP contracts
- `docs/security/SECURITY_MODEL.md` — security invariants
- `docs/architecture/AI_RUNTIME.md`, `MEMORY.md`, `DATA_FABRIC.md`, `SOLANA.md` — runtime/data architecture
- `docs/architecture/UI_UX_SYSTEM.md` and `docs/architecture/MOBILE.md` — light-first app design and mobile interaction contract

## Data trust

Solana/Helius represent chain state; Pyth represents oracle state; Birdeye represents market intelligence; documents and telemetry carry provenance; LLM output is reasoning, never a substitute for verified external state.
