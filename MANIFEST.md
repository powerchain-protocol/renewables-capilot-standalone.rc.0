# PowerChain Copilot v1.0.0 — Manifest

Files (excluding this manifest): 46

```text
CHANGELOG.md
CONTRIBUTING.md
README.md
ai/providers.tsx
ai/solana/jupiter.tsx
ai/solana/solana.tsx
ai/sui/cetus.tsx
ai/sui/sui.tsx
apps/backend/src/copilot/credit_service.ts
apps/backend/src/copilot/prisma_repository.ts
apps/backend/src/copilot/routes.ts
apps/backend/src/copilot/types.ts
apps/backend/src/copilot_prompts.ts
apps/desktop/src/app/(auth)/sign-in/page.tsx
apps/mobile/components/copilot/CopilotComposer.tsx
apps/mobile/components/copilot/CopilotMessageCard.tsx
apps/mobile/components/copilot/CopilotPromptModal.tsx
apps/mobile/components/copilot/CreditBalancePill.tsx
apps/mobile/components/copilot/EvidenceDisclosure.tsx
apps/mobile/components/copilot/MessageContent.tsx
apps/mobile/components/copilot/ResponseToolbar.tsx
apps/mobile/components/copilot/StreamStageBar.tsx
apps/mobile/components/copilot/TokenizedMessageReceipt.tsx
apps/mobile/lib/copilot/api.ts
apps/mobile/lib/copilot/types.ts
apps/mobile/screens/auth/LoginScreen.tsx
apps/mobile/screens/copilot/CopilotChatScreen.tsx
apps/mobile/screens/credits/CopilotCreditsScreen.tsx
backend/copilot_credits.test.ts
backend/copilot_credits.ts
backend/copilot_prompts.ts
docs/COPILOT-CHAT-UX.md
docs/COPILOT-PWRC-CREDITS.md
docs/POWERCHAIN_COPILOT_WHITEPAPER.md
docs/api/openapi.yaml
docs/architecture/AUTH_AND_IDENTITY.md
docs/architecture/CREDITS.md
docs/architecture/MOBILE.md
docs/architecture/UI_UX_SYSTEM.md
docs/design/mobile-core-screens-v1.png
docs/design/mobile-onboarding-auth-v1.png
docs/design/mobile-operations-approval-v1.png
docs/development/IMPLEMENTATION_STATUS.md
docs/development/MIGRATION_V1.md
prisma/schema.prisma
skills/powerchain-capilot.md
```

## PWRC credit invariants

- `1 MCU = 10,000 PWRC`.
- Launch reference `1 PWRC = $0.000002`.
- Therefore `1 MCU = $0.02` reference value.
- Pricing uses integer micro-USD and atomic-unit math.
- PWRC funding is chain-verified and credits the verified net amount.
- Per-message usage is reserved and settled off-chain through an immutable ledger.
- Tokenized message receipts contain hashes/settlement metadata; raw chat content remains off-chain.
- Product version remains `1.0.0`.
