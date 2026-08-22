# Fixes included

## Copilot dev exit / 404 routing

Web now owns port 3000. Copilot owns port 3001. Backend owns 3002. Copilot proxy excludes health, manifest and `_next` assets and redirects `/` to `/dashboard` only after authentication.

## config:doctor top-level await

The replacement script uses `async function main()` and no top-level await, preventing the CJS transform error seen under `tsx`/esbuild.

## Web3 Icons TypeScript error

`NetworkIcon network="..."` is removed. Static `NetworkSolana`, `NetworkSui`, and `TokenUSDC` exports are used for type safety and tree shaking.

## `utf-8-validate` peer mismatch

The workspace patch pins `utf-8-validate` to `5.0.10`, which satisfies the `ws@7` `^5.0.2` peer and `ws@8` `>=5.0.2` requirement.

## Chat 503

A 503 from `/api/v1/chat` is not a routing health failure when `/api/health` and `/api/v1/config` remain 200. It indicates AI/provider/persistence readiness. The new backend health/session split prevents app-routing failures from being conflated with AI-provider readiness; the UI should continue disabling generation when no provider is configured.
