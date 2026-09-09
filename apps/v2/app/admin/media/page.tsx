"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Btn, PageHead, Toolbar, pageBodyCls, mediaCls, emptyCls, kbdCls } from "../_components/ui";

type MediaItem = {
  url: string;
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

export default function MediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data: MediaItem[]) => setItems(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      await upload(file.name, file, { access: "public", handleUploadUrl: "/api/media/upload" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (url: string) => {
    if (!window.confirm("Delete this file?")) return;
    setItems((prev) => prev.filter((i) => i.url !== url));
    await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
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
            <span className={emptyCls.hint}>Upload an image to use as a hero or thumbnail.</span>
          </div>
        ) : (
          <div className={mediaCls.grid}>
            {items.map((item) => (
              <div key={item.url} className={`group relative ${mediaCls.card}`}>
                <button
                  className="absolute top-1 right-1 z-10 w-5 h-5 rounded-[3px] bg-black/60 text-white/80 text-[12px] leading-none opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.url);
                  }}
                  title="Delete"
                >
                  ×
                </button>
                <a href={item.url} target="_blank" rel="noreferrer" className={mediaCls.thumb}>
                  {isImage(item.pathname) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- external blob URL, not a local asset
                    <img src={item.url} alt={item.pathname} className="w-full h-full object-cover" />
                  ) : (
                    <span className={mediaCls.thumbIcon}>◻</span>
                  )}
                </a>
                <div className={mediaCls.info}>
                  <span className={mediaCls.name}>{item.pathname}</span>
                  <span className={mediaCls.size}>{formatSize(item.size)}</span>
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
