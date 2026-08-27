"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Project, Post, Experience, Profile } from "../data";
import { ViewCounter } from "./ViewCounter";

type PortfolioProps = {
  profile: Profile;
  projects: Project[];
  posts: Post[];
  experiences: Experience[];
};

function parsePortfolioRoute(pathname: string): {
  focused: string;
  selectedPostId: string | null;
  selectedProjectId: string | null;
} {
  if (pathname === "/writing") return { focused: "blog", selectedPostId: null, selectedProjectId: null };
  if (pathname.startsWith("/writing/")) {
    return { focused: "blog", selectedPostId: decodeURIComponent(pathname.slice("/writing/".length)), selectedProjectId: null };
  }
  if (pathname === "/itinerary") return { focused: "experiences", selectedPostId: null, selectedProjectId: null };
  if (pathname.startsWith("/projects/")) {
    return { focused: "projects", selectedPostId: null, selectedProjectId: decodeURIComponent(pathname.slice("/projects/".length)) };
  }
  return { focused: "projects", selectedPostId: null, selectedProjectId: null };
}

export function Portfolio({ profile, projects, posts, experiences }: PortfolioProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { focused, selectedPostId, selectedProjectId } = parsePortfolioRoute(pathname);

  const panes = [
    { id: "projects", label: "Projects", num: "I", count: projects.length, sub: "What I made" },
    { id: "blog", label: "Writing", num: "II", count: posts.length, sub: "What I think" },
    { id: "experiences", label: "Itinerary", num: "III", count: experiences.length, sub: "Where I went" },
  ];

  const handleFocus = (id: string) => {
    if (id === "projects") router.push("/");
    else if (id === "blog") router.push("/writing");
    else if (id === "experiences") router.push("/itinerary");
  };

  const handleSelectPost = (id: string | null) => {
    router.push(id ? `/writing/${id}` : "/writing");
  };

  const handleSelectProject = (id: string | null) => {
    router.push(id ? `/projects/${id}` : "/");
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-v3-bg text-v3-text font-mono text-[12.5px] leading-[1.55] [background-image:radial-gradient(ellipse_60%_40%_at_75%_90%,rgba(183,148,246,0.05),transparent_70%),radial-gradient(ellipse_40%_30%_at_20%_10%,rgba(183,148,246,0.04),transparent_60%)]">
      <header className="h-11 shrink-0 flex items-center gap-6 px-7 bg-v3-bg-2 border-b border-v3-border text-[11px] tracking-[0.18em] uppercase text-v3-text-mute max-[920px]:px-[18px] max-[920px]:gap-[14px] max-[720px]:px-[14px]">
        <div className="flex items-center gap-[14px] flex-none">
          <span className="text-v3-accent text-[13px] tracking-normal">✦</span>
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

      <div className="flex-1 flex min-w-0 min-h-0 max-[720px]:flex-col max-[720px]:overflow-hidden">
        {panes.map((p, i) => {
          const isFocused = focused === p.id;
          return (
            <section
              key={p.id}
              className={[
                "bg-v3-bg overflow-hidden relative min-w-0 transition-[flex] duration-[540ms] ease-v3-pane",
                "border-r border-v3-border last:border-r-0",
                "max-[720px]:duration-[360ms] max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:last:border-b-0",
                isFocused
                  ? "flex-1 max-[720px]:order-[99] max-[720px]:min-h-0"
                  : "grow-0 shrink-0 basis-[88px] cursor-pointer bg-v3-bg-2 hover:bg-v3-bg-3 max-[1100px]:basis-[76px] max-[920px]:basis-[64px] max-[720px]:basis-auto max-[720px]:min-h-[48px] max-[720px]:border-b max-[720px]:border-v3-border",
              ].join(" ")}
              onClick={() => !isFocused && handleFocus(p.id)}
            >
              {isFocused ? (
                <PaneFocused
                  key={`${p.id}/${selectedPostId ?? selectedProjectId ?? "list"}`}
                  pane={p}
                  projects={projects}
                  posts={posts}
                  experiences={experiences}
                  profile={profile}
                  selectedPostId={selectedPostId}
                  onSelectPost={handleSelectPost}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={handleSelectProject}
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

function PaneRail({ pane }: { pane: { num: string; label: string; count: number } }) {
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

type PaneFocusedProps = {
  pane: { id: string; label: string; num: string; count: number; sub: string };
  projects: Project[];
  posts: Post[];
  experiences: Experience[];
  profile: Profile;
  selectedPostId: string | null;
  onSelectPost: (id: string | null) => void;
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
};

function PaneFocused({
  pane,
  projects,
  posts,
  experiences,
  profile,
  selectedPostId,
  onSelectPost,
  selectedProjectId,
  onSelectProject,
}: PaneFocusedProps) {
  const selectedPost = pane.id === "blog" && selectedPostId
    ? posts.find((p) => p.id === selectedPostId) ?? null
    : null;
  const selectedProject = pane.id === "projects" && selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const centeredHead = pane.id === "blog" || selectedProject || (pane.id === "projects" && !selectedProject) || pane.id === "experiences";

  return (
    <div className="scroll-thin absolute inset-0 overflow-y-auto flex flex-col animate-v3-fade">
      <header
        className={[
          "px-16 pt-14 pb-9 max-[1100px]:px-12 max-[1100px]:pt-11 max-[1100px]:pb-7",
          "max-[920px]:px-9 max-[920px]:pt-9 max-[920px]:pb-6",
          "max-[720px]:px-[22px] max-[720px]:pt-7 max-[720px]:pb-[18px]",
          "max-[480px]:px-4 max-[480px]:pt-[22px] max-[480px]:pb-[14px]",
          centeredHead
            ? "max-w-[760px] mx-auto w-full !px-0 max-[920px]:max-w-full"
            : "",
        ].join(" ")}
      >
        {selectedPost ? (
          <>
            <div className="flex items-center gap-4 mb-4 text-[11px] text-v3-text-mute tracking-[0.15em] uppercase max-[720px]:gap-[10px] max-[480px]:flex-wrap max-[480px]:gap-2">
              <button
                className="bg-transparent border-0 text-v3-accent font-mono text-[11px] tracking-[0.15em] uppercase cursor-pointer py-1 flex items-center gap-2 transition-[color,gap] duration-150 hover:text-v3-accent-2 hover:gap-3 max-[480px]:text-[10.5px] max-[480px]:tracking-[0.12em]"
                onClick={() => onSelectPost(null)}
              >
                <span className="font-serif text-[16px] tracking-normal">←</span>
                <span>Writing</span>
              </button>
              <span className="flex-none basis-14 h-px bg-v3-border-strong max-[720px]:basis-6 max-[480px]:hidden" />
              <span className="flex items-baseline gap-[14px]">
                <span>{selectedPost.date}</span>
                <span className="text-v3-text-dim tabular-nums">{selectedPost.readTime}</span>
              </span>
            </div>
            <h1 className="font-serif font-light text-[72px] tracking-[-0.02em] m-0 text-v3-text leading-none text-pretty max-w-[920px] text-[56px] leading-[1.05] max-[1100px]:text-[48px] max-[920px]:text-[40px] max-[720px]:text-[32px] max-[720px]:leading-[1.1] max-[480px]:text-[26px]">
              {selectedPost.title}
            </h1>
          </>
        ) : selectedProject ? (
          <>
            <div className="flex items-center gap-4 mb-4 text-[11px] text-v3-text-mute tracking-[0.15em] uppercase max-[720px]:gap-[10px] max-[480px]:flex-wrap max-[480px]:gap-2">
              <button
                className="bg-transparent border-0 text-v3-accent font-mono text-[11px] tracking-[0.15em] uppercase cursor-pointer py-1 flex items-center gap-2 transition-[color,gap] duration-150 hover:text-v3-accent-2 hover:gap-3 max-[480px]:text-[10.5px] max-[480px]:tracking-[0.12em]"
                onClick={() => onSelectProject(null)}
              >
                <span className="font-serif text-[16px] tracking-normal">←</span>
                <span>Projects</span>
              </button>
              <span className="flex-none basis-14 h-px bg-v3-border-strong max-[720px]:basis-6 max-[480px]:hidden" />
              <span className="flex items-baseline gap-[14px]">
                <span style={{ color: selectedProject.color }}>● {selectedProject.kind}</span>
                <span className="text-v3-text-dim tabular-nums">{selectedProject.year}</span>
              </span>
            </div>
            <h1 className="font-serif font-light tracking-[-0.02em] m-0 text-v3-text leading-none text-[64px] max-[1100px]:text-[54px] max-[920px]:text-[48px] max-[720px]:text-[36px] max-[480px]:text-[30px]">
              {selectedProject.title}
            </h1>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4 text-[11px] text-v3-text-mute tracking-[0.15em] uppercase max-[720px]:gap-[10px] max-[480px]:flex-wrap max-[480px]:gap-2">
              <span className="font-serif italic text-[18px] text-v3-accent normal-case tracking-normal font-normal">{pane.num}</span>
              <span className="flex-none basis-14 h-px bg-v3-border-strong max-[720px]:basis-6 max-[480px]:hidden" />
              <span className="flex items-baseline gap-[14px]">
                <span>{pane.sub}</span>
                <span className="text-v3-text-dim tabular-nums">{String(pane.count).padStart(2, "0")} entries</span>
              </span>
            </div>
            <h1 className="font-serif font-light text-[72px] tracking-[-0.02em] m-0 text-v3-text leading-none max-[1100px]:text-[60px] max-[920px]:text-[52px] max-[720px]:text-[40px] max-[480px]:text-[34px]">
              {pane.label}
            </h1>
          </>
        )}
      </header>

      <div className="px-16 pb-16 max-[1100px]:px-12 max-[1100px]:pb-12 max-[920px]:px-9 max-[920px]:pb-10 max-[720px]:px-[22px] max-[720px]:pb-8 max-[480px]:px-4 max-[480px]:pb-7">
        {pane.id === "projects" && (
          selectedProject
            ? <ProjectDetail project={selectedProject} projects={projects} onSelect={onSelectProject} />
            : <ProjectsList projects={projects} onSelect={onSelectProject} />
        )}
        {pane.id === "blog" && (
          selectedPost
            ? <PostDetail post={selectedPost} posts={posts} profile={profile} onSelect={onSelectPost} />
            : <BlogList posts={posts} onSelect={onSelectPost} />
        )}
        {pane.id === "experiences" && <ExperiencesList experiences={experiences} />}
      </div>
    </div>
  );
}

function ProjectsList({ projects, onSelect }: { projects: Project[]; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col max-w-[760px] mx-auto w-full pt-2 max-[920px]:max-w-full">
      {projects.map((p, i) => (
        <article
          key={p.id}
          className="group grid grid-cols-[56px_96px_1fr] gap-[18px] items-start cursor-pointer py-[18px] border-t border-v3-border transition-colors duration-200 hover:bg-[rgba(183,148,246,0.025)] max-[720px]:grid-cols-[36px_72px_1fr] max-[720px]:gap-3 max-[720px]:py-[14px] max-[480px]:grid-cols-[28px_56px_1fr] max-[480px]:gap-[10px]"
          style={{ "--c": p.color } as React.CSSProperties}
          onClick={() => onSelect(p.id)}
        >
          <div className="font-serif italic text-[14px] text-v3-text-dim tabular-nums tracking-[0.04em] pt-[6px]">
            {String(i + 1).padStart(3, "0")}
          </div>
          <div className="w-24 h-24 bg-v3-bg-3 border border-v3-border rounded relative overflow-hidden flex items-center justify-center transition-colors duration-200 group-hover:border-[var(--c)] max-[1100px]:w-[88px] max-[1100px]:h-[88px] max-[720px]:w-[72px] max-[720px]:h-[72px] max-[480px]:w-14 max-[480px]:h-14">
            <div className="font-serif font-light text-[56px] leading-none relative z-[1] tracking-[-0.04em] opacity-75 text-[var(--c)] max-[1100px]:text-[52px] max-[720px]:text-[44px] max-[480px]:text-[34px]">
              {p.title[0]}
            </div>
            <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--c)_14%,transparent),transparent_60%),radial-gradient(circle_at_80%_80%,color-mix(in_oklab,var(--c)_8%,transparent),transparent_50%)]" />
          </div>
          <div className="flex flex-col gap-2 pt-[2px]">
            <div className="flex items-baseline gap-3 max-[480px]:flex-wrap max-[480px]:gap-1">
              <h3 className="font-serif font-normal text-[22px] m-0 tracking-[-0.01em] text-v3-text flex-1 max-[720px]:text-[19px] max-[480px]:text-[17px]">
                {p.title}
              </h3>
              <span className="text-[10.5px] text-v3-text-mute tabular-nums tracking-[0.1em]">{p.year}</span>
            </div>
            <p className="font-mono text-[12px] text-v3-text-2 m-0 leading-[1.65] max-w-[420px] text-pretty max-[720px]:text-[11.5px] max-[720px]:max-w-full">
              {p.blurb}
            </p>
            <div className="flex items-center gap-2 text-[10.5px] text-v3-text-mute tracking-[0.08em] uppercase mt-[2px] max-[480px]:flex-wrap max-[480px]:gap-y-1">
              <span className="text-v3-text-2">{p.kind}</span>
              <span className="text-v3-text-dim">·</span>
              <span className={p.status === "shipping" ? "text-[#74e893]" : p.status === "paused" ? "text-[#f1c45b]" : "text-v3-text-mute"}>
                {p.status}
              </span>
              <span className="flex-1" />
              <span className="text-v3-text-mute normal-case tracking-normal tabular-nums max-[480px]:w-full">{p.stack.join(" / ")}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProjectDetail({
  project,
  projects,
  onSelect,
}: {
  project: Project;
  projects: Project[];
  onSelect: (id: string | null) => void;
}) {
  const idx = projects.findIndex((p) => p.id === project.id);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <article className="max-w-[760px] mx-auto pt-1 max-[920px]:max-w-full" style={{ "--c": project.color } as React.CSSProperties}>
      <div className="relative h-60 rounded-md bg-v3-bg-2 border border-v3-border overflow-hidden mb-8 flex items-center justify-center max-[720px]:h-[200px] max-[480px]:h-40">
        <div className="font-serif font-light text-[220px] leading-[0.85] text-[var(--c)] opacity-85 tracking-[-0.04em] relative z-[1] select-none max-[720px]:text-[180px] max-[480px]:text-[140px]">
          {project.title[0]}
        </div>
        <div className="absolute inset-0 z-0 [background-image:radial-gradient(circle_at_25%_25%,color-mix(in_oklab,var(--c)_18%,transparent),transparent_55%),radial-gradient(circle_at_78%_70%,color-mix(in_oklab,var(--c)_12%,transparent),transparent_50%),radial-gradient(circle_at_60%_20%,color-mix(in_oklab,var(--c)_8%,transparent),transparent_45%)]" />
        <div className="absolute inset-0 z-0 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute bottom-[14px] left-4 right-4 flex items-center justify-between text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute z-[2] max-[480px]:left-3 max-[480px]:right-3 max-[480px]:bottom-[10px] max-[480px]:text-[9.5px]">
          <span className="tabular-nums">
            No. {String(idx + 1).padStart(3, "0")} / {String(projects.length).padStart(3, "0")}
          </span>
          <span className={`py-px ${project.status === "shipping" ? "text-[#74e893]" : project.status === "paused" ? "text-[#f1c45b]" : "text-v3-text-mute"}`}>
            ● {project.status}
          </span>
        </div>
      </div>

      <p className="font-serif italic font-light text-[22px] leading-[1.5] tracking-[-0.005em] text-v3-text-2 mt-0 mb-7 text-pretty max-[720px]:text-[18px]">
        {project.blurb}
      </p>

      <div className="flex flex-col gap-[2px] my-7 mb-8 px-[22px] py-[18px] bg-v3-bg-2 border border-v3-border border-l-2 rounded text-[12px]" style={{ borderLeftColor: project.color }}>
        <div className="grid grid-cols-[100px_1fr] items-baseline py-[6px] gap-4 [&+&]:border-t [&+&]:border-dashed [&+&]:border-v3-border max-[720px]:grid-cols-1 max-[720px]:gap-[6px] max-[720px]:py-[10px]">
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute max-[720px]:text-[10px]">Kind</span>
          <span className="font-mono text-[12.5px] text-v3-text flex items-center flex-wrap gap-[6px]">{project.kind}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] items-baseline py-[6px] gap-4 border-t border-dashed border-v3-border max-[720px]:grid-cols-1 max-[720px]:gap-[6px] max-[720px]:py-[10px]">
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute max-[720px]:text-[10px]">Year</span>
          <span className="font-mono text-[12.5px] text-v3-text flex items-center flex-wrap gap-[6px]">{project.year}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] items-baseline py-[6px] gap-4 border-t border-dashed border-v3-border max-[720px]:grid-cols-1 max-[720px]:gap-[6px] max-[720px]:py-[10px]">
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute max-[720px]:text-[10px]">Status</span>
          <span className={`font-mono text-[12.5px] flex items-center flex-wrap gap-[6px] ${project.status === "shipping" ? "text-[#74e893]" : project.status === "paused" ? "text-[#f1c45b]" : "text-v3-text-mute"}`}>
            {project.status}
          </span>
        </div>
        {project.role && (
          <div className="grid grid-cols-[100px_1fr] items-baseline py-[6px] gap-4 border-t border-dashed border-v3-border max-[720px]:grid-cols-1 max-[720px]:gap-[6px] max-[720px]:py-[10px]">
            <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute max-[720px]:text-[10px]">Role</span>
            <span className="font-mono text-[12.5px] text-v3-text flex items-center flex-wrap gap-[6px]">{project.role}</span>
          </div>
        )}
        <div className="grid grid-cols-[100px_1fr] items-baseline py-[6px] gap-4 border-t border-dashed border-v3-border max-[720px]:grid-cols-1 max-[720px]:gap-[6px] max-[720px]:py-[10px]">
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute max-[720px]:text-[10px]">Stack</span>
          <span className="font-mono text-[12.5px] text-v3-text flex items-center flex-wrap gap-[4px]">
            {project.stack.map((s) => (
              <span key={s} className="font-mono text-[10.5px] text-v3-text-2 bg-[rgba(183,148,246,0.08)] border border-[rgba(183,148,246,0.18)] rounded-[3px] px-[7px] py-[2px] tracking-[0.02em]">
                {s}
              </span>
            ))}
          </span>
        </div>
        <div className="grid grid-cols-[100px_1fr] items-baseline py-[6px] gap-4 border-t border-dashed border-v3-border max-[720px]:grid-cols-1 max-[720px]:gap-[6px] max-[720px]:py-[10px]">
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute max-[720px]:text-[10px]">Views</span>
          <span className="font-mono text-[12.5px] text-v3-text flex items-center flex-wrap gap-[6px]">
            <ViewCounter slug={`/projects/${project.id}`} />
          </span>
        </div>
        {project.links && project.links.length > 0 && (
          <div className="grid grid-cols-[100px_1fr] items-baseline py-[6px] gap-4 border-t border-dashed border-v3-border max-[720px]:grid-cols-1 max-[720px]:gap-[6px] max-[720px]:py-[10px]">
            <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute max-[720px]:text-[10px]">Links</span>
            <span className="font-mono text-[12.5px] text-v3-text flex items-center flex-wrap gap-[10px]">
              {project.links.map((l, i) => (
                <React.Fragment key={l.label}>
                  <a className="text-v3-accent no-underline font-mono text-[12px] tracking-[0.02em] transition-colors duration-150 hover:text-v3-accent-2" href={l.href}>
                    {l.label} ↗
                  </a>
                  {project.links && i < project.links.length - 1 && (
                    <span className="text-v3-text-dim">·</span>
                  )}
                </React.Fragment>
              ))}
            </span>
          </div>
        )}
      </div>

      <div className="w-14 h-px bg-v3-accent opacity-55 mb-8" />

      <div className="flex flex-col gap-[22px] max-[720px]:gap-[18px]">
        {project.body.map((para, i) => (
          <p key={i} className="font-mono text-[13.5px] leading-[1.85] text-v3-text m-0 text-pretty max-[480px]:text-[12.5px] max-[480px]:leading-[1.75]">
            {para}
          </p>
        ))}
      </div>

      <footer className="mt-14 pt-7 border-t border-v3-border max-[480px]:mt-9 max-[480px]:pt-5">
        <div className="flex items-center gap-[10px] text-[11px] tracking-[0.15em] uppercase text-v3-text-mute mb-7">
          <span className="text-[13px] tracking-normal" style={{ color: project.color }}>●</span>
          <span className="text-v3-text font-semibold">{project.title}</span>
          <span className="text-v3-text-dim ml-auto tabular-nums">{project.year}</span>
        </div>
        <nav className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
          {prev && (
            <button
              className="bg-transparent border border-v3-border rounded-md px-[18px] py-[14px] cursor-pointer font-mono text-v3-text-2 text-left flex flex-col gap-1 transition-all duration-200 hover:border-v3-accent hover:bg-[rgba(183,148,246,0.04)] only:col-start-2"
              onClick={() => onSelect(prev.id)}
            >
              <span className="text-[10px] tracking-[0.18em] uppercase text-v3-text-mute">← previous</span>
              <span className="font-serif not-italic font-normal text-[15px] tracking-[-0.005em] text-v3-text leading-[1.3] text-pretty">{prev.title}</span>
            </button>
          )}
          {next && (
            <button
              className="bg-transparent border border-v3-border rounded-md px-[18px] py-[14px] cursor-pointer font-mono text-v3-text-2 text-right flex flex-col gap-1 transition-all duration-200 hover:border-v3-accent hover:bg-[rgba(183,148,246,0.04)] only:col-start-2"
              onClick={() => onSelect(next.id)}
            >
              <span className="text-[10px] tracking-[0.18em] uppercase text-v3-text-mute">next →</span>
              <span className="font-serif not-italic font-normal text-[15px] tracking-[-0.005em] text-v3-text leading-[1.3] text-pretty">{next.title}</span>
            </button>
          )}
        </nav>
      </footer>
    </article>
  );
}

function BlogList({ posts, onSelect }: { posts: Post[]; onSelect: (id: string) => void }) {
  return (
    <ol className="list-none p-0 mx-auto max-w-[760px] flex flex-col max-[920px]:max-w-full">
      {posts.map((p, i) => (
        <li
          key={p.id}
          className="grid grid-cols-[120px_1fr] gap-9 py-[30px] border-t border-v3-border last:border-b cursor-pointer relative transition-[padding-left] duration-[280ms] ease-v3-fade hover:pl-[18px] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-v3-accent before:origin-top before:scale-y-0 before:transition-transform before:duration-[280ms] before:ease-v3-fade hover:before:scale-y-100 max-[720px]:grid-cols-[72px_1fr] max-[720px]:gap-[18px] max-[720px]:py-[22px] max-[480px]:grid-cols-[56px_1fr] max-[480px]:gap-3 max-[480px]:py-[18px]"
          onClick={() => onSelect(p.id)}
        >
          <div className="flex flex-col gap-[6px] pt-1">
            <div className="font-serif italic text-[32px] text-v3-accent leading-none font-light tabular-nums max-[720px]:text-[26px] max-[480px]:text-[22px]">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="text-[10.5px] text-v3-text-dim tracking-[0.08em] uppercase tabular-nums">{p.date}</div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <h3 className="font-serif font-normal text-[30px] m-0 tracking-[-0.015em] leading-[1.15] text-v3-text text-pretty max-[720px]:text-[24px] max-[480px]:text-[20px]">
              {p.title}
            </h3>
            <p className="font-mono text-[12.5px] leading-[1.7] text-v3-text-2 m-0 max-w-[640px] text-pretty max-[720px]:text-[12px] max-[720px]:max-w-full">
              {p.excerpt}
            </p>
            <div className="flex items-center gap-2 text-[10.5px] text-v3-text-mute tracking-[0.1em] uppercase mt-1 max-[480px]:flex-wrap max-[480px]:gap-[6px]">
              <span>{p.readTime}</span>
              <span className="text-v3-text-dim">/</span>
              {p.tags.map((t, j) => (
                <React.Fragment key={t}>
                  <span className="text-v3-text-2">{t}</span>
                  {j < p.tags.length - 1 && <span className="text-v3-text-dim">,</span>}
                </React.Fragment>
              ))}
              <span className="flex-1 max-[480px]:hidden" />
              <span className="text-v3-accent tracking-[0.08em]">Read →</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PostDetail({
  post,
  posts,
  profile,
  onSelect,
}: {
  post: Post;
  posts: Post[];
  profile: Profile;
  onSelect: (id: string | null) => void;
}) {
  const idx = posts.findIndex((p) => p.id === post.id);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx < posts.length - 1 ? posts[idx + 1] : null;

  return (
    <article className="max-w-[720px] mx-auto pt-2">
      <div className="flex items-center gap-3 text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute mb-[22px]">
        {post.tags.map((t) => (
          <span key={t} className="text-v3-accent font-mono">#{t}</span>
        ))}
        <span className="ml-auto text-v3-text-dim tabular-nums">
          No. {String(idx + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
        </span>
      </div>

      <p className="font-serif italic font-light text-[22px] leading-[1.5] tracking-[-0.005em] text-v3-text-2 mt-0 mb-7 text-pretty max-[720px]:text-[18px] max-[480px]:text-[16px]">
        {post.excerpt}
      </p>
      <div className="w-14 h-px bg-v3-accent opacity-55 mb-8" />

      <div className="flex flex-col gap-[22px] max-[720px]:gap-[18px]">
        {post.body.map((para, i) => (
          <p key={i} className="font-mono text-[13.5px] leading-[1.85] text-v3-text m-0 text-pretty max-[480px]:text-[12.5px] max-[480px]:leading-[1.75]">
            {i === 0 && (
              <span className="font-serif italic font-light text-[56px] leading-[0.85] float-left mr-2 -mb-[2px] mt-[6px] text-v3-accent max-[720px]:text-[44px] max-[480px]:text-[36px] max-[480px]:mr-[6px] max-[480px]:mt-1">
                {para.charAt(0)}
              </span>
            )}
            {i === 0 ? para.slice(1) : para}
          </p>
        ))}
      </div>

      <footer className="mt-14 pt-7 border-t border-v3-border max-[480px]:mt-9 max-[480px]:pt-5">
        <div className="flex items-center gap-[10px] text-[11px] tracking-[0.15em] uppercase text-v3-text-mute mb-7">
          <span className="text-v3-accent text-[13px] tracking-normal">✦</span>
          <span className="text-v3-text font-semibold">{profile.name}</span>
          <span className="text-v3-text-dim ml-auto tabular-nums">{post.date}</span>
        </div>
        <nav className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
          {prev && (
            <button
              className="bg-transparent border border-v3-border rounded-md px-[18px] py-[14px] cursor-pointer font-mono text-v3-text-2 text-left flex flex-col gap-1 transition-all duration-200 hover:border-v3-accent hover:bg-[rgba(183,148,246,0.04)] only:col-start-2"
              onClick={() => onSelect(prev.id)}
            >
              <span className="text-[10px] tracking-[0.18em] uppercase text-v3-text-mute">← previous</span>
              <span className="font-serif not-italic font-normal text-[15px] tracking-[-0.005em] text-v3-text leading-[1.3] text-pretty">{prev.title}</span>
            </button>
          )}
          {next && (
            <button
              className="bg-transparent border border-v3-border rounded-md px-[18px] py-[14px] cursor-pointer font-mono text-v3-text-2 text-right flex flex-col gap-1 transition-all duration-200 hover:border-v3-accent hover:bg-[rgba(183,148,246,0.04)] only:col-start-2"
              onClick={() => onSelect(next.id)}
            >
              <span className="text-[10px] tracking-[0.18em] uppercase text-v3-text-mute">next →</span>
              <span className="font-serif not-italic font-normal text-[15px] tracking-[-0.005em] text-v3-text leading-[1.3] text-pretty">{next.title}</span>
            </button>
          )}
        </nav>
      </footer>
    </article>
  );
}

function ExperiencesList({ experiences }: { experiences: Experience[] }) {
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
              <div
                className={[
                  "w-[5px] h-[5px] rounded-full transition-all duration-200",
                  e.kind === "self"
                    ? "bg-v3-accent shadow-[0_0_0_3px_rgba(183,148,246,0.18)]"
                    : e.kind === "role"
                      ? "bg-v3-text-2"
                      : e.kind === "edu"
                        ? "bg-[#f1c45b]"
                        : "bg-v3-text-dim",
                ].join(" ")}
              />
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
              <span
                className={
                  e.kind === "self"
                    ? "text-v3-accent"
                    : e.kind === "role"
                      ? "text-v3-text-2"
                      : e.kind === "edu"
                        ? "text-[#f1c45b]"
                        : "text-v3-text-2"
                }
              >
                {e.kind}
              </span>
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
