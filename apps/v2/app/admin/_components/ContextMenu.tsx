"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, type LucideIcon } from "lucide-react";

export type MenuEntry =
  | {
      type?: "item";
      label: string;
      onSelect: () => void;
      icon?: LucideIcon;
      /** Tailwind text colour class for a small status dot, e.g. "text-a-green". */
      dot?: string;
      danger?: boolean;
      disabled?: boolean;
      /** Marks the current value of a group (shows a check). */
      checked?: boolean;
      /** Right-aligned hint, e.g. a shortcut. */
      hint?: string;
    }
  | { type: "separator" }
  | { type: "heading"; label: string };

type OpenState = { x: number; y: number; items: MenuEntry[]; key: string | null } | null;

/**
 * Right-click menu for list rows. Call `open(event, items, rowKey)` from an `onContextMenu`
 * handler, render `menu` once in the page, and use `isOpen(rowKey)` to highlight the target row.
 */
export function useContextMenu() {
  const [state, setState] = useState<OpenState>(null);

  const open = useCallback((e: React.MouseEvent, items: MenuEntry[], key: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    setState({ x: e.clientX, y: e.clientY, items, key });
  }, []);
  const close = useCallback(() => setState(null), []);
  const isOpen = (key: string) => state?.key === key;

  const menu = state ? (
    <ContextMenu x={state.x} y={state.y} items={state.items} onClose={close} />
  ) : null;
  return { open, menu, isOpen };
}

const isItem = (e: MenuEntry): e is Extract<MenuEntry, { label: string; onSelect: () => void }> =>
  (e.type ?? "item") === "item";

