# Validation

## Completed in this build environment

- TypeScript/TSX syntax parse: **182 files, 0 syntax diagnostics**.
- Internal project import audit: **0 unresolved imports**, excluding `@/generated/prisma/client`, which is intentionally created by `prisma generate`.
- Required-structure validation: **15 critical paths present**.
- Prisma output preflight: `scripts/prepare-prisma-output.mjs` removes only `src/generated/prisma/` and passes its path guard.
- `src/generated/prisma/` contains no committed placeholder or non-generated file.
- Local Node 24 `DOMException` compatibility package exports the native runtime implementation and has no install script.
- `@solana/wallet-adapter-walletconnect` and `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` are absent from runtime dependencies/configuration.
- `@google/genai` is explicitly listed in pnpm `allowBuilds`.
- `.env.example` and `env.example` are synchronized.
- JSON configuration files parse successfully.
- `pnpm-workspace.yaml` parses successfully as YAML.

## Dependency warning remediation

The prior warning set contained duplicated WalletConnect 2.19.x packages, `lodash.isequal`, old `uuid` versions and `node-domexception`.

This release removes the optional Solana WalletConnect adapter from the default dependency graph, which is expected to remove the WalletConnect/`lodash.isequal`/legacy-`uuid` branch on the next lockfile refresh. The remaining `node-domexception` path reached through Google GenAI is overridden with a local Node 24 native-DOMException compatibility package.

Because this container does not contain the user's resolved `pnpm-lock.yaml` or installed dependency graph, the final deprecation count must be confirmed after refreshing the lockfile locally.

## Requires local Node 24 dependency environment

The execution container is Node 22, while the project requires Node `>=24.19.0 <25`. Run locally:

```bash
corepack enable
corepack use pnpm@11.22.0

# Refresh once because the dependency graph changed.
pnpm install --no-frozen-lockfile

# The committed allowBuilds policy should make @google/genai non-interactive.
pnpm prisma:generate
pnpm typecheck
pnpm prisma:validate
pnpm build

# Confirm deprecated packages are no longer in the resolved graph.
pnpm deps:why:deprecated
```

After the refreshed `pnpm-lock.yaml` is committed, CI should return to:

```bash
pnpm install --frozen-lockfile
```

## Database verification

```bash
supabase start
supabase db reset
pnpm supabase:types
pnpm db:test
```

`DATABASE_URL` is not required for `prisma generate`, but it is required for migrations, Prisma runtime queries, Studio, database tests and seeds.
