"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "../../data";
import { byDateDesc } from "@/lib/admin-sort";
import { ArrowUpRight, Copy, Pencil, Trash2 } from "lucide-react";
import { useContextMenu, saveEntity, deleteEntity, type MenuEntry } from "../_components/ContextMenu";
import { Badge, Btn, FilterChips, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls, useKeyShortcut } from "../_components/ui";

export default function PostsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "drafts" | "archived">("all");

  useKeyShortcut("n", () => router.push("/admin/posts/new"));
  const { open: openMenu, menu, isOpen } = useContextMenu();

  const update = async (p: Post, patch: Partial<Post>) => {
    const next = { ...p, ...patch };
    setItems((prev) => prev.map((x) => (x.id === p.id ? next : x)));
    const err = await saveEntity("/api/posts", next);
    if (err) { setItems((prev) => prev.map((x) => (x.id === p.id ? p : x))); alert(err); }
  };
  const remove = async (p: Post) => {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    const err = await deleteEntity("/api/posts", p.id);
    if (err) alert(err); else setItems((prev) => prev.filter((x) => x.id !== p.id));
  };
  const menuFor = (p: Post): MenuEntry[] => {
    const isDraft = p.published === false;
    const isArchived = !!p.archived;
    return [
      { label: "Edit", icon: Pencil, hint: "↵", onSelect: () => router.push(`/admin/posts/${p.id}`) },
      ...(isDraft || isArchived ? [] : [{ label: "View on site", icon: ArrowUpRight, onSelect: () => window.open(`/writing/${p.id}`, "_blank") }]),
      { type: "separator" },
      { type: "heading", label: "Status" },
      { label: "Published", dot: "text-a-green", checked: !isDraft && !isArchived, onSelect: () => update(p, { published: true, archived: false }) },
      { label: "Draft", dot: "text-a-amber", checked: isDraft && !isArchived, onSelect: () => update(p, { published: false, archived: false }) },
      { label: "Archived", dot: "text-a-text-mute", checked: isArchived, onSelect: () => update(p, { archived: true }) },
      { type: "separator" },
      { label: "Copy id", icon: Copy, onSelect: () => navigator.clipboard?.writeText(p.id) },
      { label: "Delete…", icon: Trash2, danger: true, onSelect: () => remove(p) },
    ];
  };

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then((data: Post[]) => setItems(byDateDesc(data)));
  }, []);

  const live = items.filter((p) => !p.archived);
  const published = live.filter((p) => p.published !== false).length;
  const drafts = live.filter((p) => p.published === false).length;
  const archived = items.length - live.length;

  // "All" leaves out archived posts; they have their own filter.
  const visible = items.filter((p) =>
    filter === "archived" ? p.archived
      : p.archived ? false
      : filter === "all" ? true
      : filter === "drafts" ? p.published === false
      : p.published !== false,
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
            { value: "all", label: "All", count: live.length },
            { value: "published", label: "Published", count: published },
            { value: "drafts", label: "Drafts", count: drafts },
            { value: "archived", label: "Archived", count: archived },
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
              <tr className={`${tableCls.tr} ${isOpen(p.id) ? "bg-a-bg-2" : ""}`} key={p.id} onClick={() => router.push(`/admin/posts/${p.id}`)} onContextMenu={(e) => openMenu(e, menuFor(p), p.id)}>
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
                  <Badge kind={p.archived ? "archived" : p.published === false ? "draft" : "published"}>
                    {p.archived ? "archived" : p.published === false ? "draft" : "published"}
                  </Badge>
                </td>
                <td className={`${tableCls.td} ${tableCls.tdActions}`}><span className={tableCls.rowArrow}>→</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {menu}
    </>
  );
}
