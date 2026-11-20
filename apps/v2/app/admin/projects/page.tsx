"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "../../data";
import { byYearDesc, timeAgo } from "@/lib/admin-sort";
import { ArrowUpRight, Copy, Pencil, Trash2, ArrowLeftRight } from "lucide-react";
import { useContextMenu, saveEntity, deleteEntity, type MenuEntry } from "../_components/ContextMenu";
import { Badge, Btn, FilterChips, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls, useKeyShortcut } from "../_components/ui";

export default function ProjectsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"all" | Project["status"]>("all");

  useKeyShortcut("n", () => router.push("/admin/projects/new"));
  const { open: openMenu, menu, isOpen } = useContextMenu();

  const update = async (p: Project, patch: Partial<Project>) => {
    const next = { ...p, ...patch };
    const drop = patch.category !== undefined && patch.category !== "main";
    setItems((prev) => (drop ? prev.filter((x) => x.id !== p.id) : prev.map((x) => (x.id === p.id ? next : x))));
    const err = await saveEntity("/api/projects", next);
    if (err) {
      setItems((prev) => (drop ? byYearDesc([...prev, p]) : prev.map((x) => (x.id === p.id ? p : x))));
      alert(err);
    }
  };
  const remove = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    const err = await deleteEntity("/api/projects", p.id);
    if (err) alert(err); else setItems((prev) => prev.filter((x) => x.id !== p.id));
  };
  const menuFor = (p: Project): MenuEntry[] => {
    const isDraft = p.published === false;
    return [
      { label: "Edit", icon: Pencil, hint: "↵", onSelect: () => router.push(`/admin/projects/${p.id}`) },
      ...(isDraft ? [] : [{ label: "View on site", icon: ArrowUpRight, onSelect: () => window.open(`/projects/${p.id}`, "_blank") }]),
      { type: "separator" },
      { type: "heading", label: "Status" },
      { label: "Shipping", dot: "text-a-green", checked: p.status === "shipping", onSelect: () => update(p, { status: "shipping" }) },
      { label: "Paused", dot: "text-a-amber", checked: p.status === "paused", onSelect: () => update(p, { status: "paused" }) },
      { label: "Archived", dot: "text-a-text-mute", checked: p.status === "archived", onSelect: () => update(p, { status: "archived" }) },
      { type: "separator" },
      { type: "heading", label: "Visibility" },
      { label: "Published", dot: "text-a-green", checked: !isDraft, onSelect: () => update(p, { published: true }) },
      { label: "Draft", dot: "text-a-amber", checked: isDraft, onSelect: () => update(p, { published: false }) },
      { type: "separator" },
      { label: "Move to Side Quests", icon: ArrowLeftRight, onSelect: () => update(p, { category: "side" }) },
      { label: "Copy id", icon: Copy, onSelect: () => navigator.clipboard?.writeText(p.id) },
      { label: "Delete…", icon: Trash2, danger: true, onSelect: () => remove(p) },
    ];
  };

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => setItems(byYearDesc(data.filter((p) => p.category !== "side"))));
  }, []);

  const counts = {
    shipping: items.filter((p) => p.status === "shipping").length,
    paused: items.filter((p) => p.status === "paused").length,
    archived: items.filter((p) => p.status === "archived").length,
  };

  const visible = filter === "all" ? items : items.filter((p) => p.status === filter);

  return (
    <>
      <PageHead
        title="Main Projects"
        actions={
          <Btn variant="primary" onClick={() => router.push("/admin/projects/new")}>
            + New project <span className={kbdCls}>N</span>
          </Btn>
        }
      />
      <Toolbar>
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: items.length },
            { value: "shipping", label: "Shipping", count: counts.shipping },
            { value: "paused", label: "Paused", count: counts.paused },
            { value: "archived", label: "Archived", count: counts.archived },
          ]}
        />
      </Toolbar>
      <div className={pageBodyCls}>
        <table className={tableCls.table}>
          <thead className={tableCls.thead}>
            <tr>
              <th className={`${tableCls.th} ${tableCls.thNum}`}>#</th>
              <th className={tableCls.th}>Title</th>
              <th className={`${tableCls.th} ${tableCls.colMd}`}>Year</th>
              <th className={`${tableCls.th} ${tableCls.colMd}`}>Kind</th>
              <th className={tableCls.th}>Status</th>
              <th className={`${tableCls.th} ${tableCls.colLg}`}>Stack</th>
              <th className={`${tableCls.th} ${tableCls.colLg}`}>Updated</th>
              <th className={`${tableCls.th} ${tableCls.thActions}`} />
            </tr>
          </thead>
          <tbody>
            {visible.map((p, i) => (
              <tr className={`${tableCls.tr} ${isOpen(p.id) ? "bg-a-bg-2" : ""}`} key={p.id} onClick={() => router.push(`/admin/projects/${p.id}`)} onContextMenu={(e) => openMenu(e, menuFor(p), p.id)}>
                <td className={`${tableCls.td} ${tableCls.tdNum}`}>{String(i + 1).padStart(2, "0")}</td>
                <td className={`${tableCls.td} ${tableCls.tdTitle}`}>
                  <div className={tableCls.tdTitleInner}>
                    <span className={tableCls.tdColorDot} style={{ background: p.color }} />
                    <span>
                      <span className={tableCls.tdTitleName}>{p.title}</span>
                      <span className={tableCls.tdTitleSub}>
                        {p.blurb.slice(0, 64)}{p.blurb.length > 64 ? "…" : ""}
                      </span>
                    </span>
                  </div>
                </td>
                <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colMd}`}>{p.year}</td>
                <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colMd}`}>{p.kind}</td>
                <td className={tableCls.td}>
                  <div className={tableCls.tdChipRow}>
                    <Badge kind={p.status}>{p.status}</Badge>
                    {p.published === false && <Badge kind="draft">draft</Badge>}
                  </div>
                </td>
                <td className={`${tableCls.td} ${tableCls.colLg}`}>
                  <div className={tableCls.tdChipRow}>
                    {p.stack.slice(0, 3).map((s) => (
                      <span key={s} className={tableCls.tdChip}>{s}</span>
                    ))}
                    {p.stack.length > 3 && (
                      <span className={`${tableCls.tdChip} text-a-text-dim`}>
                        +{p.stack.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colLg}`}>{timeAgo(p.updatedAt)}</td>
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
