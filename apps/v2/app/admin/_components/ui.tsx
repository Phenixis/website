"use client";

import React, { useState } from "react";

export const COLOR_OPTIONS = [
  "#a78bfa", "#7dd3fc", "#fcd34d", "#f472b6",
  "#86efac", "#fb923c", "#c4b5fd", "#fda4af",
  "#34d399", "#60a5fa", "#fbbf24", "#f87171",
];

export function PageHead({
  title,
  sub,
  actions,
  crumbs,
}: {
  title: React.ReactNode;
  sub?: string;
  actions?: React.ReactNode;
  crumbs?: { label: string; onClick?: () => void }[];
}) {
  return (
    <header className="a-page-head">
      {crumbs && crumbs.length > 0 && (
        <div className="a-page-crumbs">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: "contents" }}>
              {c.onClick ? (
                <button className="a-page-crumb-link" onClick={c.onClick}>{c.label}</button>
              ) : (
                <span className={i === crumbs.length - 1 ? "a-page-crumb-current" : ""}>{c.label}</span>
              )}
              {i < crumbs.length - 1 && <span className="a-page-crumb-sep">›</span>}
            </span>
          ))}
        </div>
      )}
      <div className="a-page-row">
        <div style={{ flex: 1, minWidth: 0 }}>
          {typeof title === "string" ? (
            <h1 className="a-page-title">{title}</h1>
          ) : (
            title
          )}
          {sub && <p className="a-page-sub">{sub}</p>}
        </div>
        {actions && <div className="a-page-actions">{actions}</div>}
      </div>
    </header>
  );
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="a-toolbar">{children}</div>;
}

export function Btn({
  children,
  variant,
  size,
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  size?: "sm";
  onClick?: () => void;
}) {
  const cls = [
    "a-btn",
    variant === "primary" ? "a-btn-primary" : "",
    variant === "ghost" ? "a-btn-ghost" : "",
    variant === "danger" ? "a-btn-danger" : "",
    size === "sm" ? "a-btn-sm" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return <button className={cls} onClick={onClick}>{children}</button>;
}

export function Badge({ kind, children }: { kind: string; children: React.ReactNode }) {
  return (
    <span className={`a-badge a-badge--${kind}`}>
      <span className="a-badge-dot" />
      {children}
    </span>
  );
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="a-form-section">
      <h3 className="a-section-title">
        <span className="a-section-title-mark">●</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function timeAgo(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function FormBar({
  onSave,
  onDiscard,
  onDelete,
  saving,
  savedAt,
}: {
  onSave: () => void;
  onDiscard: () => void;
  onDelete: () => void;
  saving?: boolean;
  savedAt?: Date | null;
}) {
  const status = saving
    ? "Saving…"
    : savedAt
    ? `Saved ${timeAgo(savedAt)}`
    : "Unsaved changes";

  return (
    <div className="a-formbar">
      <div className="a-formbar-status">{status}</div>
      <div className="a-formbar-spacer" />
      <Btn variant="danger" onClick={onDelete}>Delete</Btn>
      <Btn variant="ghost" onClick={onDiscard}>Discard</Btn>
      <Btn variant="primary" onClick={onSave} >
        {saving ? "Saving…" : <>Save changes <span className="a-btn-kbd">⌘S</span></>}
      </Btn>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="a-field">
      <div className="a-field-label-row">
        <span className="a-field-label">{label}</span>
        {hint && <span className="a-field-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className="a-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  variant,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  variant?: "lede" | "body";
}) {
  return (
    <textarea
      className={`a-textarea ${variant === "lede" ? "a-textarea--lede" : ""} ${variant === "body" ? "a-textarea--body" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select className="a-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; dot?: string }[];
}) {
  return (
    <div className="a-seg">
      {options.map((o) => (
        <button
          key={o.value}
          className={`a-seg-opt ${value === o.value ? "is-active" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.dot && <span className="a-badge-dot" style={{ background: o.dot }} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Chips({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...(value || []), v]);
    setDraft("");
  };
  return (
    <div className="a-chips">
      {(value || []).map((v, i) => (
        <span key={i} className="a-chip">
          {v}
          <button
            className="a-chip-x"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="a-chip-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          if (e.key === "Backspace" && !draft && value?.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder={placeholder || "Add and press enter"}
      />
    </div>
  );
}

export function Swatches({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="a-swatches">
      {options.map((c) => (
        <button
          key={c}
          className={`a-swatch ${value === c ? "is-active" : ""}`}
          style={{ background: c }}
          onClick={() => onChange(c)}
          title={c}
        />
      ))}
    </div>
  );
}

export function LinkList({
  value,
  onChange,
}: {
  value: { label: string; href: string }[];
  onChange: (v: { label: string; href: string }[]) => void;
}) {
  return (
    <div className="a-links">
      {value.map((l, i) => (
        <div key={i} className="a-link-row">
          <input
            className="a-input"
            value={l.label}
            onChange={(e) =>
              onChange(value.map((x, j) => j === i ? { ...x, label: e.target.value } : x))
            }
            placeholder="Label"
          />
          <input
            className="a-input"
            value={l.href}
            onChange={(e) =>
              onChange(value.map((x, j) => j === i ? { ...x, href: e.target.value } : x))
            }
            placeholder="https://..."
          />
          <button
            className="a-link-x"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="a-links-add"
        onClick={() => onChange([...value, { label: "", href: "" }])}
      >
        + Add link
      </button>
    </div>
  );
}

export function Paragraphs({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="a-paragraphs">
      {value.map((p, i) => (
        <div key={i} className="a-paragraph-row">
          <div className="a-paragraph-num">{String(i + 1).padStart(2, "0")}</div>
          <textarea
            className="a-paragraph-area"
            value={p}
            onChange={(e) => onChange(value.map((x, j) => j === i ? e.target.value : x))}
          />
          <button
            className="a-paragraph-x"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="a-paragraphs-add"
        onClick={() => onChange([...value, ""])}
      >
        + Add paragraph
      </button>
    </div>
  );
}

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flexDirection: "column",
        gap: 12,
        color: "var(--a-text-mute)",
        fontFamily: "var(--a-mono)",
      }}
    >
      <span style={{ fontSize: 36, fontFamily: "var(--a-serif)", fontStyle: "italic", fontWeight: 300, color: "var(--a-text-dim)" }}>
        {title}
      </span>
      <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Not yet designed
      </span>
    </div>
  );
}
