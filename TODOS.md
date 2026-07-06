# TODOS — mesita-web-consumer

Design debt surfaced by `/plan-design-review` (Rewards + Me pages, 2026-07-06).

## Avatar upload (backend half of T11)

**What:** Let a consumer upload a profile photo shown in the Me hero story-ring.

**Why:** The identity hero is initials-only. A photo makes the profile feel
personal and is the natural payoff of the story-ring treatment already built.

**Done so far (this branch — frontend, forward-compatible):**
- `ConsumerProfile.avatar_url?: string | null` added (`src/lib/api/profile.ts`).
- `ProfileHero` renders the image when `avatar_url` is present, initials
  otherwise (`src/app/(shell)/profile/ProfileClient.tsx`). No-ops until the EF
  returns the field.

**Remaining (separate, human-gated change — do NOT bundle with UI polish):**
1. DB: `consumers.avatar_url text null` migration (mirror in `mesita-supabase`).
2. Storage: a `consumer-avatars` bucket + RLS (owner-write, public-read or
   signed-read). Security-sensitive — review carefully.
3. EF `consumer-web-get-profile`: return `avatar_url` in the consumer payload.
4. EF `consumer-web-update-profile`: accept + persist `avatar_url`.
5. Client upload: signed-upload path + an avatar picker in
   `EditProfileSheet.tsx` (crop/size limits, moderation stance TBD).
6. `next.config.ts`: allow the storage host so this can move to `next/image`
   (drop the `no-img-element` disable in ProfileHero).
7. Cloud deploy of both EFs, verified `cloud == repo` (not a stub).

**Depends on / blocked by:** operator-run cloud deploy (EF deploys are
human-gated); storage RLS review.

## Dynamic city/region + app version (T12 data source)

**What:** Replace remaining hardcoded chrome with real data.

**Done so far (this branch):**
- `MyQrCard` takes a `region` prop (default `"MX · MTY"`); the caller can now
  pass a real value.
- Settings version reads `NEXT_PUBLIC_APP_VERSION` (falls back to `2.4.1`).

**Remaining:**
1. Wire `NEXT_PUBLIC_APP_VERSION` to the package version in CI/`next.config.ts`.
2. Source the QR card `region` from the consumer's city/market data and pass it
   from the pay page once a second launch city exists.

**Depends on / blocked by:** multi-city launch decision (low urgency while
Monterrey-only).
