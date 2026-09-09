"use client";

import React, { useState } from "react";

export const COLOR_OPTIONS = [
  "#a78bfa", "#7dd3fc", "#fcd34d", "#f472b6",
  "#86efac", "#fb923c", "#c4b5fd", "#fda4af",
  "#34d399", "#60a5fa", "#fbbf24", "#f87171",
];

const inputBase =
  "font-mono text-[12.5px] bg-a-bg border border-a-border text-a-text px-[10px] py-2 rounded-[5px] w-full outline-none transition-all duration-[140ms] resize-y hover:border-a-border-focus focus:border-a-accent focus:bg-a-bg-2 focus:shadow-[0_0_0_3px_var(--color-a-accent-softer)] placeholder:text-a-text-dim placeholder:italic";

export const tableCls = {
  table: "w-full border-collapse text-[12px] font-mono",
  thead: "sticky top-0 z-[1]",
  th: "text-left text-[10px] font-medium tracking-[0.12em] uppercase text-a-text-mute px-[14px] py-[10px] bg-a-bg-2 border-b border-a-border whitespace-nowrap",
  thNum: "w-[50px] pl-[22px] max-[560px]:hidden",
  thActions: "w-[60px] text-right pr-[22px]",
  colMd: "max-[560px]:hidden",
  colLg: "max-[720px]:hidden",
  tr: "group border-b border-a-border cursor-pointer transition-colors duration-[120ms] hover:bg-a-bg-2",
  td: "px-[14px] py-3 align-middle text-a-text",
  tdNum: "text-a-text-dim tabular-nums text-[11px] pl-[22px] w-[50px] max-[560px]:hidden",
  tdTitle: "font-medium",
  tdMuted: "text-a-text-mute",
  tdActions: "text-right pr-[22px] w-[60px]",
  tdTitleInner: "flex items-center",
  tdColorDot: "inline-block w-[10px] h-[10px] rounded-[2px] align-middle mr-2",
  tdTitleName: "text-a-text",
  tdTitleSub: "block text-a-text-dim text-[10.5px] mt-px tracking-[0.02em]",
  tdChipRow: "flex gap-1 flex-wrap",
  tdChip: "text-[10px] bg-a-bg-3 border border-a-border-strong rounded-[3px] px-[6px] py-px text-a-text-2",
  rowArrow: "text-a-text-dim text-[14px] transition-all duration-[160ms] inline-block group-hover:text-a-accent group-hover:translate-x-[2px]",
};

export const pageBodyCls = "scroll-thin-a-wide flex-1 overflow-y-auto p-0";

export const formBarCls =
  "sticky bottom-0 [background:linear-gradient(180deg,transparent,var(--color-a-bg-2)_30%)] pt-6 px-9 pb-[18px] -mx-9 -mb-20 mt-6 border-t border-a-border flex items-center gap-[10px] max-[980px]:-mx-6 max-[980px]:px-6 max-[980px]:-mb-9 max-[560px]:-mx-4 max-[560px]:px-4 max-[560px]:-mb-8 max-[560px]:flex-wrap max-[560px]:gap-2";

export const mediaCls = {
  grid: "grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 px-7 py-5",
  card: "flex flex-col gap-2 bg-a-surface border border-a-border rounded-md overflow-hidden cursor-pointer transition-colors duration-[140ms] hover:border-a-border-strong hover:bg-a-surface-2",
  cardUpload: "border-dashed",
  thumb: "aspect-[4/3] bg-a-bg-3 flex items-center justify-center",
  thumbUpload: "bg-transparent",
  thumbIcon: "text-[28px] text-a-text-dim",
  info: "px-[10px] pt-2 pb-[10px]",
  name: "block text-[11px] text-a-text overflow-hidden text-ellipsis whitespace-nowrap",
  size: "block text-[10px] text-a-text-mute mt-[2px]",
};

export const emptyCls = {
  wrap: "flex flex-col items-center justify-center py-20 px-6 gap-[10px] text-center",
  icon: "text-[32px] text-a-text-dim font-serif italic",
  label: "text-[14px] font-medium text-a-text-2",
  hint: "text-[11.5px] text-a-text-mute max-w-[320px] leading-[1.6]",
};

export const kbdCls = "text-[9.5px] ml-1 px-1 rounded-[3px] bg-white/[0.06] text-a-text-mute tracking-[0.05em]";

