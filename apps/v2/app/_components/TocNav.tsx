"use client";

import { useEffect, useMemo, useState } from "react";
import type { Heading } from "@/lib/reading";

// A heading counts as "being read" once it has scrolled up past this line
// (px from the top of the viewport, a bit under the sticky offset).
const READ_LINE = 140;

function useActiveHeading(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = (scroller?: Element | null) => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= READ_LINE) current = id;
      }
      // At the very bottom the last heading may never reach the read line.
      const root = scroller ?? document.scrollingElement;
      if (root && root.scrollHeight > root.clientHeight && root.scrollTop + root.clientHeight >= root.scrollHeight - 4) {
        current = ids[ids.length - 1] ?? current;
      }
      setActive(current);
    };
    // Capture: the page scrolls inside a pane element, and scroll events
    // don't bubble from there.
    const onScroll = (e: Event) => {
      if (frame) return;
      const t = e.target;
      frame = requestAnimationFrame(() => update(t instanceof Element ? t : null));
    };
    update();
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll as EventListener);
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll as EventListener);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}

/**
 * Table of contents. Wide screens: a sticky rail in the left gutter that
 * follows the reading position (the parent must be `relative` and as tall as
 * the body). Narrower screens: a plain list above the body.
 */
export function TocNav({ headings }: { headings: Heading[] }) {
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useActiveHeading(ids);
  const top = Math.min(...headings.map((h) => h.depth));

  return (
    <>
      <nav aria-label="Table of contents" className="mb-10 pl-5 border-l-2 border-v3-border min-[1280px]:hidden max-[480px]:mb-8 max-[480px]:pl-4">
        <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-v3-text-mute mb-3">Contents</div>
        <ol className="list-none m-0 p-0 flex flex-col gap-[7px]">
          {headings.map((h) => (
            <li key={h.id} className={h.depth > top ? "pl-4" : ""}>
              <a
                href={`#${h.id}`}
                className={`font-reading text-[16px] leading-[1.4] no-underline transition-colors duration-150 hover:text-v3-accent-2 ${
                  h.depth > top ? "text-v3-text-mute" : "text-v3-text-2"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <aside className="hidden min-[1280px]:block absolute top-0 bottom-0 right-full mr-12 w-[200px]">
        <nav aria-label="Table of contents" className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scroll-thin">
          <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-v3-text-mute mb-3">Contents</div>
          <ol className="list-none m-0 p-0 flex flex-col border-l border-v3-border">
            {headings.map((h) => {
              const isActive = h.id === active;
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`block -ml-px py-[5px] border-l-2 font-reading text-[14.5px] leading-[1.35] no-underline transition-colors duration-150 hover:text-v3-text ${
                      h.depth > top ? "pl-7" : "pl-4"
                    } ${isActive ? "border-v3-accent text-v3-text" : "border-transparent text-v3-text-mute"}`}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>
    </>
  );
}
