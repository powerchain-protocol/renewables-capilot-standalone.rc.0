# Firebase emergency Web hosting

Use **Firebase App Hosting**, not the legacy Next.js Hosting frameworks experiment, for the Web surface. Firebase App Hosting runs framework builds on Cloud Build/Cloud Run and supports dynamic Next.js applications.

PowerChain keeps Firebase as an emergency Web-only target. Copilot streaming and the Backend remain on Vercel/Cloudflare/AWS unless separately validated.

Next.js versions newer than Firebase's currently active support line may operate in preview/best-effort mode. Validate the exact Next.js 16.3.x release before promoting Firebase to production traffic.
