"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "../../data";
import { Badge, Btn, PageHead, Toolbar } from "../_components/ui";

export default function PostsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then(setItems);
  }, []);

  const published = items.filter((p) => p.published !== false).length;
  const drafts = items.filter((p) => p.published === false).length;

  return (
    <>
      <PageHead
        title="Writing"
        sub="Essays, notes, observations — things that needed to be written."
        actions={
          <Btn variant="primary" onClick={() => router.push("/admin/posts/new")}>
            + New post <span className="a-btn-kbd">⌘N</span>
          </Btn>
        }
      />
      <Toolbar>
        <Btn size="sm">All <span className="a-btn-kbd">{items.length}</span></Btn>
        <Btn size="sm" variant="ghost">Published <span className="a-btn-kbd">{published}</span></Btn>
        <Btn size="sm" variant="ghost">Drafts <span className="a-btn-kbd">{drafts}</span></Btn>
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
              <tr key={p.id} onClick={() => router.push(`/admin/posts/${p.id}`)}>
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
                <td>
                  <Badge kind={p.published === false ? "draft" : "published"}>
                    {p.published === false ? "draft" : "published"}
                  </Badge>
                </td>
                <td className="a-td-actions"><span className="a-row-arrow">→</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
