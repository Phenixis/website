import Link from "next/link";
import { getProjects, getPosts, getExperiences } from "@/lib/db";
import { Badge } from "./_components/ui";

export default async function DashboardPage() {
  const [projects, posts, experiences] = await Promise.all([
    getProjects(),
    getPosts(),
    getExperiences(),
  ]);

  const shipping = projects.filter((p) => p.status === "shipping").length;
  const paused = projects.filter((p) => p.status === "paused").length;
  const archived = projects.filter((p) => p.status === "archived").length;

  const drafts = posts.filter((p) => p.published === false);
  const published = posts.length - drafts.length;

  const selfCount = experiences.filter((e) => e.kind === "self").length;
  const roleCount = experiences.filter((e) => e.kind === "role").length;
  const eduCount = experiences.filter((e) => e.kind === "edu").length;

  return (
    <div className="a-page-body">
      <div className="a-dash">
        <div className="a-dash-hello">
          <h2>
            Good evening, <span className="a-dash-hello-accent">Maxime.</span>
          </h2>
          <p>
            {drafts.length === 0
              ? "Everything published — no drafts open."
              : `${drafts.length} draft${drafts.length === 1 ? "" : "s"} open.`}
          </p>
        </div>

        <div className="a-dash-grid">
          <Link className="a-stat" href="/admin/projects">
            <div className="a-stat-num">{String(projects.length).padStart(2, "0")}</div>
            <div className="a-stat-label">Projects</div>
            <div className="a-stat-meta">
              <span className="a-stat-meta-pill" style={{ color: "var(--a-green)" }}>● {shipping} shipping</span>
              <span className="a-stat-meta-pill">{paused} paused</span>
              <span className="a-stat-meta-pill">{archived} archived</span>
            </div>
            <span className="a-stat-arrow">↗</span>
          </Link>
          <Link className="a-stat" href="/admin/posts">
            <div className="a-stat-num">{String(posts.length).padStart(2, "0")}</div>
            <div className="a-stat-label">Writing</div>
            <div className="a-stat-meta">
              <span className="a-stat-meta-pill" style={{ color: "var(--a-green)" }}>● {published} published</span>
              <span className="a-stat-meta-pill" style={{ color: "var(--a-amber)" }}>● {drafts.length} drafts</span>
            </div>
            <span className="a-stat-arrow">↗</span>
          </Link>
          <Link className="a-stat" href="/admin/experiences">
            <div className="a-stat-num">{String(experiences.length).padStart(2, "0")}</div>
            <div className="a-stat-label">Itinerary</div>
            <div className="a-stat-meta">
              <span className="a-stat-meta-pill">{selfCount} self</span>
              <span className="a-stat-meta-pill">{roleCount} roles</span>
              <span className="a-stat-meta-pill">{eduCount} school</span>
            </div>
            <span className="a-stat-arrow">↗</span>
          </Link>
        </div>

        <div className="a-panel" style={{ marginTop: 22 }}>
          <div className="a-panel-head">
            <span className="a-panel-title">Drafts</span>
            <span className="a-panel-spacer" />
            <span className="a-panel-meta">{drafts.length} open</span>
          </div>
          <div className="a-panel-body">
            {drafts.length === 0 ? (
              <div className="a-empty">
                <span className="a-empty-icon">•</span>
                <span className="a-empty-label">No drafts</span>
              </div>
            ) : (
              drafts.map((d) => (
                <div key={d.id} className="a-draft-row">
                  <div>
                    <div className="a-draft-title">{d.title}</div>
                    <div className="a-draft-meta">{d.readTime}{d.tags.length > 0 ? ` · ${d.tags.join(", ")}` : ""}</div>
                  </div>
                  <Badge kind="draft">draft</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
