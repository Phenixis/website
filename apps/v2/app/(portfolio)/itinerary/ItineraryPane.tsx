import type { Experience } from "../../data";
import { formatDuration, formatMonth, hasGapAfter, sortByStartDesc } from "@/lib/experience-dates";

const DOT_CLASS: Record<Experience["kind"], string> = {
  self: "bg-v3-accent shadow-[0_0_0_3px_rgba(183,148,246,0.18)]",
  role: "bg-v3-text-2",
  edu: "bg-[#f1c45b]",
};

const KIND_TEXT_CLASS: Record<Experience["kind"], string> = {
  self: "text-v3-accent",
  role: "text-v3-text-2",
  edu: "text-[#f1c45b]",
};

function DateStack({ e, size }: { e: Experience; size: "outer" | "inner" }) {
  const labelCls =
    size === "outer"
      ? "text-[11px] text-v3-text-mute tracking-[0.12em] uppercase tabular-nums max-[480px]:text-[10px] max-[480px]:tracking-[0.08em]"
      : "text-[9.5px] text-v3-text-mute tracking-[0.1em] uppercase tabular-nums";
  const durationCls =
    size === "outer"
      ? "text-[9px] text-v3-text-dim tracking-[0.1em] uppercase italic max-[480px]:text-[8px]"
      : "text-[8px] text-v3-text-dim tracking-[0.08em] uppercase italic";
  return (
    <div className="h-full flex flex-col justify-between items-end text-right py-[2px]">
      <div className={labelCls}>{e.endDate ? formatMonth(e.endDate) : "→"}</div>
      <div className={durationCls}>{formatDuration(e)}</div>
      <div className={labelCls}>{formatMonth(e.startDate)}</div>
    </div>
  );
}

function EntryDot({ e }: { e: Experience }) {
  return (
    <div className="col-start-2 row-start-1 flex justify-center pt-[10px]">
      <div
        className={[
          "w-[13px] h-[13px] rounded-full bg-v3-bg flex items-center justify-center relative z-[1] transition-colors duration-200 border",
          e.kind === "self" ? "border-v3-accent bg-v3-bg-2" : "border-v3-border-strong",
        ].join(" ")}
      >
        <div className={`w-[5px] h-[5px] rounded-full transition-all duration-200 ${DOT_CLASS[e.kind]}`} />
      </div>
    </div>
  );
}

function EntryContent({ e }: { e: Experience }) {
  return (
    <div className="col-start-3 row-start-1 flex flex-col gap-[10px] pt-1 pb-[26px] max-[720px]:pb-[22px] max-[480px]:pb-[18px]">
      <div className="flex items-baseline gap-[10px] flex-wrap max-[480px]:gap-[6px]">
        <span className="font-serif font-normal text-[26px] tracking-[-0.015em] text-v3-text max-[720px]:text-[22px] max-[480px]:text-[19px]">
          {e.role}
        </span>
        <span className="font-serif italic font-light text-[18px] text-v3-text-dim max-[720px]:text-[16px] max-[480px]:text-[14px]">
          at
        </span>
        <span className="font-serif font-normal text-[22px] tracking-[-0.01em] text-v3-accent-2 max-[720px]:text-[19px] max-[480px]:text-[17px]">
          {e.where}
        </span>
      </div>
      <p className="font-mono text-[12.5px] text-v3-text-2 m-0 leading-[1.7] max-w-[600px] text-pretty max-[720px]:text-[12px] max-[720px]:max-w-full">
        {e.blurb}
      </p>
      <div className="flex items-center gap-2 text-[10.5px] text-v3-text-mute tracking-[0.08em] uppercase mt-[2px] flex-wrap">
        <span className={KIND_TEXT_CLASS[e.kind]}>{e.kind}</span>
        {e.stack.length > 0 && (
          <>
            <span className="text-v3-text-dim">·</span>
            <span className="text-v3-text-mute normal-case tracking-normal tabular-nums">{e.stack.join(" / ")}</span>
          </>
        )}
      </div>
    </div>
  );
}

function TopLevelBlock({ e, parallel }: { e: Experience; parallel: Experience[] }) {
  const hasChildren = parallel.length > 0;
  return (
    <div className="relative grid grid-cols-[140px_44px_1fr] gap-x-7 pt-[22px] max-[720px]:grid-cols-[96px_32px_1fr] max-[720px]:gap-x-4 max-[720px]:pt-[18px] max-[480px]:grid-cols-[72px_24px_1fr] max-[480px]:gap-x-3 max-[480px]:pt-[14px]">
      <div className="absolute inset-y-0 left-[189px] w-px bg-v3-border-strong max-[720px]:left-[113px] max-[480px]:left-[85px]" />
      {/* When there's a nested timeline, the date stack spans both this row and
          the nested block below it, so the start date lands at the bottom of
          the whole cluster rather than just this entry's own text. */}
      <div className={`col-start-1 row-start-1 ${hasChildren ? "row-span-2" : ""}`}>
        <DateStack e={e} size="outer" />
      </div>
      <EntryDot e={e} />
      <EntryContent e={e} />
      {hasChildren && (
        <div className="col-start-1 col-span-3 row-start-2">
          <InnerTimeline items={parallel} />
        </div>
      )}
    </div>
  );
}

