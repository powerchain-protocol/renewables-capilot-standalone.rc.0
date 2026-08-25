# Contributing

All contributions must preserve documented dependency and security boundaries.

## Before opening a pull request

- run formatting/linting
- run type checks
- run unit and integration tests
- add/update API schemas for contract changes
- add an ADR for architectural changes
- update docs and changelog where behavior changes

Do not introduce provider SDK calls, wallet SDK calls or Solana SDK calls directly into React feature screens.
