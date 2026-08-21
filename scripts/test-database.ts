import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    const result = await prisma.$queryRaw<Array<{ now: Date }>>`select now()`;
    console.log("Prisma database connection OK", result[0]?.now ?? "connected");
  } catch (error) {
    console.error("Prisma database connection failed", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

void main();
