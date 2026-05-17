"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "../../data";
import { Badge, Btn, PageHead, Toolbar } from "../_components/ui";

export default function DraftsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data: Post[]) => setItems(data.filter((p) => p.published === false)));
  }, []);

  const publish = async (p: Post) => {
    setPublishing(p.id);
    await fetch(`/api/posts/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, published: true }),
    });
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    setPublishing(null);
  };

  return (
    <>
      <PageHead
        title="Drafts"
        sub="Posts in progress — publish when ready."
      />
      <Toolbar>
        <Btn size="sm">Drafts <span className="a-btn-kbd">{items.length}</span></Btn>
        <span className="a-toolbar-spacer" />
        <Btn size="sm" variant="ghost" onClick={() => router.push("/admin/posts")}>
          View all posts →
        </Btn>
      </Toolbar>
      <div className="a-page-body">
        {items.length === 0 ? (
          <div className="a-empty">
            <span className="a-empty-icon">•</span>
            <span className="a-empty-label">No drafts</span>
            <span className="a-empty-hint">Create a new post and set its status to "draft" to keep it here.</span>
          </div>
        ) : (
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
                <tr key={p.id} onClick={() => router.push(`/admin/posts/${p.id}`)}>
                  <td className="a-td-num">{String(i + 1).padStart(2, "0")}</td>
                  <td className="a-td-title">
                    <span className="a-td-title-name">{p.title}</span>
                    <span className="a-td-title-sub">
                      {p.excerpt.slice(0, 72)}{p.excerpt.length > 72 ? "…" : ""}
                    </span>
                  </td>
                  <td className="a-td-muted a-col--md">{p.date}</td>
                  <td className="a-col--lg">
                    <div className="a-td-chip-row">
                      {p.tags.map((t) => <span key={t} className="a-td-chip">{t}</span>)}
                    </div>
                  </td>
                  <td><Badge kind="draft">draft</Badge></td>
                  <td className="a-td-actions" onClick={(ev) => ev.stopPropagation()}>
                    <Btn
                      size="sm"
                      variant="primary"
                      onClick={() => publish(p)}
                    >
                      {publishing === p.id ? "…" : "Publish"}
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
