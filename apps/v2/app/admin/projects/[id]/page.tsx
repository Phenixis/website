"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Project } from "../../../data";
import {
  Badge, Btn, FormBar, FormSection, Field, PageHead,
  TextInput, Textarea, Select, Segmented, Chips, Swatches, LinkList, Paragraphs,
  COLOR_OPTIONS, editPageCls,
} from "../../_components/ui";

const BLANK: Project = {
  id: "",
  title: "Untitled project",
  year: String(new Date().getFullYear()),
  kind: "App",
  status: "paused",
  blurb: "",
  body: [""],
  stack: [],
  color: "#a78bfa",
  published: false,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `project-${Date.now()}`;
}

export default function ProjectEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [p, setP] = useState<Project>(BLANK);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const update = (key: keyof Project, val: unknown) =>
    setP((prev) => ({ ...prev, [key]: val }));

  const back = () => router.push("/admin/projects");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/projects/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) { router.replace("/admin/projects"); return; }
        setP(data);
        setLoading(false);
      });
  }, [id, isNew, router]);

  const save = async () => {
    setSaving(true);
    const payload = isNew ? { ...p, id: slugify(p.title) } : p;
    await fetch(isNew ? "/api/projects" : `/api/projects/${p.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSavedAt(new Date());
    if (isNew) router.push("/admin/projects");
  };

  const remove = async () => {
    if (!window.confirm("Delete this project?")) return;
    await fetch(`/api/projects/${p.id}`, { method: "DELETE" });
    back();
  };

  // 30s autosave
  useEffect(() => {
    if (isNew || loading) return;
    const timer = setTimeout(() => { save(); }, 30_000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  if (loading) {
    return <div className={editPageCls.loading}>Loading…</div>;
  }

  return (
    <div className={editPageCls.wrapper}>
      <PageHead
        crumbs={[
          { label: "Projects", onClick: back },
          { label: p.title },
        ]}
        title={
          <input
            className={editPageCls.inputTitle}
            value={p.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Project title"
          />
        }
      />
      <div className={editPageCls.form}>
        <div className={editPageCls.formMain}>
          <FormSection title="Content">
            <Field label="Blurb" hint="One-liner shown on card and in meta">
              <Textarea
                value={p.blurb}
                onChange={(v) => update("blurb", v)}
                variant="lede"
                placeholder="Short description…"
              />
            </Field>
            <Field label="Body" hint="Full write-up · one paragraph per block">
              <Paragraphs value={p.body} onChange={(v) => update("body", v)} />
            </Field>
          </FormSection>
          <FormSection title="Links">
            <Field label="External links">
              <LinkList value={p.links ?? []} onChange={(v) => update("links", v)} />
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
              <span className={editPageCls.sideCardVal}>{isNew ? "new" : p.id}</span>
            </div>
            <div className={editPageCls.sideCardRow}>
              <span className={editPageCls.sideCardKey}>Status</span>
              <span className={editPageCls.sideCardVal}><Badge kind={p.status}>{p.status}</Badge></span>
            </div>
            <div className={editPageCls.sideCardRow}>
              <span className={editPageCls.sideCardKey}>Visibility</span>
              <span className={editPageCls.sideCardVal}>
                <Badge kind={p.published === false ? "draft" : "published"}>
                  {p.published === false ? "draft" : "published"}
                </Badge>
              </span>
            </div>
          </div>
          <FormSection title="Visibility">
            <Field label="Visibility" hint="Drafts never show up on the public site">
              <Segmented
                value={p.published === false ? "draft" : "published"}
                onChange={(v) => update("published", v === "published")}
                options={[
                  { value: "published", label: "Published", dot: "#74e893" },
                  { value: "draft", label: "Draft", dot: "#f1c45b" },
                ]}
              />
            </Field>
          </FormSection>
          <FormSection title="Status & Kind">
            <Field label="Status">
              <Segmented
                value={p.status}
                onChange={(v) => update("status", v)}
                options={[
                  { value: "shipping", label: "Shipping", dot: "#74e893" },
                  { value: "paused", label: "Paused", dot: "#f1c45b" },
                  { value: "archived", label: "Archived", dot: "#6e6e80" },
                ]}
              />
            </Field>
            <Field label="Kind">
              <Select
                value={p.kind}
                onChange={(v) => update("kind", v)}
                options={["App", "Tool", "Writing", "Music", "Library", "Other"]}
              />
            </Field>
            <Field label="Year">
              <TextInput value={p.year} onChange={(v) => update("year", v)} placeholder="2025" />
            </Field>
          </FormSection>
          <FormSection title="People & Stack">
            <Field label="Role">
              <TextInput value={p.role ?? ""} onChange={(v) => update("role", v)} placeholder="Solo · Design + Engineering" />
            </Field>
            <Field label="Stack">
              <Chips value={p.stack} onChange={(v) => update("stack", v)} />
            </Field>
          </FormSection>
          <FormSection title="Appearance">
            <Field label="Accent color">
              <Swatches value={p.color} onChange={(v) => update("color", v)} options={COLOR_OPTIONS} />
            </Field>
          </FormSection>
        </div>
      </div>
    </div>
  );
}
