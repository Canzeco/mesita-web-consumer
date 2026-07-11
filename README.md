> **FROZEN (2026-07-11):** This repository is read-only history. All active work lives in [`Canzeco/mesita-monorepo`](https://github.com/Canzeco/mesita-monorepo) — never a work target. See monorepo packages under `apps/` and `supabase/`.

# mesita-web-consumer

Consumer (diner) app for Mesita — lives at
[consumer.mesita.ai](https://consumer.mesita.ai).

Next.js 16 app (Tailwind v4 + shadcn primitives, dark theme). Sign-in
is phone OTP; every read and write goes through a `consumer-*` Edge
Function in [`mesita-supabase`](https://github.com/Canzeco/mesita-supabase) —
the client never touches the database directly.

## Develop

```bash
pnpm install
pnpm dev
```

Deployed automatically by Vercel on push to `main`.

## Sibling surfaces

- [business.mesita.ai](https://business.mesita.ai) — place console (`mesita-web-business`)
- [admin.mesita.ai](https://admin.mesita.ai) — super-admin console (`mesita-web-admin`)
- [mesita.ai](https://mesita.ai) — marketing site (`mesita-web-landing`)
