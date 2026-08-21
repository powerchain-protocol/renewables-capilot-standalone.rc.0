# Changelog

All notable changes to PowerChain Renewables Copilot are documented here.

The project follows semantic versioning for release artifacts. Dates use ISO `YYYY-MM-DD` format.

## [Unreleased]

### Fixed

- Made Prisma client generation idempotent by cleaning only `src/generated/prisma/` before generation.
- Removed the committed placeholder from the Prisma output directory that caused Prisma ORM 7 to reject the output as non-generated content.
- Added `@google/genai` to pnpm `allowBuilds` so reviewed installs no longer require repeated interactive approval.

### Changed

- Removed the optional `@solana/wallet-adapter-walletconnect` dependency from the default wallet bundle to eliminate its legacy WalletConnect 2.19.x, `lodash.isequal`, and old `uuid` transitive chains.
- Default Solana wallet support is now intentionally limited to direct Phantom and Solflare adapters.
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
