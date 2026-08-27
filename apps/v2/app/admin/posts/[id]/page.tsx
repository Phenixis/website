"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Post } from "../../../data";
import {
  Badge, FormBar, FormSection, Field, PageHead,
  TextInput, Textarea, Chips, Paragraphs, Segmented, editPageCls,
} from "../../_components/ui";

const BLANK: Post = {
  id: "",
  title: "Untitled post",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  readTime: "",
  tags: [],
  excerpt: "",
  body: [""],
  published: false,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `post-${Date.now()}`;
}

export default function PostEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [p, setP] = useState<Post>(BLANK);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const update = (key: keyof Post, val: unknown) =>
    setP((prev) => ({ ...prev, [key]: val }));

  const back = () => router.push("/admin/posts");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/posts/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) { router.replace("/admin/posts"); return; }
        setP(data);
        setLoading(false);
      });
  }, [id, isNew, router]);

  const save = async () => {
    setSaving(true);
    const payload = isNew ? { ...p, id: slugify(p.title) } : p;
    await fetch(isNew ? "/api/posts" : `/api/posts/${p.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSavedAt(new Date());
    if (isNew) router.push("/admin/posts");
  };

  const remove = async () => {
    if (!window.confirm("Delete this post?")) return;
    await fetch(`/api/posts/${p.id}`, { method: "DELETE" });
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
          { label: "Writing", onClick: back },
          { label: p.title },
        ]}
        title={
          <input
            className={editPageCls.inputTitle}
            value={p.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Post title"
          />
        }
      />
      <div className={editPageCls.form}>
        <div className={editPageCls.formMain}>
          <FormSection title="Content">
            <Field label="Excerpt" hint="Lede shown in the list and as the article intro">
              <Textarea value={p.excerpt} onChange={(v) => update("excerpt", v)} variant="lede" placeholder="Opening line…" />
            </Field>
            <Field label="Body" hint="One paragraph per block">
              <Paragraphs value={p.body} onChange={(v) => update("body", v)} />
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
              <span className={editPageCls.sideCardVal}>
                <Badge kind={p.published === false ? "draft" : "published"}>
                  {p.published === false ? "draft" : "published"}
                </Badge>
              </span>
            </div>
          </div>
          <FormSection title="Visibility">
            <Field label="Status">
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
          <FormSection title="Meta">
            <Field label="Date">
              <TextInput value={p.date} onChange={(v) => update("date", v)} placeholder="Apr 02, 2026" />
            </Field>
            <Field label="Read time">
              <TextInput value={p.readTime} onChange={(v) => update("readTime", v)} placeholder="8 min" />
            </Field>
            <Field label="Tags">
              <Chips value={p.tags} onChange={(v) => update("tags", v)} />
            </Field>
          </FormSection>
        </div>
      </div>
    </div>
  );
}
