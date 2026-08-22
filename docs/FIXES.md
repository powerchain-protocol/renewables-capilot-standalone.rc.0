# Runtime and workspace fixes

## `No projects matched the filters`

Cause: root scripts used `pnpm --filter @powerchain/web` / `@powerchain/copilot`, but the existing repository retained legacy package names.

Fix: root orchestration now targets directories with `pnpm --dir` through `scripts/powerchain-workspace.mjs`. App package names are preserved instead of being silently renamed.

## `Command "peers:check" not found`

Fix: the root package now defines `peers:check`, which delegates to `pnpm peers check`.

The overlay automatically merges:

```yaml
overrides:
  utf-8-validate: 5.0.10

peerDependencyRules:
  allowedVersions:
    utf-8-validate: ">=5.0.2"
```

This addresses the `ws@7.5.13` peer requirement while remaining compatible with the workspace's newer WebSocket consumers.

## Backend typecheck

Backend now uses the same strict Next.js TypeScript baseline as the frontend applications:

- `skipLibCheck`
- `esModuleInterop`
- `moduleResolution: bundler`
- `isolatedModules`
- Next TypeScript plugin
- `.next/types/**/*.ts`
- `.next/dev/types/**/*.ts`

The root layout imports `ReactNode` explicitly, session proxy data is Zod-validated, and CORS origin filtering uses a typed string predicate.

## `build:apps` / `dev:apps` missing

Both are installed by the root package patch and dispatched by `scripts/powerchain-workspace.mjs`.

Build order is Backend → Web → Copilot. Development starts Web `:3000`, Copilot `:3001`, and Backend `:3002` concurrently with shared signal handling.

## Turbopack 404 recovery

If `/`, `/api/health`, or `/manifest.webmanifest` suddenly become 404 after previously working during development, run:

```bash
pnpm dev:reset
```

This removes only the three application `.next` directories before restarting. Source files, Prisma output, dependencies and environment files are untouched.

## Cross-subdomain auth

Production Better Auth enables cross-subdomain cookies for `.powerchain.app`. This is required for the intended flow:

`web.powerchain.app → copilot.powerchain.app/dashboard`

Localhost does not force that production cookie domain.

## pnpm minimumReleaseAge prompt during Next 16.3.2 install

The age gate is retained. The overlay adds exact `minimumReleaseAgeExclude` entries for the reviewed Next 16.3.2 package family only. No wildcard exclusion and no global policy disable is used.

The root `dev` and `predev` scripts are also replaced so development never runs an implicit dependency install. `predev` performs Node/workspace/port checks only.

`peers:check` is now an internal deterministic compatibility audit rather than a call to a nonexistent `pnpm peers check` command. It validates the workspace override and lockfile state for `utf-8-validate@5.0.10`.
