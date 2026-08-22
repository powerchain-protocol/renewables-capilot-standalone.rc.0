# Routing

1. Browser opens Web on port 3000 / `web.powerchain.app`.
2. Get Started opens the sign-in flow.
3. Better Auth or an explicitly enabled Demo session resolves a role.
4. Successful access redirects to Copilot `/dashboard` on port 3001.
5. Copilot proxy never intercepts `_next`, manifest or health routes.
6. Shared control-plane services are exposed from Backend on port 3002.

Balances, Tokens, Field/PWA and Integrations are dashboard resource panels, not separate shells by default.
