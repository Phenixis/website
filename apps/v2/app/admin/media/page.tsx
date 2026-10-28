"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Btn, PageHead, Toolbar, pageBodyCls, mediaCls, emptyCls, kbdCls } from "../_components/ui";

type MediaItem = {
  /** Blob URL — private, only used to identify the file for deletion. */
  url: string;
  /** Where the site serves the file (/media/…). */
  src: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(pathname: string): boolean {
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(pathname);
}

/**
 * The Clipboard API only exists in secure contexts (HTTPS, localhost), so over
 * plain HTTP — the dev server reached from another machine — fall back to a
 * selected textarea, then to a prompt the text can be copied from by hand.
 */
async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied: try the fallbacks below.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) window.prompt("Copy the Markdown:", text);
  return copied;
}

export default function MediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copyMarkdown = async (item: MediaItem) => {
    const alt = item.pathname.replace(/\.[^.]+$/, "").replace(/[[\]]/g, "");
    if (!(await copyText(`![${alt}](${item.src})`))) return;
    setCopied(item.url);
    setTimeout(() => setCopied((c) => (c === item.url ? null : c)), 1500);
  };

  const load = () => {
    fetch("/api/media")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Could not load media");
        setItems(data as MediaItem[]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load media"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      await upload(file.name, file, { access: "private", handleUploadUrl: "/api/media/upload" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm("Delete this file?")) return;
    const previous = items;
    setItems((prev) => prev.filter((i) => i.url !== item.url));
    setError(null);
    const res = await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: item.url }),
    }).catch(() => null);
    if (!res?.ok) {
      setItems(previous);
      setError(`Could not delete ${item.pathname}`);
    }
  };

  return (
    <>
      <PageHead
        title="Media"
        sub="Images and files used across projects and posts."
        actions={
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                if (inputRef.current) inputRef.current.value = "";
              }}
            />
            <Btn variant="primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading…" : "+ Upload"}
            </Btn>
          </>
        }
      />
      <Toolbar>
        <Btn size="sm">
          All <span className={kbdCls}>{items.length}</span>
        </Btn>
        <span className="flex-1" />
      </Toolbar>
      <div className={pageBodyCls}>
        {error && <p className="px-7 pb-3 text-[12px] text-a-red">{error}</p>}
        {loading ? (
          <div className={emptyCls.wrap}>
            <span className={emptyCls.label}>Loading…</span>
          </div>
        ) : items.length === 0 ? (
          <div className={emptyCls.wrap}>
            <span className={emptyCls.icon}>◻</span>
            <span className={emptyCls.label}>No media yet</span>
            <span className={emptyCls.hint}>Upload an image to use as a hero, thumbnail, or in a post body.</span>
          </div>
        ) : (
          <div className={mediaCls.grid}>
            {items.map((item) => (
              <div key={item.url} className={`group relative ${mediaCls.card}`}>
                <button
                  className="absolute top-1 right-1 z-10 w-5 h-5 rounded-[3px] bg-black/60 text-white/80 text-[12px] leading-none opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
                  }}
                  title="Delete"
                >
                  ×
                </button>
                <a href={item.src} target="_blank" rel="noreferrer" className={mediaCls.thumb}>
                  {isImage(item.pathname) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- streamed from the Blob store by /media, not a static asset
                    <img src={item.src} alt={item.pathname} className="w-full h-full object-cover" />
                  ) : (
                    <span className={mediaCls.thumbIcon}>◻</span>
                  )}
                </a>
                <div className={mediaCls.info}>
                  <span className={mediaCls.name}>{item.pathname}</span>
                  <span className={mediaCls.size}>{formatSize(item.size)}</span>
                  {isImage(item.pathname) && (
                    <button
                      className="mt-[6px] bg-transparent border-0 p-0 font-mono text-[10px] text-a-accent cursor-pointer hover:text-a-accent-2"
                      onClick={() => copyMarkdown(item)}
                      title="Copy a Markdown image tag to paste into a post or project body"
                    >
                      {copied === item.url ? "✓ Copied" : "Copy Markdown"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button className={`group ${mediaCls.card} ${mediaCls.cardUpload}`} onClick={() => inputRef.current?.click()}>
              <div className={`${mediaCls.thumb} ${mediaCls.thumbUpload}`}>
                <span className="text-[28px] text-a-text-dim font-light group-hover:text-a-accent">+</span>
              </div>
              <div className={mediaCls.info}>
                <span className={mediaCls.name}>Upload file</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
