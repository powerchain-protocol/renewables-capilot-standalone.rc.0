# PowerChain routing, backend and access-control overlay

Drop-in overlay for the latest PowerChain Renewables Copilot monorepo.

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

The Copilot root no longer owns the public landing page. Dashboard context controls are removed from the header/right rail and consolidated into branded dropdown/select controls. Balances, Tokens, PWA and Integrations open from the dashboard resource launcher instead of spawning unrelated shells.

## Apply

From this overlay directory:

```bash
node scripts/apply-overlay.mjs /Users/miko/github/powerchain/renewables-capilot-standalone.rc.0
```

Then merge `pnpm-workspace.patch.yaml` into the repository `pnpm-workspace.yaml` and run:

```bash
corepack enable
corepack use pnpm@11.22.0
pnpm install --no-frozen-lockfile
pnpm prisma:generate
pnpm config:doctor
pnpm peers:check
pnpm typecheck
pnpm build:apps
pnpm dev:apps
```
