# PowerChain routing, backend and access-control overlay

Drop-in overlay for the PowerChain Renewables Copilot monorepo.

## Install into an existing clone

Do **not** run `node ../powerchain-routing-backend-overlay/...` unless that sibling directory actually exists. The most reliable installation is to extract the overlay ZIP **inside the repository root**, then run the installer from that local directory:

```bash
git clone https://github.com/powerchain-protocol/powerchain-capilot.git
cd powerchain-capilot

# Copy/download powerchain-routing-backend-overlay.zip into this directory, then:
unzip -oq powerchain-routing-backend-overlay.zip -d .
node powerchain-routing-backend-overlay/install-current.mjs .

corepack enable
corepack use pnpm@11.22.0
pnpm install --no-frozen-lockfile
pnpm overlay:verify
pnpm workspace:doctor
pnpm prisma:generate
pnpm prisma:validate
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm build:apps
pnpm dev:apps
```

The installer patches the current root `package.json`; `pnpm install` by itself does not create the PowerChain lifecycle scripts.

## Applications

| Application | Local | Production | Description |
| --- | --- | --- | --- |
| **PowerChain Web** | `http://localhost:3000` | `https://web.powerchain.app` | Public product and account gateway for PowerChain. Provides the marketing site, product preview, SaaS pricing, Better Auth sign-in/sign-up, demo access, role-aware routing, Wallet Standard connection, newsletter/events and review-first Solana Pay checkout. It is the default entry point for users. |
| **PowerChain Renewables Copilot** | `http://localhost:3001` | `https://copilot.powerchain.app` | Authenticated AI operations workspace for renewable generation, storage, local/P2P energy markets, tokenized energy, carbon, PWRC and Solana infrastructure. GRIDLLM provides persistent conversations and reports, source-aware Live/Demo/TBA analysis, evidence/provenance, agents/skills and policy/evidence/simulation review. Copilot prepares and recommends; the connected wallet remains the signing authority. |
| **PowerChain Backend** | `http://localhost:3002` | `https://api.powerchain.app` | Server-only API/control-plane boundary shared by Web and Copilot. Owns health/config/session routing, protected API orchestration, Copilot forwarding, provider/integration boundaries, request IDs, CORS and deployment-safe server concerns. It has no end-user UI and never becomes a signing authority. |
| **PowerChain Skills** | — | — | Operator-facing domain references and reusable assistant knowledge for renewables, PowerChain, Solana and assistant operating rules. Runtime skill/agent contracts stay typed in the shared packages/programs rather than being bundled into the marketing application. |
| **PowerChain Auth** | — | — | Shared `@powerchain/auth` roles and capability contracts for Web, Copilot and Backend. Session persistence stays app-owned; this package has no credentials or wallet authority. |

### Product flow

```text
PowerChain Web
    ↓
Sign in / Demo access
    ↓
Role & session resolution
    ↓
Renewables Copilot
    ↓
Observe → Analyze → Evidence → Human review
    ↓
Wallet review / signature when an executable intent is available
    ↓
Backend / provider / Solana settlement services
```

The three deployable applications are intentionally separate. Web owns public acquisition and authentication, Copilot owns the operator workspace, and Backend owns server-side orchestration. This keeps public UI, AI workspace code, secrets and infrastructure concerns out of one oversized application bundle. Prisma is the default relational ORM and Supabase is the default managed Postgres/platform integration where configured.


## Recommended installation: self-contained bootstrap

The safest installation path does **not** require an extracted sibling overlay directory. Download `powerchain-bootstrap.mjs` into the cloned repository root and run:

```bash
git clone https://github.com/powerchain-protocol/powerchain-capilot.git
cd powerchain-capilot

node powerchain-bootstrap.mjs .

corepack enable
corepack use pnpm@11.22.0
pnpm install --no-frozen-lockfile

pnpm overlay:verify
pnpm workspace:doctor
pnpm prisma:generate
pnpm prisma:validate
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm build:apps
pnpm dev:apps
```

Do not run the overlay-defined pnpm commands before the bootstrap prints `[powerchain-bootstrap] PASS`; those commands are installed into the root `package.json` by the bootstrap itself.

## Repository-native monorepo lifecycle

After the bootstrap has been applied once, the repository no longer depends on an external overlay directory for normal maintenance. The root `package.json` owns the three deployable apps by path and exposes:

```bash
pnpm setup      # repair manifests/workspace, install deps, validate Prisma/types
pnpm upgrade    # same as setup plus production builds
pnpm fix        # idempotent manifest/workspace repair without installing
pnpm doctor     # fast structural monorepo diagnostics
```

Application routing is direct from the root manifest:

```text
apps/web      -> :3000
apps/copilot  -> :3001
apps/backend  -> :3002
```

The installer preserves existing application code and mature Prisma schemas while repairing package manifests, required Next/Node typings, workspace policy, shared `@powerchain/auth`, and generated/local ignore rules.

## Canonical local ports

- Web: `http://localhost:3000`
- Copilot: `http://localhost:3001`
- Backend: `http://localhost:3002`

## Production hosts

- Web: `https://web.powerchain.app`
- Copilot: `https://copilot.powerchain.app`
- Backend: `https://api.powerchain.app`

## User journey

`Web → Sign in / Demo access → role resolution → Copilot /dashboard`

Production Better Auth sessions use a shared `.powerchain.app` cookie domain so Web authentication is available to the Copilot subdomain. Demo sessions follow the same production domain boundary. Account authentication and wallet signing remain separate.

## Persistence defaults

- **Prisma 7.9.1** is the default relational ORM across Web, Copilot and Backend.
- **Supabase** is supported by default for hosted Postgres, storage and server integrations.
- Existing Web/Copilot Prisma schemas are preserved by the installer; safe defaults are written only when missing.
- Backend ships with a minimal Prisma schema plus a matching Supabase migration for `backend_audit_events`.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and is never exposed through `NEXT_PUBLIC_*`.
- `pnpm prisma:generate`, `pnpm prisma:validate`, `pnpm typecheck`, `pnpm build:apps` and `pnpm dev:apps` use Prisma preflight logic to prevent missing generated-client failures.

The canonical authentication package is `@powerchain/auth`. The old `@powerchain/authz`, `packages/authz/` and `/api/v1/authz/*` namespace are removed during overlay upgrade.

See [`docs/DATABASE.md`](docs/DATABASE.md) for Prisma/Supabase boundaries and environment variables.

## Reliability changes in this revision

- root commands no longer depend on workspace package names or `pnpm --filter`;
- legacy names such as `@powerchain/renewables-copilot` are preserved;
- root lifecycle scripts execute Web, Copilot and Backend directly with `pnpm --dir apps/<app> ...`;
- `prisma:generate`, `prisma:validate`, `typecheck`, `build:apps` and `dev:apps` compose those app-local package scripts;
- `peers:check` is a real root script that validates the workspace peer policy and lockfile compatibility without depending on a nonexistent pnpm subcommand;
- workspace package globs and the `utf-8-validate@5.0.10` compatibility override are merged automatically;
- Backend uses a standard Next.js TypeScript configuration with generated Next types included;
- `pnpm clean:next` safely removes only `apps/*/.next` caches;
- `pnpm dev:reset` recovers the three-app dev environment after route/HMR cache corruption;
- Vercel build commands no longer rely on package-name filters;
- Next.js is patched to `16.3.2` for Web, Copilot and Backend.



## One-command canonical setup

**Do not run `pnpm workspace:doctor` or the other overlay lifecycle scripts before the overlay has been installed into the repository root.** A fresh Git clone does not contain those commands yet.

From the extracted overlay directory, run:

```bash
node setup.mjs
```

This clones `https://github.com/powerchain-protocol/powerchain-capilot.git` into a sibling `powerchain-capilot/` directory when needed, applies the overlay, and verifies the root scripts before returning success.

To also install dependencies and run Prisma generation/validation, config checks, peer checks and TypeScript validation:

```bash
node setup.mjs --install
```

To include production builds of all three applications:

```bash
node setup.mjs --install --build
```

If `powerchain-capilot/` is already cloned, the same command patches and verifies that existing canonical checkout without recloning it.

## Clone and bootstrap

Start from the canonical GitHub repository rather than a machine-specific local path:

```bash
git clone https://github.com/powerchain-protocol/powerchain-capilot.git
cd powerchain-capilot
```

A clone alone does **not** install the overlay root scripts. Before running any `pnpm workspace:*`, Prisma, build or multi-app commands, apply the overlay once.

Extract `powerchain-routing-backend-overlay/` **inside the cloned repository**, then bootstrap the current repository root with:

```bash
node powerchain-routing-backend-overlay/install-current.mjs .
```

The bootstrap fails if `package.json` cannot be patched and verifies all required root lifecycle commands before returning success. Do not run the lifecycle sequence before bootstrap reports `PASS`.

