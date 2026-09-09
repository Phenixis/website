export function PaneRail({ pane }: { pane: { num: string; label: string; count: number } }) {
  return (
    <div className="pane-rail absolute inset-0 flex flex-col items-center py-8 pb-6 [transition:color_200ms] group">
      <span className="pane-rail-num font-serif italic text-[14px] font-light text-v3-text-mute tracking-[0.02em] transition-colors duration-200 group-hover:text-v3-accent">
        {pane.num}
      </span>
      <span className="pane-rail-label flex-1 my-6 [writing-mode:vertical-rl] rotate-180 font-serif text-[20px] font-light tracking-[0.04em] text-v3-text-2 flex items-center justify-center transition-colors duration-200 group-hover:text-v3-text max-[1100px]:text-[18px] max-[920px]:text-[16px]">
        {pane.label}
      </span>
      <span className="pane-rail-count text-[10.5px] text-v3-text-dim tabular-nums tracking-[0.15em]">
        {String(pane.count).padStart(2, "0")}
      </span>
    </div>
  );
}