export const editPageCls = {
  wrapper: "flex flex-col h-full overflow-hidden",
  loading: "flex items-center justify-center h-full text-a-text-mute",
  inputTitle:
    "font-serif font-normal text-[22px] tracking-[-0.01em] px-[14px] py-3 bg-transparent border border-transparent rounded-[5px] w-full outline-none transition-all duration-[140ms] text-a-text hover:bg-a-bg-2 hover:border-a-border focus:bg-a-bg-2 focus:border-a-accent placeholder:text-a-text-dim placeholder:italic",
  form: "grid grid-cols-[1fr_320px] h-full overflow-hidden max-[1100px]:grid-cols-[1fr_280px] max-[980px]:grid-cols-1 max-[980px]:overflow-y-auto",
  formMain:
    "scroll-thin-a-wide overflow-y-auto pt-7 px-9 pb-20 border-r border-a-border max-[1100px]:pt-[22px] max-[1100px]:px-[26px] max-[980px]:border-r-0 max-[980px]:border-b max-[980px]:border-a-border max-[980px]:pt-[22px] max-[980px]:px-6 max-[980px]:pb-9 max-[980px]:overflow-visible max-[560px]:pt-[18px] max-[560px]:px-4 max-[560px]:pb-8",
  formSide:
    "scroll-thin-a-wide overflow-y-auto pt-6 px-[22px] pb-15 bg-a-bg-2 max-[1100px]:pt-5 max-[1100px]:px-4 max-[980px]:overflow-visible max-[980px]:pt-5 max-[980px]:px-6 max-[980px]:pb-12 max-[560px]:pt-4 max-[560px]:px-4 max-[560px]:pb-10",
  sideCard: "p-[14px] bg-a-bg-3 border border-a-border rounded-md mb-[14px]",
  sideCardTitle: "text-[10px] tracking-[0.15em] uppercase text-a-text-mute mb-[10px]",
  sideCardRow: "flex items-baseline gap-[10px] py-1 text-[11.5px]",
  sideCardKey: "text-a-text-mute flex-none basis-20 text-[10.5px] tracking-[0.05em]",
  sideCardVal: "text-a-text flex-1",
};

const BADGE_COLORS: Record<string, string> = {
  shipping: "text-a-green bg-a-green-soft",
  published: "text-a-green bg-a-green-soft",
  self: "text-a-green bg-a-green-soft",
  paused: "text-a-amber bg-a-amber-soft",
  draft: "text-a-amber bg-a-amber-soft",
  edu: "text-a-amber bg-a-amber-soft",
  archived: "text-a-text-mute bg-[rgba(110,110,128,0.1)]",
  role: "text-a-text-mute bg-[rgba(110,110,128,0.1)]",
  accent: "text-a-accent bg-a-accent-soft",
  side: "text-a-accent bg-a-accent-soft",
};

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
    <header className="flex-none px-7 pt-[22px] pb-4 border-b border-a-border max-[1100px]:px-[22px] max-[1100px]:pt-[18px] max-[1100px]:pb-[14px] max-[720px]:px-[18px] max-[720px]:pt-4 max-[720px]:pb-3 max-[560px]:px-4 max-[560px]:pt-[14px] max-[560px]:pb-[10px]">
      {crumbs && crumbs.length > 0 && (
        <div className="flex items-center gap-2 text-[10.5px] text-a-text-mute tracking-[0.12em] uppercase mb-[10px]">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: "contents" }}>
              {c.onClick ? (
                <button
                  className="text-a-text-mute bg-transparent border-0 p-0 [font:inherit] [letter-spacing:inherit] [text-transform:inherit] cursor-pointer hover:text-a-accent"
                  onClick={c.onClick}
                >
                  {c.label}
                </button>
              ) : (
                <span className={i === crumbs.length - 1 ? "text-a-text" : ""}>{c.label}</span>
              )}
              {i < crumbs.length - 1 && <span className="text-a-text-dim">›</span>}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          {typeof title === "string" ? (
            <h1 className="font-serif font-light text-[32px] tracking-[-0.015em] m-0 text-a-text leading-[1.05] max-[720px]:text-[26px] max-[560px]:text-[22px]">
              {title}
            </h1>
          ) : (
            title
          )}
          {sub && <p className="mt-1 mb-0 text-[12px] text-a-text-mute italic font-serif font-light">{sub}</p>}
        </div>
        {actions && (
          <div className="flex items-center gap-2 max-[720px]:[&>button:not([data-variant=primary])]:hidden">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-7 py-3 border-b border-a-border bg-a-bg-2 text-[11.5px] max-[1100px]:px-[22px] max-[1100px]:py-[10px] max-[720px]:px-[18px] max-[720px]:py-[10px] max-[720px]:gap-[6px] max-[720px]:flex-wrap max-[560px]:px-4 max-[560px]:py-2">
      {children}
    </div>
  );
}