function ContextMenu({ x, y, items, onClose }: { x: number; y: number; items: MenuEntry[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<{ left: number; top: number; origin: string } | null>(null);
  const [active, setActive] = useState(-1);
  const [mounted, setMounted] = useState(false);

  const enabled = items.flatMap((it, i) => (isItem(it) && !it.disabled ? [i] : []));

  useEffect(() => setMounted(true), []);

  // Place next to the cursor, flipping so it never leaves the viewport.
  useLayoutEffect(() => {
    if (!mounted || !ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    const flipX = x + width + 8 > window.innerWidth;
    const flipY = y + height + 8 > window.innerHeight;
    setPlaced({
      left: Math.max(8, flipX ? x - width : x),
      top: Math.max(8, flipY ? y - height : y),
      origin: `${flipY ? "bottom" : "top"} ${flipX ? "right" : "left"}`,
    });
  }, [mounted, x, y]);

  // Hand focus to the menu and give it back to whatever had it afterwards.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    return () => prev?.focus?.({ preventScroll: true });
  }, [mounted]);

  const select = useCallback(
    (it: Extract<MenuEntry, { label: string; onSelect: () => void }>) => {
      if (it.disabled) return;
      onClose();
      it.onSelect();
    },
    [onClose],
  );

  const move = (dir: 1 | -1 | "first" | "last") => {
    if (!enabled.length) return;
    const cur = enabled.indexOf(active);
    if (dir === "first") return setActive(enabled[0]);
    if (dir === "last") return setActive(enabled[enabled.length - 1]);
    const next = cur === -1 ? (dir === 1 ? 0 : enabled.length - 1) : (cur + dir + enabled.length) % enabled.length;
    setActive(enabled[next]);
  };

  const typeahead = useRef({ text: "", at: 0 });
  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    switch (e.key) {
      case "Escape": case "Tab": e.preventDefault(); onClose(); return;
      case "ArrowDown": e.preventDefault(); move(1); return;
      case "ArrowUp": e.preventDefault(); move(-1); return;
      case "Home": e.preventDefault(); move("first"); return;
      case "End": e.preventDefault(); move("last"); return;
      case "Enter": case " ": {
        e.preventDefault();
        const it = items[active];
        if (it && isItem(it)) select(it);
        return;
      }
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const t = typeahead.current;
      t.text = Date.now() - t.at > 700 ? e.key.toLowerCase() : t.text + e.key.toLowerCase();
      t.at = Date.now();
      const hit = enabled.find((i) => (items[i] as { label: string }).label.toLowerCase().startsWith(t.text));
      if (hit !== undefined) setActive(hit);
    }
  };

  // Any scroll or resize while open would leave the menu stranded.
  useEffect(() => {
    window.addEventListener("resize", onClose);
    window.addEventListener("blur", onClose);
    return () => {
      window.removeEventListener("resize", onClose);
      window.removeEventListener("blur", onClose);
    };
  }, [onClose]);

  // Keep the active item in view for tall menus on short screens.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!mounted) return null;

  // The backdrop covers the whole page, so clicks / right-clicks / wheel never reach what is behind the menu.
  const swallow = (e: React.SyntheticEvent) => { e.preventDefault(); e.stopPropagation(); onClose(); };

  return createPortal(
    <div
      className="fixed inset-0 z-[200]"
      onPointerDown={swallow}
      onClick={swallow}
      onContextMenu={swallow}
      onWheel={onClose}
      onTouchMove={onClose}
    >
      <div
        ref={ref}
        role="menu"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        style={{
          left: placed?.left ?? x,
          top: placed?.top ?? y,
          transformOrigin: placed?.origin,
          visibility: placed ? "visible" : "hidden",
        }}
        className="a-menu-in fixed min-w-[210px] max-w-[300px] max-h-[calc(100vh-16px)] overflow-y-auto p-[5px] rounded-[8px] bg-a-bg-3 border border-a-border-strong shadow-[0_16px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(0,0,0,0.4)] font-mono text-[12px] outline-none select-none"
      >
        {items.map((it, i) => {
          if (it.type === "separator") return <div key={i} role="separator" className="my-[5px] mx-1 h-px bg-a-border-strong" />;
          if (it.type === "heading") {
            return (
              <div key={i} className="px-[9px] pt-[7px] pb-[3px] text-[9.5px] tracking-[0.16em] uppercase text-a-text-dim">
                {it.label}
              </div>
            );
          }
          const Icon = it.icon;
          const on = i === active;
          const tone = it.disabled
            ? "bg-transparent text-a-text-dim cursor-default"
            : it.danger
              ? `text-a-red ${on ? "bg-a-red/20" : "bg-transparent"}`
              : `text-a-text ${on ? "bg-a-accent/25 text-white" : "bg-transparent"}`;
          return (
            <button
              key={i}
              data-i={i}
              type="button"
              role={it.checked !== undefined ? "menuitemradio" : "menuitem"}
              aria-checked={it.checked}
              aria-disabled={it.disabled}
              tabIndex={-1}
              onPointerMove={() => !it.disabled && active !== i && setActive(i)}
              onClick={() => select(it)}
              className={`flex w-full items-center gap-[9px] px-[9px] py-[7px] rounded-[5px] text-left border-0 cursor-pointer transition-colors duration-75 ${tone}`}
            >
              <span className="flex w-[14px] shrink-0 items-center justify-center">
                {it.dot ? (
                  <span className={`w-[7px] h-[7px] rounded-full bg-current ${it.disabled ? "opacity-40" : it.dot}`} />
                ) : Icon ? (
                  <Icon size={14} strokeWidth={1.75} className={it.danger ? "" : "text-a-text-mute"} />
                ) : null}
              </span>
              <span className="flex-1 whitespace-nowrap">{it.label}</span>
              {it.hint && <span className="text-[10px] text-a-text-dim">{it.hint}</span>}
              {it.checked && <Check size={13} strokeWidth={2.25} className="shrink-0 text-a-accent" />}
            </button>
          );
        })}
      </div>
    </div>,
    document.body,
  );
}

/** PUT a full entity back to its API route. Returns an error message, or null on success. */
export async function saveEntity(path: string, item: Record<string, unknown> & { id: string }): Promise<string | null> {
  try {
    const res = await fetch(`${path}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) return null;
    return (await res.json().catch(() => null))?.error ?? `Save failed (${res.status})`;
  } catch {
    return "Network error";
  }
}

export async function deleteEntity(path: string, id: string): Promise<string | null> {
  try {
    const res = await fetch(`${path}/${id}`, { method: "DELETE" });
    return res.ok ? null : `Delete failed (${res.status})`;
  } catch {
    return "Network error";
  }
}
