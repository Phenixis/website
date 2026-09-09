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

### Blockers

1. **Admin GET APIs are unauthenticated.** `middleware.ts:24-38` only gates `POST/PUT/DELETE/PATCH`. `GET /api/posts|projects|experiences|settings` require no auth, and the underlying `getPosts()/getProjects()/getExperiences()` (`lib/db.ts`) return every row including drafts; `/api/settings` returns the profile record. All publicly fetchable by anyone.
2. **Session cookie is the raw `ADMIN_SECRET`, not a token.** `app/api/auth/login/route.ts:12` sets the `admin-session` cookie to the literal secret value; `middleware.ts:6-9` compares the cookie directly against `process.env.ADMIN_SECRET`. No session/JWT layer, no revocation, no rotation — any cookie leak permanently compromises the one shared admin credential.
3. **No rate limiting or lockout on login.** `app/api/auth/login/route.ts:7` is a plain `!==` compare, unlimited attempts, no throttling — brute-forceable, and worse since the "session" IS the password.
4. **No request-body validation on admin mutation routes.** `app/api/posts|projects|experiences|settings` `POST`/`PUT` handlers pass `req.json()` straight into the DB layer with no schema check and no try/catch — a malformed payload becomes an unhandled 500 instead of a clean 400.

### Should fix before launch

5. No `error.tsx`/`not-found.tsx` — explicitly deferred per `IMPLEMENTATION_PLAN.md:710`.
6. No SEO/observability surface — unlike v1 (`robots.ts`, `sitemap.ts`, OG route, RSS), v2 has none of these.
7. MDX content renders with no sanitization (`components/mdx.tsx`) — combined with #2/#3, a compromised admin session becomes stored XSS against every visitor.
8. No lint/typecheck/test scripts, no CI workflow for v2.
9. Migration bookkeeping in `lib/db.ts` isn't atomic and swallows real failures in a broad try/catch; runs on every cold start (`instrumentation.ts`).
10. Media upload admin page is a stub (`app/admin/media/page.tsx` — `// TODO: wire to upload API once storage is configured`).

### Nice to have

- Unpaginated admin list queries (`getPosts/getProjects/getExperiences` in `lib/db.ts`) — fine at current content scale.
- `console.log`/`console.error`-only error handling in a few spots (`lib/db.ts`, `app/api/views/route.ts`).
- Non-null `TURSO_DATABASE_URL!` assertion (`lib/db.ts:5`) throws a raw libsql error at import time if the env var is missing, instead of a friendly message.

**Priority fix order:** #1 and #2 first (unauthenticated data leak + non-revocable shared-secret session), then #3/#4.
