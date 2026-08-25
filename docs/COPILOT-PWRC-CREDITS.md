# PowerChain Copilot PWRC Credits — v1.0.0

PowerChain Copilot uses **PWRC-funded service credits** while keeping chat execution off-chain. The credit ledger is the billing source of truth; Solana is used to verify PWRC funding and, optionally, to anchor privacy-preserving usage receipts.

## Canonical launch calculation

Initial PWRC reference price:

```text
1 PWRC = $0.000002
```

Base Message Credit Unit (MCU):

```text
1 MCU = 10,000 PWRC
10,000 × $0.000002 = $0.020000
```

Therefore the canonical launch baseline is:

> **1 base Copilot message = 10,000 PWRC = $0.02 reference value.**

This is a **minimum service unit**, not a claim that every AI workload costs the same amount to serve.

## Recommended v1.0.0 pricing classes

| Workload | MCU | PWRC | Reference USD |
|---|---:|---:|---:|
| Standard chat | 1 | 10,000 | $0.02 |
| Tool-assisted chat | 2 | 20,000 | $0.04 |
| Deep analysis | 5 | 50,000 | $0.10 |
| Agent run | 10 | 100,000 | $0.20 |
| Report generation | 25 | 250,000 | $0.50 |

These are launch policy defaults and should remain server-configurable.

## Conversion examples at the initial token price

| Messages | PWRC | Reference USD |
|---:|---:|---:|
| 1 | 10,000 | $0.02 |
| 50 | 500,000 | $1.00 |
| 100 | 1,000,000 | $2.00 |
| 500 | 5,000,000 | $10.00 |
| 1,000 | 10,000,000 | $20.00 |
| 10,000 | 100,000,000 | $200.00 |

## Why not transfer PWRC for every message?

A direct wallet transaction per chat turn would add wallet prompts, confirmation latency, chain/network dependence, potential token transfer fees, and unnecessary public metadata.

Instead:

```text
PWRC WALLET
   ↓
FUNDING INTENT
   ↓
WALLET REVIEW + SIGNATURE
   ↓
CHAIN VERIFICATION
   ↓
PWRC CREDIT ACCOUNT
   ↓
RESERVE
   ↓
RUN COPILOT
   ↓
SETTLE / RELEASE
   ↓
IMMUTABLE CREDIT LEDGER
```

The Backend credits the **verified net PWRC received**, not merely the amount the client says it sent.

## Reservation model

Before a paid operation, Copilot reserves the quoted PWRC amount. The execution must stay within the approved reservation.

```text
AVAILABLE
   ↓
RESERVED
   ↓
EXECUTION
   ├── success → SETTLED
   └── cancelled/error → RELEASED
```

An expensive provider/model must not silently create an after-the-fact charge above the quote. The model router should choose a provider that fits the approved budget or request approval for a higher credit class before execution.

## Price policy

Two modes are supported.

### FIXED_PWRC — recommended launch mode

The unit stays fixed at 10,000 PWRC. Its USD value moves with PWRC.

### USD_INDEXED — optional future mode

The service keeps a stable USD target and converts it to PWRC using an approved price snapshot/TWAP:

```text
PWRC charge = ceil(target USD / verified PWRC USD price)
```

For example, for a $0.02 target:

- at $0.000001/PWRC → 20,000 PWRC
- at $0.000002/PWRC → 10,000 PWRC
- at $0.000004/PWRC → 5,000 PWRC

A price snapshot must include source, observed time, freshness, and pricing epoch. AI output is never accepted as a price source.

## Provider-cost protection

Provider cost is measured from actual input/output/tool usage. The router can compute the minimum number of MCU units required to support a configured gross-margin target:

```text
required revenue = provider cost / (1 - target margin)
required MCU     = ceil(required revenue / $0.02)
```

This calculation is used **before execution** to route or quote. It is not permission to increase a settled charge after the user has approved a lower amount.

## Tokenized messages

PowerChain should not mint an NFT or publish raw chat content for every message. A tokenized message is instead a **usage receipt** associated with the authenticated assistant message.

A receipt may contain:

- message ID;
- conversation ID;
- request ID;
- prompt hash;
- response hash;
- settled PWRC amount;
- pricing snapshot;
- model/provider metadata;
- evidence count;
- creation time;
- optional batched Solana anchor signature.

Raw prompts, responses, evidence, private user IDs, and document contents stay off-chain.

```text
MESSAGE
  ↓
SHA-256 PROMPT / RESPONSE HASHES
  ↓
PWRC SETTLEMENT
  ↓
TOKENIZED MESSAGE RECEIPT
  ↓
OPTIONAL BATCH / MERKLE ANCHOR
```

This gives verifiable usage provenance without turning private conversations into public blockchain data.

## Accounting invariants

1. The credit ledger is append-only.
2. Account balance is derived/cached from ledger effects.
3. Reservation and settlement are idempotent.
4. Failed/cancelled requests release reservations.
5. A message receipt cannot settle more PWRC than the approved reservation.
6. PWRC funding is credited only after chain verification.
7. Reversals use compensating ledger entries; settled history is not rewritten.
8. Organization/user isolation applies to balances, receipts, reservations, and ledger entries.
9. Pricing snapshots are immutable after a reservation is accepted.
10. Copilot never receives private-key authority.

## Token-2022 transfer-fee-aware funding

PWRC message pricing is based on the **net PWRC credited to the Copilot account**. If the active PWRC mint uses Token-2022 transfer fees, the funding flow must read the active epoch fee basis points and maximum fee from the mint and calculate the transfer before asking the wallet to sign.

Token-2022 fee shape:

```text
fee = min(ceil(pre_fee_amount × basis_points / 10,000), maximum_fee)
net = pre_fee_amount - fee
```

The implementation includes helpers for both fee calculation and the inverse question: *what is the minimum gross transfer that produces the desired net credit?*

Example only: if a transfer were subject to an uncapped 2% fee, obtaining a net 10,000 PWRC MCU would require approximately `10,204.081632654 PWRC` gross. Do not hardcode that amount because the mint's maximum fee and active epoch configuration can change the result.
