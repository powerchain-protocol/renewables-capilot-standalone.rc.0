# Prisma and Supabase defaults

PowerChain uses Prisma as the default relational ORM and supports Supabase as the default managed Postgres/platform integration.

## Application boundaries

| Application | Prisma | Supabase |
| --- | --- | --- |
| Web | Better Auth and public-site persistence | hosted Postgres/storage/client integrations |
| Copilot | chats, messages, reports, AI runs and tenant-scoped operational state | hosted Postgres, storage and tenant/auth integration |
| Backend | server audit/control-plane persistence | server-only administrative integration |

Existing Web/Copilot Prisma schemas and migrations remain authoritative. The overlay writes its Web Prisma baseline only when a schema is missing and never replaces an existing Copilot schema.

## Environment

```env
DATABASE_URL=
WEB_DATABASE_URL=
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it through browser bundles or `NEXT_PUBLIC_*` variables.

## Commands

```bash
pnpm prisma:generate
pnpm prisma:validate
pnpm typecheck
pnpm build:apps
```

Prisma generation runs automatically as a preflight for application dev/build/typecheck commands when a schema exists.

## Backend migration

`apps/backend/supabase/migrations/0001_backend_audit_events.sql` mirrors the default backend Prisma audit model, enables RLS and grants direct table access only to `service_role`.
