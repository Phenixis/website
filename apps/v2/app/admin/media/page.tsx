"use client";

import { useRef } from "react";
import { Btn, PageHead, Toolbar, pageBodyCls, kbdCls, mediaCls } from "../_components/ui";

const PLACEHOLDER_ITEMS = [
  { id: "hero-cartograph", name: "hero-cartograph.png", size: "142 KB", kind: "image" },
  { id: "hero-tideline", name: "hero-tideline.png", size: "98 KB", kind: "image" },
  { id: "og-default", name: "og-default.png", size: "56 KB", kind: "image" },
];

export default function MediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);

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
              onChange={() => {
                // TODO: wire to upload API once storage is configured
                alert("Upload endpoint not yet configured.");
                if (inputRef.current) inputRef.current.value = "";
              }}
            />
            <Btn variant="primary" onClick={() => inputRef.current?.click()}>
              + Upload
            </Btn>
          </>
        }
      />
      <Toolbar>
        <Btn size="sm">All <span className={kbdCls}>{PLACEHOLDER_ITEMS.length}</span></Btn>
        <Btn size="sm" variant="ghost">Images</Btn>
        <span className="flex-1" />
        <Btn size="sm" variant="ghost">Grid ⊞</Btn>
      </Toolbar>
      <div className={pageBodyCls}>
        <div className={mediaCls.grid}>
          {PLACEHOLDER_ITEMS.map((item) => (
            <div key={item.id} className={mediaCls.card}>
              <div className={mediaCls.thumb}>
                <span className={mediaCls.thumbIcon}>◻</span>
              </div>
              <div className={mediaCls.info}>
                <span className={mediaCls.name}>{item.name}</span>
                <span className={mediaCls.size}>{item.size}</span>
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
      </div>
    </>
  );
}
