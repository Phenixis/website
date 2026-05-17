"use client";

import Link from "next/link";
import { PROJECTS, POSTS, EXPERIENCES } from "../data";
import { Badge } from "./_components/ui";

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

export default function DashboardPage() {
  const projects = PROJECTS;
  const posts = POSTS;
  const experiences = EXPERIENCES;

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
              <span className="a-stat-meta-pill" style={{ color: "var(--a-green)" }}>● {posts.length} published</span>
              <span className="a-stat-meta-pill" style={{ color: "var(--a-amber)" }}>● 2 drafts</span>
            </div>
            <span className="a-stat-arrow">↗</span>
          </Link>
          <Link className="a-stat" href="/admin/experiences">
            <div className="a-stat-num">{String(experiences.length).padStart(2, "0")}</div>
            <div className="a-stat-label">Itinerary</div>
            <div className="a-stat-meta">
              <span className="a-stat-meta-pill">1 current</span>
              <span className="a-stat-meta-pill">4 roles</span>
              <span className="a-stat-meta-pill">1 school</span>
            </div>
            <span className="a-stat-arrow">↗</span>
          </Link>
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
