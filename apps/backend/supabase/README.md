# Backend Supabase

Backend Supabase access is server-only. `SUPABASE_SERVICE_ROLE_KEY` is optional and must never be exposed through a `NEXT_PUBLIC_*` variable.

The default migration enables RLS and grants direct table access only to `service_role`.
