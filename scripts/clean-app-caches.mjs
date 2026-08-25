import { existsSync, rmSync } from "node:fs";
import { resolve, relative, sep } from "node:path";

const root = process.cwd();
for (const app of ["apps/web", "apps/copilot", "apps/backend"]) {
  const appRoot = resolve(root, app);
  const target = resolve(appRoot, ".next");
  if (!target.startsWith(appRoot + sep)) throw new Error(`Unsafe cache path: ${target}`);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    console.log(`removed ${relative(root, target)}`);
  } else {
    console.log(`clean ${relative(root, target)} (already absent)`);
  }
}
