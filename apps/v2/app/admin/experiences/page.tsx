"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience } from "../../data";
import { Badge, Btn, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls } from "../_components/ui";

export default function ExperiencesListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Experience[]>([]);

  useEffect(() => {
    fetch("/api/experiences").then((r) => r.json()).then(setItems);
  }, []);

  return (
    <>
      <PageHead
        title="Itinerary"
        sub="Where I went, what I did, who I worked with."
        actions={
          <Btn variant="primary" onClick={() => router.push("/admin/experiences/new")}>
            + New entry <span className={kbdCls}>⌘N</span>
          </Btn>
        }
      />
      <Toolbar>
        <Btn size="sm">All <span className={kbdCls}>{items.length}</span></Btn>
        <Btn size="sm" variant="ghost">Self <span className={kbdCls}>{items.filter((e) => e.kind === "self").length}</span></Btn>
        <Btn size="sm" variant="ghost">Role <span className={kbdCls}>{items.filter((e) => e.kind === "role").length}</span></Btn>
        <Btn size="sm" variant="ghost">Edu <span className={kbdCls}>{items.filter((e) => e.kind === "edu").length}</span></Btn>
        <span className="flex-1" />
        <Btn size="sm" variant="ghost">Sort: Recent ↓</Btn>
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
            {items.map((e, i) => (
              <tr className={tableCls.tr} key={e.id} onClick={() => router.push(`/admin/experiences/${e.id}`)}>
                <td className={`${tableCls.td} ${tableCls.tdNum}`}>{String(i + 1).padStart(2, "0")}</td>
                <td className={`${tableCls.td} ${tableCls.tdTitle}`}>
                  <span className={tableCls.tdTitleName}>{e.role}</span>
                  <span className={tableCls.tdTitleSub}>{e.blurb.slice(0, 64)}{e.blurb.length > 64 ? "…" : ""}</span>
                </td>
                <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colMd}`}>{e.where}</td>
                <td className={`${tableCls.td} ${tableCls.tdMuted} ${tableCls.colMd}`}>{e.when}</td>
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
    </>
  );
}
