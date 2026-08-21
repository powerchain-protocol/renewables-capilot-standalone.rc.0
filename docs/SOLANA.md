# Solana, SVM and Web3

## Runtime

The application uses `@solana/web3.js` with direct wallet adapters rather than the all-wallet aggregator.

Supported wallet UI currently includes:

- Phantom
- Solflare
- optional WalletConnect

Web3 Icons provides normalized token, network and wallet branding.

## RPC behavior

Read-only Solana RPC calls prefer Helius when configured. Allowlisted standard reads may fall back to the public Solana RPC endpoint.

Helius Enhanced APIs remain Helius-specific and fail clearly when no Helius key is configured.

## PWRC

PWRC uses the canonical public mint/configuration supplied by PowerChain. Application program IDs are environment-driven and remain empty until independently verified deployments exist.

The token factory and AI layer must not create an alternate PWRC mint path.

## Address validation

Public keys are base58-decoded with `bs58` and checked for the expected 32-byte length before use.

## Signing

Server routes and GRIDLLM may construct or simulate unsigned transactions. Private keys are never accepted by application APIs and signing remains inside the connected wallet.
