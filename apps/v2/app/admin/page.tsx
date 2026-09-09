import Link from "next/link";
import { getProjects, getPosts, getExperiences } from "@/lib/db";
import { Badge } from "./_components/ui";

export default async function DashboardPage() {
  const [projects, posts, experiences] = await Promise.all([
    getProjects(),
    getPosts(),
    getExperiences(),
  ]);

  const mainProjects = projects.filter((p) => p.category !== "side");
  const sideQuests = projects.filter((p) => p.category === "side");

  const shipping = mainProjects.filter((p) => p.status === "shipping").length;
  const paused = mainProjects.filter((p) => p.status === "paused").length;
  const archived = mainProjects.filter((p) => p.status === "archived").length;

  const sqShipping = sideQuests.filter((p) => p.status === "shipping").length;
  const sqPaused = sideQuests.filter((p) => p.status === "paused").length;
  const sqArchived = sideQuests.filter((p) => p.status === "archived").length;

  const drafts = posts.filter((p) => p.published === false);
  const published = posts.length - drafts.length;

  const selfCount = experiences.filter((e) => e.kind === "self").length;
  const roleCount = experiences.filter((e) => e.kind === "role").length;
  const eduCount = experiences.filter((e) => e.kind === "edu").length;

  return (
    <div className="scroll-thin-a-wide flex-1 overflow-y-auto">
      <div className="p-7 px-8 max-[1100px]:p-[22px] max-[560px]:p-4 max-[560px]:px-4">
        <div className="mb-[22px]">
          <h2 className="font-serif font-light text-[36px] tracking-[-0.02em] m-0 text-a-text max-[560px]:text-[28px]">
            Good evening, <span className="text-a-accent">Maxime.</span>
          </h2>
          <p className="mt-[6px] mb-0 text-a-text-mute italic font-serif font-light text-[14px]">
            {drafts.length === 0
              ? "Everything published — no drafts open."
              : `${drafts.length} draft${drafts.length === 1 ? "" : "s"} open.`}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-[14px] max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1">
          <Link className="group p-[22px] pb-[18px] bg-a-bg-2 border border-a-border rounded-md cursor-pointer transition-all duration-200 relative overflow-hidden w-full text-left font-mono text-a-text hover:border-a-border-strong hover:bg-a-bg-3 max-[720px]:p-[18px] max-[720px]:pb-4" href="/admin/projects">
            <div className="font-serif font-light text-[56px] text-a-text tracking-[-0.03em] leading-none max-[720px]:text-[44px]">
              {String(mainProjects.length).padStart(2, "0")}
            </div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-a-text-mute mt-2">Main Projects</div>
            <div className="mt-[14px] flex items-center gap-2 text-[11px] text-a-text-2 border-t border-dashed border-a-border pt-3 max-[720px]:flex-wrap max-[720px]:gap-1">
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-green">● {shipping} shipping</span>
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-text-mute">{paused} paused</span>
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-text-mute">{archived} archived</span>
            </div>
            <span className="absolute top-[18px] right-[18px] text-a-text-dim text-[16px] transition-colors duration-[160ms] group-hover:text-a-accent">↗</span>
          </Link>
          <Link className="group p-[22px] pb-[18px] bg-a-bg-2 border border-a-border rounded-md cursor-pointer transition-all duration-200 relative overflow-hidden w-full text-left font-mono text-a-text hover:border-a-border-strong hover:bg-a-bg-3 max-[720px]:p-[18px] max-[720px]:pb-4" href="/admin/side-quests">
            <div className="font-serif font-light text-[56px] text-a-text tracking-[-0.03em] leading-none max-[720px]:text-[44px]">
              {String(sideQuests.length).padStart(2, "0")}
            </div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-a-text-mute mt-2">Side Quests</div>
            <div className="mt-[14px] flex items-center gap-2 text-[11px] text-a-text-2 border-t border-dashed border-a-border pt-3 max-[720px]:flex-wrap max-[720px]:gap-1">
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-green">● {sqShipping} shipping</span>
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-text-mute">{sqPaused} paused</span>
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-text-mute">{sqArchived} archived</span>
            </div>
            <span className="absolute top-[18px] right-[18px] text-a-text-dim text-[16px] transition-colors duration-[160ms] group-hover:text-a-accent">↗</span>
          </Link>
          <Link className="group p-[22px] pb-[18px] bg-a-bg-2 border border-a-border rounded-md cursor-pointer transition-all duration-200 relative overflow-hidden w-full text-left font-mono text-a-text hover:border-a-border-strong hover:bg-a-bg-3 max-[720px]:p-[18px] max-[720px]:pb-4" href="/admin/posts">
            <div className="font-serif font-light text-[56px] text-a-text tracking-[-0.03em] leading-none max-[720px]:text-[44px]">
              {String(posts.length).padStart(2, "0")}
            </div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-a-text-mute mt-2">Writing</div>
            <div className="mt-[14px] flex items-center gap-2 text-[11px] text-a-text-2 border-t border-dashed border-a-border pt-3 max-[720px]:flex-wrap max-[720px]:gap-1">
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-green">● {published} published</span>
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-amber">● {drafts.length} drafts</span>
            </div>
            <span className="absolute top-[18px] right-[18px] text-a-text-dim text-[16px] transition-colors duration-[160ms] group-hover:text-a-accent">↗</span>
          </Link>
          <Link className="group p-[22px] pb-[18px] bg-a-bg-2 border border-a-border rounded-md cursor-pointer transition-all duration-200 relative overflow-hidden w-full text-left font-mono text-a-text hover:border-a-border-strong hover:bg-a-bg-3 max-[720px]:p-[18px] max-[720px]:pb-4" href="/admin/experiences">
            <div className="font-serif font-light text-[56px] text-a-text tracking-[-0.03em] leading-none max-[720px]:text-[44px]">
              {String(experiences.length).padStart(2, "0")}
            </div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-a-text-mute mt-2">Itinerary</div>
            <div className="mt-[14px] flex items-center gap-2 text-[11px] text-a-text-2 border-t border-dashed border-a-border pt-3 max-[720px]:flex-wrap max-[720px]:gap-1">
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-text-mute">{selfCount} self</span>
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-text-mute">{roleCount} roles</span>
              <span className="bg-a-bg border border-a-border rounded-[3px] px-[6px] py-px text-[10px] text-a-text-mute">{eduCount} school</span>
            </div>
            <span className="absolute top-[18px] right-[18px] text-a-text-dim text-[16px] transition-colors duration-[160ms] group-hover:text-a-accent">↗</span>
          </Link>
        </div>

        <div className="bg-a-bg-2 border border-a-border rounded-md overflow-hidden mt-[22px]">
          <div className="flex items-center px-[18px] py-[14px] border-b border-a-border">
            <span className="text-[11px] tracking-[0.18em] uppercase text-a-text-mute font-medium">Drafts</span>
            <span className="flex-1" />
            <span className="text-[10.5px] text-a-text-dim tabular-nums">{drafts.length} open</span>
          </div>
          <div className="py-2">
            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 gap-[10px] text-center">
                <span className="text-[32px] text-a-text-dim font-serif italic">•</span>
                <span className="text-[14px] font-medium text-a-text-2">No drafts</span>
              </div>
            ) : (
              drafts.map((d) => (
                <div key={d.id} className="px-[18px] py-[10px] grid grid-cols-[1fr_auto] gap-3 items-center cursor-pointer transition-colors duration-[120ms] hover:bg-a-bg-3">
                  <div>
                    <div className="text-a-text text-[12.5px] font-medium">{d.title}</div>
                    <div className="text-a-text-mute text-[10.5px] mt-[2px]">{d.readTime}{d.tags.length > 0 ? ` · ${d.tags.join(", ")}` : ""}</div>
                  </div>
                  <Badge kind="draft">draft</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