function GapMarker() {
  return (
    <div className="grid grid-cols-[140px_44px_1fr] gap-x-7 h-14 max-[720px]:grid-cols-[96px_32px_1fr] max-[720px]:gap-x-4 max-[480px]:grid-cols-[72px_24px_1fr] max-[480px]:gap-x-3">
      <div />
      <div className="relative flex justify-center">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-v3-border-strong" />
      </div>
      <div />
    </div>
  );
}

function InnerEntryRow({ e }: { e: Experience }) {
  return (
    <div className="grid grid-cols-[52px_22px_1fr] gap-x-3 items-stretch">
      <DateStack e={e} size="inner" />
      <div className="relative flex justify-center">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-v3-border" />
        <div className="w-[9px] h-[9px] mt-[7px] rounded-full bg-v3-bg border border-v3-border-strong flex items-center justify-center relative z-[1]">
          <div className={`w-[4px] h-[4px] rounded-full ${DOT_CLASS[e.kind]}`} />
        </div>
      </div>
      <div className="flex flex-col gap-2 min-w-0 pb-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-serif font-normal text-[21px] tracking-[-0.01em] text-v3-text max-[480px]:text-[18px]">
            {e.role}
          </span>
          <span className="font-serif italic font-light text-[14px] text-v3-text-dim">at</span>
          <span className="font-serif font-normal text-[18px] text-v3-accent-2 max-[480px]:text-[16px]">
            {e.where}
          </span>
        </div>
        <p className="font-mono text-[12px] text-v3-text-2 m-0 leading-[1.6] max-w-[480px] text-pretty">
          {e.blurb}
        </p>
        <div className="flex items-center gap-2 text-[10.5px] text-v3-text-mute tracking-[0.08em] uppercase flex-wrap">
          <span className={KIND_TEXT_CLASS[e.kind]}>{e.kind}</span>
          {e.stack.length > 0 && (
            <>
              <span className="text-v3-text-dim">·</span>
              <span className="text-v3-text-mute normal-case tracking-normal tabular-nums">{e.stack.join(" / ")}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InnerGapMarker() {
  return (
    <div className="grid grid-cols-[52px_22px_1fr] gap-x-3 h-10">
      <div />
      <div className="relative flex justify-center">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-v3-border" />
      </div>
      <div />
    </div>
  );
}

function InnerTimeline({ items }: { items: Experience[] }) {
  const sorted = sortByStartDesc(items);
  return (
    <div className="ml-[210px] mt-1 mb-3 max-[720px]:ml-[140px] max-[480px]:ml-[105px]">
      <div className="pl-[98px] text-[10px] text-v3-text-mute tracking-[0.14em] uppercase mb-4">In parallel</div>
      <div className="flex flex-col gap-5">
        {sorted.map((e, i) => (
          <div key={e.id} className="flex flex-col gap-5">
            <InnerEntryRow e={e} />
            {hasGapAfter(sorted, i) && <InnerGapMarker />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperiencesList({ experiences }: { experiences: Experience[] }) {
  const idSet = new Set(experiences.map((e) => e.id));
  const byId = new Map(experiences.map((e) => [e.id, e]));

  // Resolve each entry's effective parent, breaking any cycle (A parallel to B
  // and B parallel to A, or a longer loop) by falling back to "no parent" so
  // entries never disappear from the timeline.
  const effectiveParent = new Map<string, string | null>();
  for (const e of experiences) {
    let parentId = e.parentId && idSet.has(e.parentId) ? e.parentId : null;
    if (parentId) {
      const seen = new Set([e.id]);
      let cur: string | null = parentId;
      while (cur) {
        if (seen.has(cur)) { parentId = null; break; }
        seen.add(cur);
        const next: string | undefined = byId.get(cur)?.parentId;
        cur = next && idSet.has(next) ? next : null;
      }
    }
    effectiveParent.set(e.id, parentId);
  }

  const topLevel = sortByStartDesc(experiences.filter((e) => effectiveParent.get(e.id) == null));
  const childrenOf = (id: string) => experiences.filter((e) => effectiveParent.get(e.id) === id);

  return (
    <div className="relative max-w-[760px] mx-auto pt-3 pb-8 max-[920px]:max-w-full">
      {topLevel.map((e, i) => (
        <div key={e.id}>
          <TopLevelBlock e={e} parallel={childrenOf(e.id)} />
          {hasGapAfter(topLevel, i) && <GapMarker />}
        </div>
      ))}
      <div className="relative">
        <div className="absolute inset-y-0 left-[189px] w-px bg-v3-border-strong opacity-50 max-[720px]:left-[113px] max-[480px]:left-[85px]" />
        <div className="grid grid-cols-[140px_44px_1fr] gap-x-7 pt-2 items-center max-[720px]:grid-cols-[96px_32px_1fr] max-[720px]:gap-x-4 max-[480px]:grid-cols-[72px_24px_1fr] max-[480px]:gap-x-3">
          <div className="text-right pt-0 opacity-50">
            <div className="text-[11px] text-v3-text-mute tracking-[0.12em] uppercase tabular-nums">earlier</div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-[5px] h-[5px] rounded-full bg-v3-text-dim opacity-50 mt-1" />
          </div>
          <div className="pt-0 opacity-50">
            <span className="font-serif italic text-[14px] text-v3-text-mute">— birth —</span>
          </div>
        </div>
      </div>
    </div>
  );
}
