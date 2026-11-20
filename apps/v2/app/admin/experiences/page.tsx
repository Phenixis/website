"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience } from "../../data";
import { ArrowUpRight, Copy, Pencil, Trash2 } from "lucide-react";
import { useContextMenu, saveEntity, deleteEntity, type MenuEntry } from "../_components/ContextMenu";
import { Badge, Btn, FilterChips, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls, useKeyShortcut } from "../_components/ui";
import { formatRange } from "@/lib/experience-dates";

export default function ExperiencesListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Experience[]>([]);
  const [filter, setFilter] = useState<"all" | Experience["kind"]>("all");

  useKeyShortcut("n", () => router.push("/admin/experiences/new"));
  const { open: openMenu, menu, isOpen } = useContextMenu();

  const update = async (x: Experience, patch: Partial<Experience>) => {
    const next = { ...x, ...patch };
    setItems((prev) => prev.map((y) => (y.id === x.id ? next : y)));
    const err = await saveEntity("/api/experiences", next);
    if (err) { setItems((prev) => prev.map((y) => (y.id === x.id ? x : y))); alert(err); }
  };
  const remove = async (x: Experience) => {
    if (!confirm(`Delete "${x.role}"? This can't be undone.`)) return;
    const err = await deleteEntity("/api/experiences", x.id);
    if (err) alert(err); else setItems((prev) => prev.filter((y) => y.id !== x.id));
  };
  const menuFor = (x: Experience): MenuEntry[] => {
    const isDraft = x.published === false;
    return [
      { label: "Edit", icon: Pencil, hint: "↵", onSelect: () => router.push(`/admin/experiences/${x.id}`) },
      ...(isDraft ? [] : [{ label: "View on site", icon: ArrowUpRight, onSelect: () => window.open(`/itinerary#${x.id}`, "_blank") }]),
      { type: "separator" },
      { type: "heading", label: "Kind" },
      { label: "Self", dot: "text-a-green", checked: x.kind === "self", onSelect: () => update(x, { kind: "self" }) },
      { label: "Role", dot: "text-a-text-mute", checked: x.kind === "role", onSelect: () => update(x, { kind: "role" }) },
      { label: "Edu", dot: "text-a-amber", checked: x.kind === "edu", onSelect: () => update(x, { kind: "edu" }) },
      { type: "separator" },
      { type: "heading", label: "Visibility" },
      { label: "Published", dot: "text-a-green", checked: !isDraft, onSelect: () => update(x, { published: true }) },
      { label: "Draft", dot: "text-a-amber", checked: isDraft, onSelect: () => update(x, { published: false }) },
      { type: "separator" },
      { label: x.endDate === null ? "Ongoing" : "Mark as ongoing", checked: x.endDate === null, disabled: x.endDate === null, onSelect: () => update(x, { endDate: null }) },
      { label: "Copy id", icon: Copy, onSelect: () => navigator.clipboard?.writeText(x.id) },
      { label: "Delete…", icon: Trash2, danger: true, onSelect: () => remove(x) },
    ];
  };

  useEffect(() => {
    fetch("/api/experiences").then((r) => r.json()).then(setItems);
  }, []);

  // Most recent first: by start date, then ongoing / latest end date.
  const sorted = [...items].sort(
    (a, b) =>
      b.startDate.localeCompare(a.startDate) ||
      (b.endDate ?? "9999-99").localeCompare(a.endDate ?? "9999-99"),
  );
  const visible = filter === "all" ? sorted : sorted.filter((e) => e.kind === filter);
  const countOf = (kind: Experience["kind"]) => items.filter((e) => e.kind === kind).length;

  return (
    <>
      <PageHead
        title="Itinerary"
        sub="Where I went, what I did, who I worked with."
        actions={
          <Btn variant="primary" onClick={() => router.push("/admin/experiences/new")}>
            + New entry <span className={kbdCls}>N</span>
          </Btn>
        }
      />
      <Toolbar>
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: items.length },
            { value: "self", label: "Self", count: countOf("self") },
            { value: "role", label: "Role", count: countOf("role") },
            { value: "edu", label: "Edu", count: countOf("edu") },
          ]}
        />
      </Toolbar>
      <div className={pageBodyCls}>
        <table className={tableCls.table}>
          <thead className={tableCls.thead}>
            <tr>
              <th className={`${tableCls.th} ${tableCls.thNum}`}>#</th>
              <th className={tableCls.th}>Role</th>
              <th className={`${tableCls.th} ${tableCls.colMd}`}>Where</th>
              <th className={`${tableCls.th} ${tableCls.colMd}`}>When</th>
              <th className={tableCls.th}>Kind</th>
              <th className={`${tableCls.th} ${tableCls.thActions}`} />
            </tr>
          </thead>
          <tbody>
            {visible.map((e, i) => (
              <tr className={`${tableCls.tr} ${isOpen(e.id) ? "bg-a-bg-2" : ""}`} key={e.id} onClick={() => router.push(`/admin/experiences/${e.id}`)} onContextMenu={(ev) => openMenu(ev, menuFor(e), e.id)}>
                <td className={`${tableCls.td} ${tableCls.tdNum}`}>{String(i + 1).padStart(2, "0")}</td>
                <td className={`${tableCls.td} ${tableCls.tdTitle}`}>
                  <span className={tableCls.tdTitleName}>{e.role}</span>
                  <span className={tableCls.tdTitleSub}>{e.blurb.slice(0, 64)}{e.blurb.length > 64 ? "…" : ""}</span>
                </td>
                <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colMd}`}>{e.where}</td>
                <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colMd}`}>{formatRange(e)}</td>
                <td className={tableCls.td}>
                  <div className={tableCls.tdChipRow}>
                    <Badge kind={e.kind}>{e.kind}</Badge>
                    {e.published === false && <Badge kind="draft">draft</Badge>}
                  </div>
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