Then run from `powerchain-capilot/`:

```bash
corepack enable
corepack use pnpm@11.22.0
pnpm install --no-frozen-lockfile

pnpm overlay:verify
pnpm workspace:doctor
pnpm prisma:generate
pnpm prisma:validate
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm build:apps
pnpm dev:apps
```

## Apply without bootstrap

If you intentionally want to apply only the overlay patch, run from the cloned repository root:

```bash
node powerchain-routing-backend-overlay/scripts/apply-overlay.mjs .
```

The apply script updates `pnpm-workspace.yaml` itself; there is no manual YAML merge step. Bootstrap is still preferred because it verifies the root lifecycle scripts after applying the patch.

If a Turbopack development session starts returning 404 for routes that previously existed:

```bash
pnpm dev:reset
```

## Workspace command model

The root `package.json` is the canonical orchestration layer. Normal lifecycle commands call each application by directory rather than by workspace package name:

```text
pnpm dev:web       → pnpm --dir apps/web run dev       → :3000
pnpm dev:copilot   → pnpm --dir apps/copilot run dev   → :3001
pnpm dev:backend   → pnpm --dir apps/backend run dev   → :3002

pnpm build:web     → pnpm --dir apps/web run build
pnpm build:copilot → pnpm --dir apps/copilot run build
pnpm build:backend → pnpm --dir apps/backend run build
```

`pnpm dev:apps` launches the three app scripts concurrently. `pnpm build:apps`, `pnpm typecheck` and the Prisma root commands compose the corresponding app-local scripts. Package names are therefore metadata, not orchestration identifiers. The `scripts/powerchain-workspace.mjs` helper remains only for diagnostics such as `workspace:doctor`, peer-policy validation and port checks.

A complete reference root manifest is shipped at [`templates/root/package.json`](templates/root/package.json).

## Next 16.3.2 + minimumReleaseAge

The workspace keeps `minimumReleaseAge` enabled. Because Next 16.3.2 was intentionally selected before the global age window elapsed, the overlay adds exact exceptions only for `next@16.3.2`, `@next/env@16.3.2`, and the platform-specific `@next/swc-* @16.3.2` artifacts. This removes pnpm's interactive age-policy prompt without disabling the supply-chain policy for unrelated packages.

If pnpm is already waiting at the `versions do not meet the minimumReleaseAge constraint` prompt, cancel that run with `Ctrl+C`, reapply this overlay, then run `pnpm install --no-frozen-lockfile` once.

`pnpm run dev` no longer performs an install. It runs a workspace preflight, verifies ports 3000/3001/3002 are free, then starts Web, Copilot, and Backend.

Useful diagnostics:

```bash
pnpm workspace:doctor
pnpm ports:check
pnpm peers:check
pnpm validate
pnpm verify:build
```

## Next.js / TypeScript repair defaults

The installer now guarantees these build prerequisites for Web, Copilot and Backend:

- `next@16.3.2`;
- `typescript@5.9.3`;
- `@types/node@24.3.0`;
- React/ReactDOM type packages;
- committed `next-env.d.ts`;
- Next-aware `tsconfig.json` with `moduleResolution: "bundler"`, the Next TypeScript plugin, `@/*` path mapping and root `*.ts` inclusion for `proxy.ts` / `next.config.ts`;
- idempotent root/app `.gitignore` rules for `.next`, generated Prisma clients, local env files, OpenNext/Vercel/Cloudflare output and TypeScript build info.

This addresses editor/build errors such as `Cannot find module 'next/server'`, `Cannot find module 'next'`, and `Cannot find name 'process'` once `pnpm install` has completed after applying the overlay.

## Reliability and CI improvements

- Multi-app development and production start use the native `scripts/powerchain-workspace.mjs` process supervisor; the root no longer depends on `concurrently`.
- `.nvmrc` and `.node-version` pin Node `24.19.0` alongside `package.json#engines`.
- `pnpm env:doctor` validates application URLs, local ports, PowerChain/Solana network pairing, auth/demo safety, database configuration and common environment typos.
- `pnpm check` runs structure + environment + workspace validation.
- `pnpm ci` adds production builds on top of `pnpm check`.
- `.github/workflows/ci.yml` uses the frozen lockfile with Node 24.19.0 and pnpm 11.22.0.
- `pnpm start:apps` runs the three built Next.js applications with coordinated signal/failure handling.

See `docs/OPERATIONS.md` for the local and CI runbook.
