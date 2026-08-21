# PowerChain Renewables Copilot Security

Security-sensitive implementation notes live in:

- `docs/SECURITY.md`
- `docs/SECURITY_DEPENDENCIES.md`
- `docs/CONFIGURATION.md`
- `docs/OPENAI.md`

Core rules: server-only secrets, fail-closed AI/provider behavior, no server-side wallet signing, explicit Solana program/mint identity, Supabase RLS for browser-visible data, bounded uploads/WebSocket payloads, and lockfile/audit verification after dependency overrides.
