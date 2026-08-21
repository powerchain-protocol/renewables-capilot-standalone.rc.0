# Prisma

## Generated client

Prisma ORM 7 uses the `prisma-client` generator with an explicit output path:

```text
src/generated/prisma/
```

This directory is generated code and must remain absent from source control. A non-Prisma file in the output directory causes Prisma generation to fail with an "exists and is not empty but doesn't look like generated" error.

Renewables Copilot therefore uses:

```bash
pnpm prisma:clean
pnpm prisma:generate
```

`prisma:clean` removes **only** `src/generated/prisma/` after verifying that it is below `src/generated/`, then `prisma generate` recreates the client.

`postinstall` calls `pnpm prisma:generate`, making repeated installs and upgrades idempotent.

## DATABASE_URL

`prisma generate` does not need a live database. `prisma.config.ts` therefore allows an empty datasource URL during generation. Commands that actually access PostgreSQL still require a valid `DATABASE_URL`, including migrations, status checks, Studio and runtime Prisma queries.
