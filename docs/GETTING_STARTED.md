# Getting Started

## Requirements

- Node.js `24.19.x`
- Corepack enabled
- pnpm `11.22.0`
- PostgreSQL/Supabase only when database-backed features are required

## Install

```bash
corepack enable
corepack use pnpm@11.22.0
pnpm install
cp .env.example .env.local
pnpm telemetry:disable
pnpm prisma:generate
pnpm dev
```

`DATABASE_URL` is intentionally optional during `prisma generate`. It is required for migrations, Prisma Studio, database tests and runtime Prisma queries.

## Validation

```bash
pnpm typecheck
pnpm config:validate
pnpm prisma:validate
pnpm build
```

## Build-script approvals

The workspace uses pnpm's explicit build-script policy. Review new native/build dependencies before running:

```bash
pnpm approve-builds
```

Do not approve unknown scripts blindly.

## Environment groups

The example environment files separate configuration into:

- application/runtime
- AI providers
- Supabase/PostgreSQL
- Solana/Helius/Pyth
- PowerChain program IDs
- wallet integration
- upload/CORS policy

Provider secrets must never use `NEXT_PUBLIC_` names.
