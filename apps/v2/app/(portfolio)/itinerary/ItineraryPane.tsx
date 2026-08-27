import type { Experience } from "../../data";

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

export function ExperiencesList({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="relative max-w-[760px] mx-auto pt-3 pb-8 max-[920px]:max-w-full">
      <div className="absolute left-[189px] top-8 bottom-14 w-px pointer-events-none [background:linear-gradient(180deg,transparent_0%,var(--color-v3-border-strong)_4%,var(--color-v3-border-strong)_96%,transparent_100%)] max-[720px]:left-[113px] max-[480px]:left-[85px]" />
      {experiences.map((e) => (
        <div
          key={e.id}
          className="grid grid-cols-[140px_44px_1fr] gap-x-7 py-[22px] pb-[26px] relative max-[720px]:grid-cols-[96px_32px_1fr] max-[720px]:gap-x-4 max-[720px]:py-[18px] max-[720px]:pb-[22px] max-[480px]:grid-cols-[72px_24px_1fr] max-[480px]:gap-x-3 max-[480px]:py-[14px] max-[480px]:pb-[18px]"
        >
          <div className="flex flex-col gap-3 pt-2 text-right items-end">
            <div className="text-[11px] text-v3-text-mute tracking-[0.12em] uppercase tabular-nums max-[480px]:text-[10px] max-[480px]:tracking-[0.08em]">
              {e.when}
            </div>
          </div>
          <div className="relative flex justify-center pt-[10px]">
            <div
              className={[
                "w-[13px] h-[13px] rounded-full bg-v3-bg flex items-center justify-center relative z-[1] transition-colors duration-200 border",
                e.kind === "self" ? "border-v3-accent bg-v3-bg-2" : "border-v3-border-strong",
              ].join(" ")}
            >
              <div className={`w-[5px] h-[5px] rounded-full transition-all duration-200 ${DOT_CLASS[e.kind]}`} />
            </div>
          </div>
          <div className="flex flex-col gap-[10px] pt-1">
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
            <div className="flex items-center gap-2 text-[10.5px] text-v3-text-mute tracking-[0.08em] uppercase mt-[2px]">
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
      ))}
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
  );
}
