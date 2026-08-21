import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "src/generated/prisma");
const generatedRoot = resolve(root, "src/generated");

if (!output.startsWith(`${generatedRoot}/`)) {
  throw new Error(`Refusing to remove unexpected Prisma output path: ${output}`);
}

await rm(output, { recursive: true, force: true });
console.log("Prepared Prisma client output: src/generated/prisma");
