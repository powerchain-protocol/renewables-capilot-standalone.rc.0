# OpenAI / GRIDLLM Integration

The default server endpoint is the OpenAI Responses API:

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_RESPONSES_URL=https://api.openai.com/v1/responses
CHATGPT_API_URL=https://api.openai.com/v1/responses
```

`CHATGPT_API_URL` is a compatibility name for teams that refer to their OpenAI-backed chat surface as “ChatGPT API”. It is not a separate consumer ChatGPT endpoint; production calls use the OpenAI API.

Default model profiles:

- Quality: `gpt-5.6-sol`
- Balanced: `gpt-5.6-terra`
- Fast: `gpt-5.6-luna`

The application exposes two server boundaries:

- `/api/v1/chat` for GRIDLLM multi-provider streaming.
- `/api/v1/ai/openai/responses` for an explicit OpenAI Responses request with an allowlisted profile.

Clients cannot submit arbitrary OpenAI base URLs or model IDs. API keys remain server-only.
