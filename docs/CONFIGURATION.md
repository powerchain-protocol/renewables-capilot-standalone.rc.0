# Configuration Behavior

Optional integrations must not crash the application at import time.

- Invalid or placeholder `NEXT_PUBLIC_SUPABASE_URL` values are normalized to `undefined`.
- Supabase browser/server clients return `null` while configuration is absent.
- `/api/v1/config` reports whether Supabase, OpenAI, Helius and Pyth are configured.
- The workspace displays a warning when a Supabase public URL is malformed.
- `pnpm config:doctor` remains strict enough to report malformed explicitly configured URLs.

Use a real Supabase URL when enabling persistence:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Do not put service-role, Helius, OpenAI or private-model credentials in `NEXT_PUBLIC_*` variables.
