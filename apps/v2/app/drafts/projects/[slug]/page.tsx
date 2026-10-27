import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProjectDetail } from "@/app/(portfolio)/projects/ProjectsPane";
import { getProject } from "@/lib/db";
import { getDraftPasswordHash, hasDraftAccess } from "@/lib/draft-gate";
import { DraftGate } from "../../DraftGate";

// Per-visitor (cookie-dependent) and must never be cached or indexed.
export const dynamic = "force-dynamic";

// Static on purpose: the draft's title must not leak before the password is entered.
export const metadata: Metadata = {
  title: "Private draft — Maxime Duhamel",
  robots: { index: false, follow: false },
};

export default async function DraftProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = await getProject(slug);
  if (!project) notFound();
  // Once published, an old draft link just lands on the real page.
  if (project.published !== false) {
    redirect(`/${project.category === "side" ? "side-quests" : "projects"}/${encodeURIComponent(slug)}`);
  }

  const storedHash = await getDraftPasswordHash("project", slug);

  let content: React.ReactNode;
  if (await hasDraftAccess("project", slug, storedHash)) {
    content = (
      <div className="w-full">
        <div className="max-w-[760px] mx-auto mb-8 flex items-center gap-3 text-[10.5px] tracking-[0.18em] uppercase text-v3-text-mute">
          <span className="text-v3-accent">Draft</span>
          <span>· not published</span>
        </div>
        <h1 className="max-w-[760px] mx-auto font-serif font-normal text-[40px] tracking-[-0.015em] leading-[1.1] text-v3-text text-pretty m-0 mb-8 max-[720px]:text-[30px]">
          {project.title}
        </h1>
        <ProjectDetail project={project} projects={[project]} />
      </div>
    );
  } else if (storedHash === null) {
    // No password set means no public link: indistinguishable from a missing project.
    notFound();
  } else {
    content = <DraftGate kind="project" slug={slug} />;
  }

  return (
    <main className="min-h-screen bg-v3-bg text-v3-text font-mono text-[12.5px] leading-[1.55] px-6 py-14 flex justify-center items-start max-[480px]:px-4">
      {content}
    </main>
  );
}
