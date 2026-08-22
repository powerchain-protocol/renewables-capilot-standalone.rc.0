# PowerChain hosting and failover

| App | Local | Production |
|---|---:|---|
| Web | 3000 | https://web.powerchain.app |
| Copilot | 3001 | https://copilot.powerchain.app |
| Backend | 3002 | https://api.powerchain.app |

Preferred order: Vercel → Cloudflare → AWS. Hostinger and Firebase are emergency/surface-specific options.

Never put multiple URLs in one environment variable. Use `*_URL` for production and `*_LOCAL_URL` for local development. `NODE_ENV=development` is the valid value; `developemnt` is invalid. `http://` is valid; `http;//` is invalid.
