"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Experience } from "../../../data";
import {
  Badge, FormBar, FormSection, Field, PageHead,
  TextInput, Textarea, Segmented, Chips, editPageCls,
} from "../../_components/ui";

const BLANK: Experience = {
  id: "",
  when: `${new Date().getFullYear()} →`,
  role: "Untitled role",
  where: "",
  kind: "role",
  blurb: "",
  stack: [],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `exp-${Date.now()}`;
}

export default function ExperienceEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [e, setE] = useState<Experience>(BLANK);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const update = (key: keyof Experience, val: unknown) =>
    setE((prev) => ({ ...prev, [key]: val }));

  const back = () => router.push("/admin/experiences");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/experiences/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) { router.replace("/admin/experiences"); return; }
        setE(data);
        setLoading(false);
      });
  }, [id, isNew, router]);

  const save = async () => {
    setSaving(true);
    const payload = isNew ? { ...e, id: slugify(e.role) } : e;
    await fetch(isNew ? "/api/experiences" : `/api/experiences/${e.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSavedAt(new Date());
    if (isNew) router.push("/admin/experiences");
  };

  const remove = async () => {
    if (!window.confirm("Delete this entry?")) return;
    await fetch(`/api/experiences/${e.id}`, { method: "DELETE" });
    back();
  };

  // 30s autosave
  useEffect(() => {
    if (isNew || loading) return;
    const timer = setTimeout(() => { save(); }, 30_000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e]);

  if (loading) {
    return <div className={editPageCls.loading}>Loading…</div>;
  }

  return (
    <div className={editPageCls.wrapper}>
      <PageHead
        crumbs={[
          { label: "Itinerary", onClick: back },
          { label: e.role },
        ]}
        title={
          <input
            className={editPageCls.inputTitle}
            value={e.role}
            onChange={(ev) => update("role", ev.target.value)}
            placeholder="Role / title"
          />
        }
      />
      <div className={editPageCls.form}>
        <div className={editPageCls.formMain}>
          <FormSection title="Details">
            <Field label="Blurb" hint="One or two sentences">
              <Textarea value={e.blurb} onChange={(v) => update("blurb", v)} variant="lede" placeholder="What you did there…" />
            </Field>
            <Field label="Stack / Tags">
              <Chips value={e.stack} onChange={(v) => update("stack", v)} />
            </Field>
          </FormSection>
          <FormBar
            onSave={save}
            onDiscard={back}
            onDelete={remove}
            saving={saving}
            savedAt={savedAt}
          />
        </div>
        <div className={editPageCls.formSide}>
          <div className={editPageCls.sideCard}>
            <div className={editPageCls.sideCardTitle}>At a glance</div>
            <div className={editPageCls.sideCardRow}>
              <span className={editPageCls.sideCardKey}>ID</span>
              <span className={editPageCls.sideCardVal}>{isNew ? "new" : e.id}</span>
            </div>
            <div className={editPageCls.sideCardRow}>
              <span className={editPageCls.sideCardKey}>Kind</span>
              <span className={editPageCls.sideCardVal}><Badge kind={e.kind}>{e.kind}</Badge></span>
            </div>
          </div>
          <FormSection title="Meta">
            <Field label="When">
              <TextInput value={e.when} onChange={(v) => update("when", v)} placeholder="2024 — 2025" />
            </Field>
            <Field label="Where">
              <TextInput value={e.where} onChange={(v) => update("where", v)} placeholder="Company / institution" />
            </Field>
            <Field label="Kind">
              <Segmented
                value={e.kind}
                onChange={(v) => update("kind", v)}
                options={[
                  { value: "self", label: "Self", dot: "#b794f6" },
                  { value: "role", label: "Role", dot: "#b8b8c4" },
                  { value: "edu", label: "Edu", dot: "#f1c45b" },
                ]}
              />
            </Field>
          </FormSection>
        </div>
      </div>
    </div>
  );
}
