"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "../../data";
import { Badge, Btn, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls, emptyCls } from "../_components/ui";

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
        <Btn size="sm">Drafts <span className={kbdCls}>{items.length}</span></Btn>
        <span className="flex-1" />
        <Btn size="sm" variant="ghost" onClick={() => router.push("/admin/posts")}>
          View all posts →
        </Btn>
      </Toolbar>
      <div className={pageBodyCls}>
        {items.length === 0 ? (
          <div className={emptyCls.wrap}>
            <span className={emptyCls.icon}>•</span>
            <span className={emptyCls.label}>No drafts</span>
            <span className={emptyCls.hint}>Create a new post and set its status to &quot;draft&quot; to keep it here.</span>
          </div>
        ) : (
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
                    <span className={tableCls.tdTitleSub}>
                      {p.excerpt.slice(0, 72)}{p.excerpt.length > 72 ? "…" : ""}
                    </span>
                  </td>
                  <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colMd}`}>{p.date}</td>
                  <td className={`${tableCls.td} ${tableCls.colLg}`}>
                    <div className={tableCls.tdChipRow}>
                      {p.tags.map((t) => <span key={t} className={tableCls.tdChip}>{t}</span>)}
                    </div>
                  </td>
                  <td className={tableCls.td}><Badge kind="draft">draft</Badge></td>
                  <td className={`${tableCls.td} ${tableCls.tdActions}`} onClick={(ev) => ev.stopPropagation()}>
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
