# Cloudflare warm-standby

Use the current Cloudflare Workers + OpenNext adapter for Next.js. Keep Web, Copilot and Backend as three independent Worker projects and bind `web.powerchain.app`, `copilot.powerchain.app` and `api.powerchain.app` independently.

For each app:

```bash
pnpm add -D @opennextjs/cloudflare@latest wrangler@latest
pnpm exec opennextjs-cloudflare build
pnpm exec wrangler deploy
```

Required Worker configuration:

- `main = ".open-next/worker.js"`
- `compatibility_flags = ["nodejs_compat"]`
- assets directory `.open-next/assets`
- compatibility date `2024-09-23` or newer

Do not route Copilot streaming API traffic through the Web application. Promote Cloudflare from warm standby only after `/api/health`, authenticated session transfer and streaming chat smoke tests pass.
