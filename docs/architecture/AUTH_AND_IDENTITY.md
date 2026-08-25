# Authentication and Identity

## Canonical identity

Clerk is the primary identity/session system for desktop and Expo clients. Supported entry points include email/password or passwordless methods configured in Clerk, social connections, enterprise SSO and Clerk Sign in with Solana.

Authentication is not wallet transaction authorization. A Solana wallet authenticated through Clerk may also be linked to PowerChain, but every financial transaction still passes transaction intent → simulation → review → wallet signing.

## Application data

Supabase provides Postgres, Storage, Realtime and Edge infrastructure. Prisma is the server ORM/schema migration layer. Clients do not receive Supabase service/secret keys.

## Identity synchronization

Clerk user ID is stored as an external immutable identity key (`user_profiles.clerk_user_id`). Organization membership and PowerChain roles live in the application database. Never authorize based on editable frontend metadata.

## Social sign-in

Enable providers in Clerk. Native Expo social providers require platform credentials in production. Prefer Clerk's maintained native/prebuilt auth flows over reimplementing OAuth token handling.

## Migration

See `docs/development/AUTH_MIGRATION.md`.

## Expo implementation note

The native `AuthView` route uses Clerk's current native components on iOS/Android and dedicated `.web.tsx` routes for Expo web. Native components require a development build; production credentials for Google/Apple must be configured in Clerk/native app settings.
