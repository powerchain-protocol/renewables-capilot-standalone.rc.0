# Security Notes

## Secrets

Never expose these with `NEXT_PUBLIC_*`:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- `DEEPSEEK_API_KEY`
- `LORA_API_KEY`
- `HELIUS_API_KEY`
- `DATABASE_URL`
- Supabase service-role/secret keys

Only the Supabase project URL/publishable key, wallet-connection public configuration, canonical token identifiers and verified program IDs belong in browser-visible configuration.

## AI

- provider/model selection is resolved on the server.
- client AI Settings stores only provider preference, model profile and fallback preference.
- credentials are not stored in localStorage.
- provider fallback is explicit and can be disabled.
- if no provider succeeds, the chat API fails closed.
- private LoRA support expects an OpenAI-compatible endpoint and remains server-only.

## pnpm supply-chain policy

`pnpm-workspace.yaml` uses `strictDepBuilds`, `blockExoticSubdeps`, `minimumReleaseAge` and `allowBuilds`. Review any new package requiring install/build scripts before adding it to `allowBuilds` or approving it with `pnpm approve-builds`.

A small exact-version `minimumReleaseAgeExclude` exists only for direct packages intentionally pinned to just-published versions in this release; transitive packages keep the release-age gate.

## Prisma / database

Making `DATABASE_URL` optional in `prisma.config.ts` is only a CLI bootstrap fix for commands such as `prisma generate`. Database code must still fail if the runtime connection string is absent.

Supabase RLS is the authorization boundary for browser-accessible database rows. Do not replace RLS ownership policies with a service-role client in request paths.

## Solana

- Helius is observational/infrastructure access, not protocol authority.
- no AI or server module may sign on behalf of a user wallet.
- unknown PowerChain program IDs remain unset rather than using placeholders.
- public RPC fallback is limited to read-oriented RPC methods exposed by the application endpoint.
- executable operations must show a transaction review and require wallet approval.


## Agent, skill, memory and wallet boundaries

- Agent/skill definitions are capability metadata, not authority or evidence.
- Memory modules must not store secrets, API keys, seed phrases, private keys or reusable transaction signing material.
- Embedded-wallet/MPC support is disabled unless a separately reviewed provider is configured.
- Web3 icons are presentation-only and must never be used to infer asset/network identity; identity comes from validated chain IDs, addresses and mint/program IDs.
- Pyth/Helius/other providers are data sources. Provider responses never grant mint, transfer, treasury or signing authority.

## 2026 dependency remediations

- Lodash is pinned to the patched 4.18.x line; browser helpers import individual methods rather than the whole package surface.
- Direct `ws` is pinned to a patched 8.21.x line and the reusable WebSocket server enforces a 256 KiB payload ceiling with compression disabled.
- The `@solana/web3.js -> jayson` UUID dependency is scoped to `uuid@11.1.1`, preserving CommonJS support while addressing the current bounds-check advisory.
- `deepmerge-ts<8` is overridden to 8.0.1 because the recursive-object stack-exhaustion remediation landed in v8.
- `image-size` has no patched upstream npm release for the current ICNS/JXL/HEIF infinite-loop advisories. The dependency is resolved to the maintained `image-size-next` fork and affected upload formats are rejected independently.

See `docs/SECURITY_DEPENDENCIES.md` for lockfile verification commands.
