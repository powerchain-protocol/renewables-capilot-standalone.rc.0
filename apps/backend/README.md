# PowerChain Backend

Server-only API and control-plane application for the PowerChain Web and Renewables Copilot applications.

## Runtime

- Local: `http://localhost:3002`
- Production: `https://api.powerchain.app`
- Framework: Next.js 16 route handlers / TypeScript
- UI: none; the root page is operational metadata only

## Responsibilities

- health and configuration APIs;
- authenticated session normalization;
- protected Copilot/API forwarding;
- request IDs and provenance-header propagation;
- hosting/deployment metadata;
- server-only provider and persistence boundaries;
- Prisma relational persistence;
- Supabase administrative integration when explicitly configured.

## Authentication

Backend reads the canonical Web session endpoint:

```text
GET /api/v1/auth/session
```

Role and capability contracts come from `@powerchain/auth`.

## Prisma

A default Prisma schema is included under `prisma/schema.prisma`. The generated client is intentionally not committed.

```bash
pnpm --dir apps/backend run prisma:generate
pnpm --dir apps/backend run prisma:validate
```

`DATABASE_URL` is optional for client generation but required for real database operations.

## Supabase

Server-only administrative access is enabled only when both are configured:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

The service-role key must never be exposed through `NEXT_PUBLIC_*` variables.

## Development

```bash
pnpm --dir apps/backend run dev
```

Backend runs on port `3002`.

## TypeScript / Next.js baseline

Backend ships with a complete Next TypeScript project: `next-env.d.ts`, strict-compatible `tsconfig.json`, Node types, `moduleResolution: bundler`, root configuration inclusion, and generated Next type inclusion.

## Monorepo commands

Run lifecycle commands from the repository root. `pnpm setup`, `pnpm upgrade`, `pnpm fix`, and `pnpm doctor` repair and validate this app through the canonical root `package.json`; app discovery is path-based and does not depend on package-name filters.
