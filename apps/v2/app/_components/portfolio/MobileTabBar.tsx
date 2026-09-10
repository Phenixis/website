import Link from "next/link";
import { paneHref } from "./route";

type Pane = { id: string; label: string; num: string };

export function MobileTabBar({ panes, focused }: { panes: Pane[]; focused: string }) {
  return (
    <nav className="hidden max-[720px]:flex shrink-0 bg-v3-bg-2 border-b border-v3-border">
      {panes.map((p) => {
        const active = p.id === focused;
        return (
          <Link
            key={p.id}
            href={paneHref(p.id)}
            className={[
              "flex-1 min-w-0 flex items-center justify-center gap-[6px] h-[34px] max-[480px]:h-[30px] px-1 font-mono text-[10px] tracking-[0.06em] uppercase whitespace-nowrap overflow-hidden border-r border-v3-border last:border-r-0 border-b-2 transition-colors duration-150",
              active
                ? "text-v3-accent-2 bg-[rgba(183,148,246,0.08)] border-b-v3-accent"
                : "text-v3-text-mute border-b-transparent hover:text-v3-text-2",
            ].join(" ")}
          >
            <span className="font-serif italic normal-case text-[12px] flex-none">{p.num}</span>
            <span className="truncate">{p.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
