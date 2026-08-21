import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * `prisma generate` does not require a database connection. Using Prisma's
 * `env("DATABASE_URL")` helper here makes every CLI command fail when the URL
 * is intentionally absent (for example during install/type generation).
 * Database commands still fail normally if DATABASE_URL is empty.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
