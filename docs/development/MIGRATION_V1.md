# v1.0.0 Repository Migration

## Target

Move the contract-first repository into a runnable multi-client workspace without breaking Copilot, AI provider, wallet or blockchain boundaries.

## Sequence

1. Install/pin workspace dependencies and commit `pnpm-lock.yaml`.
2. Generate Prisma Client from `prisma/schema.prisma`.
3. Configure Supabase Postgres connection strings and validate the database connection.
4. Generate and review the initial migration; apply RLS/Data API restrictions through the normal Supabase migration workflow.
5. Configure Clerk web and native applications, social providers and Solana Web3 authentication.
6. Start `apps/desktop` and validate sign-in, role navigation and server API access.
7. Create an Expo development build for `apps/mobile`; validate native auth and `.web.tsx` PWA auth separately.
8. Link organizations and roles from application DB, not editable client metadata.
9. Connect PowerChain API bearer-token verification to Clerk and add webhook-based profile synchronization.
10. Run end-to-end auth → onboarding → renewable client → Copilot → wallet review tests before release.

## Supabase 2026 compatibility

The scaffold assumes the current Data API exposure model: application tables are API-owned and `supabase/sql/harden-public-tables.sql` revokes direct `anon`/`authenticated` access unless an explicit Data API use case is introduced later. Edge Functions use a named server secret rather than exposing a service key to clients.
