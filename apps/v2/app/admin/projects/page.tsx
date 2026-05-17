"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "../../data";
import { Badge, Btn, PageHead, Toolbar } from "../_components/ui";

const updated = ["12m", "2h", "yesterday", "2d", "4d", "1w", "3w", "1mo"];

export default function ProjectsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(setItems);
  }, []);

  const counts = {
    shipping: items.filter((p) => p.status === "shipping").length,
    paused: items.filter((p) => p.status === "paused").length,
    archived: items.filter((p) => p.status === "archived").length,
  };

  return (
    <>
      <PageHead
        title="Projects"
        sub="What I made — apps, tools, libraries, the occasional experiment."
        actions={
          <>
            <Btn variant="ghost" size="sm">Export</Btn>
            <Btn variant="primary" onClick={() => router.push("/admin/projects/new")}>
              + New project <span className="a-btn-kbd">⌘N</span>
            </Btn>
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
              <tr key={p.id} onClick={() => router.push(`/admin/projects/${p.id}`)}>
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
