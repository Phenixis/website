"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "../../data";
import { Badge, Btn, FilterChips, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls, useKeyShortcut } from "../_components/ui";

export default function PostsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  useKeyShortcut("n", () => router.push("/admin/posts/new"));

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then(setItems);
  }, []);

  const published = items.filter((p) => p.published !== false).length;
  const drafts = items.filter((p) => p.published === false).length;

  const visible = items.filter((p) =>
    filter === "all" ? true : filter === "drafts" ? p.published === false : p.published !== false,
  );

  return (
    <>
      <PageHead
        title="Writing"
        sub="Essays, notes, observations — things that needed to be written."
        actions={
          <Btn variant="primary" onClick={() => router.push("/admin/posts/new")}>
            + New post <span className={kbdCls}>N</span>
          </Btn>
        }
      />
      <Toolbar>
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: items.length },
            { value: "published", label: "Published", count: published },
            { value: "drafts", label: "Drafts", count: drafts },
          ]}
        />
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
            {visible.map((p, i) => (
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
