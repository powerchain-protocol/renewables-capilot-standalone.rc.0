# PowerChain Web

Public product, authentication and onboarding application for the PowerChain Renewables Copilot ecosystem.

## Runtime

- Local: `http://localhost:3000`
- Production: `https://web.powerchain.app`
- Framework: Next.js 16 / React 19 / TypeScript
- Role: default user entry point

## Responsibilities

- marketing, product preview, pricing, About, legal and onboarding surfaces;
- Better Auth sign-in/sign-up and demo access;
- shared PowerChain role/session handoff through `@powerchain/auth`;
- role-aware redirect to Copilot;
- Wallet Standard connection kept separate from account authentication;
- newsletter/events and review-first Solana Pay preparation;
- Prisma-backed relational persistence and Supabase integration where configured.

## Persistence defaults

Prisma is the relational ORM boundary. Supabase can provide hosted Postgres, storage and additional platform services.

Recommended environment variables:

```env
WEB_DATABASE_URL=
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code.

## Authentication boundary

The canonical session endpoint is:

```text
GET /api/v1/auth/session
```

`authz` is no longer a package or route namespace. Authorization capabilities live in `@powerchain/auth`.

## Development

```bash
pnpm --dir apps/web run dev
```

Web runs on port `3000`.

## TypeScript / Next.js baseline

The overlay guarantees `next@16.3.2`, `typescript@5.9.3`, `@types/node@24.3.0`, React type packages, `next-env.d.ts`, and a Next-aware `tsconfig.json`. Root TypeScript files such as `proxy.ts`, `next.config.ts` and `prisma.config.ts` are part of the project so editor diagnostics match CI/build behavior.

## Monorepo commands

Run lifecycle commands from the repository root. `pnpm setup`, `pnpm upgrade`, `pnpm fix`, and `pnpm doctor` repair and validate this app through the canonical root `package.json`; app discovery is path-based and does not depend on package-name filters.
