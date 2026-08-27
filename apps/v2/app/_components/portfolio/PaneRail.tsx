export function PaneRail({ pane }: { pane: { num: string; label: string; count: number } }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center py-8 pb-6 [transition:color_200ms] group max-[720px]:static max-[720px]:flex-row max-[720px]:px-[18px] max-[720px]:py-0 max-[720px]:gap-[14px] max-[720px]:h-12 max-[720px]:items-center">
      <span className="font-serif italic text-[22px] font-light text-v3-text-mute tracking-[0.02em] transition-colors duration-200 group-hover:text-v3-accent max-[720px]:text-[14px] max-[720px]:flex-none">
        {pane.num}
      </span>
      <span
        className="flex-1 my-6 [writing-mode:vertical-rl] rotate-180 font-serif text-[36px] font-light tracking-[0.04em] text-v3-text-2 flex items-center justify-center transition-colors duration-200 group-hover:text-v3-text max-[1100px]:text-[30px] max-[920px]:text-[26px] max-[720px]:[writing-mode:horizontal-tb] max-[720px]:rotate-0 max-[720px]:text-[16px] max-[720px]:my-0 max-[720px]:flex-1 max-[720px]:justify-start max-[720px]:tracking-[0.01em] max-[720px]:leading-none"
      >
        {pane.label}
      </span>
      <span className="text-[10.5px] text-v3-text-dim tabular-nums tracking-[0.15em] max-[720px]:bg-v3-bg-3 max-[720px]:border max-[720px]:border-v3-border max-[720px]:rounded-[3px] max-[720px]:px-[7px] max-[720px]:py-[2px] max-[720px]:text-[10px]">
        {String(pane.count).padStart(2, "0")}
      </span>
    </div>
  );
}
