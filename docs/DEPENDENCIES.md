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

The previous optional `@solana/wallet-adapter-walletconnect` dependency was removed from the default app because it pulled duplicated WalletConnect 2.19.x clients plus deprecated `lodash.isequal` and legacy `uuid` packages. Phantom and Solflare remain direct adapters.

`@google/genai` may reach `node-domexception@1.0.0` through Google auth/fetch dependencies. PowerChain requires Node 24, which already implements `DOMException`, so pnpm overrides that obsolete shim with `vendor/node-domexception` rather than loading deprecated code.

Do not force arbitrary WalletConnect transitive versions with broad overrides. Reintroduce WalletConnect only behind an integration test using a current supported Solana/Wallet Standard path.
