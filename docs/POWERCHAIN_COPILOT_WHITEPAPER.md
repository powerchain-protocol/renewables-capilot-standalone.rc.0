# PowerChain Copilot — Authenticated AI Operations Workspace

**Version:** 1.0.0  
**Applications:** Web · Copilot · Backend · Mobile  
**Default local topology:** Web `:3000` · Copilot `:3001` · Backend `:3002`

## Abstract

PowerChain Copilot is the authenticated AI operations workspace of the PowerChain platform. It combines persistent conversations, model routing, operational data, document intelligence, evidence and provenance, analytics, reporting and review-first execution workflows in one application boundary.

Copilot is designed for high-consequence operational environments where AI must be useful without becoming an invisible authority. It can inspect structured system state, analyze uploaded evidence, summarize renewable-energy and market context, interpret blockchain activity, produce reports, identify anomalies and prepare execution intents. It does not hold private keys, sign blockchain transactions or silently bypass human approval.

```text
OBSERVE
   ↓
RESOLVE CONTEXT
   ↓
ANALYZE
   ↓
PRODUCE EVIDENCE
   ↓
RECOMMEND
   ↓
HUMAN REVIEW
   ↓
EXECUTION INTENT
   ↓
WALLET / OPERATOR AUTHORIZATION
   ↓
VERIFICATION
```

## 1. Mission

Operational teams work across renewable generation, storage, markets, APIs, wallets, digital assets, documents, reports and distributed settlement networks. Copilot provides one reasoning and evidence layer across those systems so teams can answer what changed, which evidence supports a conclusion, what is stale or uncertain, what action is available, what that action will do, who must authorize it and how the result is verified.

## 2. Design Principles

### 2.1 AI assists; it does not become the principal
AI may analyze, compare, summarize, draft parameters and prepare execution intents. Irreversible actions stay behind user, operator or wallet authorization.

### 2.2 Evidence must remain distinguishable from inference
Documents, records, API responses and verified chain effects are source evidence. Model conclusions derived from them are inference and retain that trust label.

### 2.3 External state is authoritative for external actions
Frontend success is not proof of settlement. Blockchain/provider workflows advance only after relevant external state is verified.

### 2.4 Security-sensitive workflows fail closed
Missing required permissions, context, provider configuration or verification downgrades a workflow to read-only or stops it.

### 2.5 Context is bounded
Documents, prompts, telemetry and API responses are potentially untrusted inputs with explicit type, byte, page, text and trust limits.

## 3. Application Architecture

```text
PowerChain Web (:3000)
        │
        ▼
PowerChain Renewables Copilot (:3001)
        │
        ▼
PowerChain Backend (:3002)
   │                  │
Prisma/Supabase   External providers
                  ├─ Energy/telemetry
                  ├─ Solana/Sui
                  └─ AI models
```

The public Web, authenticated Copilot workspace and privileged Backend are independently deployable trust zones. Mobile and desktop clients consume the same Backend contracts.

## 4. Copilot Operating Loop
A request resolves session, role, application state, persistent conversations, reports, documents, operational telemetry, analytics, blockchain evidence and provider/network configuration before model routing. The answer carries provenance and uncertainty with any recommendation.

## 5. Model and Provider Architecture
Copilot is provider-aware rather than provider-bound. OpenAI, Anthropic, Gemini, DeepSeek, Ollama/local and validated LoRA profiles live behind a shared runtime. Provider health, model identity and failures are observable. Model output is never proof of external state.

## 6. Persistent Conversations and Reports
Conversations are server-issued, reopenable records containing messages, provider/model metadata, evidence references and correlation identifiers. Reports are durable operational artifacts above a single chat turn.

## 7. Evidence and Provenance

```text
SOURCE EVIDENCE
      ↓
NORMALIZED CONTEXT
      ↓
MODEL ANALYSIS
      ↓
RECOMMENDATION
      ↓
OPTIONAL EXECUTION INTENT
      ↓
VERIFIED RESULT
```

Evidence records preserve source type, source identifier, observed/fetched time, verification status, trust class and optional content hash.

## 8. Document Intelligence and PDF Evidence

| Format | Default boundary | Processing |
| --- | ---: | --- |
| PDF | 5 MiB / 50 pages | server-side bounded text extraction |
| TXT | 256 KiB | UTF-8 text |
| CSV | 256 KiB | UTF-8 text |
| JSON | 256 KiB | UTF-8 + syntax validation |

A request accepts three attachments. Extracted text is capped at 200,000 characters per document. PDFs require `%PDF-`, use PDF.js with JavaScript evaluation disabled, and produce SHA-256. Parsed content is labelled `untrusted-user-document`. OCR is not automatic.