export function Btn({
  children,
  variant,
  size,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  size?: "sm";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = [
    "font-mono text-[11.5px] bg-a-bg-3 border border-a-border-strong text-a-text px-[11px] py-[5px] rounded-[5px] cursor-pointer inline-flex items-center gap-[6px] transition-all duration-[140ms] whitespace-nowrap tracking-[0.01em] hover:bg-a-surface hover:border-a-border-focus active:translate-y-[0.5px]",
    variant === "primary" ? "bg-a-accent border-a-accent text-[#0a0a14] font-semibold hover:bg-a-accent-2 hover:border-a-accent-2" : "",
    variant === "ghost" ? "bg-transparent border-transparent text-a-text-mute hover:text-a-text hover:bg-a-bg-3 hover:border-transparent" : "",
    variant === "danger" ? "text-a-red hover:bg-a-red-soft hover:border-a-red hover:text-a-red" : "",
    size === "sm" ? "text-[10.5px] px-2 py-1" : "",
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} data-variant={variant ?? "default"} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Badge({ kind, children }: { kind: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] tracking-[0.08em] uppercase px-[7px] py-[2px] rounded-[3px] font-medium whitespace-nowrap ${BADGE_COLORS[kind] ?? ""}`}>
      <span className="w-[5px] h-[5px] rounded-full bg-current" />
      {children}
    </span>
  );
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-[14px] pb-[22px] [&+&]:border-t [&+&]:border-a-border [&+&]:mt-[14px]">
      <h3 className="text-[10.5px] tracking-[0.18em] uppercase text-a-text-mute m-0 mb-[14px] font-medium">
        <span className="text-a-accent mr-[6px]">●</span>
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
  error,
}: {
  onSave: () => void;
  onDiscard: () => void;
  onDelete: () => void;
  saving?: boolean;
  savedAt?: Date | null;
  error?: string | null;
}) {
  const status = saving
    ? "Saving…"
    : savedAt
    ? `Saved ${timeAgo(savedAt)}`
    : "Unsaved changes";

  return (
    <div className={formBarCls}>
      <div className={`flex items-center gap-2 text-[11px] italic ${error ? "text-red-400" : "text-a-text-mute"}`}>
        {error ?? status}
      </div>
      <div className="flex-1" />
      <Btn variant="danger" onClick={onDelete}>Delete</Btn>
      <Btn variant="ghost" onClick={onDiscard}>Discard</Btn>
      <Btn variant="primary" onClick={onSave}>
        {saving ? "Saving…" : <>Save changes <span className={kbdCls}>⌘S</span></>}
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
    <div className="flex flex-col gap-[6px] py-[10px] [&+&]:border-t [&+&]:border-dashed [&+&]:border-a-border [&+&]:pt-[14px]">
      <div className="flex items-baseline gap-[10px]">
        <span className="text-[11px] text-a-text tracking-[0.05em] font-medium">{label}</span>
        {hint && <span className="text-[10.5px] text-a-text-mute italic font-serif font-light">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      className={inputBase}
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
  const variantCls =
    variant === "lede"
      ? "font-serif italic text-[16px] leading-[1.5] font-light text-a-text-2 min-h-[80px]"
      : variant === "body"
        ? "min-h-[120px] leading-[1.7]"
        : "";
  return (
    <textarea
      className={`${inputBase} ${variantCls}`}
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
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[] | { value: string; label: string }[];
  disabled?: boolean;
}) {
  const normalized = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <select
      disabled={disabled}
      className={`${inputBase} appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%236e6e80%22%20fill%3D%22none%22%20stroke-width%3D%221.4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center] pr-7 resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {normalized.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
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
    <div className="inline-flex bg-a-bg border border-a-border rounded-[5px] p-[2px] gap-px w-full">
      {options.map((o) => (
        <button
          key={o.value}
          className={[
            "flex-1 font-mono text-[11px] bg-transparent border-0 text-a-text-mute px-2 py-[5px] rounded-[3px] cursor-pointer transition-all duration-[140ms] tracking-[0.04em] flex items-center justify-center gap-1 hover:text-a-text",
            value === o.value ? "bg-a-bg-3 text-a-text shadow-[0_0_0_1px_var(--color-a-border-strong)]" : "",
          ].join(" ")}
          onClick={() => onChange(o.value)}
        >
          {o.dot && <span className="w-[5px] h-[5px] rounded-full bg-current" style={{ background: o.dot }} />}
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
    <div className="flex flex-wrap gap-1 p-[6px] bg-a-bg border border-a-border rounded-[5px] min-h-9 items-center focus-within:border-a-accent focus-within:shadow-[0_0_0_3px_var(--color-a-accent-softer)]">
      {(value || []).map((v, i) => (
        <span key={i} className="inline-flex items-center gap-[6px] bg-a-accent-soft border border-[rgba(183,148,246,0.2)] rounded-[3px] pl-2 pr-1 py-[2px] font-mono text-[11px] text-a-accent-2">
          {v}
          <button
            className="bg-transparent border-0 text-a-text-mute cursor-pointer text-[12px] px-1 rounded-[3px] leading-none hover:text-a-red"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[80px] bg-transparent border-0 text-a-text font-mono text-[12px] outline-none px-[6px] py-1 placeholder:text-a-text-dim placeholder:italic"
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
    <div className="flex flex-wrap gap-[6px]">
      {options.map((c) => (
        <button
          key={c}
          className={[
            "w-7 h-7 rounded-[5px] border-2 border-a-border cursor-pointer relative p-0 bg-transparent transition-[transform,border-color] duration-[140ms] hover:-translate-y-px hover:border-a-border-strong",
            value === c
              ? "border-a-text after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-[rgba(0,0,0,0.6)] after:text-[14px] after:font-bold"
              : "",
          ].join(" ")}
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
  const linkInput =
    "font-mono bg-a-bg border border-a-border text-a-text rounded-[5px] w-full outline-none transition-all duration-[140ms] hover:border-a-border-focus focus:border-a-accent focus:bg-a-bg-2 focus:shadow-[0_0_0_3px_var(--color-a-accent-softer)] placeholder:text-a-text-dim placeholder:italic px-2 py-[5px] text-[11.5px]";
  return (
    <div className="flex flex-col gap-[6px]">
      {value.map((l, i) => (
        <div key={i} className="grid grid-cols-[1fr_1.5fr_24px] gap-1 items-center">
          <input
            className={linkInput}
            value={l.label}
            onChange={(e) =>
              onChange(value.map((x, j) => j === i ? { ...x, label: e.target.value } : x))
            }
            placeholder="Label"
          />
          <input
            className={linkInput}
            value={l.href}
            onChange={(e) =>
              onChange(value.map((x, j) => j === i ? { ...x, href: e.target.value } : x))
            }
            placeholder="https://..."
          />
          <button
            className="bg-transparent border border-transparent text-a-text-dim cursor-pointer rounded-[3px] h-[26px] flex items-center justify-center text-[13px] hover:text-a-red hover:border-a-border"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="self-start text-[10.5px] text-a-accent bg-transparent border border-dashed border-a-border-strong px-[10px] py-1 rounded-[4px] cursor-pointer font-mono tracking-[0.05em] mt-[2px] hover:border-a-accent"
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
    <div className="flex flex-col gap-[10px]">
      {value.map((p, i) => (
        <div key={i} className="grid grid-cols-[40px_1fr_24px] gap-2 items-start">
          <div className="font-serif italic text-[14px] text-a-accent pt-[14px] text-center tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </div>
          <textarea
            className="font-mono text-[12.5px] bg-a-bg border border-a-border text-a-text px-3 py-2 rounded-[5px] outline-none resize-y min-h-16 leading-[1.65] w-full focus:border-a-accent focus:bg-a-bg-2"
            value={p}
            onChange={(e) => onChange(value.map((x, j) => j === i ? e.target.value : x))}
          />
          <button
            className="bg-transparent border-0 text-a-text-dim text-[14px] cursor-pointer pt-[10px] hover:text-a-red"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="self-start text-[10.5px] text-a-accent bg-transparent border border-dashed border-a-border-strong px-3 py-1 rounded-[4px] cursor-pointer font-mono tracking-[0.05em] hover:border-a-accent"
        onClick={() => onChange([...value, ""])}
      >
        + Add paragraph
      </button>
    </div>
  );
}

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-3 text-a-text-mute font-mono">
      <span className="text-[36px] font-serif italic font-light text-a-text-dim">{title}</span>
      <span className="text-[11px] tracking-[0.12em] uppercase">Not yet designed</span>
    </div>
  );
}
