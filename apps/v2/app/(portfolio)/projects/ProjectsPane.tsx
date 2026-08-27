import React from "react";
import type { Project } from "../../data";
import { ViewCounter } from "../../_components/ViewCounter";
import { DetailFooter } from "../../_components/portfolio/DetailFooter";

function statusColor(status: Project["status"]) {
  return status === "shipping" ? "text-[#74e893]" : status === "paused" ? "text-[#f1c45b]" : "text-v3-text-mute";
}

export function ProjectsList({ projects, onSelect }: { projects: Project[]; onSelect: (id: string) => void }) {
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
              <span className={statusColor(p.status)}>{p.status}</span>
              <span className="flex-1" />
              <span className="text-v3-text-mute normal-case tracking-normal tabular-nums max-[480px]:w-full">{p.stack.join(" / ")}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProjectDetail({
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
          <span className={`py-px ${statusColor(project.status)}`}>
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
          <span className={`font-mono text-[12.5px] flex items-center flex-wrap gap-[6px] ${statusColor(project.status)}`}>
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

      <DetailFooter
        sign={
          <>
            <span className="text-[13px] tracking-normal" style={{ color: project.color }}>●</span>
            <span className="text-v3-text font-semibold">{project.title}</span>
            <span className="text-v3-text-dim ml-auto tabular-nums">{project.year}</span>
          </>
        }
        prev={prev}
        next={next}
        onSelect={onSelect}
      />
    </article>
  );
}
