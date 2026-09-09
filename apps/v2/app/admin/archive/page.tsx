"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "../../data";
import { Badge, Btn, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls, emptyCls } from "../_components/ui";

export default function ArchivePage() {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => setItems(data.filter((p) => p.status === "archived")));
  }, []);

  const restore = async (p: Project) => {
    setRestoring(p.id);
    await fetch(`/api/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, status: "paused" }),
    });
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    setRestoring(null);
  };

  return (
    <>
      <PageHead
        title="Archive"
        sub="Projects set aside — restore to bring them back."
      />
      <Toolbar>
        <Btn size="sm">Archived <span className={kbdCls}>{items.length}</span></Btn>
        <span className="flex-1" />
        <Btn size="sm" variant="ghost" onClick={() => router.push("/admin/projects")}>
          View all projects →
        </Btn>
      </Toolbar>
      <div className={pageBodyCls}>
        {items.length === 0 ? (
          <div className={emptyCls.wrap}>
            <span className={emptyCls.icon}>⌗</span>
            <span className={emptyCls.label}>No archived projects</span>
            <span className={emptyCls.hint}>Set a project to &quot;archived&quot; status to move it here.</span>
          </div>
        ) : (
          <table className={tableCls.table}>
            <thead className={tableCls.thead}>
              <tr>
                <th className={`${tableCls.th} ${tableCls.thNum}`}>#</th>
                <th className={tableCls.th}>Title</th>
                <th className={`${tableCls.th} ${tableCls.colMd}`}>Year</th>
                <th className={`${tableCls.th} ${tableCls.colMd}`}>Kind</th>
                <th className={`${tableCls.th} ${tableCls.colLg}`}>Stack</th>
                <th className={`${tableCls.th} ${tableCls.thActions}`} />
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => (
                <tr className={tableCls.tr} key={p.id} onClick={() => router.push(`${p.category === "side" ? "/admin/side-quests" : "/admin/projects"}/${p.id}`)}>
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
                  <td className={`${tableCls.td} ${tableCls.colLg}`}>
                    <div className={tableCls.tdChipRow}>
                      {p.category === "side" && <span className={tableCls.tdChip}>side quest</span>}
                      {p.stack.slice(0, 3).map((s) => (
                        <span key={s} className={tableCls.tdChip}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className={`${tableCls.td} ${tableCls.tdActions}`} onClick={(ev) => ev.stopPropagation()}>
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => restore(p)}
                    >
                      {restoring === p.id ? "…" : "Restore"}
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
