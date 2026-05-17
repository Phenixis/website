"use client";

import { useState } from "react";
import { PROFILE, PROJECTS, POSTS, EXPERIENCES } from "../../data";
import type { Project, Post, Experience } from "../../data";

type Route =
  | { page: "dashboard" }
  | { page: "projects"; mode: "list" }
  | { page: "projects"; mode: "edit"; id: string }
  | { page: "posts"; mode: "list" }
  | { page: "posts"; mode: "edit"; id: string }
  | { page: "experiences"; mode: "list" }
  | { page: "experiences"; mode: "edit"; id: string }
  | { page: string; mode?: string };

const COLOR_OPTIONS = [
  "#a78bfa", "#7dd3fc", "#fcd34d", "#f472b6",
  "#86efac", "#fb923c", "#c4b5fd", "#fda4af",
  "#34d399", "#60a5fa", "#fbbf24", "#f87171",
];

export function AdminApp() {
  const [route, setRoute] = useState<Route>({ page: "dashboard" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);

  const goTo = (next: Route) => {
    setRoute(next);
    setSidebarOpen(false);
  };

  const nav = [
    {
      group: "Content",
      items: [
        { id: "dashboard", label: "Overview", icon: "✦" },
        { id: "projects", label: "Projects", icon: "I", count: projects.length },
        { id: "posts", label: "Writing", icon: "II", count: posts.length },
        { id: "experiences", label: "Itinerary", icon: "III", count: experiences.length },
      ],
    },
    {
      group: "Library",
      items: [
        { id: "media", label: "Media", icon: "◇", count: 24 },
        { id: "tags", label: "Tags", icon: "#", count: 14 },
      ],
    },
    {
      group: "Workspace",
      items: [
        { id: "drafts", label: "Drafts", icon: "•", count: 2 },
        { id: "archive", label: "Archive", icon: "⌗", count: 4 },
        { id: "settings", label: "Settings", icon: "⚙" },
      ],
    },
  ];

  return (
    <div className={`a-shell ${sidebarOpen ? "is-sidebar-open" : ""}`}>
      {/* Top bar */}
      <header className="a-topbar">
        <button
          className="a-hamburger"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={sidebarOpen}
        >
          <span className="a-hamburger-line" />
          <span className="a-hamburger-line" />
          <span className="a-hamburger-line" />
        </button>
        <div className="a-topbar-left">
          <span className="a-topbar-logo">✦</span>
          <div className="a-topbar-brand">
            <span className="a-topbar-name">{PROFILE.name}</span>
            <span className="a-topbar-pill">Back-office</span>
          </div>
        </div>
        <div className="a-topbar-center">
          <input
            className="a-topbar-search"
            placeholder="Search projects, posts, experiences…"
            readOnly
          />
        </div>
        <div className="a-topbar-right">
          <span className="a-topbar-status">
            <span className="a-topbar-status-dot" />
            <span className="a-topbar-status-label">All synced</span>
          </span>
          <a className="a-topbar-link" href="/">
            <span>↗</span>
            <span className="a-topbar-link-label"> View site</span>
          </a>
          <div className="a-topbar-avatar" title={PROFILE.name}>M</div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="a-sidebar">
        {nav.map((group) => (
          <div key={group.group} className="a-side-group">
            <div className="a-side-heading">{group.group}</div>
            {group.items.map((it) => (
              <button
                key={it.id}
                className={`a-side-item ${route.page === it.id ? "is-active" : ""}`}
                onClick={() =>
                  goTo(it.id === "dashboard"
                    ? { page: "dashboard" }
                    : { page: it.id, mode: "list" } as Route)
                }
              >
                <span className="a-side-icon">{it.icon}</span>
                <span className="a-side-label">{it.label}</span>
                {it.count != null && (
                  <span className="a-side-count">{String(it.count).padStart(2, "0")}</span>
                )}
              </button>
            ))}
          </div>
        ))}
        <div className="a-side-spacer" />
        <div className="a-side-footer">v2.0 · Saint-Brieuc</div>
      </aside>

      {/* Scrim */}
      <div className="a-scrim" onClick={() => setSidebarOpen(false)} />

      {/* Main */}
      <main className="a-main">
        {route.page === "dashboard" && (
          <Dashboard projects={projects} posts={posts} experiences={experiences} setRoute={setRoute} />
        )}
        {route.page === "projects" && (
          <ProjectsPage
            route={route as { page: "projects"; mode: string; id?: string }}
            setRoute={setRoute}
            items={projects}
            setItems={setProjects}
          />
        )}
        {route.page === "posts" && (
          <PostsPage
            route={route as { page: "posts"; mode: string; id?: string }}
            setRoute={setRoute}
            items={posts}
            setItems={setPosts}
          />
        )}
        {route.page === "experiences" && (
          <ExperiencesPage
            route={route as { page: "experiences"; mode: string; id?: string }}
            setRoute={setRoute}
            items={experiences}
            setItems={setExperiences}
          />
        )}
        {!["dashboard", "projects", "posts", "experiences"].includes(route.page) && (
          <PlaceholderPage title={route.page} />
        )}
      </main>
    </div>
  );
}

/* ── DASHBOARD ────────────────────────────────────────── */
function Dashboard({
  projects,
  posts,
  experiences,
  setRoute,
}: {
  projects: Project[];
  posts: Post[];
  experiences: Experience[];
  setRoute: (r: Route) => void;
}) {
  const activity = [
    { when: "12m ago", text: "Cartograph body updated", type: "Projects", icon: "C" },
    { when: "2h ago", text: "Published On building slowly", type: "Writing", icon: "O" },
    { when: "yesterday", text: "Independent details edited", type: "Itinerary", icon: "I" },
    { when: "2d ago", text: "New draft Notes on the bay of Saint-Brieuc", type: "Writing", icon: "N" },
    { when: "4d ago", text: "Inkwell stack updated · added Pandoc", type: "Projects", icon: "I" },
    { when: "1w ago", text: "Archived Compass", type: "Projects", icon: "C" },
  ];

  const drafts = [
    { id: "bay", title: "Notes on the bay of Saint-Brieuc", kind: "Writing", words: 420, edited: "2d" },
    { id: "atelier", title: "On running an atelier (year one)", kind: "Writing", words: 1840, edited: "5d" },
  ];

  const shipping = projects.filter((p) => p.status === "shipping").length;
  const paused = projects.filter((p) => p.status === "paused").length;
  const archived = projects.filter((p) => p.status === "archived").length;

  return (
    <div className="a-page-body">
      <div className="a-dash">
        <div className="a-dash-hello">
          <h2>
            Good evening, <span className="a-dash-hello-accent">Maxime.</span>
          </h2>
          <p>It's quiet. Three drafts open, one project edited today.</p>
        </div>

        <div className="a-dash-grid">
          <button className="a-stat" onClick={() => setRoute({ page: "projects", mode: "list" })}>
            <div className="a-stat-num">{String(projects.length).padStart(2, "0")}</div>
            <div className="a-stat-label">Projects</div>
            <div className="a-stat-meta">
              <span className="a-stat-meta-pill" style={{ color: "var(--a-green)" }}>● {shipping} shipping</span>
              <span className="a-stat-meta-pill">{paused} paused</span>
              <span className="a-stat-meta-pill">{archived} archived</span>
            </div>
            <span className="a-stat-arrow">↗</span>
          </button>
          <button className="a-stat" onClick={() => setRoute({ page: "posts", mode: "list" })}>
            <div className="a-stat-num">{String(posts.length).padStart(2, "0")}</div>
            <div className="a-stat-label">Writing</div>
            <div className="a-stat-meta">
              <span className="a-stat-meta-pill" style={{ color: "var(--a-green)" }}>● {posts.length} published</span>
              <span className="a-stat-meta-pill" style={{ color: "var(--a-amber)" }}>● 2 drafts</span>
            </div>
            <span className="a-stat-arrow">↗</span>
          </button>
          <button className="a-stat" onClick={() => setRoute({ page: "experiences", mode: "list" })}>
            <div className="a-stat-num">{String(experiences.length).padStart(2, "0")}</div>
            <div className="a-stat-label">Itinerary</div>
            <div className="a-stat-meta">
              <span className="a-stat-meta-pill">1 current</span>
              <span className="a-stat-meta-pill">4 roles</span>
              <span className="a-stat-meta-pill">1 school</span>
            </div>
            <span className="a-stat-arrow">↗</span>
          </button>
        </div>

        <div className="a-dash-cols">
          <div className="a-panel">
            <div className="a-panel-head">
              <span className="a-panel-title">Recent activity</span>
              <span className="a-panel-spacer" />
              <span className="a-panel-meta">{activity.length} events</span>
            </div>
            <div className="a-panel-body">
              {activity.map((a, i) => (
                <div key={i} className="a-activity-row">
                  <span className="a-activity-when">{a.when}</span>
                  <div className="a-activity-icon">{a.icon}</div>
                  <span className="a-activity-text">{a.text}</span>
                  <span className="a-activity-kind">{a.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="a-panel">
            <div className="a-panel-head">
              <span className="a-panel-title">Drafts</span>
              <span className="a-panel-spacer" />
              <span className="a-panel-meta">{drafts.length} open</span>
            </div>
            <div className="a-panel-body">
              {drafts.map((d) => (
                <div key={d.id} className="a-draft-row">
                  <div>
                    <div className="a-draft-title">{d.title}</div>
                    <div className="a-draft-meta">{d.kind} · {d.words} words · {d.edited} ago</div>
                  </div>
                  <Badge kind="draft">draft</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PROJECTS ─────────────────────────────────────────── */
function ProjectsPage({
  route,
  setRoute,
  items,
  setItems,
}: {
  route: { mode: string; id?: string };
  setRoute: (r: Route) => void;
  items: Project[];
  setItems: (p: Project[]) => void;
}) {
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
        onDelete={() => {
          if (!window.confirm("Delete this project?")) return;
          setItems(items.filter((p) => p.id !== route.id));
          setRoute({ page: "projects", mode: "list" });
        }}
      />
    );
  }
  return <ProjectsList items={items} setRoute={setRoute} onNew={handleNew} />;
}

function ProjectsList({
  items,
  setRoute,
  onNew,
}: {
  items: Project[];
  setRoute: (r: Route) => void;
  onNew: () => void;
}) {
  const counts = {
    shipping: items.filter((p) => p.status === "shipping").length,
    paused: items.filter((p) => p.status === "paused").length,
    archived: items.filter((p) => p.status === "archived").length,
  };
  const updated = ["12m", "2h", "yesterday", "2d", "4d", "1w", "3w", "1mo"];

  return (
    <>
      <PageHead
        title="Projects"
        sub="What I made — apps, tools, libraries, the occasional experiment."
        actions={
          <>
            <Btn variant="ghost" size="sm">Export</Btn>
            <Btn variant="primary" onClick={onNew}>+ New project <span className="a-btn-kbd">⌘N</span></Btn>
          </>
        }
      />
      <Toolbar>
        <Btn size="sm">All <span className="a-btn-kbd">{items.length}</span></Btn>
        <Btn size="sm" variant="ghost">Shipping <span className="a-btn-kbd">{counts.shipping}</span></Btn>
        <Btn size="sm" variant="ghost">Paused <span className="a-btn-kbd">{counts.paused}</span></Btn>
        <Btn size="sm" variant="ghost">Archived <span className="a-btn-kbd">{counts.archived}</span></Btn>
        <span className="a-toolbar-spacer" />
        <Btn size="sm" variant="ghost">Sort: Recent ↓</Btn>
        <Btn size="sm" variant="ghost">Columns ⌃</Btn>
      </Toolbar>
      <div className="a-page-body">
        <table className="a-table">
          <thead>
            <tr>
              <th className="a-th-num">#</th>
              <th>Title</th>
              <th className="a-col--md">Year</th>
              <th className="a-col--md">Kind</th>
              <th>Status</th>
              <th className="a-col--lg">Stack</th>
              <th className="a-col--lg">Updated</th>
              <th className="a-th-actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr
                key={p.id}
                onClick={() => setRoute({ page: "projects", mode: "edit", id: p.id })}
              >
                <td className="a-td-num">{String(i + 1).padStart(2, "0")}</td>
                <td className="a-td-title">
                  <div className="a-td-title-inner">
                    <span className="a-td-color-dot" style={{ background: p.color }} />
                    <span>
                      <span className="a-td-title-name">{p.title}</span>
                      <span className="a-td-title-sub">
                        {p.blurb.slice(0, 64)}{p.blurb.length > 64 ? "…" : ""}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="a-td-muted a-col--md">{p.year}</td>
                <td className="a-td-muted a-col--md">{p.kind}</td>
                <td><Badge kind={p.status}>{p.status}</Badge></td>
                <td className="a-col--lg">
                  <div className="a-td-chip-row">
                    {p.stack.slice(0, 3).map((s) => (
                      <span key={s} className="a-td-chip">{s}</span>
                    ))}
                    {p.stack.length > 3 && (
                      <span className="a-td-chip" style={{ color: "var(--a-text-dim)" }}>
                        +{p.stack.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="a-td-muted a-col--lg">{updated[i] ?? "—"} ago</td>
                <td className="a-td-actions"><span className="a-row-arrow">→</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ProjectEdit({
  project,
  onBack,
  onSave,
  onDelete,
}: {
  project: Project;
  onBack: () => void;
  onSave: (p: Project) => void;
  onDelete: () => void;
}) {
  const [p, setP] = useState<Project>({ ...project });
  const update = (key: keyof Project, val: unknown) =>
    setP((prev) => ({ ...prev, [key]: val }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <PageHead
        crumbs={[
          { label: "Projects", onClick: onBack },
          { label: p.title },
        ]}
        title={
          <input
            className="a-input a-input--title"
            value={p.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Project title"
          />
        }
      />
      <div className="a-form">
        <div className="a-form-main">
          <FormSection title="Content">
            <Field label="Blurb" hint="One-liner shown on card and in meta">
              <Textarea
                value={p.blurb}
                onChange={(v) => update("blurb", v)}
                variant="lede"
                placeholder="Short description…"
              />
            </Field>
            <Field label="Body" hint="Full write-up · one paragraph per block">
              <Paragraphs value={p.body} onChange={(v) => update("body", v)} />
            </Field>
          </FormSection>
          <FormSection title="Links">
            <Field label="External links">
              <LinkList value={p.links ?? []} onChange={(v) => update("links", v)} />
            </Field>
          </FormSection>
          <FormBar
            onSave={() => onSave(p)}
            onDiscard={onBack}
            onDelete={onDelete}
          />
        </div>
        <div className="a-form-side">
          <div className="a-side-card">
            <div className="a-side-card-title">At a glance</div>
            <div className="a-side-card-row">
              <span className="a-side-card-key">ID</span>
              <span className="a-side-card-val">{p.id}</span>
            </div>
            <div className="a-side-card-row">
              <span className="a-side-card-key">Status</span>
              <span className="a-side-card-val"><Badge kind={p.status}>{p.status}</Badge></span>
            </div>
          </div>
          <FormSection title="Status & Kind">
            <Field label="Status">
              <Segmented
                value={p.status}
                onChange={(v) => update("status", v)}
                options={[
                  { value: "shipping", label: "Shipping", dot: "#74e893" },
                  { value: "paused", label: "Paused", dot: "#f1c45b" },
                  { value: "archived", label: "Archived", dot: "#6e6e80" },
                ]}
              />
            </Field>
            <Field label="Kind">
              <Select
                value={p.kind}
                onChange={(v) => update("kind", v)}
                options={["App", "Tool", "Writing", "Music", "Library", "Other"]}
              />
            </Field>
            <Field label="Year">
              <TextInput value={p.year} onChange={(v) => update("year", v)} placeholder="2025" />
            </Field>
          </FormSection>
          <FormSection title="People & Stack">
            <Field label="Role">
              <TextInput value={p.role ?? ""} onChange={(v) => update("role", v)} placeholder="Solo · Design + Engineering" />
            </Field>
            <Field label="Stack">
              <Chips value={p.stack} onChange={(v) => update("stack", v)} />
            </Field>
          </FormSection>
          <FormSection title="Appearance">
            <Field label="Accent color">
              <Swatches value={p.color} onChange={(v) => update("color", v)} options={COLOR_OPTIONS} />
            </Field>
          </FormSection>
        </div>
      </div>
    </div>
  );
}

/* ── POSTS ────────────────────────────────────────────── */
function PostsPage({
  route,
  setRoute,
  items,
  setItems,
}: {
  route: { mode: string; id?: string };
  setRoute: (r: Route) => void;
  items: Post[];
  setItems: (p: Post[]) => void;
}) {
  const handleNew = () => {
    const blank: Post = {
      id: `post-${Date.now()}`,
      title: "Untitled post",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      readTime: "",
      tags: [],
      excerpt: "",
      body: [""],
    };
    setItems([...items, blank]);
    setRoute({ page: "posts", mode: "edit", id: blank.id });
  };

  if (route.mode === "edit" && route.id) {
    const post = items.find((p) => p.id === route.id);
    if (!post) return null;
    return (
      <PostEdit
        post={post}
        onBack={() => setRoute({ page: "posts", mode: "list" })}
        onSave={(updated) => {
          setItems(items.map((p) => (p.id === updated.id ? updated : p)));
          setRoute({ page: "posts", mode: "list" });
        }}
        onDelete={() => {
          if (!window.confirm("Delete this post?")) return;
          setItems(items.filter((p) => p.id !== route.id));
          setRoute({ page: "posts", mode: "list" });
        }}
      />
    );
  }
  return <PostsList items={items} setRoute={setRoute} onNew={handleNew} />;
}

function PostsList({ items, setRoute, onNew }: { items: Post[]; setRoute: (r: Route) => void; onNew: () => void }) {
  return (
    <>
      <PageHead
        title="Writing"
        sub="Essays, notes, observations — things that needed to be written."
        actions={
          <Btn variant="primary" onClick={onNew}>+ New post <span className="a-btn-kbd">⌘N</span></Btn>
        }
      />
      <Toolbar>
        <Btn size="sm">All <span className="a-btn-kbd">{items.length}</span></Btn>
        <Btn size="sm" variant="ghost">Published <span className="a-btn-kbd">{items.length}</span></Btn>
        <span className="a-toolbar-spacer" />
        <Btn size="sm" variant="ghost">Sort: Recent ↓</Btn>
      </Toolbar>
      <div className="a-page-body">
        <table className="a-table">
          <thead>
            <tr>
              <th className="a-th-num">#</th>
              <th>Title</th>
              <th className="a-col--md">Date</th>
              <th className="a-col--lg">Tags</th>
              <th>Status</th>
              <th className="a-th-actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr key={p.id} onClick={() => setRoute({ page: "posts", mode: "edit", id: p.id })}>
                <td className="a-td-num">{String(i + 1).padStart(2, "0")}</td>
                <td className="a-td-title">
                  <span className="a-td-title-name">{p.title}</span>
                  <span className="a-td-title-sub">{p.excerpt.slice(0, 72)}{p.excerpt.length > 72 ? "…" : ""}</span>
                </td>
                <td className="a-td-muted a-col--md">{p.date}</td>
                <td className="a-col--lg">
                  <div className="a-td-chip-row">
                    {p.tags.map((t) => <span key={t} className="a-td-chip">{t}</span>)}
                  </div>
                </td>
                <td><Badge kind="published">published</Badge></td>
                <td className="a-td-actions"><span className="a-row-arrow">→</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PostEdit({
  post,
  onBack,
  onSave,
  onDelete,
}: {
  post: Post;
  onBack: () => void;
  onSave: (p: Post) => void;
  onDelete: () => void;
}) {
  const [p, setP] = useState<Post>({ ...post });
  const update = (key: keyof Post, val: unknown) =>
    setP((prev) => ({ ...prev, [key]: val }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <PageHead
        crumbs={[
          { label: "Writing", onClick: onBack },
          { label: p.title },
        ]}
        title={
          <input
            className="a-input a-input--title"
            value={p.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Post title"
          />
        }
      />
      <div className="a-form">
        <div className="a-form-main">
          <FormSection title="Content">
            <Field label="Excerpt" hint="Lede shown in the list and as the article intro">
              <Textarea value={p.excerpt} onChange={(v) => update("excerpt", v)} variant="lede" placeholder="Opening line…" />
            </Field>
            <Field label="Body" hint="One paragraph per block">
              <Paragraphs value={p.body} onChange={(v) => update("body", v)} />
            </Field>
          </FormSection>
          <FormBar onSave={() => onSave(p)} onDiscard={onBack} onDelete={onDelete} />
        </div>
        <div className="a-form-side">
          <div className="a-side-card">
            <div className="a-side-card-title">At a glance</div>
            <div className="a-side-card-row">
              <span className="a-side-card-key">ID</span>
              <span className="a-side-card-val">{p.id}</span>
            </div>
            <div className="a-side-card-row">
              <span className="a-side-card-key">Date</span>
              <span className="a-side-card-val">{p.date}</span>
            </div>
          </div>
          <FormSection title="Meta">
            <Field label="Date">
              <TextInput value={p.date} onChange={(v) => update("date", v)} placeholder="Apr 02, 2026" />
            </Field>
            <Field label="Read time">
              <TextInput value={p.readTime} onChange={(v) => update("readTime", v)} placeholder="8 min" />
            </Field>
            <Field label="Tags">
              <Chips value={p.tags} onChange={(v) => update("tags", v)} />
            </Field>
          </FormSection>
        </div>
      </div>
    </div>
  );
}

/* ── EXPERIENCES ──────────────────────────────────────── */
function ExperiencesPage({
  route,
  setRoute,
  items,
  setItems,
}: {
  route: { mode: string; id?: string };
  setRoute: (r: Route) => void;
  items: Experience[];
  setItems: (e: Experience[]) => void;
}) {
  const handleNew = () => {
    const blank: Experience = {
      id: `exp-${Date.now()}`,
      when: `${new Date().getFullYear()} →`,
      role: "Untitled role",
      where: "",
      kind: "role",
      blurb: "",
      stack: [],
    };
    setItems([...items, blank]);
    setRoute({ page: "experiences", mode: "edit", id: blank.id });
  };

  if (route.mode === "edit" && route.id) {
    const exp = items.find((e) => e.id === route.id);
    if (!exp) return null;
    return (
      <ExperienceEdit
        experience={exp}
        onBack={() => setRoute({ page: "experiences", mode: "list" })}
        onSave={(updated) => {
          setItems(items.map((e) => (e.id === updated.id ? updated : e)));
          setRoute({ page: "experiences", mode: "list" });
        }}
        onDelete={() => {
          if (!window.confirm("Delete this entry?")) return;
          setItems(items.filter((e) => e.id !== route.id));
          setRoute({ page: "experiences", mode: "list" });
        }}
      />
    );
  }
  return <ExperiencesList items={items} setRoute={setRoute} onNew={handleNew} />;
}

function ExperiencesList({ items, setRoute, onNew }: { items: Experience[]; setRoute: (r: Route) => void; onNew: () => void }) {
  return (
    <>
      <PageHead
        title="Itinerary"
        sub="Where I went, what I did, who I worked with."
        actions={
          <Btn variant="primary" onClick={onNew}>+ New entry <span className="a-btn-kbd">⌘N</span></Btn>
        }
      />
      <Toolbar>
        <Btn size="sm">All <span className="a-btn-kbd">{items.length}</span></Btn>
        <Btn size="sm" variant="ghost">Self <span className="a-btn-kbd">{items.filter((e) => e.kind === "self").length}</span></Btn>
        <Btn size="sm" variant="ghost">Role <span className="a-btn-kbd">{items.filter((e) => e.kind === "role").length}</span></Btn>
        <Btn size="sm" variant="ghost">Edu <span className="a-btn-kbd">{items.filter((e) => e.kind === "edu").length}</span></Btn>
        <span className="a-toolbar-spacer" />
        <Btn size="sm" variant="ghost">Sort: Recent ↓</Btn>
      </Toolbar>
      <div className="a-page-body">
        <table className="a-table">
          <thead>
            <tr>
              <th className="a-th-num">#</th>
              <th>Role</th>
              <th className="a-col--md">Where</th>
              <th className="a-col--md">When</th>
              <th>Kind</th>
              <th className="a-th-actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((e, i) => (
              <tr key={e.id} onClick={() => setRoute({ page: "experiences", mode: "edit", id: e.id })}>
                <td className="a-td-num">{String(i + 1).padStart(2, "0")}</td>
                <td className="a-td-title">
                  <span className="a-td-title-name">{e.role}</span>
                  <span className="a-td-title-sub">{e.blurb.slice(0, 64)}{e.blurb.length > 64 ? "…" : ""}</span>
                </td>
                <td className="a-td-muted a-col--md">{e.where}</td>
                <td className="a-td-muted a-col--md">{e.when}</td>
                <td><Badge kind={e.kind}>{e.kind}</Badge></td>
                <td className="a-td-actions"><span className="a-row-arrow">→</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ExperienceEdit({
  experience,
  onBack,
  onSave,
  onDelete,
}: {
  experience: Experience;
  onBack: () => void;
  onSave: (e: Experience) => void;
  onDelete: () => void;
}) {
  const [e, setE] = useState<Experience>({ ...experience });
  const update = (key: keyof Experience, val: unknown) =>
    setE((prev) => ({ ...prev, [key]: val }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <PageHead
        crumbs={[
          { label: "Itinerary", onClick: onBack },
          { label: e.role },
        ]}
        title={
          <input
            className="a-input a-input--title"
            value={e.role}
            onChange={(ev) => update("role", ev.target.value)}
            placeholder="Role / title"
          />
        }
      />
      <div className="a-form">
        <div className="a-form-main">
          <FormSection title="Details">
            <Field label="Blurb" hint="One or two sentences">
              <Textarea value={e.blurb} onChange={(v) => update("blurb", v)} variant="lede" placeholder="What you did there…" />
            </Field>
            <Field label="Stack / Tags">
              <Chips value={e.stack} onChange={(v) => update("stack", v)} />
            </Field>
          </FormSection>
          <FormBar onSave={() => onSave(e)} onDiscard={onBack} onDelete={onDelete} />
        </div>
        <div className="a-form-side">
          <div className="a-side-card">
            <div className="a-side-card-title">At a glance</div>
            <div className="a-side-card-row">
              <span className="a-side-card-key">ID</span>
              <span className="a-side-card-val">{e.id}</span>
            </div>
            <div className="a-side-card-row">
              <span className="a-side-card-key">Kind</span>
              <span className="a-side-card-val"><Badge kind={e.kind}>{e.kind}</Badge></span>
            </div>
          </div>
          <FormSection title="Meta">
            <Field label="When">
              <TextInput value={e.when} onChange={(v) => update("when", v)} placeholder="2024 — 2025" />
            </Field>
            <Field label="Where">
              <TextInput value={e.where} onChange={(v) => update("where", v)} placeholder="Company / institution" />
            </Field>
            <Field label="Kind">
              <Segmented
                value={e.kind}
                onChange={(v) => update("kind", v)}
                options={[
                  { value: "self", label: "Self", dot: "#b794f6" },
                  { value: "role", label: "Role", dot: "#b8b8c4" },
                  { value: "edu", label: "Edu", dot: "#f1c45b" },
                ]}
              />
            </Field>
          </FormSection>
        </div>
      </div>
    </div>
  );
}

/* ── PLACEHOLDER ──────────────────────────────────────── */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flexDirection: "column",
        gap: 12,
        color: "var(--a-text-mute)",
        fontFamily: "var(--a-mono)",
      }}
    >
      <span style={{ fontSize: 36, fontFamily: "var(--a-serif)", fontStyle: "italic", fontWeight: 300, color: "var(--a-text-dim)" }}>
        {title}
      </span>
      <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Not yet designed
      </span>
    </div>
  );
}

/* ── SHARED UI PRIMITIVES ─────────────────────────────── */
function PageHead({
  title,
  sub,
  actions,
  crumbs,
}: {
  title: React.ReactNode;
  sub?: string;
  actions?: React.ReactNode;
  crumbs?: { label: string; onClick?: () => void }[];
}) {
  return (
    <header className="a-page-head">
      {crumbs && crumbs.length > 0 && (
        <div className="a-page-crumbs">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: "contents" }}>
              {c.onClick ? (
                <button className="a-page-crumb-link" onClick={c.onClick}>{c.label}</button>
              ) : (
                <span className={i === crumbs.length - 1 ? "a-page-crumb-current" : ""}>{c.label}</span>
              )}
              {i < crumbs.length - 1 && <span className="a-page-crumb-sep">›</span>}
            </span>
          ))}
        </div>
      )}
      <div className="a-page-row">
        <div style={{ flex: 1, minWidth: 0 }}>
          {typeof title === "string" ? (
            <h1 className="a-page-title">{title}</h1>
          ) : (
            title
          )}
          {sub && <p className="a-page-sub">{sub}</p>}
        </div>
        {actions && <div className="a-page-actions">{actions}</div>}
      </div>
    </header>
  );
}

function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="a-toolbar">{children}</div>;
}

function Btn({
  children,
  variant,
  size,
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  size?: "sm";
  onClick?: () => void;
}) {
  const cls = [
    "a-btn",
    variant === "primary" ? "a-btn-primary" : "",
    variant === "ghost" ? "a-btn-ghost" : "",
    variant === "danger" ? "a-btn-danger" : "",
    size === "sm" ? "a-btn-sm" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return <button className={cls} onClick={onClick}>{children}</button>;
}

function Badge({ kind, children }: { kind: string; children: React.ReactNode }) {
  return (
    <span className={`a-badge a-badge--${kind}`}>
      <span className="a-badge-dot" />
      {children}
    </span>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="a-form-section">
      <h3 className="a-section-title">
        <span className="a-section-title-mark">●</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function FormBar({
  onSave,
  onDiscard,
  onDelete,
}: {
  onSave: () => void;
  onDiscard: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="a-formbar">
      <div className="a-formbar-status">Saved 2 min ago</div>
      <div className="a-formbar-spacer" />
      <Btn variant="danger" onClick={onDelete}>Delete</Btn>
      <Btn variant="ghost" onClick={onDiscard}>Discard</Btn>
      <Btn variant="primary" onClick={onSave}>
        Save changes <span className="a-btn-kbd">⌘S</span>
      </Btn>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="a-field">
      <div className="a-field-label-row">
        <span className="a-field-label">{label}</span>
        {hint && <span className="a-field-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className="a-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  variant,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  variant?: "lede" | "body";
}) {
  return (
    <textarea
      className={`a-textarea ${variant === "lede" ? "a-textarea--lede" : ""} ${variant === "body" ? "a-textarea--body" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select className="a-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; dot?: string }[];
}) {
  return (
    <div className="a-seg">
      {options.map((o) => (
        <button
          key={o.value}
          className={`a-seg-opt ${value === o.value ? "is-active" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.dot && <span className="a-badge-dot" style={{ background: o.dot }} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Chips({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...(value || []), v]);
    setDraft("");
  };
  return (
    <div className="a-chips">
      {(value || []).map((v, i) => (
        <span key={i} className="a-chip">
          {v}
          <button
            className="a-chip-x"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="a-chip-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          if (e.key === "Backspace" && !draft && value?.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder={placeholder || "Add and press enter"}
      />
    </div>
  );
}

function Swatches({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="a-swatches">
      {options.map((c) => (
        <button
          key={c}
          className={`a-swatch ${value === c ? "is-active" : ""}`}
          style={{ background: c }}
          onClick={() => onChange(c)}
          title={c}
        />
      ))}
    </div>
  );
}

function LinkList({
  value,
  onChange,
}: {
  value: { label: string; href: string }[];
  onChange: (v: { label: string; href: string }[]) => void;
}) {
  return (
    <div className="a-links">
      {value.map((l, i) => (
        <div key={i} className="a-link-row">
          <input
            className="a-input"
            value={l.label}
            onChange={(e) =>
              onChange(value.map((x, j) => j === i ? { ...x, label: e.target.value } : x))
            }
            placeholder="Label"
          />
          <input
            className="a-input"
            value={l.href}
            onChange={(e) =>
              onChange(value.map((x, j) => j === i ? { ...x, href: e.target.value } : x))
            }
            placeholder="https://..."
          />
          <button
            className="a-link-x"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="a-links-add"
        onClick={() => onChange([...value, { label: "", href: "" }])}
      >
        + Add link
      </button>
    </div>
  );
}

function Paragraphs({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="a-paragraphs">
      {value.map((p, i) => (
        <div key={i} className="a-paragraph-row">
          <div className="a-paragraph-num">{String(i + 1).padStart(2, "0")}</div>
          <textarea
            className="a-paragraph-area"
            value={p}
            onChange={(e) => onChange(value.map((x, j) => j === i ? e.target.value : x))}
          />
          <button
            className="a-paragraph-x"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="a-paragraphs-add"
        onClick={() => onChange([...value, ""])}
      >
        + Add paragraph
      </button>
    </div>
  );
}
