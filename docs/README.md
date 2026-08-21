# PowerChain Renewables Copilot Documentation

The `/docs` directory is the canonical home for long-form product, engineering, operations, security, and release documentation. The repository root intentionally keeps only the main `README.md` as the project entry point.

## Start here

| Document | Purpose |
| --- | --- |
| [Getting Started](GETTING_STARTED.md) | Install, configure and run the application locally |
| [Architecture](ARCHITECTURE.md) | Application boundaries, runtime flow and module ownership |
| [Configuration](CONFIGURATION.md) | Environment parsing, diagnostics and optional-integration behavior |
| [Validation](VALIDATION.md) | Source validation and target-environment verification |

## AI and intelligence

| Document | Purpose |
| --- | --- |
| [AI & GRIDLLM](AI.md) | Provider routing, profiles, agents, skills, prompts and memory |
| [OpenAI](OPENAI.md) | Responses API, model profiles, endpoints and secret boundaries |

## Blockchain and infrastructure

| Document | Purpose |
| --- | --- |
| [Solana & Web3](SOLANA.md) | Wallet Standard, RPC, Helius, PWRC and Solana program identities |
| [Database](DATABASE.md) | Supabase, Prisma, migrations, seeds and RLS |
| [Prisma](PRISMA.md) | Generated-client lifecycle and database commands |
| [Dependencies](DEPENDENCIES.md) | pnpm policy, build approvals and dependency maintenance |

## Product and design

| Document | Purpose |
| --- | --- |
| [UI/UX](UI_UX.md) | Workspace shell, themes, responsive behavior and interaction rules |

## Security

| Document | Purpose |
| --- | --- |
| [Security](SECURITY.md) | Secrets, wallet authority, database policy and runtime controls |
| [Dependency Security](SECURITY_DEPENDENCIES.md) | Dependabot remediation, overrides, audits and lockfile checks |

## Project maintenance

| Document | Purpose |
| --- | --- |
| [Changelog](CHANGELOG.md) | Canonical version history |
| [Release Notes](RELEASE_NOTES.md) | Detailed notes for the current implementation artifact |
| [Contributing](CONTRIBUTING.md) | Contribution workflow and repository conventions |
| [Contributors](CONTRIBUTORS.md) | Contributor record and attribution policy |

## Documentation conventions

- Runtime behavior is authoritative over screenshots, mockups, or sample data.
- Demo telemetry is always labelled as sample data until a live adapter supplies it.
- Unknown PowerChain program IDs stay unset until deployment is verified.
- AI may analyze and prepare actions, but wallet signing remains user-controlled.
- Supabase migration SQL is authoritative for RLS and grants; Prisma mirrors application models for typed server access.
- `src/docs/` contains concise application-facing metadata and references; it is not a second copy of the canonical long-form documentation.
