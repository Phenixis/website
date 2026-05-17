"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "../../data";
import { Badge, Btn, PageHead, Toolbar } from "../_components/ui";

export default function ArchivePage() {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => setItems(data.filter((p) => p.status === "archived")));
  }, []);

  const restore = async (p: Project) => {
    setRestoring(p.id);
    await fetch(`/api/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, status: "paused" }),
    });
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    setRestoring(null);
  };

  return (
    <>
      <PageHead
        title="Archive"
        sub="Projects set aside — restore to bring them back."
      />
      <Toolbar>
        <Btn size="sm">Archived <span className="a-btn-kbd">{items.length}</span></Btn>
        <span className="a-toolbar-spacer" />
        <Btn size="sm" variant="ghost" onClick={() => router.push("/admin/projects")}>
          View all projects →
        </Btn>
      </Toolbar>
      <div className="a-page-body">
        {items.length === 0 ? (
          <div className="a-empty">
            <span className="a-empty-icon">⌗</span>
            <span className="a-empty-label">No archived projects</span>
            <span className="a-empty-hint">Set a project to "archived" status to move it here.</span>
          </div>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                <th className="a-th-num">#</th>
                <th>Title</th>
                <th className="a-col--md">Year</th>
                <th className="a-col--md">Kind</th>
                <th className="a-col--lg">Stack</th>
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
                  <td className="a-col--lg">
                    <div className="a-td-chip-row">
                      {p.stack.slice(0, 3).map((s) => (
                        <span key={s} className="a-td-chip">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="a-td-actions" onClick={(ev) => ev.stopPropagation()}>
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => restore(p)}
                    >
                      {restoring === p.id ? "…" : "Restore"}
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
