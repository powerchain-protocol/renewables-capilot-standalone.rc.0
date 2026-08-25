# AWS emergency hosting

Recommended emergency paths:

- Web: AWS Amplify Hosting for Next.js SSR, or the standalone container image on ECS/Fargate.
- Copilot: ECS/Fargate or App Runner using the standalone image so streaming and long-running provider calls remain under explicit runtime controls.
- Backend: ECS/Fargate or App Runner behind an ALB/API domain.

Preserve the canonical hosts (`web.powerchain.app`, `copilot.powerchain.app`, `api.powerchain.app`) through DNS failover rather than changing application URLs during an incident. Health checks must verify `/api/health` for all promoted targets.
