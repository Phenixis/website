"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, Post, Experience, Profile } from "../data";

type PortfolioProps = {
  profile: Profile;
  projects: Project[];
  posts: Post[];
  experiences: Experience[];
  initialFocus?: string;
  initialProjectId?: string | null;
  initialPostId?: string | null;
};

export function Portfolio({
  profile,
  projects,
  posts,
  experiences,
  initialFocus = "projects",
  initialProjectId = null,
  initialPostId = null,
}: PortfolioProps) {
  const router = useRouter();
  const [focused, setFocused] = useState<string>(initialFocus);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(initialPostId);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId);

  const panes = [
    { id: "projects", label: "Projects", num: "I", count: projects.length, sub: "What I made" },
    { id: "blog", label: "Writing", num: "II", count: posts.length, sub: "What I think" },
    { id: "experiences", label: "Itinerary", num: "III", count: experiences.length, sub: "Where I went" },
  ];

  const handleFocus = (id: string) => {
    setFocused(id);
    setSelectedPostId(null);
    setSelectedProjectId(null);
    if (id === "projects") router.push("/");
    else if (id === "blog") router.push("/writing");
    else if (id === "experiences") router.push("/itinerary");
  };

  const handleSelectPost = (id: string | null) => {
    setSelectedPostId(id);
    if (id) router.push(`/writing/${id}`);
    else router.push("/writing");
  };

  const handleSelectProject = (id: string | null) => {
    setSelectedProjectId(id);
    if (id) router.push(`/projects/${id}`);
    else router.push("/");
  };

  return (
    <div className="v3-root">
      <header className="v3-namestrip">
        <div className="v3-namestrip-left">
          <span className="v3-namestrip-mono">✦</span>
          <span className="v3-namestrip-name">{profile.name}</span>
        </div>
        <div className="v3-namestrip-center">
          <span className="v3-namestrip-tag">{profile.tagline}</span>
        </div>
        <div className="v3-namestrip-right">
          <span className="v3-namestrip-loc">{profile.location}</span>
          <span className="v3-namestrip-dot">·</span>
          <span className="v3-namestrip-year">MMXXVI</span>
        </div>
      </header>

      <div className="v3-body">
        {panes.map((p, i) => {
          const isFocused = focused === p.id;
          return (
            <section
              key={p.id}
              className={`v3-pane ${isFocused ? "v3-pane--focus" : "v3-pane--rail"}`}
              onClick={() => !isFocused && handleFocus(p.id)}
            >
              {isFocused ? (
                <PaneFocused
                  key={`${p.id}/${selectedPostId ?? selectedProjectId ?? "list"}`}
                  pane={p}
                  projects={projects}
                  posts={posts}
                  experiences={experiences}
                  profile={profile}
                  selectedPostId={selectedPostId}
                  onSelectPost={handleSelectPost}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={handleSelectProject}
                />
              ) : (
                <PaneRail pane={p} />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function PaneRail({ pane }: { pane: { num: string; label: string; count: number } }) {
  return (
    <div className="v3-rail">
      <span className="v3-rail-num">{pane.num}</span>
      <span className="v3-rail-label">{pane.label}</span>
      <span className="v3-rail-count">{String(pane.count).padStart(2, "0")}</span>
    </div>
  );
}

type PaneFocusedProps = {
  pane: { id: string; label: string; num: string; count: number; sub: string };
  projects: Project[];
  posts: Post[];
  experiences: Experience[];
  profile: Profile;
  selectedPostId: string | null;
  onSelectPost: (id: string | null) => void;
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
};

function PaneFocused({
  pane,
  projects,
  posts,
  experiences,
  profile,
  selectedPostId,
  onSelectPost,
  selectedProjectId,
  onSelectProject,
}: PaneFocusedProps) {
  const selectedPost = pane.id === "blog" && selectedPostId
    ? posts.find((p) => p.id === selectedPostId) ?? null
    : null;
  const selectedProject = pane.id === "projects" && selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const contentClass = [
    "v3-content",
    pane.id === "blog" ? "v3-content--writing" : "",
    selectedProject ? "v3-content--project-detail" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={contentClass}>
      <header className="v3-section-head">
        {selectedPost ? (
          <>
            <div className="v3-section-head-top">
              <button className="v3-back" onClick={() => onSelectPost(null)}>
                <span className="v3-back-arrow">←</span>
                <span>Writing</span>
              </button>
              <span className="v3-section-rule" />
              <span className="v3-section-meta">
                <span>{selectedPost.date}</span>
                <span className="v3-section-meta-count">{selectedPost.readTime}</span>
              </span>
            </div>
            <h1 className="v3-section-title v3-section-title--post">{selectedPost.title}</h1>
          </>
        ) : selectedProject ? (
          <>
            <div className="v3-section-head-top">
              <button className="v3-back" onClick={() => onSelectProject(null)}>
                <span className="v3-back-arrow">←</span>
                <span>Projects</span>
              </button>
              <span className="v3-section-rule" />
              <span className="v3-section-meta">
                <span style={{ color: selectedProject.color }}>● {selectedProject.kind}</span>
                <span className="v3-section-meta-count">{selectedProject.year}</span>
              </span>
            </div>
            <h1 className="v3-section-title v3-section-title--project">{selectedProject.title}</h1>
          </>
        ) : (
          <>
            <div className="v3-section-head-top">
              <span className="v3-section-num">{pane.num}</span>
              <span className="v3-section-rule" />
              <span className="v3-section-meta">
                <span>{pane.sub}</span>
                <span className="v3-section-meta-count">{String(pane.count).padStart(2, "0")} entries</span>
              </span>
            </div>
            <h1 className="v3-section-title">{pane.label}</h1>
          </>
        )}
      </header>

      <div className="v3-scroll">
        {pane.id === "projects" && (
          selectedProject
            ? <ProjectDetail project={selectedProject} projects={projects} onSelect={onSelectProject} />
            : <ProjectsList projects={projects} onSelect={onSelectProject} />
        )}
        {pane.id === "blog" && (
          selectedPost
            ? <PostDetail post={selectedPost} posts={posts} profile={profile} onSelect={onSelectPost} />
            : <BlogList posts={posts} onSelect={onSelectPost} />
        )}
        {pane.id === "experiences" && <ExperiencesList experiences={experiences} />}
      </div>
    </div>
  );
}

function ProjectsList({ projects, onSelect }: { projects: Project[]; onSelect: (id: string) => void }) {
  return (
    <div className="v3-projects">
      {projects.map((p, i) => (
        <article
          key={p.id}
          className="v3-pcard"
          style={{ "--c": p.color } as React.CSSProperties}
          onClick={() => onSelect(p.id)}
        >
          <div className="v3-pcard-num">{String(i + 1).padStart(3, "0")}</div>
          <div className="v3-pcard-thumb">
            <div className="v3-pcard-glyph">{p.title[0]}</div>
            <div className="v3-pcard-noise" />
          </div>
          <div className="v3-pcard-body">
            <div className="v3-pcard-row">
              <h3 className="v3-pcard-title">{p.title}</h3>
              <span className="v3-pcard-year">{p.year}</span>
            </div>
            <p className="v3-pcard-blurb">{p.blurb}</p>
            <div className="v3-pcard-foot">
              <span className="v3-pcard-kind">{p.kind}</span>
              <span className="v3-pcard-dot">·</span>
              <span className={`v3-pcard-status v3-vstatus--${p.status}`}>{p.status}</span>
              <span className="v3-pcard-spacer" />
              <span className="v3-pcard-stack">{p.stack.join(" / ")}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProjectDetail({
  project,
  projects,
  onSelect,
}: {
  project: Project;
  projects: Project[];
  onSelect: (id: string | null) => void;
}) {
  const idx = projects.findIndex((p) => p.id === project.id);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <article className="v3-project-detail" style={{ "--c": project.color } as React.CSSProperties}>
      <div className="v3-project-hero">
        <div className="v3-project-hero-glyph">{project.title[0]}</div>
        <div className="v3-project-hero-noise" />
        <div className="v3-project-hero-grid" />
        <div className="v3-project-hero-tag">
          <span className="v3-project-hero-num">
            No. {String(idx + 1).padStart(3, "0")} / {String(projects.length).padStart(3, "0")}
          </span>
          <span className={`v3-project-hero-status v3-vstatus--${project.status}`}>
            ● {project.status}
          </span>
        </div>
      </div>

      <p className="v3-article-lede">{project.blurb}</p>

      <div className="v3-project-meta">
        <div className="v3-project-meta-row">
          <span className="v3-project-meta-key">Kind</span>
          <span className="v3-project-meta-val">{project.kind}</span>
        </div>
        <div className="v3-project-meta-row">
          <span className="v3-project-meta-key">Year</span>
          <span className="v3-project-meta-val">{project.year}</span>
        </div>
        <div className="v3-project-meta-row">
          <span className="v3-project-meta-key">Status</span>
          <span className={`v3-project-meta-val v3-vstatus--${project.status}`}>{project.status}</span>
        </div>
        {project.role && (
          <div className="v3-project-meta-row">
            <span className="v3-project-meta-key">Role</span>
            <span className="v3-project-meta-val">{project.role}</span>
          </div>
        )}
        <div className="v3-project-meta-row">
          <span className="v3-project-meta-key">Stack</span>
          <span className="v3-project-meta-val v3-project-meta-stack">
            {project.stack.map((s) => (
              <span key={s} className="v3-project-stack-chip">{s}</span>
            ))}
          </span>
        </div>
        {project.links && project.links.length > 0 && (
          <div className="v3-project-meta-row">
            <span className="v3-project-meta-key">Links</span>
            <span className="v3-project-meta-val v3-project-meta-links">
              {project.links.map((l, i) => (
                <React.Fragment key={l.label}>
                  <a className="v3-project-link" href={l.href}>
                    {l.label} ↗
                  </a>
                  {project.links && i < project.links.length - 1 && (
                    <span className="v3-post-sep">·</span>
                  )}
                </React.Fragment>
              ))}
            </span>
          </div>
        )}
      </div>

      <div className="v3-article-rule" />

      <div className="v3-article-body">
        {project.body.map((para, i) => (
          <p key={i} className="v3-article-para">{para}</p>
        ))}
      </div>

      <footer className="v3-article-foot">
        <div className="v3-article-sign">
          <span className="v3-article-sign-mark" style={{ color: project.color }}>●</span>
          <span className="v3-article-sign-name">{project.title}</span>
          <span className="v3-article-sign-date">{project.year}</span>
        </div>
        <nav className="v3-article-nav">
          {prev && (
            <button
              className="v3-article-nav-btn v3-article-nav-prev"
              onClick={() => onSelect(prev.id)}
            >
              <span className="v3-article-nav-dir">← previous</span>
              <span className="v3-article-nav-title">{prev.title}</span>
            </button>
          )}
          {next && (
            <button
              className="v3-article-nav-btn v3-article-nav-next"
              onClick={() => onSelect(next.id)}
            >
              <span className="v3-article-nav-dir">next →</span>
              <span className="v3-article-nav-title">{next.title}</span>
            </button>
          )}
        </nav>
      </footer>
    </article>
  );
}

function BlogList({ posts, onSelect }: { posts: Post[]; onSelect: (id: string) => void }) {
  return (
    <ol className="v3-posts">
      {posts.map((p, i) => (
        <li key={p.id} className="v3-post" onClick={() => onSelect(p.id)}>
          <div className="v3-post-left">
            <div className="v3-post-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="v3-post-date">{p.date}</div>
          </div>
          <div className="v3-post-body">
            <h3 className="v3-post-title">{p.title}</h3>
            <p className="v3-post-excerpt">{p.excerpt}</p>
            <div className="v3-post-meta">
              <span>{p.readTime}</span>
              <span className="v3-post-sep">/</span>
              {p.tags.map((t, j) => (
                <React.Fragment key={t}>
                  <span className="v3-post-tag">{t}</span>
                  {j < p.tags.length - 1 && <span className="v3-post-sep">,</span>}
                </React.Fragment>
              ))}
              <span className="v3-post-spacer" />
              <span className="v3-post-read">Read →</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PostDetail({
  post,
  posts,
  profile,
  onSelect,
}: {
  post: Post;
  posts: Post[];
  profile: Profile;
  onSelect: (id: string | null) => void;
}) {
  const idx = posts.findIndex((p) => p.id === post.id);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx < posts.length - 1 ? posts[idx + 1] : null;

  return (
    <article className="v3-article">
      <div className="v3-article-tags">
        {post.tags.map((t) => (
          <span key={t} className="v3-article-tag">#{t}</span>
        ))}
        <span className="v3-article-num">
          No. {String(idx + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
        </span>
      </div>

      <p className="v3-article-lede">{post.excerpt}</p>
      <div className="v3-article-rule" />

      <div className="v3-article-body">
        {post.body.map((para, i) => (
          <p key={i} className="v3-article-para">
            {i === 0 && <span className="v3-article-dropcap">{para.charAt(0)}</span>}
            {i === 0 ? para.slice(1) : para}
          </p>
        ))}
      </div>

      <footer className="v3-article-foot">
        <div className="v3-article-sign">
          <span className="v3-article-sign-mark">✦</span>
          <span className="v3-article-sign-name">{profile.name}</span>
          <span className="v3-article-sign-date">{post.date}</span>
        </div>
        <nav className="v3-article-nav">
          {prev && (
            <button
              className="v3-article-nav-btn v3-article-nav-prev"
              onClick={() => onSelect(prev.id)}
            >
              <span className="v3-article-nav-dir">← previous</span>
              <span className="v3-article-nav-title">{prev.title}</span>
            </button>
          )}
          {next && (
            <button
              className="v3-article-nav-btn v3-article-nav-next"
              onClick={() => onSelect(next.id)}
            >
              <span className="v3-article-nav-dir">next →</span>
              <span className="v3-article-nav-title">{next.title}</span>
            </button>
          )}
        </nav>
      </footer>
    </article>
  );
}

function ExperiencesList({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="v3-timeline">
      <div className="v3-timeline-rail" />
      {experiences.map((e) => (
        <div key={e.id} className={`v3-trow v3-trow--${e.kind}`}>
          <div className="v3-trow-when">
            <div className="v3-trow-when-label">{e.when}</div>
          </div>
          <div className="v3-trow-axis">
            <div className="v3-trow-dot">
              <div className="v3-trow-dot-inner" />
            </div>
          </div>
          <div className="v3-trow-body">
            <div className="v3-trow-headline">
              <span className="v3-trow-role">{e.role}</span>
              <span className="v3-trow-conj">at</span>
              <span className="v3-trow-where">{e.where}</span>
            </div>
            <p className="v3-trow-blurb">{e.blurb}</p>
            <div className="v3-trow-foot">
              <span className={`v3-trow-kind v3-vkind--${e.kind}`}>{e.kind}</span>
              {e.stack.length > 0 && (
                <>
                  <span className="v3-post-sep">·</span>
                  <span className="v3-trow-stack">{e.stack.join(" / ")}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="v3-timeline-end">
        <div className="v3-trow-when v3-trow-when--end">
          <div className="v3-trow-when-label">earlier</div>
        </div>
        <div className="v3-trow-axis">
          <div className="v3-trow-endcap" />
        </div>
        <div className="v3-trow-body v3-trow-body--end">
          <span className="v3-trow-end-note">— et cetera —</span>
        </div>
      </div>
    </div>
  );
}
