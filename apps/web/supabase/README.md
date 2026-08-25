# Web Supabase

Supabase is optional but supported by default. Use it for hosted Postgres, storage or public client integrations. Better Auth remains the canonical account/session layer for Web.

Client-safe variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-only variable:

- `SUPABASE_SERVICE_ROLE_KEY`

Never expose the service-role key to browser code.
