"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Experience } from "../../../data";
import {
  Badge, FormBar, FormSection, Field, PageHead,
  TextInput, Textarea, Segmented, Select, Chips, editPageCls,
} from "../../_components/ui";

const BLANK: Experience = {
  id: "",
  startDate: new Date().toISOString().slice(0, 7),
  endDate: null,
  role: "Untitled role",
  where: "",
  kind: "role",
  blurb: "",
  stack: [],
  published: false,
};

const NO_PARENT = "";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `exp-${Date.now()}`;
}

// True if setting `currentId`'s parent to `candidateId` would create a loop
// (directly, e.g. A ↔ B, or through a longer chain, e.g. A → B → C → A).
function wouldCreateCycle(candidateId: string, currentId: string, all: Experience[]): boolean {
  const seen = new Set<string>();
  let cur: string | undefined = candidateId;
  while (cur) {
    if (cur === currentId) return true;
    if (seen.has(cur)) return false;
    seen.add(cur);
    cur = all.find((x) => x.id === cur)?.parentId;
  }
  return false;
}

export default function ExperienceEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [e, setE] = useState<Experience>(BLANK);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);

  const update = (key: keyof Experience, val: unknown) =>
    setE((prev) => ({ ...prev, [key]: val }));

  const back = () => router.push("/admin/experiences");

  useEffect(() => {
    fetch("/api/experiences").then((r) => r.json()).then(setAllExperiences);
  }, []);

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
    setSaveError(null);
    const payload = isNew ? { ...e, id: slugify(e.role) } : e;
    const res = await fetch(isNew ? "/api/experiences" : `/api/experiences/${e.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      setSaveError(`Save failed (${res.status})`);
      return;
    }
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
            error={saveError}
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
            <div className={editPageCls.sideCardRow}>
              <span className={editPageCls.sideCardKey}>Visibility</span>
              <span className={editPageCls.sideCardVal}>
                <Badge kind={e.published === false ? "draft" : "published"}>
                  {e.published === false ? "draft" : "published"}
                </Badge>
              </span>
            </div>
          </div>
          <FormSection title="Visibility">
            <Field label="Visibility" hint="Drafts never show up on the public site">
              <Segmented
                value={e.published === false ? "draft" : "published"}
                onChange={(v) => update("published", v === "published")}
                options={[
                  { value: "published", label: "Published", dot: "#74e893" },
                  { value: "draft", label: "Draft", dot: "#f1c45b" },
                ]}
              />
            </Field>
          </FormSection>
          <FormSection title="Meta">
            <Field label="Start date">
              <TextInput type="month" value={e.startDate} onChange={(v) => update("startDate", v)} />
            </Field>
            <Field label="End date" hint="Leave empty if this is ongoing">
              <TextInput type="month" value={e.endDate ?? ""} onChange={(v) => update("endDate", v || null)} />
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
            <Field label="Parallel to" hint="Nests this entry under another one happening at the same time, e.g. a work-study under a degree">
              <Select
                value={e.parentId ?? NO_PARENT}
                onChange={(v) => update("parentId", v === NO_PARENT ? undefined : v)}
                options={[
                  { value: NO_PARENT, label: "— none —" },
                  ...allExperiences
                    .filter((x) => x.id !== e.id && !wouldCreateCycle(x.id, e.id, allExperiences))
                    .map((x) => ({ value: x.id, label: `${x.role} — ${x.where}` })),
                ]}
              />
            </Field>
          </FormSection>
        </div>
      </div>
    </div>
  );
}
