# Runtime and dependency security

- Optional client integrations never throw during module evaluation. Invalid URLs are normalized to `undefined` and surfaced through `/api/v1/config`.
- OpenAI, Helius, Supabase service-role, and private LoRA credentials remain server-only.
- `ws` uses bounded payloads and disables per-message deflate in the reusable server utility.
- Uploads reject ICNS, JXL, HEIC/HEIF and related formats as defense in depth.
- pnpm overrides are scoped to known vulnerable transitive chains; run `pnpm security:check` after every lockfile refresh.
- The unmaintained `image-size` package is replaced by the maintained `image-size-next` compatibility fork.
