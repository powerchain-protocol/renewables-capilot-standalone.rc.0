# PowerChain Copilot Chat UX

**Product version:** 1.0.0  
**Status:** canonical mobile chat interaction contract

## Purpose

PowerChain Copilot Chat is an evidence-aware operational workspace. The chat interface must make AI useful without implying that model output is verified external state or wallet authorization.

The runtime pipeline exposed in the UI is:

```text
Context → Generate → Verify
```

This visual pipeline is intentionally narrower than the complete backend lifecycle. Structured SSE events still carry request IDs, heartbeats, cancellation, grounding, evidence, usage and review intents.

## Composer

`apps/mobile/components/copilot/CopilotComposer.tsx` is the canonical mobile composer.

Requirements:

- hard maximum of 2,000 characters;
- progressive counter begins at 1,600 characters;
- warning tone increases as the limit approaches;
- multiline input grows from 44px to a 128px ceiling, then scrolls internally;
- Prompt Library is available directly above the input;
- selected prompts are inserted, never automatically sent;
- active generation replaces Send with an explicit Stop control;
- critical-action disclaimer remains visible.

The character boundary exists in both UI and server request validation. Client validation is not a security boundary.

## Auto-follow behavior

New output auto-scrolls only when the operator is within 120px of the bottom of the conversation. Scrolling upward disables forced following. New deltas continue to render without pulling the operator away from earlier evidence.

When a new operator message is sent, the client intentionally returns to follow mode for that turn.

## Streaming

`StreamStageBar.tsx` maps structured runtime events into three visible states:

1. **Context** — resolve conversation, tenant, assets, documents and qualified external state.
2. **Generate** — stream model output and tool/agent results.
3. **Verify** — attach grounding, evidence, usage and review-intent metadata.

The following transport concerns stay connected but do not need a permanent visual slot:

- heartbeat;
- request ID;
- cancellation;
- usage;
- evidence events;
- grounding status;
- review intents;
- completion/error state.

## Message rendering

`MessageContent.tsx` deliberately uses a lightweight renderer. While streaming, assistant text is rendered as plain text plus a streaming cursor. After completion the renderer recognizes:

- headings (`#` through `###`);
- bullet lists;
- numbered steps;
- `**bold**` emphasis;
- inline code;
- fenced code blocks.

It does not execute HTML or arbitrary embedded components.

## Evidence and provenance

Evidence is collapsed by default. The compact assistant footer shows:

```text
Grounding · provider/model · latency · source count
```

Expanding evidence reveals linked records. Supported source families include Assets, Energy, Treasury, Alerts, Reports, Documents and Chain evidence.

A source link is navigation, not proof that the model interpretation is correct. Verification state remains explicit.

## Response controls

`ResponseToolbar.tsx` provides:

- Regenerate;
- Share;
- Helpful;
- Unhelpful.

Feedback is persisted against the authenticated assistant message through:

```http
POST /api/v1/copilot/messages/:message_id/feedback
```

Accepted ratings are `HELPFUL` and `UNHELPFUL`. The endpoint must verify that the message is an assistant message owned by a conversation visible to the authenticated user and organization.

Feedback is an evaluation signal. It does not expose chain-of-thought or internal model reasoning.

## Prompt Library

`CopilotPromptModal.tsx` provides 12 canonical operational prompts across:

- Operations;
- Assets;
- Energy;
- Treasury;
- Alerts;
- Reports;
- Risk.

Operators can search, filter and bookmark prompts. Insertion only updates the composer; it never triggers execution.

API contract:

```text
GET    /api/v1/copilot/prompts/library
GET    /api/v1/copilot/prompts/saved
POST   /api/v1/copilot/prompts/saved
DELETE /api/v1/copilot/prompts/saved/:prompt_id
```

The canonical registry is `backend/copilot_prompts.ts` and remains versioned at 1.0.0.

## Conversation deletion

The chat UI requires an explicit destructive confirmation before calling:

```text
DELETE /api/v1/copilot/conversations/:conversation_id
```

The backend performs tenant/user ownership checks. The Prisma reference implementation soft-deletes the conversation using `deletedAt`; product deletion does not override regulatory, security or audit-retention requirements.

## Accessibility

- controls expose explicit accessibility labels;
- touch targets are at least 44px for Send/Stop;
- state is not communicated by color alone;
- prompt insertion and destructive deletion are explicit actions;
- evidence remains inspectable without forced auto-scroll.

## Trust invariant

```text
AI response ≠ evidence
Evidence ≠ authorization
Review intent ≠ signature
Wallet/operator authorization remains explicit
```

## PWRC message credits

The v1.0.0 chat composer is credit-aware. The base launch unit is **10,000 PWRC per standard chat message**, equal to **$0.02** at the supplied initial PWRC reference price of **$0.000002**.

The Prompt Library carries a `creditClass` so an operator sees the expected class before inserting a prompt. The composer loads `/api/v1/copilot/credits/pricing` and `/api/v1/copilot/credits/balance`, displays the estimate, and fails closed when enforcement is `ENFORCED` and the available balance cannot cover the quote.

The SSE lifecycle adds:

```text
credits.reserved
credits.settled
credits.released
```

A successful assistant message can expose a collapsed tokenized usage receipt. Message content stays private; only hashes and settlement metadata are eligible for optional chain anchoring.
