
## Install and dependency hardening — 2026-08-21

- Added canonical root `CHANGELOG.md` maintenance and application-local `src/docs/` registry.
- Fixed Prisma ORM 7 generation failures caused by a non-generated placeholder inside `src/generated/prisma/`.
- Added `scripts/prepare-prisma-output.mjs`; `postinstall` now cleans only the declared generated-client output and regenerates it.
- Added `@google/genai` to pnpm `allowBuilds`, eliminating repeated interactive build approval for that reviewed dependency.
- Removed legacy WalletConnect and direct Phantom/Solflare SDK adapters from the default dependency graph. Current Phantom and Solflare browser wallets are discovered through Wallet Standard support in `@solana/wallet-adapter-react`.
- Added a Node 24 native `DOMException` compatibility override for the deprecated `node-domexception` shim reached transitively through Google auth/fetch dependencies.
- Added `docs/PRISMA.md`, `docs/DEPENDENCIES.md`, and matching `src/docs/` engineering notes.

- Committed Next.js 16 development route types include (`.next/dev/types/**/*.ts`) to avoid automatic `tsconfig.json` rewrites.
- Removed `experimental.optimizePackageImports` from `next.config.ts`; the current Radix usage relies on normal ESM tree-shaking.
- Switched Solana wallet integration to Wallet Standard discovery and removed direct Phantom/Solflare adapter dependencies to further reduce old UUID transitive packages.
- `@prisma/adapter-pg` registry timing warnings are documented as network/cache latency; the adapter remains the intentional Prisma 7 PostgreSQL driver boundary.

## Solana runtime/configuration hardening — 2026-08-21

- Fixed the local boot crash caused by malformed optional `NEXT_PUBLIC_SUPABASE_URL` values. Optional URLs are sanitized to an unconfigured state at runtime, while `pnpm config:validate` remains strict.
- Added explicit Solana devnet/testnet/mainnet-beta browser RPC settings and separate server fallback RPC settings.
- Added Helius devnet/mainnet RPC base URLs and configurable Enhanced API base URL; `HELIUS_API_KEY` remains server-only.
- Added canonical SPL Token, Token-2022, and Associated Token Program IDs to the configuration registry and diagnostics API.
- Added `/api/v1/solana/config`, expanded `/api/programs` and `/api/health`, and surfaced Solana configuration in Workspace Settings.
- Added `pnpm peers:check` as a convenience alias for pnpm 11 peer-dependency diagnostics.

## Runtime, backend and security hardening — 2026-08-21

- Replaced fatal client environment parsing with resilient optional-integration parsing. Invalid Supabase placeholders no longer crash WalletProvider/AppProviders under Turbopack.
- Added `/api/v1/config` diagnostics and an in-workspace configuration warning banner.
- Added the server-only OpenAI Responses service, official Responses API URL configuration, a compatibility `CHATGPT_API_URL`, and `POST /api/v1/ai/openai/responses` with allowlisted Quality/Balanced/Fast profiles.
- Added typed API results, integration-health types, OpenAI/WebSocket request schemas, reusable backend response/error helpers, abortable GRIDLLM streaming, and Stop/Clear conversation controls.
- Added `lodash@4.18.1` using narrow method imports and `ws@8.21.3` with bounded WebSocket payloads.
- Added scoped pnpm remediations for vulnerable Lodash, Solana/Jayson UUID/WS, deepmerge-ts, and the unpatched upstream image-size package.
- Added defense-in-depth upload blocking for ICNS, JXL, HEIC/HEIF and related high-risk parser formats.
- Added Dependabot dependency grouping and security verification documentation.
