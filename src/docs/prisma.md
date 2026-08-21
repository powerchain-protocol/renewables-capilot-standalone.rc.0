# Prisma client lifecycle

- Schema: `prisma/schema.prisma`
- Generated output: `src/generated/prisma/`
- The generated folder is ephemeral and ignored by Git.
- `pnpm prisma:generate` deletes only that generated output and regenerates it.
- `prisma generate` does not require `DATABASE_URL`; database commands do.
