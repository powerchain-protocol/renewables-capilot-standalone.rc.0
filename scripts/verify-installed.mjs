import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const pkgFile = resolve(root, "package.json");
if (!existsSync(pkgFile)) {
  console.error("Not at a package root.");
  process.exit(1);
}
const pkg = JSON.parse(readFileSync(pkgFile, "utf8"));
const names = ["workspace:doctor","prisma:generate","config:doctor","peers:check","typecheck","build:apps","dev:apps"];
console.log(`Root: ${root}`);
console.log(`Package: ${pkg.name ?? "unnamed"}`);
for (const name of names) console.log(`${name.padEnd(18)} ${pkg.scripts?.[name] ? "installed ✓" : "MISSING ✗"}`);
const missing = names.filter((name) => !pkg.scripts?.[name]);
if (missing.length) {
  console.error("\nOverlay is not installed into this root. Run bootstrap.mjs from the overlay directory.");
  process.exit(1);
}
console.log("\nOverlay root lifecycle scripts: PASS");
