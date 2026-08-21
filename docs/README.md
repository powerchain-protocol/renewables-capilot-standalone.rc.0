# PowerChain Renewables Copilot Documentation

This directory contains the technical and operational documentation for the Renewables Copilot workspace.

## Documentation map

| Document | Purpose |
| --- | --- |
| [Getting Started](GETTING_STARTED.md) | Local installation, environment setup, pnpm, Prisma and first run |
| [Architecture](ARCHITECTURE.md) | Application boundaries, provider routing, data flow and module ownership |
| [AI & GRIDLLM](AI.md) | Model providers, agents, skills, prompts, memory and safety boundaries |
| [Solana & Web3](SOLANA.md) | Wallets, Helius, RPC fallbacks, PWRC configuration and program IDs |
| [Database](DATABASE.md) | Supabase, Prisma, RLS, migrations, seeds and persistence |
| [UI/UX](UI_UX.md) | Product shell, themes, responsive behavior and interaction principles |
| [Security](SECURITY.md) | Secrets, wallets, database policies, AI safety and operational controls |
| [Validation](VALIDATION.md) | Source-level validation status and remaining environment checks |
| [Release Notes](RELEASE_NOTES.md) | Detailed notes for the current implementation artifact |
| [Contributing](CONTRIBUTING.md) | Contribution workflow and repository conventions |

## Documentation conventions

- Runtime behavior is authoritative over screenshots or mock data.
- Unknown program IDs and deployment addresses remain unset rather than fabricated.
- Demo telemetry is labelled as sample data until a real data adapter supplies it.
- AI may analyze and prepare actions, but wallet signing remains user-controlled.
- Supabase migration SQL is authoritative for RLS and grants; Prisma mirrors application models for typed server access.

## Dependency and database maintenance

- [Prisma generated-client lifecycle](./PRISMA.md)
- [Dependency and pnpm policy](./DEPENDENCIES.md)
