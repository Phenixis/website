"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Project, Post, Experience, Profile } from "../../data";
import { parsePortfolioRoute } from "./route";
import { Header } from "./Header";
import { PaneRail } from "./PaneRail";
import { PaneFocused } from "./PaneFocused";
import { MobileTabBar } from "./MobileTabBar";

type PortfolioProps = {
  profile: Profile;
  mainProjects: Project[];
  sideQuests: Project[];
  posts: Post[];
  experiences: Experience[];
};

export function Portfolio({ profile, mainProjects, sideQuests, posts, experiences }: PortfolioProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { focused, selectedPostId, selectedProjectId, selectedSideQuestId } = parsePortfolioRoute(pathname);

  const panes = [
    { id: "projects", label: "Main Projects", num: "I", count: mainProjects.length, sub: "What I made" },
    { id: "blog", label: "Writing", num: "II", count: posts.length, sub: "What I think" },
    { id: "sidequests", label: "Side Quests", num: "III", count: sideQuests.length, sub: "What I tinker with" },
    { id: "experiences", label: "Itinerary", num: "IV", count: experiences.length, sub: "Where I went" },
  ];

  const handleFocus = (id: string) => {
    if (id === "projects") router.push("/");
    else if (id === "blog") router.push("/writing");
    else if (id === "sidequests") router.push("/side-quests");
    else if (id === "experiences") router.push("/itinerary");
  };

  const handleSelectPost = (id: string | null) => {
    router.push(id ? `/writing/${id}` : "/writing");
  };

  const handleSelectProject = (id: string | null) => {
    router.push(id ? `/projects/${id}` : "/");
  };

  const handleSelectSideQuest = (id: string | null) => {
    router.push(id ? `/side-quests/${id}` : "/side-quests");
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-v3-bg text-v3-text font-mono text-[12.5px] leading-[1.55] [background-image:radial-gradient(ellipse_60%_40%_at_75%_90%,rgba(183,148,246,0.05),transparent_70%),radial-gradient(ellipse_40%_30%_at_20%_10%,rgba(183,148,246,0.04),transparent_60%)]">
      <Header profile={profile} />
      <MobileTabBar panes={panes} focused={focused} onFocus={handleFocus} />

      <div className="flex-1 flex min-w-0 min-h-0 max-[720px]:flex-col max-[720px]:overflow-hidden">
        {panes.map((p) => {
          const isFocused = focused === p.id;
          return (
            <section
              key={p.id}
              className={[
                "bg-v3-bg overflow-hidden relative min-w-0 transition-[flex] duration-[540ms] ease-v3-pane",
                "border-r border-v3-border last:border-r-0",
                "max-[720px]:duration-[360ms] max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:last:border-b-0",
                isFocused
                  ? "flex-1 max-[720px]:min-h-0"
                  : "grow-0 shrink-0 basis-[88px] cursor-pointer bg-v3-bg-2 hover:bg-v3-bg-3 max-[1100px]:basis-[76px] max-[920px]:basis-[64px] max-[720px]:hidden",
              ].join(" ")}
              onClick={() => !isFocused && handleFocus(p.id)}
            >
              {isFocused ? (
                <PaneFocused
                  key={`${p.id}/${selectedPostId ?? selectedProjectId ?? selectedSideQuestId ?? "list"}`}
                  pane={p}
                  mainProjects={mainProjects}
                  sideQuests={sideQuests}
                  posts={posts}
                  experiences={experiences}
                  profile={profile}
                  selectedPostId={selectedPostId}
                  onSelectPost={handleSelectPost}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={handleSelectProject}
                  selectedSideQuestId={selectedSideQuestId}
                  onSelectSideQuest={handleSelectSideQuest}
                />
              ) : (
                <PaneRail pane={p} />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
