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

All 10 items below are resolved as of this commit; only the "nice to have" list remains open. `tsc --noEmit`, `eslint`, `vitest run`, and `next build` are all clean.

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

### Fixed

9. ~~Migration bookkeeping isn't atomic and swallows real failures.~~ `runMigrations()` now applies each migration's DDL + bookkeeping insert inside a single transaction, and only tolerates the specific "already exists at schema level" error (e.g. a column added by hand before the `migrations` table existed) — anything else throws for real. It also no longer runs on every serverless cold start via `instrumentation.ts` (deleted); it's a deploy-time step now, run via `pnpm migrate` (`scripts/migrate.ts`), wired into `vercel.json`'s `buildCommand` (`pnpm run migrate && pnpm run build`). This removes the concurrent-cold-start race entirely rather than defending against it.

   **Requires action in Vercel:** `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` must be available at **build time**, not just runtime, in the Vercel project's environment variable settings, since the build command now runs a migration before `next build`. Locally, run `pnpm migrate` after pulling any commit that adds a new migration — it's no longer automatic on `pnpm dev`.

10. ~~Media upload admin page is a stub.~~ Wired up to Vercel Blob: `/admin/media` now lists, uploads, and deletes real files. Uploads go client → Blob directly (not proxied through the Next.js server) via `@vercel/blob/client`'s `upload()`, authorized by a short-lived token from `app/api/media/upload/route.ts` (`handleUpload`, admin-only per `middleware.ts`, capped at 10 MB, image types only). `app/api/media/route.ts` lists (`GET`) and deletes (`DELETE`) via the server SDK. No local media table — Vercel Blob's own storage is the source of truth for the list. Requires `BLOB_READ_WRITE_TOKEN` (already configured in Vercel Production/Preview per the store setup); added to local `.env.local` for `pnpm dev`.

### Nice to have

- ~~Unpaginated admin list queries.~~ `getProjects/getPublishedProjects/getPosts/getPublishedPosts/getExperiences/getPublishedExperiences` in `lib/db.ts` now cap at `LIST_LIMIT = 500`. Not real pagination (no UI for it, and content is nowhere near that scale) — just a bound on the worst case.
- `console.log`/`console.error`-only error handling in `app/api/views/route.ts` — left as-is. It already has proper try/catch and status codes; `console.error` lands in Vercel's Runtime Logs, which is proportionate for a low-traffic single-admin site. Revisit if real alerting (Sentry, a failure webhook, etc.) is ever wanted.
- ~~Non-null `TURSO_DATABASE_URL!` assertion.~~ `lib/db.ts` now throws a clear "Missing required environment variable" error instead of a bare non-null assertion, so a missing env var fails with an actionable message instead of a cryptic libsql `URL_INVALID` error.
- ~~Next.js 16 deprecates the `middleware.ts` convention in favor of `proxy.ts`.~~ Renamed `middleware.ts` → `proxy.ts` and the exported `middleware()` function → `proxy()` (Next 16 requires the export name to match the file name); no other behavior changed. Build warning is gone.
