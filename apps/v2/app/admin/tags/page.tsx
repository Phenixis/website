"use client";

import { useEffect, useState } from "react";
import type { Post } from "../../data";
import { Btn, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls, emptyCls } from "../_components/ui";

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
        <Btn size="sm">All <span className={kbdCls}>{tags.length}</span></Btn>
        <span className="flex-1" />
        <span className="text-[11px] text-a-text-dim italic">Tags are managed by editing individual posts.</span>
      </Toolbar>
      <div className={pageBodyCls}>
        {tags.length === 0 ? (
          <div className={emptyCls.wrap}>
            <span className={emptyCls.icon}>#</span>
            <span className={emptyCls.label}>No tags yet</span>
            <span className={emptyCls.hint}>Add tags to your posts to see them here.</span>
          </div>
        ) : (
          <table className={tableCls.table}>
            <thead className={tableCls.thead}>
              <tr>
                <th className={`${tableCls.th} ${tableCls.thNum}`}>#</th>
                <th className={tableCls.th}>Tag</th>
                <th className={tableCls.th}>Posts</th>
                <th className={`${tableCls.th} ${tableCls.colLg}`}>Used in</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((t, i) => (
                <tr key={t.tag} className="border-b border-a-border">
                  <td className={`${tableCls.td} ${tableCls.tdNum}`}>{String(i + 1).padStart(2, "0")}</td>
                  <td className={`${tableCls.td} ${tableCls.tdTitle}`}>
                    <span className={tableCls.tdTitleName}>#{t.tag}</span>
                  </td>
                  <td className={tableCls.td}>
                    <span className="text-a-text">{t.count}</span>
                  </td>
                  <td className={`${tableCls.td} ${tableCls.colLg}`}>
                    <div className={tableCls.tdChipRow}>
                      {t.posts.slice(0, 3).map((name) => (
                        <span key={name} className={tableCls.tdChip} title={name}>
                          {name.slice(0, 24)}{name.length > 24 ? "…" : ""}
                        </span>
                      ))}
                      {t.posts.length > 3 && (
                        <span className={`${tableCls.tdChip} text-a-text-dim`}>
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
