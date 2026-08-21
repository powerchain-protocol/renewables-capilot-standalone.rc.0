
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
