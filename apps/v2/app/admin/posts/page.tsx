"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "../../data";
import { Badge, Btn, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls } from "../_components/ui";

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
            + New post <span className={kbdCls}>⌘N</span>
          </Btn>
        }
      />
      <Toolbar>
        <Btn size="sm">All <span className={kbdCls}>{items.length}</span></Btn>
        <Btn size="sm" variant="ghost">Published <span className={kbdCls}>{published}</span></Btn>
        <Btn size="sm" variant="ghost">Drafts <span className={kbdCls}>{drafts}</span></Btn>
        <span className="flex-1" />
        <Btn size="sm" variant="ghost">Sort: Recent ↓</Btn>
      </Toolbar>
      <div className={pageBodyCls}>
        <table className={tableCls.table}>
          <thead className={tableCls.thead}>
            <tr>
              <th className={`${tableCls.th} ${tableCls.thNum}`}>#</th>
              <th className={tableCls.th}>Title</th>
              <th className={`${tableCls.th} ${tableCls.colMd}`}>Date</th>
              <th className={`${tableCls.th} ${tableCls.colLg}`}>Tags</th>
              <th className={tableCls.th}>Status</th>
              <th className={`${tableCls.th} ${tableCls.thActions}`} />
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr className={tableCls.tr} key={p.id} onClick={() => router.push(`/admin/posts/${p.id}`)}>
                <td className={`${tableCls.td} ${tableCls.tdNum}`}>{String(i + 1).padStart(2, "0")}</td>
                <td className={`${tableCls.td} ${tableCls.tdTitle}`}>
                  <span className={tableCls.tdTitleName}>{p.title}</span>
                  <span className={tableCls.tdTitleSub}>{p.excerpt.slice(0, 72)}{p.excerpt.length > 72 ? "…" : ""}</span>
                </td>
                <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colMd}`}>{p.date}</td>
                <td className={`${tableCls.td} ${tableCls.colLg}`}>
                  <div className={tableCls.tdChipRow}>
                    {p.tags.map((t) => <span key={t} className={tableCls.tdChip}>{t}</span>)}
                  </div>
                </td>
                <td className={tableCls.td}>
                  <Badge kind={p.published === false ? "draft" : "published"}>
                    {p.published === false ? "draft" : "published"}
                  </Badge>
                </td>
                <td className={`${tableCls.td} ${tableCls.tdActions}`}><span className={tableCls.rowArrow}>→</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
