# Changelog
## 1.0.0 — PWRC Copilot credits and tokenized message receipts

- Added canonical Message Credit Unit pricing: `10,000 PWRC = $0.02` at the `$0.000002/PWRC` launch reference.
- Added fixed-PWRC and optional USD-indexed pricing calculations using integer micro-USD/atomic-unit math.
- Added server-side pricing classes for standard chat, tool-assisted chat, deep analysis, agent runs and report generation.
- Added PWRC credit accounts, reservations, append-only ledger entries and privacy-preserving tokenized message receipts to the Prisma reference schema.
- Added credit balance, pricing, ledger, reservation/release and message-receipt API contracts.
- Added credit-aware Prompt Library pricing, composer balance/estimate display and insufficient-credit guardrails.
- Added structured stream events for `credits.reserved`, `credits.settled` and `credits.released`.
- Added settlement receipt hashing; raw prompt/response content remains off-chain.
- Added verified-PWRC-funding repository hook that credits the chain-verified net amount and is idempotent by transaction signature.
- Added `docs/COPILOT-PWRC-CREDITS.md` and pricing tests while retaining product version `1.0.0`.

## 1.0.0 — Copilot Chat UX hardening

- Added `CopilotComposer.tsx` with a 2,000-character guardrail, progressive counter, multiline growth, Prompt Library entry point and Stop control.
- Added `StreamStageBar.tsx` for the structured `Context → Generate → Verify` SSE lifecycle.
- Added completed-response rendering for headings, lists, bold, inline code and fenced code blocks while retaining lightweight streaming output.
- Added collapsed evidence/provenance and compact provider/model/latency/source metadata.
- Added `ResponseToolbar.tsx` with Regenerate, Share and persisted Helpful/Unhelpful feedback.
- Added a 12-prompt operational Prompt Library with search, category filters and bookmarks.
- Added saved prompt, feedback and tenant-safe soft-delete conversation APIs/persistence models.
- Added near-bottom-only chat auto-follow and explicit destructive confirmation for conversation deletion.


## 1.0.0

### Architecture

- Defined universal Expo mobile/PWA architecture.
- Added provider-independent Copilot Runtime.
- Added prompts, suggestions, memory, MCP tools, agents and LoRA boundaries.
- Added immutable credit ledger and optional tokenized-credit redemption model.
- Added wallet transport abstraction and Solana Kit connector boundary.
- Added Helius, Pyth and Birdeye integration roles.
- Added normalized data fabric, provenance and freshness rules.
- Added transaction-intent security pipeline.
- Added API v1 namespaces, middleware model, observability and test invariants.
## v1.0.0 — integration scaffold expansion

- Added DeepSeek and Ollama normalized AI provider adapters.
- Added PowerChain assistant/skill/character/domain instruction files.
- Added AI provider registry and compatibility `providets.tsx` re-export.
- Added generic fetch, environment, cache and Result helpers.
- Added Solana Kit RPC, Jupiter, Birdeye, Pyth and PowerChain Solana reference adapters.
- Added current Sui gRPC SDK boundary and Cetus SDK v2 adapter boundary.
- Added AI provider, Solana data and Sui/Cetus documentation.
- Expanded API v1 documentation for model providers, Jupiter, Sui and Cetus.

### Client, renewable and identity hardening
- Added dedicated Next.js desktop shell with TypeScript and Tailwind CSS.
- Added prosumer, consumer and renewable-provider client segments.
- Added renewable asset, telemetry, market and Energy RWA domain contracts.
- Added Clerk desktop/Expo integration model, social/SSO support and Solana Web3 sign-in.
- Added Supabase Postgres/Edge boundaries, Prisma schema and migration guidance.
- Added responsive authentication/onboarding screens and shared authorization contracts.

## 1.0.0 — Copilot application hardening

- Added independently deployable `apps/web`, `apps/copilot`, and `apps/backend` boundaries with canonical 3000/3001/3002 local topology.
- Implemented Clerk-protected backend requests, role/capability contracts, content-free analytics, persistent conversation/report/evidence/execution data models, bounded document parsing, AI runtime routing, renewable overview and review-first execution intents.
- Added public whitepaper routes, authenticated Copilot workspace UI, provider health, evidence/provenance surfaces and release verification scripts.
- Extended Prisma schema for Copilot persistence while retaining renewable asset/meter data.

### Mobile and product UI/UX hardening

- Rebuilt Expo welcome/get-started, signed-in onboarding, authentication shells and completion flow around the light-first PowerChain design system.
- Added local onboarding completion gating for native and PWA clients without weakening server authorization.
- Replaced the mobile primary navigation with Copilot, Command Center, Assets, Alerts and Profile; Tasks/More remain nested routes.
- Added production-style Command Center, searchable assets, derived alerts, profile, full Copilot conversation, Review & Approve, Treasury, Reports and Energy Overview surfaces.
- Added shared mobile theme tokens, brand components, buttons, cards, badges and metric components.
- Upgraded authenticated Copilot web and Next.js desktop workspace shells to the same light visual system.
- Added design reference boards under `docs/design/` and documented the canonical UI/UX contract.
- Preserved data-trust behavior: missing treasury/financial values render unavailable instead of fabricated live values.