"use client";

import { useRef } from "react";
import { Btn, PageHead, Toolbar } from "../_components/ui";

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
        <Btn size="sm">All <span className="a-btn-kbd">{PLACEHOLDER_ITEMS.length}</span></Btn>
        <Btn size="sm" variant="ghost">Images</Btn>
        <span className="a-toolbar-spacer" />
        <Btn size="sm" variant="ghost">Grid ⊞</Btn>
      </Toolbar>
      <div className="a-page-body">
        <div className="a-media-grid">
          {PLACEHOLDER_ITEMS.map((item) => (
            <div key={item.id} className="a-media-card">
              <div className="a-media-thumb">
                <span className="a-media-thumb-icon">◻</span>
              </div>
              <div className="a-media-info">
                <span className="a-media-name">{item.name}</span>
                <span className="a-media-size">{item.size}</span>
              </div>
            </div>
          ))}
          <button className="a-media-card a-media-card--upload" onClick={() => inputRef.current?.click()}>
            <div className="a-media-thumb a-media-thumb--upload">
              <span className="a-media-upload-icon">+</span>
            </div>
            <div className="a-media-info">
              <span className="a-media-name">Upload file</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
