# Changelog
## 1.0.0-rc.4 — 2026-08-21

### Fixed
- Made optional Supabase public configuration non-fatal during local boot; blank or malformed optional URLs are treated as unconfigured at runtime instead of throwing a Zod module-evaluation error.
- Preserved explicit config validation so malformed supplied URLs are still reported by `pnpm config:validate`.
- Committed `.next/dev/types/**/*.ts` and retained a stable Next config without `experimental.optimizePackageImports`.

### Added
- Explicit Solana devnet, testnet, and mainnet-beta RPC configuration.
- Server-side Solana fallback RPC variables and Helius devnet/mainnet RPC base variables.
- Helius REST API base configuration without exposing the API key client-side.
- Canonical SPL Token, Token-2022, and Associated Token Program IDs.
- `/api/v1/solana/config` and expanded `/api/programs`/`/api/health` network metadata.
- Solana configuration details in Workspace Settings and `docs/SOLANA.md`.

All notable changes to PowerChain Renewables Copilot are documented here.

The project follows semantic versioning for release artifacts. Dates use ISO `YYYY-MM-DD` format.

## [Unreleased]

### Fixed

- Explicitly included `.next/dev/types/**/*.ts` in `tsconfig.json` so Next.js 16 no longer needs to rewrite the project config during `next dev`.
- Removed the unused experimental `optimizePackageImports` flag from `next.config.ts`, eliminating the experiments warning for the current Radix icon usage.
- Switched the default Solana wallet layer to Wallet Standard discovery and removed legacy direct Phantom/Solflare adapter packages to reduce remaining old `uuid` transitive dependencies.
- Made Prisma client generation idempotent by cleaning only `src/generated/prisma/` before generation.
- Removed the committed placeholder from the Prisma output directory that caused Prisma ORM 7 to reject the output as non-generated content.
- Added `@google/genai` to pnpm `allowBuilds` so reviewed installs no longer require repeated interactive approval.

### Changed

- Removed the optional `@solana/wallet-adapter-walletconnect` dependency from the default wallet bundle to eliminate its legacy WalletConnect 2.19.x, `lodash.isequal`, and old `uuid` transitive chains.
- Default Solana wallet support now uses Wallet Standard discovery; compatible Phantom and Solflare browser wallets are discovered without bundling per-wallet SDK adapters.
- Replaced deprecated `node-domexception` transitively reached by Google GenAI with a Node 24 native-DOMException compatibility package.

### Documentation

- Added `src/docs/` as a typed application documentation registry and engineering-note boundary.
- Added Prisma and dependency/pnpm maintenance guides under `/docs/`.

## [1.0.0] - 2026-08-21

### Added

- Next.js 16 / React 19 / TypeScript / Tailwind CSS Renewables Copilot workspace.
- GRIDLLM multi-provider AI routing for OpenAI, Anthropic, Google GenAI, DeepSeek and private LoRA endpoints.
- AI settings, agents, skills, prompts, saved prompts and non-secret memory boundaries.
- Solana wallet provider, Phantom/Solflare support, Helius RPC/API adapters and Pyth configuration.
- PowerChain PWRC configuration and environment-driven application program registry.
- Supabase Auth/PostgreSQL/RLS persistence with Prisma typed server access.
- Light/dark themes, responsive application shell, Radix UI primitives and Web3 Icons.
- PWA/settings/profile/account/balance/error/loading/not-found surfaces.
- Modular `src/env`, `src/constants`, `src/api/v1`, `src/data`, `src/storage`, `src/types`, `src/agents`, `src/skills`, `src/memory`, `src/mcp` and `src/mpc` boundaries.

### Changed

- Standardized package management on Corepack + pnpm `11.22.0`.
- Disabled Next.js telemetry in project scripts/configuration.
- Replaced the all-wallet Solana adapter aggregator with direct Phantom/Solflare dependencies.
- Made Prisma client generation independent of `DATABASE_URL` while keeping real database operations fail-closed.

### Security

- Kept AI and server code outside wallet signing authority.
- Kept secrets server-only.
- Added explicit Supabase RLS ownership policies and grants.
- Kept unknown Solana program IDs unset rather than fabricating deployment values.

## 1.0.0 - 2026-08-21 - Runtime and dependency hardening

### Fixed
- Prevented malformed optional `NEXT_PUBLIC_SUPABASE_URL` values from throwing a Zod error during Turbopack module evaluation. Optional integrations now normalize invalid placeholder URLs to an unconfigured state and expose diagnostics through `/api/v1/config`.
- Removed server/client API barrel leakage for OpenAI and WebSocket server modules.
- Hardened WebSocket parsing against invalid JSON and bounded server payloads with compression disabled.
- Added abort/stop behavior to GRIDLLM streaming and a clear-conversation action.

### Added
- `OPENAI_BASE_URL`, `OPENAI_RESPONSES_URL`, and `CHATGPT_API_URL` environment configuration.
- Typed OpenAI Responses API service under `src/api/openai/` and `POST /api/v1/ai/openai/responses` with server-controlled model profiles.
- `src/schemas/ws.ts`, `src/schemas/openai.ts`, typed API results, integration-health types, and reusable API response helpers.
- `lodash@4.18.1`, `ws@8.21.3`, and their TypeScript types.
- Configuration warning UI for malformed Supabase settings and OpenAI endpoint visibility in AI Settings.
- Dependabot grouping for AI, Solana, database and UI dependency families.

### Security
- Scoped vulnerable Lodash ranges to `4.18.1`.
- Scoped the Solana `jayson` UUID chain to patched `uuid@11.1.1` and its WS 7.x chain to patched `ws@7.5.13`.
- Forced `deepmerge-ts<8` to `8.0.1` to address recursive-object stack exhaustion.
- Replaced unmaintained vulnerable `image-size` resolutions with `image-size-next@2.1.1`, and blocked risky ICNS/JXL/HEIF upload formats as defense in depth.
