# Solana, Helius, and PowerChain Configuration

## Network selection

`NEXT_PUBLIC_SOLANA_CLUSTER` selects the browser wallet/RPC context:

- `devnet`
- `testnet`
- `mainnet-beta`

The browser-safe defaults are:

```text
Devnet       https://api.devnet.solana.com
Testnet      https://api.testnet.solana.com
Mainnet-beta https://api.mainnet-beta.solana.com
```

Public Solana endpoints are rate-limited. Use a dedicated/private provider for production workloads.

## Helius

Helius is server-only in this application. Never expose `HELIUS_API_KEY` through a `NEXT_PUBLIC_*` variable.

```text
HELIUS_DEVNET_RPC_URL  https://devnet.helius-rpc.com
HELIUS_MAINNET_RPC_URL https://mainnet.helius-rpc.com
HELIUS_API_BASE_URL    https://api.helius.xyz
```

RPC reads prefer Helius when a key is present and fall back to the configured Solana public RPC. Helius Enhanced Transactions fail explicitly when Helius is not configured rather than fabricating a fallback response.

## Canonical token programs

```text
SPL Token
TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

Token-2022
TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

Associated Token Program
ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL
```

PowerChain PWRC remains configured as Token-2022.

## Optional Supabase configuration

Supabase is optional for local boot. Leave `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` blank when unused. Do not use placeholder strings such as `your-project-url`.

The runtime treats malformed optional URLs as unconfigured so an optional integration cannot crash the entire UI. `pnpm config:validate` still reports malformed values explicitly.
