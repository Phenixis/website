This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production readiness audit (2026-09-09)

`tsc --noEmit` is clean and the public read paths are in decent shape, but the admin/auth layer is not launch-ready.

### Blockers — fixed

1. ~~Admin GET APIs are unauthenticated.~~ `middleware.ts` now gates every method (not just mutations) on `/api/{projects,posts,experiences,settings}`.
2. ~~Session cookie is the raw `ADMIN_SECRET`.~~ `lib/auth.ts` issues a signed HS256 JWT via `jose`; the cookie is never the password itself.
3. ~~No rate limiting or lockout on login.~~ `api/auth/login` now locks out an IP for 15 minutes after 5 failed attempts (Redis-backed, degrades to no-op if Redis isn't configured).
4. ~~No request-body validation on admin mutation routes.~~ `lib/validate.ts` validates every field on all mutation routes; bad input returns `400`, DB failures are caught and logged instead of crashing.

### Should fix before launch — fixed

5. ~~No `error.tsx`/`not-found.tsx`.~~ Added at `app/error.tsx` and `app/not-found.tsx`.
6. ~~No SEO/observability surface.~~ Added `app/robots.ts`, `app/sitemap.ts`, `app/rss.xml/route.ts`, and a default `app/opengraph-image.tsx`. Site URL is configurable via `NEXT_PUBLIC_SITE_URL`.
7. ~~MDX content renders with no sanitization.~~ Turned out to be a non-issue on closer look: `components/mdx.tsx` (the `MDXRemote` wrapper) was never actually imported anywhere — all post/project body content renders as plain strings through JSX (`{para}`), which React escapes automatically. Removed the dead file and the unused `next-mdx-remote` dependency rather than sanitizing a path that was never live.
8. ~~No lint/typecheck/test scripts, no CI.~~ Added `lint`/`typecheck`/`test` scripts (ESLint flat config, Vitest), a starter test suite for `lib/validate.ts` and `lib/experience-dates.ts`, and `.github/workflows/v2-ci.yml` running all four plus `build` on PRs/pushes touching `apps/v2` or `packages/content`.

### Open

9. Migration bookkeeping in `lib/db.ts` isn't atomic and swallows real failures in a broad try/catch; runs on every cold start (`instrumentation.ts`).
10. Media upload admin page is a stub (`app/admin/media/page.tsx` — `// TODO: wire to upload API once storage is configured`).

### Nice to have

- Unpaginated admin list queries (`getPosts/getProjects/getExperiences` in `lib/db.ts`) — fine at current content scale.
- `console.log`/`console.error`-only error handling in a couple of spots (`lib/db.ts`, `app/api/views/route.ts`).
- Non-null `TURSO_DATABASE_URL!` assertion (`lib/db.ts:5`) throws a raw libsql error at import time if the env var is missing, instead of a friendly message.
- Next.js 16 deprecates the `middleware.ts` convention in favor of `proxy.ts` (build-time warning only, not urgent).
