# Dependency and pnpm policy

## Package manager

```bash
corepack enable
corepack use pnpm@11.22.0
pnpm install
```

`package.json#packageManager` and `pnpm-workspace.yaml` are the canonical package-management configuration.

## Build approvals

`strictDepBuilds` is enabled. Only reviewed packages in `allowBuilds` may run lifecycle build scripts. `@google/genai` is explicitly approved alongside Prisma, Sharp, esbuild and the other existing native/code-generation dependencies.

With the policy committed, a normal install should not require repeatedly approving the same reviewed package interactively.

## Deprecated transitive dependencies

The previous optional `@solana/wallet-adapter-walletconnect` dependency was removed from the default app because it pulled duplicated WalletConnect 2.19.x clients plus deprecated `lodash.isequal` and legacy `uuid` packages. The app now uses Wallet Standard discovery through `@solana/wallet-adapter-react`; Phantom and Solflare are discovered at runtime when installed, so no per-wallet SDK adapter is bundled by default.

`@google/genai` may reach `node-domexception@1.0.0` through Google auth/fetch dependencies. PowerChain requires Node 24, which already implements `DOMException`, so pnpm overrides that obsolete shim with `vendor/node-domexception` rather than loading deprecated code.

Do not force arbitrary WalletConnect transitive versions with broad overrides. Reintroduce WalletConnect only behind an integration test using a current supported Solana/Wallet Standard path.


## Next.js generated TypeScript types

`tsconfig.json` explicitly includes both `.next/types/**/*.ts` and `.next/dev/types/**/*.ts`. This prevents Next.js 16 from rewriting the file on each new development checkout and keeps route/type generation consistent between `next dev` and `next build`.

The previous `experimental.optimizePackageImports` entry for Radix icons was removed. The project does not need an experimental Next.js flag for its current Radix usage, and avoiding it removes the development warning while keeping ordinary ESM tree-shaking in place.

## Registry latency warnings

A message such as `Request took 10526ms: https://registry.npmjs.org/@prisma%2Fadapter-pg` is a pnpm registry-latency warning, not a Prisma runtime failure. `@prisma/adapter-pg` remains required by the Prisma 7 PostgreSQL driver-adapter setup. Once the package is present in the pnpm content-addressable store, subsequent frozen installs should normally reuse it.

## Current compatibility fixes

- Web3 network/token icons use static exports from `@web3icons/react`; this avoids the `NetworkIcon` dynamic-prop type mismatch observed with 4.1.21 and improves tree-shaking.
- `utf-8-validate` is resolved to `5.0.10` to satisfy both legacy `ws@7` optional peer requirements and current `ws@8` ranges.
- `uuid` remains narrowly upgraded only under the `jayson` path.
- `image-size` remains replaced by `image-size-next` because the upstream parser advisories do not have a patched upstream release in the dependency branch used by Metro.
