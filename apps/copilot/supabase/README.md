# Copilot Supabase

Copilot uses Prisma for relational persistence and can use Supabase for hosted Postgres, storage and tenant/auth integration. Existing project migrations are authoritative and are preserved by this overlay.

Expected variables:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
