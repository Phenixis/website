"use client";

import { useEffect, useState } from "react";
import type { Post } from "../../data";
import { Btn, PageHead, Toolbar } from "../_components/ui";

type TagEntry = { tag: string; count: number; posts: string[] };

export default function TagsPage() {
  const [tags, setTags] = useState<TagEntry[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((posts: Post[]) => {
        const map: Record<string, { count: number; posts: string[] }> = {};
        for (const p of posts) {
          for (const t of p.tags) {
            if (!map[t]) map[t] = { count: 0, posts: [] };
            map[t].count++;
            map[t].posts.push(p.title);
          }
        }
        const sorted = Object.entries(map)
          .map(([tag, v]) => ({ tag, ...v }))
          .sort((a, b) => b.count - a.count);
        setTags(sorted);
      });
  }, []);

  return (
    <>
      <PageHead
        title="Tags"
        sub="All tags used across writing — counts and post associations."
      />
      <Toolbar>
        <Btn size="sm">All <span className="a-btn-kbd">{tags.length}</span></Btn>
        <span className="a-toolbar-spacer" />
        <span className="a-toolbar-hint">Tags are managed by editing individual posts.</span>
      </Toolbar>
      <div className="a-page-body">
        {tags.length === 0 ? (
          <div className="a-empty">
            <span className="a-empty-icon">#</span>
            <span className="a-empty-label">No tags yet</span>
            <span className="a-empty-hint">Add tags to your posts to see them here.</span>
          </div>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                <th className="a-th-num">#</th>
                <th>Tag</th>
                <th>Posts</th>
                <th className="a-col--lg">Used in</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((t, i) => (
                <tr key={t.tag}>
                  <td className="a-td-num">{String(i + 1).padStart(2, "0")}</td>
                  <td className="a-td-title">
                    <span className="a-td-title-name">#{t.tag}</span>
                  </td>
                  <td>
                    <span className="a-side-card-val">{t.count}</span>
                  </td>
                  <td className="a-col--lg">
                    <div className="a-td-chip-row">
                      {t.posts.slice(0, 3).map((name) => (
                        <span key={name} className="a-td-chip" title={name}>
                          {name.slice(0, 24)}{name.length > 24 ? "…" : ""}
                        </span>
                      ))}
                      {t.posts.length > 3 && (
                        <span className="a-td-chip" style={{ color: "var(--a-text-dim)" }}>
                          +{t.posts.length - 3}
                        </span>
                      )}
                    </div>
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
