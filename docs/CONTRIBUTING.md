# Contributing

## Development workflow

1. Use Node `24.19.x` and pnpm `11.22.0`.
2. Create a focused branch for one coherent change.
3. Keep server-only code out of client bundles.
4. Reuse canonical `src/env`, `src/constants`, Supabase, Solana and AI modules rather than introducing parallel configuration systems.
5. Add or update schemas before accepting new external input shapes.
6. Preserve the non-custodial signing boundary.
7. Run validation before proposing a merge.

## Required checks

```bash
pnpm typecheck
pnpm config:validate
pnpm prisma:validate
pnpm build
```

When a change touches migrations, verify RLS and grants as part of review.

## Documentation

Update the relevant file under `/docs/` and add a concise entry to the root `CHANGELOG.md` for user-visible or architectural changes.

## Security-sensitive changes

Changes involving authentication, RLS, signing, wallet providers, program authorities, AI tools or secrets require explicit security review.
