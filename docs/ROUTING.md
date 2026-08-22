# PowerChain application routing

## Canonical topology

| Surface | Local | Production |
|---|---|---|
| Web | `http://localhost:3000` | `https://web.powerchain.app` |
| Copilot | `http://localhost:3001` | `https://copilot.powerchain.app` |
| Backend | `http://localhost:3002` | `https://api.powerchain.app` |

Environment resolution is mode-aware: development prefers `*_LOCAL_URL`; production prefers `*_URL`. Do not store two URLs in one environment variable.

## Authenticated flow

1. User opens Web.
2. User signs in or chooses an enabled Demo role.
3. Better Auth/session state is established.
4. User is redirected to Copilot `/dashboard`.
5. Copilot verifies the session through Backend `/api/v1/session`.
6. Role capabilities are evaluated server-side.

Production account sessions are shared across the trusted `*.powerchain.app` subdomains through Better Auth cross-subdomain cookies.

## Roles

- `admin`
- `operator`
- `analyst`
- `viewer`
- `demo`

Demo access is read-oriented and does not acquire wallet signing authority.
