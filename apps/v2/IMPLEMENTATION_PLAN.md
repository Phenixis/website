# Implementation Plan — Portfolio v2 (Next.js)

> Generated 2026-05-17. Covers everything needed to go from the current working prototype to a fully production-ready site.

---

## Table of Contents

1. [Current state](#1-current-state)
2. [File map](#2-file-map)
3. [Phase 1 — Bug fixes](#3-phase-1--bug-fixes)
4. [Phase 2 — URL routing](#4-phase-2--url-routing)
5. [Phase 3 — Persistence](#5-phase-3--persistence)
6. [Phase 4 — Auth](#6-phase-4--auth)
7. [Phase 5 — Missing admin pages](#7-phase-5--missing-admin-pages)
8. [Intentionally out of scope](#8-intentionally-out-of-scope)
9. [Design tokens reference](#9-design-tokens-reference)
10. [Data schema reference](#10-data-schema-reference)

---

## 1. Current state

Both surfaces are fully built and visually correct. Everything is pixel-perfect against the design handoff at `Websitev2/design_handoff_portfolio_and_admin/`.

**What works:**
- Portfolio: three-pane layout, rail/focus transitions, all responsive breakpoints (1100 / 920 / 720 / 480px), projects grid + detail with hero, writing list + article detail with drop-cap, timeline/itinerary
- Admin: shell (grid topbar + sidebar + main), hamburger drawer on mobile, dashboard (stat tiles + activity + drafts panels), projects / posts / experiences CRUD tables + edit forms, all form primitives (TextInput, Textarea, Select, Segmented, Chips, Swatches, LinkList, Paragraphs, Badge, Btn, FormBar)
- Fonts: JetBrains Mono + Fraunces loaded via `next/font/google`, exposed as CSS variables `--font-jetbrains-mono` and `--font-fraunces`

**What does not work (yet):**
- 3 bugs (Phase 1)
- No URL routing — everything is in-memory state only (Phase 2)
- No persistence — changes disappear on refresh (Phase 3)
- No auth on `/admin` (Phase 4)
- 5 admin placeholder pages not designed or built (Phase 5)

---

## 2. File map

```
apps/v2/
├── app/
│   ├── layout.tsx                  Root layout — loads fonts, sets HTML class
│   ├── globals.css                 Base reset + Tailwind import (for MDX pages)
│   ├── page.tsx                    Portfolio entry — server component, passes data to client
│   ├── portfolio.css               ~700 lines — all portfolio CSS (.v3-* classes)
│   ├── data.ts                     TypeScript types + placeholder data (source of truth for schema)
│   ├── _components/
│   │   └── Portfolio.tsx           Client component — all portfolio sub-components
│   └── admin/
│       ├── layout.tsx              Admin layout — imports admin.css
│       ├── page.tsx                Admin entry — renders <AdminApp />
│       ├── admin.css               ~600 lines — all admin CSS (.a-* classes)
│       └── _components/
│           └── AdminApp.tsx        Full admin SPA — shell + all pages + all form primitives
├── Websitev2/
│   └── design_handoff_portfolio_and_admin/
│       ├── README.md               Design spec (authoritative)
│       ├── portfolio-v3.jsx        Portfolio prototype (reference)
│       ├── admin-shell.jsx         Admin shell prototype
│       ├── admin-dashboard.jsx     Dashboard prototype
│       ├── admin-projects.jsx      Projects CRUD prototype
│       ├── admin-posts.jsx         Posts CRUD prototype
│       ├── admin-experiences.jsx   Experiences CRUD prototype
│       ├── admin-fields.jsx        Form primitives prototype
│       ├── admin-styles.css        Admin CSS source
│       └── data.jsx                Placeholder data (matches data.ts)
└── IMPLEMENTATION_PLAN.md          This file
```

---

## 3. Phase 1 — Bug fixes

Three bugs that can be fixed in under an hour with no design decisions required.

---

### Bug 1 — Content fade animation never re-triggers

**File:** `app/_components/Portfolio.tsx`

**Problem:** The fade-in animation (`v3-fade`, 480ms, translateX 12px → 0) is supposed to fire every time the content inside a pane changes — going from list to detail and back. The fix attempts to use a `key` to force a re-mount:

```tsx
// Portfolio.tsx line 125
const key = `${pane.id}/${selectedPost?.id ?? selectedProject?.id ?? "list"}`;

return (
  <div className={contentClass} key={key}>   // ← key here does NOTHING
```

React only uses `key` for reconciliation when the **parent** sets it on a child component or element. A `key` on the root element returned *by* a component has no reconciliation effect — it's just a plain HTML attribute. The animation therefore never re-fires after the first render.

**Fix:** Remove `key` from inside `PaneFocused` and set it on the `<PaneFocused>` call in the parent:

```tsx
// In Portfolio.tsx — the panes.map() block (around line 56)
{isFocused ? (
  <PaneFocused
    key={`${p.id}/${selectedPostId ?? selectedProjectId ?? "list"}`}  // ← ADD key HERE
    pane={p}
    projects={projects}
    posts={posts}
    experiences={experiences}
    profile={profile}
    selectedPostId={selectedPostId}
    onSelectPost={setSelectedPostId}
    selectedProjectId={selectedProjectId}
    onSelectProject={setSelectedProjectId}
  />
) : (
  <PaneRail pane={p} />
)}
```

Then remove the `key` variable and `key={key}` from inside `PaneFocused`'s return (lines 125–128):

```tsx
// DELETE these two lines inside PaneFocused:
const key = `${pane.id}/${selectedPost?.id ?? selectedProject?.id ?? "list"}`;
// and remove key={key} from the <div> below
return (
  <div className={contentClass}>   // ← key removed
```

---

### Bug 2 — "New" buttons are inert

**File:** `app/admin/_components/AdminApp.tsx`

**Problem:** The `+ New project`, `+ New post`, and `+ New entry` primary buttons have no `onClick`. Clicking them does nothing.

**Locations:**
- ProjectsList, line ~335: `<Btn variant="primary">+ New project <span className="a-btn-kbd">⌘N</span></Btn>`
- PostsList, line ~553: `<Btn variant="primary">+ New post <span className="a-btn-kbd">⌘N</span></Btn>`
- ExperiencesList, line ~705: `<Btn variant="primary">+ New entry <span className="a-btn-kbd">⌘N</span></Btn>`

**Fix pattern** (same for all three, shown for projects):

```tsx
// In ProjectsList, add onNew prop:
function ProjectsList({
  items,
  setRoute,
  onNew,   // ← ADD
}: {
  items: Project[];
  setRoute: (r: Route) => void;
  onNew: () => void;   // ← ADD
}) {
  // ...
  // Pass it to the button:
  <Btn variant="primary" onClick={onNew}>
    + New project <span className="a-btn-kbd">⌘N</span>
  </Btn>
}

// In ProjectsPage, create the blank item and navigate:
function ProjectsPage({ route, setRoute, items, setItems }) {
  const handleNew = () => {
    const blank: Project = {
      id: `project-${Date.now()}`,
      title: "Untitled project",
      year: String(new Date().getFullYear()),
      kind: "App",
      status: "paused",
      blurb: "",
      body: [""],
      stack: [],
      color: "#a78bfa",
    };
    setItems([...items, blank]);
    setRoute({ page: "projects", mode: "edit", id: blank.id });
  };

  if (route.mode === "edit" && route.id) { /* ... existing edit logic */ }
  return <ProjectsList items={items} setRoute={setRoute} onNew={handleNew} />;
}
```

Repeat for `PostsPage` / `PostsList` and `ExperiencesPage` / `ExperiencesList` with the appropriate blank shapes:

```ts
// Blank post
const blank: Post = {
  id: `post-${Date.now()}`,
  title: "Untitled post",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  readTime: "",
  tags: [],
  excerpt: "",
  body: [""],
};

// Blank experience
const blank: Experience = {
  id: `exp-${Date.now()}`,
  when: `${new Date().getFullYear()} →`,
  role: "Untitled role",
  where: "",
  kind: "role",
  blurb: "",
  stack: [],
};
```

---

### Bug 3 — Delete does not delete

**File:** `app/admin/_components/AdminApp.tsx`

**Problem:** In all three edit components, `<FormBar onDelete={onBack} />` is wired to `onBack`, which just navigates back. The item is never removed.

**Locations:**
- `ProjectEdit` line ~459: `<FormBar onSave={() => onSave(p)} onDiscard={onBack} onDelete={onBack} />`
- `PostEdit` line ~638: same pattern
- `ExperienceEdit` line ~788: same pattern

**Fix:** Pass a real `onDelete` down the chain. In each `*Page` component:

```tsx
// In ProjectsPage (around line 298):
function ProjectsPage({ route, setRoute, items, setItems }) {
  if (route.mode === "edit" && route.id) {
    const project = items.find((p) => p.id === route.id);
    if (!project) return null;
    return (
      <ProjectEdit
        project={project}
        onBack={() => setRoute({ page: "projects", mode: "list" })}
        onSave={(updated) => {
          setItems(items.map((p) => (p.id === updated.id ? updated : p)));
          setRoute({ page: "projects", mode: "list" });
        }}
        onDelete={() => {                              // ← ADD
          setItems(items.filter((p) => p.id !== route.id));
          setRoute({ page: "projects", mode: "list" });
        }}
      />
    );
  }
  // ...
}

// Update ProjectEdit to accept and forward onDelete:
function ProjectEdit({ project, onBack, onSave, onDelete }) {
  // ...
  <FormBar onSave={() => onSave(p)} onDiscard={onBack} onDelete={onDelete} />
}
```

Optionally add a `window.confirm("Delete this project?")` guard before calling `onDelete`.

---

## 4. Phase 2 — URL routing

**Goal:** Make the browser URL the source of truth for both surfaces. Enables back/forward, deep links, and shareable URLs.

**Approach:** Use Next.js App Router dynamic segments. Keep the portfolio's three-pane *visual* layout — only the focused pane and open detail change based on the URL.

---

### 4a — Portfolio routing

**Target URL structure:**

| URL | State |
|---|---|
| `/` | Projects pane focused, list view |
| `/writing` | Writing pane focused, list view |
| `/itinerary` | Itinerary pane focused, list view |
| `/projects/[slug]` | Projects pane focused, project detail open |
| `/writing/[slug]` | Writing pane focused, post detail open |

**Implementation steps:**

1. **Create route files** (no JSX changes needed, just routing wiring):

```
app/
├── page.tsx                     → focused: "projects", detail: null
├── writing/
│   ├── page.tsx                 → focused: "blog", detail: null
│   └── [slug]/
│       └── page.tsx             → focused: "blog", detail: slug
├── itinerary/
│   └── page.tsx                 → focused: "experiences", detail: null
└── projects/
    └── [slug]/
        └── page.tsx             → focused: "projects", detail: slug
```

2. **Update `Portfolio.tsx`** — accept initial state as props from the server pages, and use `router.push` for navigation instead of `setState` alone:

```tsx
// Portfolio.tsx — add router
"use client";
import { useRouter } from "next/navigation";

export function Portfolio({ profile, projects, posts, experiences, initialFocus, initialProjectId, initialPostId }) {
  const router = useRouter();
  const [focused, setFocused] = useState(initialFocus ?? "projects");
  const [selectedPostId, setSelectedPostId] = useState(initialPostId ?? null);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId ?? null);

  const handleFocus = (id: string) => {
    if (id === "projects") router.push("/");
    if (id === "blog") router.push("/writing");
    if (id === "experiences") router.push("/itinerary");
    setFocused(id);
    setSelectedPostId(null);
    setSelectedProjectId(null);
  };

  const handleSelectPost = (id: string | null) => {
    if (id) router.push(`/writing/${id}`);
    else router.push("/writing");
    setSelectedPostId(id);
  };

  const handleSelectProject = (id: string | null) => {
    if (id) router.push(`/projects/${id}`);
    else router.push("/");
    setSelectedProjectId(id);
  };
  // ...
}
```

3. **Each server page** passes `initialFocus` and the relevant `initialProjectId` / `initialPostId`:

```tsx
// app/writing/[slug]/page.tsx
import { Portfolio } from "../../_components/Portfolio";
import { PROFILE, PROJECTS, POSTS, EXPERIENCES } from "../../data";

export default function PostPage({ params }: { params: { slug: string } }) {
  return (
    <Portfolio
      profile={PROFILE}
      projects={PROJECTS}
      posts={POSTS}
      experiences={EXPERIENCES}
      initialFocus="blog"
      initialPostId={params.slug}
    />
  );
}

// Generate static params for SSG:
export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.id }));
}
```

4. **SEO** — Add `generateMetadata` to each detail page:

```tsx
// app/writing/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.id === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Maxime Duhamel`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}
```

---

### 4b — Admin routing

**Target URL structure:**

| URL | Route state |
|---|---|
| `/admin` | Dashboard |
| `/admin/projects` | Projects list |
| `/admin/projects/[id]` | Project edit |
| `/admin/posts` | Posts list |
| `/admin/posts/[id]` | Post edit |
| `/admin/experiences` | Experiences list |
| `/admin/experiences/[id]` | Experience edit |
| `/admin/media` | Placeholder |
| `/admin/tags` | Placeholder |
| `/admin/drafts` | Placeholder |
| `/admin/archive` | Placeholder |
| `/admin/settings` | Placeholder |

**Implementation steps:**

1. **Split `AdminApp.tsx`** into individual Next.js pages under `app/admin/`:

```
app/admin/
├── layout.tsx                   Shell (topbar + sidebar, wraps all admin pages)
├── page.tsx                     Dashboard
├── projects/
│   ├── page.tsx                 Projects list
│   └── [id]/
│       └── page.tsx             Project edit
├── posts/
│   ├── page.tsx                 Posts list
│   └── [id]/
│       └── page.tsx             Post edit
├── experiences/
│   ├── page.tsx                 Experiences list
│   └── [id]/
│       └── page.tsx             Experience edit
├── media/page.tsx
├── tags/page.tsx
├── drafts/page.tsx
├── archive/page.tsx
└── settings/page.tsx
```

2. **Move the shell** (`a-shell`, topbar, sidebar) to `app/admin/layout.tsx`. The sidebar nav uses `usePathname()` to compute `is-active`:

```tsx
// app/admin/layout.tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  // sidebar items use pathname.startsWith("/admin/projects") for active state
  // ...
}
```

3. **Replace `setRoute(...)` calls with `router.push(...)`** throughout. The `Route` discriminated union type can be deleted once routing is URL-based.

4. **Data fetching** — once persistence is added (Phase 3), each page fetches its own data. Until then, import from `data.ts` directly.

---

## 5. Phase 3 — Persistence

**Goal:** Admin edits survive a page refresh. The portfolio reads from the same data source.

**Recommended stack:** Supabase (Postgres + REST + realtime) or PlanetScale (MySQL) + Drizzle ORM. If you want zero external services, SQLite via Turso or a local file via the `fs` module works for a single-author site.

---

### 5a — Schema

The TypeScript types in `app/data.ts` define the contract. SQL tables:

```sql
-- projects
CREATE TABLE projects (
  id         TEXT PRIMARY KEY,          -- slug, e.g. "cartograph"
  title      TEXT NOT NULL,
  year       TEXT NOT NULL,             -- free-form, e.g. "2025 →"
  kind       TEXT NOT NULL,             -- "App" | "Tool" | "Writing" | "Music" | "Library" | "Other"
  status     TEXT NOT NULL,             -- "shipping" | "paused" | "archived"
  blurb      TEXT NOT NULL,
  body       TEXT NOT NULL,             -- JSON array of strings (paragraphs)
  stack      TEXT NOT NULL,             -- JSON array of strings
  color      TEXT NOT NULL,             -- hex from 12-swatch palette
  role       TEXT,
  links      TEXT,                      -- JSON array of {label, href}
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- posts
CREATE TABLE posts (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  date       TEXT NOT NULL,             -- display string "Apr 02, 2026"
  read_time  TEXT NOT NULL,
  tags       TEXT NOT NULL,             -- JSON array of strings
  excerpt    TEXT NOT NULL,
  body       TEXT NOT NULL,             -- JSON array of strings
  published  BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- experiences
CREATE TABLE experiences (
  id         TEXT PRIMARY KEY,
  "when"     TEXT NOT NULL,             -- "2024 — 2025" or "2026 →"
  role       TEXT NOT NULL,
  "where"    TEXT NOT NULL,
  kind       TEXT NOT NULL,             -- "self" | "role" | "edu"
  blurb      TEXT NOT NULL,
  stack      TEXT NOT NULL,             -- JSON array of strings
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

### 5b — API routes

Add under `app/api/`:

```
app/api/
├── projects/
│   ├── route.ts        GET (list), POST (create)
│   └── [id]/
│       └── route.ts    GET (single), PUT (update), DELETE
├── posts/
│   ├── route.ts
│   └── [id]/route.ts
└── experiences/
    ├── route.ts
    └── [id]/route.ts
```

**Pattern** (same for all three resources):

```ts
// app/api/projects/route.ts
import { db } from "@/lib/db";

export async function GET() {
  const rows = await db.query.projects.findMany({ orderBy: (p, { asc }) => [asc(p.sort_order)] });
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const project = await db.insert(projects).values(body).returning().get();
  return Response.json(project, { status: 201 });
}

// app/api/projects/[id]/route.ts
export async function PUT(req: Request, { params }) {
  const body = await req.json();
  const updated = await db.update(projects).set({ ...body, updated_at: new Date() })
    .where(eq(projects.id, params.id)).returning().get();
  return Response.json(updated);
}

export async function DELETE(_req: Request, { params }) {
  await db.delete(projects).where(eq(projects.id, params.id));
  return new Response(null, { status: 204 });
}
```

---

### 5c — Admin form changes

Replace ephemeral local state mutations with API calls. Pattern for ProjectEdit:

```tsx
// In ProjectEdit (or the page-level component after routing split):
const [saving, setSaving] = useState(false);
const [savedAt, setSavedAt] = useState<Date | null>(null);

const save = async (updated: Project) => {
  setSaving(true);
  await fetch(`/api/projects/${updated.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  setSaving(false);
  setSavedAt(new Date());
  // Stay in editor — do NOT call onBack()
};

// Pass savedAt to FormBar so it shows "Saved 2 min ago" with real time:
<FormBar onSave={() => save(p)} onDiscard={onBack} onDelete={handleDelete} savedAt={savedAt} saving={saving} />
```

Update `FormBar` to accept and display `savedAt`:

```tsx
function FormBar({ onSave, onDiscard, onDelete, savedAt, saving }) {
  const label = saving
    ? "Saving…"
    : savedAt
    ? `Saved ${timeAgo(savedAt)}`      // simple "2 min ago" formatter
    : "Unsaved changes";
  // ...
}
```

---

### 5d — Autosave

In each edit component, add a debounced autosave on every state change:

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    save(p);
  }, 30_000); // 30s debounce
  return () => clearTimeout(timer);
}, [p]);
```

---

### 5e — Portfolio data fetching

Replace static imports in `app/page.tsx` (and the other portfolio server pages) with fetch calls:

```tsx
// app/page.tsx
import { Portfolio } from "./_components/Portfolio";
import { PROFILE } from "./data"; // PROFILE stays static for now

export default async function Home() {
  const [projects, posts, experiences] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/projects`).then(r => r.json()),
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts`).then(r => r.json()),
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/experiences`).then(r => r.json()),
  ]);

  return (
    <Portfolio
      profile={PROFILE}
      projects={projects}
      posts={posts}
      experiences={experiences}
    />
  );
}
```

Add `revalidate` or use on-demand ISR to control caching:

```tsx
export const revalidate = 60; // rebuild portfolio data every 60s
```

---

## 6. Phase 4 — Auth

**Goal:** Gate `/admin` so only the site owner can access it.

**Recommended:** [Clerk](https://clerk.com) (simplest Next.js integration) or [NextAuth.js](https://next-auth.js.org) (self-hosted, more control).

**Minimum viable approach with Clerk:**

```tsx
// middleware.ts (at repo root or apps/v2 root)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isAdminRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/admin(.*)", "/(api|trpc)(.*)"],
};
```

Wrap the admin layout with Clerk's provider and sign-in redirect. The portfolio stays fully public.

**API route protection** — the API routes also need to be auth-gated in Phase 3. Add to each API route handler:

```ts
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  // ... rest of handler
}
```

---

## 7. Phase 5 — Missing admin pages

These pages currently show the `PlaceholderPage` component ("Not yet designed"). They need to be designed and built. The visual language is defined — only the content layout needs to be invented.

| Page | Route | Notes |
|---|---|---|
| **Media** | `/admin/media` | Image/file upload library. Grid of thumbnails. Upload button. Used by projects/posts for hero images. |
| **Tags** | `/admin/tags` | List of all tags used across posts. Merge, rename, delete. Counts of posts per tag. |
| **Drafts** | `/admin/drafts` | Posts with `published: false`. Same table UI as Writing list but filtered. Publish action per row. |
| **Archive** | `/admin/archive` | Projects with `status: "archived"`. Same table as Projects list but filtered. Restore action. |
| **Settings** | `/admin/settings` | Profile fields (name, handle, tagline, location), site metadata, domain settings. Form layout like an edit page. |

Each follows the same structural pattern: `PageHead + Toolbar + table (or form)`. Reuse all existing primitives.

---

## 8. Intentionally out of scope

These were **deliberately not designed** in the handoff. Don't implement them without a design pass first.

- **Light theme** — everything is dark-only
- **404 / loading / empty states** — no states designed for either surface
- **Admin search results** — the search bar in the admin topbar is currently decorative (`readOnly` input)
- **Mobile nav for portfolio beyond rail-tab** — the horizontal tab bar at 720px is the complete mobile nav design
- **Post `draft` status on the portfolio** — the public portfolio has no concept of drafts; the admin `published: false` flag gates content at the API/data layer only

---

## 9. Design tokens reference

Both surfaces share one palette. Portfolio uses `--v3-*` prefix; admin uses `--a-*` prefix. The values are identical.

### Backgrounds

| Token | Hex | Use |
|---|---|---|
| `--v3-bg` / `--a-bg` | `#0a0a0d` | Page background |
| `--a-bg-2` | `#0e0e14` | Topbar, sidebar, form sidebar |
| `--a-bg-3` | `#14141c` | Hovered surface, chips |
| `--a-bg-4` | `#1a1a24` | Deepest raised element |
| `--a-surface` | `#161620` | Cards |
| `--a-surface-2` | `#1c1c28` | Hovered cards |

### Borders

| Token | Hex | Use |
|---|---|---|
| `--a-border` | `#1f1f2c` | Default borders, table rows |
| `--a-border-strong` | `#2c2c3c` | Hovered borders, scrollbar thumb |
| `--a-border-focus` | `#4a4a68` | Focused input (non-accent) |

### Text

| Token | Hex | Use |
|---|---|---|
| `--a-text` | `#ededf3` | Primary |
| `--a-text-2` | `#b8b8c4` | Secondary body |
| `--a-text-mute` | `#6e6e80` | Muted meta, captions |
| `--a-text-dim` | `#45455a` | Dimmest, placeholders |

### Accent (purple)

| Token | Value | Use |
|---|---|---|
| `--a-accent` | `#b794f6` | Links, active states, drop-caps |
| `--a-accent-2` | `#d6bcfa` | Hover state of accent |
| `--a-accent-soft` | `rgba(183, 148, 246, 0.1)` | Active sidebar item background |
| `--a-accent-softer` | `rgba(183, 148, 246, 0.05)` | Very subtle hover fill |

### Semantic

| Token | Value | Use |
|---|---|---|
| `--a-green` | `#74e893` | Shipping, published, synced dot |
| `--a-green-soft` | `rgba(116, 232, 147, 0.1)` | Green badge background |
| `--a-amber` | `#f1c45b` | Paused, draft, edu kind |
| `--a-amber-soft` | `rgba(241, 196, 91, 0.1)` | Amber badge background |
| `--a-red` | `#f87171` | Danger / delete |
| `--a-red-soft` | `rgba(248, 113, 113, 0.1)` | Red badge background |

### Project accent swatches (12 colors)

```
#a78bfa  #7dd3fc  #fcd34d  #f472b6
#86efac  #fb923c  #c4b5fd  #fda4af
#34d399  #60a5fa  #fbbf24  #f87171
```

These are used in the `Swatches` form primitive and for each project's `color` field.

### Typography

| Font | Variable | Weights | Use |
|---|---|---|---|
| JetBrains Mono | `--font-jetbrains-mono` | 300/400/500/600/700 | UI, body, code-like meta |
| Fraunces | `--font-fraunces` | 300/400/500/600 (normal + italic) | Section titles, post titles, lede, drop-caps, Roman numerals |

Both loaded via `next/font/google` in `app/layout.tsx`. Do not import from Google Fonts directly — use the CSS variables `var(--font-jetbrains-mono)` and `var(--font-fraunces)` everywhere.

---

## 10. Data schema reference

These TypeScript types (defined in `app/data.ts`) are the contract between the admin, the API, and the portfolio.

```ts
export type Project = {
  id: string;             // slug, e.g. "cartograph"
  title: string;
  year: string;           // free-form, e.g. "2025 →"
  kind: string;           // "App" | "Tool" | "Writing" | "Music" | "Library" | "Other"
  status: "shipping" | "paused" | "archived";
  blurb: string;          // one-liner shown on card and as article lede
  body: string[];         // paragraphs (one string per block)
  stack: string[];        // tech / tool chips
  color: string;          // hex from 12-swatch palette above
  role?: string;          // e.g. "Solo · Design + Engineering"
  links?: { label: string; href: string }[];
};

export type Post = {
  id: string;             // slug, e.g. "slow-building"
  title: string;
  date: string;           // display string, e.g. "Apr 02, 2026"
  readTime: string;       // e.g. "8 min"
  tags: string[];
  excerpt: string;        // shown as lede in list + article
  body: string[];         // paragraphs
};

export type Experience = {
  id: string;
  when: string;           // "2024 — 2025" or "2026 →"
  role: string;
  where: string;
  kind: "self" | "role" | "edu";
  blurb: string;
  stack: string[];        // chips shown on the timeline row
};

export type Profile = {
  name: string;
  handle: string;
  tagline: string;
  location: string;
};
```

---

*End of plan. Start with Phase 1 — all three bugs can be fixed in a single session with no design input required. Phase 2 (routing) is the highest-leverage structural change and should be done before wiring up any real data.*
