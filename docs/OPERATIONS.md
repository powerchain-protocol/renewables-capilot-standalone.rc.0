# PowerChain operations

## Local application topology

| App | Port | Responsibility |
| --- | ---: | --- |
| Web | 3000 | Public website, account/auth gateway and checkout review |
| Copilot | 3001 | Authenticated renewable-intelligence workspace |
| Backend | 3002 | Server-side API/control plane |

## Daily commands

```bash
pnpm doctor
pnpm env:doctor
pnpm dev:apps
```

`dev:apps` uses the repository's native Node workspace runner, so no separate process-manager package is required. The runner validates the workspace, generates Prisma clients when schemas exist, checks ports 3000–3002, starts all applications, forwards signals, and terminates sibling processes when one application fails.

## Pre-merge verification

```bash
pnpm check
pnpm build:apps
```

`pnpm ci` performs both. CI uses Node 24.19.0 and pnpm 11.22.0 with the frozen lockfile.

## Environment validation

```bash
pnpm env:doctor
pnpm env:doctor -- --strict
```

The non-strict mode reports missing optional persistence configuration as warnings. Strict mode promotes warnings to failures and is useful for deployment gates. Production mode also requires canonical application URLs, Better Auth secret material, and safe demo-session configuration.
