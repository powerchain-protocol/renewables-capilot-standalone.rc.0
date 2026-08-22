# PowerChain hosting and failover

| App | Local | Production |
|---|---:|---|
| Web | 3000 | https://web.powerchain.app |
| Copilot | 3001 | https://copilot.powerchain.app |
| Backend | 3002 | https://api.powerchain.app |

Preferred order: **Vercel → Cloudflare → AWS**. Hostinger and Firebase remain emergency/surface-specific options.

- Vercel: primary Next.js deployment.
- Cloudflare: warm standby using the current OpenNext Workers adapter.
- AWS: emergency full-stack target through standalone containers / managed Node hosting.
- Hostinger: emergency Web/Copilot Node deployment where supported.
- Firebase: emergency Web-only App Hosting target. Next.js versions newer than Firebase's active support line require explicit validation before promotion.

DNS failover should retain the canonical PowerChain hostnames rather than changing application URLs during an incident.

Never put multiple URLs in one environment variable. `NODE_ENV=development` is valid; `developemnt` is not. `http://` is valid; `http;//` is not.
