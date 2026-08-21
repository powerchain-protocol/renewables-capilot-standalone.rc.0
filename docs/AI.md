# AI and GRIDLLM

GRIDLLM is the application-level intelligence router for renewable-energy operations, markets, tokenomics and PowerChain infrastructure.

## Providers

The server-side router supports:

- OpenAI
- Anthropic
- Google GenAI
- DeepSeek
- private OpenAI-compatible LoRA endpoints

Browser code selects a provider preference and model profile; it never receives provider credentials or arbitrary unrestricted model IDs.

## Model profiles

The user-facing profiles are:

- Quality
- Balanced
- Fast
- Private LoRA

The server maps profiles to approved model identifiers and controls fallback order.

## Agents

The built-in registry includes focused agents for renewable operations, energy markets and infrastructure auditing. Agents are orchestration metadata, not independent signing authorities.

## Skills

Domain skill files live in `src/skills/` and cover:

- renewables
- Solana
- PowerChain

## Memory

Memory is non-custodial and non-secret. Never persist:

- seed phrases
- private keys
- signing key material
- API credentials
- reusable authentication secrets

## Action boundary

```text
Analyze -> Recommend -> Prepare -> Policy -> Simulate -> Review -> User wallet signs
```

AI-generated blockchain actions must end as unsigned, human-readable review objects until the user's wallet approves them.
