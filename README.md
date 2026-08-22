# PowerChain routing, backend and access-control overlay

Drop-in overlay for the PowerChain Renewables Copilot monorepo.

## Applications

| Application | Local | Production | Description |
| --- | --- | --- | --- |
| **PowerChain Web** | `http://localhost:3000` | `https://web.powerchain.app` | Public product and account gateway for PowerChain. Provides the marketing site, product preview, SaaS pricing, Better Auth sign-in/sign-up, demo access, role-aware routing, Wallet Standard connection, newsletter/events and review-first Solana Pay checkout. It is the default entry point for users. |
| **PowerChain Renewables Copilot** | `http://localhost:3001` | `https://copilot.powerchain.app` | Authenticated AI operations workspace for renewable generation, storage, local/P2P energy markets, tokenized energy, carbon, PWRC and Solana infrastructure. GRIDLLM provides persistent conversations and reports, source-aware Live/Demo/TBA analysis, evidence/provenance, agents/skills and policy/evidence/simulation review. Copilot prepares and recommends; the connected wallet remains the signing authority. |
| **PowerChain Backend** | `http://localhost:3002` | `https://api.powerchain.app` | Server-only API/control-plane boundary shared by Web and Copilot. Owns health/config/session routing, protected API orchestration, Copilot forwarding, provider/integration boundaries, request IDs, CORS and deployment-safe server concerns. It has no end-user UI and never becomes a signing authority. |
| **PowerChain Skills** | — | — | Operator-facing domain references and reusable assistant knowledge for renewables, PowerChain, Solana and assistant operating rules. Runtime skill/agent contracts stay typed in the shared packages/programs rather than being bundled into the marketing application. |

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

The three deployable applications are intentionally separate. Web owns public acquisition and authentication, Copilot owns the operator workspace, and Backend owns server-side orchestration. This keeps public UI, AI workspace code, secrets and infrastructure concerns out of one oversized application bundle.

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

## Reliability changes in this revision

- root commands no longer depend on workspace package names or `pnpm --filter`;
- legacy names such as `@powerchain/renewables-copilot` are preserved;
- `prisma:generate`, `config:doctor`, `build:apps`, `dev:apps` and app-specific commands execute by directory;
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

To also install dependencies and run the first workspace verification:

```bash
node setup.mjs --install
```

If `powerchain-capilot/` is already cloned, the same command patches and verifies that existing canonical checkout without recloning it.

## Clone and bootstrap

Start from the canonical GitHub repository rather than a machine-specific local path:

```bash
git clone https://github.com/powerchain-protocol/powerchain-capilot.git
cd powerchain-capilot
```

A clone alone does **not** install the overlay root scripts. Before running any `pnpm workspace:*`, Prisma, build or multi-app commands, apply the overlay once.

If `powerchain-routing-backend-overlay/` is extracted next to the cloned repository, bootstrap the current repository root with:

```bash
node ../powerchain-routing-backend-overlay/bootstrap.mjs .
```

If the overlay directory is inside the cloned repository instead, use:

```bash
node powerchain-routing-backend-overlay/bootstrap.mjs .
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
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm build:apps
pnpm dev:apps
```

## Apply without bootstrap

If you intentionally want to apply only the overlay patch, run from the cloned repository root:

```bash
node ../powerchain-routing-backend-overlay/scripts/apply-overlay.mjs .
```

The apply script updates `pnpm-workspace.yaml` itself; there is no manual YAML merge step. Bootstrap is still preferred because it verifies the root lifecycle scripts after applying the patch.

If a Turbopack development session starts returning 404 for routes that previously existed:

```bash
pnpm dev:reset
```

## Workspace command model

All root orchestration is path-based:

```text
apps/web      → :3000
apps/copilot  → :3001
apps/backend  → :3002
```

The package `name` field is not used to locate these applications.

## Next 16.3.2 + minimumReleaseAge

The workspace keeps `minimumReleaseAge` enabled. Because Next 16.3.2 was intentionally selected before the global age window elapsed, the overlay adds exact exceptions only for `next@16.3.2`, `@next/env@16.3.2`, and the platform-specific `@next/swc-* @16.3.2` artifacts. This removes pnpm's interactive age-policy prompt without disabling the supply-chain policy for unrelated packages.

If pnpm is already waiting at the `versions do not meet the minimumReleaseAge constraint` prompt, cancel that run with `Ctrl+C`, reapply this overlay, then run `pnpm install --no-frozen-lockfile` once.

`pnpm run dev` no longer performs an install. It runs a workspace preflight, verifies ports 3000/3001/3002 are free, then starts Web, Copilot, and Backend.

Useful diagnostics:

```bash
pnpm workspace:doctor
pnpm ports:check
pnpm peers:check
```
