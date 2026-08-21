
## Install and dependency hardening — 2026-08-21

- Added canonical root `CHANGELOG.md` maintenance and application-local `src/docs/` registry.
- Fixed Prisma ORM 7 generation failures caused by a non-generated placeholder inside `src/generated/prisma/`.
- Added `scripts/prepare-prisma-output.mjs`; `postinstall` now cleans only the declared generated-client output and regenerates it.
- Added `@google/genai` to pnpm `allowBuilds`, eliminating repeated interactive build approval for that reviewed dependency.
- Removed `@solana/wallet-adapter-walletconnect` from the default dependency graph. Phantom and Solflare remain direct supported adapters.
- Added a Node 24 native `DOMException` compatibility override for the deprecated `node-domexception` shim reached transitively through Google auth/fetch dependencies.
- Added `docs/PRISMA.md`, `docs/DEPENDENCIES.md`, and matching `src/docs/` engineering notes.
