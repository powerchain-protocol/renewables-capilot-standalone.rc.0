import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { powerchainWebPrisma?: PrismaClient };

function createPrisma() {
  const url = process.env.WEB_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim();
  if (!url) return null;
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

export const db = globalForPrisma.powerchainWebPrisma ?? createPrisma();
if (process.env.NODE_ENV !== "production" && db) globalForPrisma.powerchainWebPrisma = db;