## 9. Analytics
Analytics measures product usage and reliability. Audit answers which sensitive action occurred. Provenance answers which evidence supports a conclusion. They are distinct stores and trust models.

Initial events: `copilot.dashboard.view`, `copilot.resource.open`, `copilot.chat.request`, `copilot.chat.response`, `copilot.chat.error`, `copilot.document.parse`.

## 10. Analytics Privacy Contract
Analytics excludes prompts, model responses, extracted text, PDFs, cookies, auth headers, wallet/address identifiers, users/sessions, private keys and seed phrases. Only approved metadata is accepted. Analytics is not billing, settlement or chain truth.

## 11. Renewable-Energy Intelligence
Evidence can include generation, state of charge, forecasts, portfolio performance, curtailment, grid conditions, prices, certificate/carbon information, incidents, maintenance and settlement. Copilot distinguishes measured, derived, forecast and model-generated data.

## 12. Execution Review

```text
ANALYSIS → EXECUTION INTENT → POLICY/CAPABILITY → EXACT REVIEW
→ HUMAN APPROVAL → WALLET/OPERATOR SIGNATURE → SUBMISSION → VERIFICATION
```

The review object exposes chain, recipients/instructions, immutable parameters, simulation, fees/warnings and expiry where applicable. Copilot never obtains private-key authority by generating the intent.

## 13. Blockchain and Launchpad Intelligence
Copilot can explain and inspect Solana/Sui launch lifecycle evidence, Token-2022 or Move artifacts, payout/graduation configuration, transaction review objects, failures and reconciliation outcomes. Creator wallet approval is never replaced by AI.

## 14. Cross-Chain Analytics
Normalized metrics may include launches, confirmation times, verification failures, reconciliation latency, holder growth, volume, graduation and vesting. Normalization does not flatten chain-native semantics or become authoritative chain state.

## 15. Identity and Authorization
Representative roles: `admin`, `operator`, `analyst`, `viewer`, `demo`. Capabilities include `copilot.access`, `documents.analyze`, `analytics.read`, `reports.read`, `execution.review`, `execution.prepare`, `admin.manage`. Demo stays constrained.

## 16. Persistence: Prisma and Supabase
PostgreSQL stores organizations, users, memberships, conversations, messages, reports, AI runs, evidence metadata, analytics, audit and execution intents. Prisma 7 uses a PostgreSQL driver adapter. Supabase supplies managed Postgres/Storage/Edge when configured. Database persistence never replaces on-chain verification.

## 17. Security Model
| Boundary | Required behavior |
| --- | --- |
| AI | no autonomous signing authority |
| Documents | untrusted, bounded parsing |
| Browser | no server secrets |
| Backend | authenticate, authorize, validate, rate limit |
| Database | least privilege + auditable persistence |
| Analytics | content-free telemetry |
| Blockchain | verify expected effects, not transaction existence alone |
| Wallet | user-controlled cryptographic authorization |

## 18. Reliability and Readiness
`GET /api/health` answers process liveness. `GET /api/ready` answers configuration readiness. Equivalent `/api/v1/health` and `/api/v1/ready` endpoints exist. Production readiness fails closed if Clerk, persistence or AI configuration is absent.

## 19. Observability
Requests carry `requestId`, optional `traceId`/`correlationId`, conversation/report IDs, provider/model, service, network and workflow stage. Secrets are never telemetry.

## 20. Public and Authenticated Surfaces
Public: `/docs/whitepaper` and `/docs/whitepaper.md`. Authenticated: conversations, documents, analytics, reports, evidence, renewable intelligence and execution review.

## 21. Deployment Model
Canonical production routing:

```text
Web      https://web.powerchain.app
Copilot  https://copilot.powerchain.app
Backend  https://api.powerchain.app
```

The monorepo targets Node 24.x and pnpm 11.22.0.

## 22. Verification and Release Contract

```text
pnpm repo:verify
pnpm docs:check
pnpm copilot:check
pnpm contract:check
pnpm env:doctor
pnpm deps:doctor
pnpm typecheck
pnpm build:apps
pnpm smoke:apps
pnpm release:check
```

## 23. Roadmap
Forecasting/anomaly detection, evidence diffs, additional document formats, multimodal technical-document review, chain-normalized lifecycle analytics, execution simulations, signed review hashes, governance-controlled adapters, richer cost/health routing, private model profiles, scheduled reports and provenance graphs.

## 24. Conclusion

```text
Copilot      → reasoning and recommendation
Documents    → bounded evidence
Analytics    → product and reliability measurement
Audit        → sensitive event accountability
Provenance   → evidence lineage
Backend      → policy, persistence and verification
Wallet       → authorization
Blockchain   → settlement
Human        → final authority
```

> Analyze deeply. Show the evidence. Prepare precisely. Authorize explicitly. Verify the result.
