# Solana runtime boundary

PowerChain uses explicit cluster configuration and separates browser-safe RPC URLs from server-only Helius credentials.

- `NEXT_PUBLIC_SOLANA_CLUSTER`: active wallet/client cluster.
- `NEXT_PUBLIC_SOLANA_*_RPC_URL`: browser-safe RPC endpoints.
- `SOLANA_*_RPC_URL`: server read fallbacks.
- `HELIUS_API_KEY`: server only.
- `HELIUS_*_RPC_URL`: Helius RPC base URLs without API keys.
- `HELIUS_API_BASE_URL`: Helius REST API base URL.

The canonical PWRC mint and Solana token-program addresses live under `src/constants/` and are exposed by `/api/programs` and `/api/v1/solana/config` without exposing credentials.
