# Database and Persistence

## Supabase

Supabase provides authentication, PostgreSQL persistence and row-level security.

Migration SQL under `supabase/migrations/` is authoritative for:

- tables
- grants
- RLS enablement
- ownership policies

Tables exposed through the Data API must have explicit grants and RLS policies appropriate to the access model.

## Prisma

Prisma provides typed server-side database access over the same PostgreSQL schema.

`prisma.config.ts` permits client generation without `DATABASE_URL`, while actual database operations require a valid connection.

## Seeds

- `supabase/seed.sql` contains local Supabase seed boundaries.
- `scripts/seed.ts` is the application seed entrypoint.

Seeds must remain deterministic, clearly marked as demo/test data and safe to rerun where practical.

## Saved prompts

Saved prompts use Supabase when configured. The UI can use an explicit localStorage fallback for local development or disconnected operation.

## Security

The Supabase service-role key is server-only. Authorization decisions must use trusted ownership/app metadata and RLS, not user-editable metadata.
