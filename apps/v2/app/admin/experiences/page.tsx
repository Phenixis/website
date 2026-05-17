"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience } from "../../data";
import { Badge, Btn, PageHead, Toolbar } from "../_components/ui";

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
            + New entry <span className="a-btn-kbd">⌘N</span>
          </Btn>
        }
      />
      <Toolbar>
        <Btn size="sm">All <span className="a-btn-kbd">{items.length}</span></Btn>
        <Btn size="sm" variant="ghost">Self <span className="a-btn-kbd">{items.filter((e) => e.kind === "self").length}</span></Btn>
        <Btn size="sm" variant="ghost">Role <span className="a-btn-kbd">{items.filter((e) => e.kind === "role").length}</span></Btn>
        <Btn size="sm" variant="ghost">Edu <span className="a-btn-kbd">{items.filter((e) => e.kind === "edu").length}</span></Btn>
        <span className="a-toolbar-spacer" />
        <Btn size="sm" variant="ghost">Sort: Recent ↓</Btn>
      </Toolbar>
      <div className="a-page-body">
        <table className="a-table">
          <thead>
            <tr>
              <th className="a-th-num">#</th>
              <th>Role</th>
              <th className="a-col--md">Where</th>
              <th className="a-col--md">When</th>
              <th>Kind</th>
              <th className="a-th-actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((e, i) => (
              <tr key={e.id} onClick={() => router.push(`/admin/experiences/${e.id}`)}>
                <td className="a-td-num">{String(i + 1).padStart(2, "0")}</td>
                <td className="a-td-title">
                  <span className="a-td-title-name">{e.role}</span>
                  <span className="a-td-title-sub">{e.blurb.slice(0, 64)}{e.blurb.length > 64 ? "…" : ""}</span>
                </td>
                <td className="a-td-muted a-col--md">{e.where}</td>
                <td className="a-td-muted a-col--md">{e.when}</td>
                <td><Badge kind={e.kind}>{e.kind}</Badge></td>
                <td className="a-td-actions"><span className="a-row-arrow">→</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
