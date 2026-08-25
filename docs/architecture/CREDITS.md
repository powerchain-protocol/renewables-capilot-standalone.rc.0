# Copilot Credit Architecture — v1.0.0

The canonical implementation and economics are documented in [`../COPILOT-PWRC-CREDITS.md`](../COPILOT-PWRC-CREDITS.md).

## Boundary

```text
Verified PWRC funding
        ↓
Credit Account
        ↓
Quote
        ↓
Reservation
        ↓
Copilot execution
        ↓
Settlement / Release
        ↓
Append-only ledger
        ↓
Tokenized message receipt
        ↓
Optional batched Solana anchor
```

The wallet funds the account; it does not authorize every message. The Backend never credits a client-reported transfer without verifying the chain effect and credits the verified net amount received.

## Launch unit

```text
1 MCU = 10,000 PWRC
1 PWRC reference = $0.000002
1 MCU reference = $0.02
```

The product version remains `1.0.0`.
