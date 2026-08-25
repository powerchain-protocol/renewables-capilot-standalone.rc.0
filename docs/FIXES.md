# Runtime and workspace fixes

## `No projects matched the filters`

Cause: root scripts used `pnpm --filter @powerchain/web` / `@powerchain/copilot`, but the existing repository retained legacy package names.

Fix: root orchestration now targets directories with `pnpm --dir` through `scripts/powerchain-workspace.mjs`. App package names are preserved instead of being silently renamed.

## `Command "peers:check" not found`

Fix: the root package now defines `peers:check` as an internal deterministic lockfile/workspace compatibility audit; it does not depend on a nonexistent pnpm subcommand.

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

The root `dev` and `predev` scripts are also replaced so development never runs an implicit dependency install. `predev` verifies that the overlay is installed; the dev dispatcher then runs workspace, Prisma and port preflights before starting applications.

`peers:check` is now an internal deterministic compatibility audit rather than a call to a nonexistent `pnpm peers check` command. It validates the workspace override and lockfile state for `utf-8-validate@5.0.10`.

## Auth package rename and persistence defaults

- Renamed `packages/authz` / `@powerchain/authz` to `packages/auth` / `@powerchain/auth`.
- Renamed the Web session route from `/api/v1/authz/session` to `/api/v1/auth/session` and normalized Backend/Copilot on the same `/api/v1/auth/session` contract.
- Overlay upgrade removes stale authz package/dependency/route paths automatically.
- Added app-level README files for Web, Copilot and Backend.
- Added Prisma/Supabase dependencies to all deployable apps.
- Added safe Web Prisma defaults only when an existing schema/helper is absent.
- Added Backend Prisma client/schema/config plus a matching Supabase migration.
- Added Prisma preflight to dev, typecheck and build paths to prevent missing generated-client failures.

- Demo access always resolves to the dedicated `demo` role; it can no longer mint viewer/analyst/operator capabilities.

## `Cannot find module 'next/server'`, `Cannot find module 'next'`, or `Cannot find name 'process'`

These errors indicate that the app package/TypeScript project was incomplete or the overlay package patch had not been applied before `pnpm install`.

The repaired overlay now guarantees for Web, Copilot and Backend:

- `next@16.3.2` in the app package;
- `@types/node@24.3.0` and TypeScript in dev dependencies;
- committed `next-env.d.ts`;
- Next-aware `tsconfig.json` using `moduleResolution: "bundler"`;
- the Next TypeScript plugin;
- `*.ts` in `include`, covering root `proxy.ts`, `next.config.ts` and `prisma.config.ts`;
- preservation of existing project-specific TypeScript options where possible;
- JSONC/trailing-comma support when merging an existing `tsconfig.json`.

Apply the overlay **before** installing dependencies, then reinstall once so pnpm links Next and the Node types into each workspace app.

## `Cannot find module .../powerchain-routing-backend-overlay/scripts/apply-overlay.mjs`

The command referenced a directory that was not present at that location. A downloaded ZIP is not the same as an extracted overlay directory.

Recommended layout:

```text
powerchain-capilot/
├── package.json
├── apps/
└── powerchain-routing-backend-overlay/
    ├── install-current.mjs
    ├── bootstrap.mjs
    └── scripts/
```

From `powerchain-capilot/` run:

```bash
node powerchain-routing-backend-overlay/install-current.mjs .
```

Only after the installer reports `PASS` should `pnpm overlay:verify`, `pnpm workspace:doctor`, Prisma, build and dev commands be used.

## `.gitignore` hardening

Bootstrap idempotently adds ignores for dependency stores, `.next`, `.turbo`, OpenNext/Vercel/Cloudflare build output, coverage/dist output, TypeScript build information, logs, all real `.env*` files, and generated Prisma clients while retaining `.env.example` templates.

## Root package orchestration refactor

The root `package.json` now owns the application lifecycle directly. Web, Copilot and Backend are addressed by directory (`apps/web`, `apps/copilot`, `apps/backend`) instead of package-name filters. This removes failures caused by legacy or renamed workspace package names.

The app manifests now guarantee `dev`, `build`, `start`, `typecheck`, `prisma:generate` and `prisma:validate`; Copilot also guarantees `config:doctor`. The root manifest composes those scripts, while `workspace:doctor`, peer checks and port checks remain diagnostic helpers.

All Next app TypeScript templates explicitly include `node`, `react` and `react-dom` ambient type packages, preventing `process`/Node-global editor errors after dependencies are installed.

## Full monorepo installer lifecycle

The root `package.json` now owns app orchestration by directory instead of package-name filters. After the one-time bootstrap, normal maintenance is repository-native:

```bash
pnpm setup
pnpm upgrade
pnpm fix
pnpm doctor
```

- `setup` repairs manifests/workspace policy, installs dependencies, generates/validates Prisma and typechecks.
- `upgrade` performs the same repair/validation and then production-builds Backend, Web and Copilot.
- `fix` performs an idempotent manifest/TypeScript/workspace repair without installing dependencies.
- `doctor` verifies Node, root scripts, app dependencies, ports/contracts and required monorepo files.

The installer guarantees Next/React/TypeScript/Node typings for each app, keeps Web/Copilot/Backend on ports 3000/3001/3002, and preserves existing Prisma schemas while creating defaults when they are absent.

## Native app supervision and CI contract

- Removed the root `concurrently` dependency. `pnpm dev:apps` and `pnpm start:apps` now use the repository-native workspace supervisor with coordinated signal forwarding and fail-fast sibling shutdown.
- Added `scripts/env-doctor.mjs` and `pnpm env:doctor` for URL/port, PowerChain/Solana network, auth/demo, persistence, Supabase and common typo validation.
- Added `.nvmrc` and `.node-version` pinned to Node 24.19.0.
- Added `pnpm check` and `pnpm ci` as stable local/CI verification contracts.
- Added `.github/workflows/ci.yml` with Node 24.19.0, pnpm 11.22.0, frozen-lockfile install, structural verification, validation and all-app production builds.
- Added `docs/OPERATIONS.md` for the developer and deployment runbook.
