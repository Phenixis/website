"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "../../data";
import { Badge, Btn, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls } from "../_components/ui";

const updated = ["12m", "2h", "yesterday", "2d", "4d", "1w", "3w", "1mo"];

export default function SideQuestsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => setItems(data.filter((p) => p.category === "side")));
  }, []);

  const counts = {
    shipping: items.filter((p) => p.status === "shipping").length,
    paused: items.filter((p) => p.status === "paused").length,
    archived: items.filter((p) => p.status === "archived").length,
  };

  return (
    <>
      <PageHead
        title="Side Quests"
        sub="Smaller, looser projects — icon libraries, homelab tinkering, whatever else didn't need to be a whole thing."
        actions={
          <>
            <Btn variant="ghost" size="sm">Export</Btn>
            <Btn variant="primary" onClick={() => router.push("/admin/side-quests/new")}>
              + New side quest <span className={kbdCls}>⌘N</span>
            </Btn>
          </>
        }
      />
      <Toolbar>
        <Btn size="sm">All <span className={kbdCls}>{items.length}</span></Btn>
        <Btn size="sm" variant="ghost">Shipping <span className={kbdCls}>{counts.shipping}</span></Btn>
        <Btn size="sm" variant="ghost">Paused <span className={kbdCls}>{counts.paused}</span></Btn>
        <Btn size="sm" variant="ghost">Archived <span className={kbdCls}>{counts.archived}</span></Btn>
        <span className="flex-1" />
        <Btn size="sm" variant="ghost">Sort: Recent ↓</Btn>
        <Btn size="sm" variant="ghost">Columns ⌃</Btn>
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
            {items.map((p, i) => (
              <tr className={tableCls.tr} key={p.id} onClick={() => router.push(`/admin/side-quests/${p.id}`)}>
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
