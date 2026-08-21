# Dependency policy

- Package manager: Corepack + pnpm 11.22.0.
- Dependency build scripts are denied unless listed in `pnpm-workspace.yaml#allowBuilds`.
- `@google/genai` is explicitly approved because its package lifecycle requires build approval under the current pnpm policy.
- Solana wallets are discovered through Wallet Standard support in `@solana/wallet-adapter-react`; direct Phantom/Solflare SDK adapters and the legacy WalletConnect adapter are intentionally omitted from the default bundle.
- Node 24 native `DOMException` replaces the deprecated `node-domexception` transitive shim through a local pnpm override.
