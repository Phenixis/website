"use client";

import { useState, useEffect, useRef } from "react";
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
  const [error, setError] = useState<string | null>(null);
  // Set once a new post has been created (by autosave), so later saves PUT instead of POST.
  const [createdId, setCreatedId] = useState<string | null>(null);

  // `rev` counts edits, `savedRev` is the edit count last persisted; they differ while dirty.
  const rev = useRef(0);
  const savedRev = useRef(0);
  const saveInFlight = useRef(false);
  // Autosave only while the persisted copy is a draft, so it never edits or unpublishes a live post.
  const persistedAsDraft = useRef(true);

  const postId = isNew ? createdId : id;

  const update = (key: keyof Post, val: unknown) => {
    rev.current += 1;
    setP((prev) => ({ ...prev, [key]: val }));
  };

  const back = () => router.push("/admin/posts");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/posts/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) { router.replace("/admin/posts"); return; }
        persistedAsDraft.current = data.published === false;
        setP(data);
        setLoading(false);
      });
  }, [id, isNew, router]);

  // Slug from the title, made unique so a new post never overwrites an existing one.
  const newId = async () => {
    const slug = slugify(p.title);
    const taken = await fetch(`/api/posts/${slug}`).then((r) => r.ok);
    return taken ? `${slug}-${Date.now()}` : slug;
  };

  const save = async ({ auto = false } = {}) => {
    if (saveInFlight.current) return;
    saveInFlight.current = true;
    setSaving(true);
    setError(null);
    const sentRev = rev.current;
    try {
      const creating = postId === null;
      const payload = creating ? { ...p, id: await newId() } : p;
      const res = await fetch(creating ? "/api/posts" : `/api/posts/${postId}`, {
        method: creating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Save failed (${res.status})`);
      }
      savedRev.current = sentRev;
      persistedAsDraft.current = payload.published === false;
      setSavedAt(new Date());
      if (creating) {
        setCreatedId(payload.id);
        setP((prev) => ({ ...prev, id: payload.id }));
        if (!auto) router.push("/admin/posts");
      } else if (isNew && !auto) {
        router.push("/admin/posts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      saveInFlight.current = false;
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!postId) { back(); return; }
    if (!window.confirm("Delete this post?")) return;
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    back();
  };

  // Debounced autosave of drafts: 3s after the last edit, only if something changed.
  useEffect(() => {
    if (loading || rev.current === savedRev.current) return;
    if (p.published !== false || !persistedAsDraft.current) return;
    // Don't create an empty "Untitled post" before anything meaningful is typed.
    if (postId === null && p.title === BLANK.title && !p.excerpt && !p.body.some((b) => b.trim())) return;
    const timer = setTimeout(() => { save({ auto: true }); }, 3_000);
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
            onSave={() => save()}
            onDiscard={back}
            onDelete={remove}
            saving={saving}
            savedAt={savedAt}
            error={error}
          />
        </div>
        <div className={editPageCls.formSide}>
          <div className={editPageCls.sideCard}>
            <div className={editPageCls.sideCardTitle}>At a glance</div>
            <div className={editPageCls.sideCardRow}>
              <span className={editPageCls.sideCardKey}>ID</span>
              <span className={editPageCls.sideCardVal}>{postId ?? "new"}</span>
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
