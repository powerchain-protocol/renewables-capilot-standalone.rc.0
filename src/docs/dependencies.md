# Dependency policy

- Package manager: Corepack + pnpm 11.22.0.
- Dependency build scripts are denied unless listed in `pnpm-workspace.yaml#allowBuilds`.
- `@google/genai` is explicitly approved because its package lifecycle requires build approval under the current pnpm policy.
- Phantom and Solflare are direct wallet dependencies; the legacy Solana WalletConnect adapter is intentionally omitted from the default bundle.
- Node 24 native `DOMException` replaces the deprecated `node-domexception` transitive shim through a local pnpm override.
