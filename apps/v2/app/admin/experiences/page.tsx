"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience } from "../../data";
import { Badge, Btn, FilterChips, PageHead, Toolbar, tableCls, pageBodyCls, kbdCls, useKeyShortcut } from "../_components/ui";
import { formatRange } from "@/lib/experience-dates";

export default function ExperiencesListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Experience[]>([]);
  const [filter, setFilter] = useState<"all" | Experience["kind"]>("all");

  useKeyShortcut("n", () => router.push("/admin/experiences/new"));

  useEffect(() => {
    fetch("/api/experiences").then((r) => r.json()).then(setItems);
  }, []);

  const visible = filter === "all" ? items : items.filter((e) => e.kind === filter);
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
              <tr className={tableCls.tr} key={e.id} onClick={() => router.push(`/admin/experiences/${e.id}`)}>
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
    </>
  );
}
