# PowerChain UI / UX System v1.0.0

PowerChain uses a light-first operational design system across Expo mobile/PWA, authenticated Copilot web, and the dedicated Next.js desktop shell.

## Visual principles

- White and near-white operational surfaces.
- Dark forest green for primary actions and verified state.
- Rounded 14–22 px cards, restrained shadows, and 1 px neutral borders.
- Dense enough for operational information, but never dashboard microtype.
- Evidence, source state, AI inference and approval actions use different semantic treatments.
- Financial or blockchain values are never replaced with fabricated demo values when live state is unavailable.

## Mobile navigation

```text
Copilot · Command Center · Assets · Alerts · Profile
```

Secondary surfaces such as full conversation, Review & Approve, Treasury, Reports, Energy Overview, Tasks and client-role workspaces are nested routes rather than additional bottom tabs.

## Mobile screen hierarchy

```text
Welcome / Get Started
  ↓
Role
  ↓
Organization
  ↓
Wallet context
  ↓
Ready
  ↓
Copilot Home
  ├── Full conversation
  ├── Command Center
  ├── Assets
  ├── Alerts
  └── Profile

Command Center
  ├── Energy Overview
  ├── Review & Approve
  ├── Treasury
  └── Reports
```

## Design references

- `docs/design/mobile-onboarding-auth-v1.png`
- `docs/design/mobile-core-screens-v1.png`
- `docs/design/mobile-operations-approval-v1.png`

These boards define the visual target. Product code remains source-of-truth for actual data and authorization behavior.

## Control states

A primary green control means the action is available, not necessarily authorized. Sensitive workflows still move through:

```text
PREPARE → REVIEW → APPROVE → WALLET / OPERATOR AUTHORIZATION → VERIFY
```

The UI must never make AI-generated action preparation visually indistinguishable from a verified external result.

## Accessibility

- Minimum interactive height: 44 px; primary controls target 52 px.
- Do not rely on color alone for warnings or success.
- Use semantic text plus icons for alert levels and verification.
- Maintain readable body copy at 14–16 px on mobile.
- Keep bottom navigation labels visible.
- Keyboard and safe-area behavior must not obscure the Copilot composer.

## Responsive web

Desktop and tablet reuse the same visual semantics but switch from bottom tabs to rail/sidebar navigation and increase information density. Copilot web uses persistent evidence and review surfaces rather than stretching the phone UI.
