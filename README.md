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


## Bootstrap / repair the target root

If commands such as `pnpm workspace:doctor`, `pnpm prisma:generate`, `pnpm config:doctor`, `pnpm peers:check`, `pnpm typecheck`, `pnpm build:apps`, or `pnpm dev:apps` report **Command not found**, the overlay has been extracted but its root package patch has not been installed into the target repository.

From the directory that contains `powerchain-routing-backend-overlay/`, run:

```bash
node powerchain-routing-backend-overlay/bootstrap.mjs \
  git clone github.com/powerchain-protocol/powerchain-capilot
```

The bootstrap now fails if `package.json` cannot be patched and verifies all required root lifecycle commands before returning success. Then run:

```bash
pnpm overlay:verify
pnpm install --no-frozen-lockfile
pnpm workspace:doctor
pnpm prisma:generate
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm build:apps
pnpm dev:apps
```

Do not run the lifecycle sequence before bootstrap reports `PASS`.

## Apply

```bash
node scripts/apply-overlay.mjs /Users/miko/github/powerchain/renewables-capilot-standalone.rc.0
```

The apply script now updates `pnpm-workspace.yaml` itself; there is no manual YAML merge step.

Then run:

```bash
cd /Users/miko/github/powerchain/renewables-capilot-standalone.rc.0

corepack enable
corepack use pnpm@11.22.0
pnpm install --no-frozen-lockfile

pnpm workspace:doctor
pnpm prisma:generate
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm build:apps
pnpm dev:apps
```

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
