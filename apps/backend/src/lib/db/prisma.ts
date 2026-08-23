import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { powerchainBackendPrisma?: PrismaClient };

function createPrisma() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

export const prisma = globalForPrisma.powerchainBackendPrisma ?? createPrisma();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.powerchainBackendPrisma = prisma;
}

export const isPrismaConfigured = Boolean(process.env.DATABASE_URL?.trim());
