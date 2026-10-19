"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "../../data";
import { Badge, Btn, FilterChips, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls, useKeyShortcut } from "../_components/ui";

const updated = ["12m", "2h", "yesterday", "2d", "4d", "1w", "3w", "1mo"];

export default function ProjectsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"all" | Project["status"]>("all");

  useKeyShortcut("n", () => router.push("/admin/projects/new"));

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => setItems(data.filter((p) => p.category !== "side")));
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
        sub="What I made — apps, tools, libraries, the occasional experiment."
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
              <tr className={tableCls.tr} key={p.id} onClick={() => router.push(`/admin/projects/${p.id}`)}>
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
                <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colLg}`}>{updated[i] ?? "—"} ago</td>
                <td className={`${tableCls.td} ${tableCls.tdActions}`}><span className={tableCls.rowArrow}>→</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
