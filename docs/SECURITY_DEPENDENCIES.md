# Dependency Security Notes

## Current remediations

The project deliberately uses narrow pnpm overrides rather than blanket major-version overrides:

```yaml
overrides:
  "lodash@<4.18.0": "4.18.1"
  "jayson>uuid": "11.1.1"
  "jayson>ws": "7.5.13"
  "deepmerge-ts@<8.0.0": "8.0.1"
  image-size: "npm:image-size-next@2.1.1"
```

`image-size` currently has high-severity parser denial-of-service advisories affecting every published 2.x release. Because upstream has no patched npm version, the project resolves it to the maintained `image-size-next` compatibility fork and independently blocks ICNS/JXL/HEIF-family uploads.

The `deepmerge-ts` override crosses a major version boundary because the stack-exhaustion fix is in v8. Run the full application test/build suite after regenerating the lockfile to confirm the transitive consumer is compatible.

The UUID override is intentionally scoped to `jayson`, the dependency chain used by `@solana/web3.js`, rather than replacing UUID globally.

## Verification

After applying these changes to an existing checkout, regenerate the lockfile and verify ownership:

```bash
pnpm install --no-frozen-lockfile
pnpm why image-size image-size-next deepmerge-ts lodash uuid ws
pnpm peers check
pnpm audit --prod --audit-level=moderate
pnpm typecheck
pnpm build
```

Once clean, commit `pnpm-lock.yaml` and return CI to `pnpm install --frozen-lockfile`.
