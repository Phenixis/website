import type { Profile } from "../../data";
import { LifeElapsed } from "./LifeElapsed";

export function Header({ profile }: { profile: Profile }) {
  return (
    <header className="h-11 shrink-0 flex items-center gap-6 px-7 bg-v3-bg-2 border-b border-v3-border text-[11px] tracking-[0.18em] uppercase text-v3-text-mute max-[920px]:px-[18px] max-[920px]:gap-[14px] max-[720px]:px-[14px]">
      <div className="flex items-center gap-[14px] flex-none">
        <LifeElapsed />
        <span className="text-v3-text font-semibold tracking-[0.22em] text-[11.5px] max-[920px]:tracking-[0.18em] max-[720px]:text-[10.5px] max-[720px]:tracking-[0.16em]">
          {profile.name}
        </span>
      </div>
      <div className="flex-1 flex justify-center min-w-0 max-[720px]:hidden">
        <span className="font-serif italic font-light text-[14px] text-v3-text-2 tracking-normal normal-case whitespace-nowrap overflow-hidden text-ellipsis max-[920px]:text-[13px]">
          {profile.tagline}
        </span>
      </div>
      <div className="flex items-center gap-[10px] flex-none max-[480px]:gap-[6px]">
        <span className="text-v3-text-mute tabular-nums max-[720px]:hidden">{profile.location}</span>
      </div>
    </header>
  );
}
