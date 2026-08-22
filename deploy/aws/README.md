# AWS emergency hosting
Recommended emergency path: three standalone Next.js services behind ALB/CloudFront or ECS/Fargate.

- web: 3000
- copilot: 3001
- backend: 3002

Health checks: `/api/health` for Web/Copilot and `/api/v1/health` for Backend.
