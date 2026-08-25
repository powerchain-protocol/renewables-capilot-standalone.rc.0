# PowerChain Renewables Copilot

Authenticated AI operations workspace for renewable generation, storage, local/P2P energy markets, tokenized energy, carbon, PWRC and Solana infrastructure.

## Runtime

- Local: `http://localhost:3001`
- Production: `https://copilot.powerchain.app`
- Framework: Next.js 16 / React 19 / TypeScript
- AI runtime: GRIDLLM

## Responsibilities

- persistent AI chats, reports and provenance;
- Live / Demo / TBA operational data separation;
- renewable generation, storage and market analysis;
- tokenized energy, carbon and PWRC context;
- evidence-aware recommendations and human review;
- policy → evidence → simulation → wallet-review execution boundary;
- role/capability enforcement through `@powerchain/auth`;
- Prisma persistence and Supabase tenant/auth integration where configured.

Copilot can analyze and prepare. It does not hold private keys and does not sign or silently submit transactions.

## Persistence defaults

```env
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Run Prisma generation before dependency-aware typechecking/builds:

```bash
pnpm prisma:generate
```

## Development

```bash
pnpm --dir apps/copilot run dev
```

Copilot runs on port `3001`.

## TypeScript / Next.js baseline

The overlay guarantees `next@16.3.2`, TypeScript, Node/React types, `next-env.d.ts`, and a Next-aware `tsconfig.json`. Existing Copilot aliases and project options are preserved while required Next settings are normalized.

## Monorepo commands

Run lifecycle commands from the repository root. `pnpm setup`, `pnpm upgrade`, `pnpm fix`, and `pnpm doctor` repair and validate this app through the canonical root `package.json`; app discovery is path-based and does not depend on package-name filters.
