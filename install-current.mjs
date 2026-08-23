import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const overlayRoot = dirname(fileURLToPath(import.meta.url));
const target = resolve(process.argv[2] || process.cwd());
const result = spawnSync(process.execPath, [resolve(overlayRoot, "bootstrap.mjs"), target], {
  cwd: overlayRoot,
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
