# Validation

## Completed in this build environment

- TypeScript/TSX syntax parse: **206 files, 0 syntax diagnostics**.
- Internal project import audit: **0 unresolved source imports**, excluding `@/generated/prisma/client`, which is intentionally created by `prisma generate`.
- Required-structure validation: **19 critical paths present**.
- Documentation hierarchy check: repository root contains only `README.md`; long-form Markdown is canonical under `/docs/`.
- Local Markdown link audit: **PASS**.
- `pnpm-workspace.yaml` parses successfully with the intended narrow security overrides.
- Next.js configuration contains no `experimental.optimizePackageImports` entry.
- `tsconfig.json` explicitly includes `.next/dev/types/**/*.ts`.
- Optional client environment modules no longer throw for malformed Supabase placeholder URLs.
- Supabase client/server factories remain nullable while configuration is absent.
- OpenAI/Helius/private-model secrets are not exposed through `NEXT_PUBLIC_*` configuration.
- Server-only OpenAI and WebSocket modules are not re-exported by the client-safe `src/api/index.ts` barrel.
- OpenAI Responses requests accept an allowlisted model profile rather than an arbitrary client-supplied model ID.
- WebSocket server utility uses `maxPayload=256 KiB`, disables per-message deflate, and safely rejects malformed JSON messages.
- Upload validation rejects ICNS/JXL/HEIF-family formats as defense in depth.
- Direct Solana wallet dependency surface remains Wallet Standard-oriented through `@solana/wallet-adapter-react`.
- Solana devnet/mainnet-beta RPC and canonical Token/Token-2022/ATA program IDs remain explicit.
- `src/generated/prisma/` remains generated output only.

## Dependency remediations encoded in pnpm

```text
lodash <4.18.0             -> 4.18.1
jayson > uuid              -> 11.1.1
jayson > ws                -> 7.5.13
deepmerge-ts <8.0.0        -> 8.0.1
image-size                  -> image-size-next 2.1.1
Direct ws                   -> 8.21.3
```

Because this generated artifact does not include the user's local `pnpm-lock.yaml` or installed `node_modules`, the final resolved dependency graph must be confirmed after lockfile regeneration in the target checkout.

## Local recovery from the reported Zod error

The application now tolerates a malformed optional Supabase URL and reports it in the UI. Prefer blank values until Supabase is actually configured:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

To enable Supabase, use the real HTTPS project URL and publishable key. Never put the service-role key in `NEXT_PUBLIC_*` variables.

## OpenAI API profile

```text
Base URL:       https://api.openai.com/v1
Responses URL:  https://api.openai.com/v1/responses
Quality:        gpt-5.6-sol
Balanced:       gpt-5.6-terra
Fast:           gpt-5.6-luna
```

`CHATGPT_API_URL` is a compatibility environment name and defaults to the same OpenAI Responses endpoint.

## Recommended target-checkout verification

```bash
corepack enable
corepack use pnpm@11.22.0

pnpm install --no-frozen-lockfile
pnpm prisma:generate
pnpm config:doctor
pnpm peers:check
pnpm security:why
pnpm audit --prod --audit-level=moderate
pnpm typecheck
pnpm prisma:validate
pnpm build
pnpm dev
```

After the updated dependency graph is verified, commit `pnpm-lock.yaml` and return CI to `pnpm install --frozen-lockfile`.

## Environment limitation

This container does not contain the project's installed npm dependency tree and runs Node 22 rather than the project's required Node 24.19.x. A local global TypeScript 5.8 parser was therefore used only for syntax diagnostics; it cannot replace the requested target-environment `pnpm typecheck`/`next build` verification.


## Web3 Icons typecheck repair

The UI icon wrapper uses static network/token exports (`NetworkSolana`, `NetworkSui`, `TokenUSDC`) rather than the dynamic `NetworkIcon` prop surface that produced `TS2322` with `@web3icons/react@4.1.21`. Wallet icons remain dynamic because wallet names are discovered at runtime.

## Config doctor execution

`pnpm config:doctor` no longer depends on top-level `await`, so it runs under the current `tsx` CommonJS transform as well as ESM-capable environments.

## Reliability invariants

- App-level system health is polled once through `SystemHealthProvider` and shared across UI consumers.
- Background tabs do not continue periodic health polling; visibility restoration triggers a refresh.
- API helper requests have bounded timeouts and distinguish timeout failures from ordinary network failures.
- `tsconfig.tsbuildinfo` is ignored and forbidden from release artifacts.
- Global error UI does not expose raw runtime exception messages to end users.

## 2026-08-21 improvement pass verification

- Structure validator: 22 critical paths, pass.
- TypeScript/TSX syntax parse: 193 source files, 0 syntax diagnostics.
- Internal `@/` import resolution audit: 0 unresolved project imports (generated Prisma client excluded by design).
- Release artifact contains no `tsconfig.tsbuildinfo`.
