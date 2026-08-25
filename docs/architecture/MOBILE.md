# Mobile and PWA Application

## Canonical client

`apps/mobile` is the Expo client for iOS, Android and installable PWA. The enterprise desktop workspace remains a separate Next.js client because its dense multi-column interaction model differs materially from the native application.

## Default theme

PowerChain mobile is light-first:

- background `#F7F8F7`
- surface `#FFFFFF`
- primary `#0B6B37`
- primary dark `#084C2A`
- text `#0E1511`
- border `#E2E7E4`

Shared values live in `apps/mobile/theme/tokens.ts`.

## Primary navigation

```text
Copilot   Command Center   Assets   Alerts   Profile
```

Hidden/nested application routes include full Copilot conversation, Tasks, More/client role workspaces, Review & Approve, Treasury, Reports and Energy Overview.

## Onboarding

```text
Welcome / Get Started
      ↓
Role selection
      ↓
Organization
      ↓
Wallet context
      ↓
Ready
```

Wallet setup is optional at onboarding. Identity and transaction signing remain separate capabilities.

## Copilot home

The first tab answers four questions:

1. What can I ask?
2. What conversations can I reopen?
3. What operational context is available?
4. How do I enter a full evidence-aware conversation?

Suggestions are loaded from `/api/v1/copilot/suggestions`; conversations come from `/api/v1/copilot/conversations`.

## Command Center

The Command Center uses `/api/v1/powerchain/context` and only renders values that exist in verified/demo-qualified Backend context. Missing treasury or financial state is shown as unavailable instead of invented.

## Offline classes

```text
LOCAL_SAFE    composer draft, filters, unsaved note
SYNC_SAFE     non-financial task updates, report drafts
ONLINE_ONLY   wallet approval, settlement, token operation, treasury action
```

The offline engine must enforce `ONLINE_ONLY`; UI disabled state is not a security boundary.

## Composer

The production composer is keyboard-aware and safe-area aware. It supports attachment affordances and contextual suggestions while keeping model output separate from evidence and transaction authorization.

## Design references

See `docs/architecture/UI_UX_SYSTEM.md` and `docs/design/`.
