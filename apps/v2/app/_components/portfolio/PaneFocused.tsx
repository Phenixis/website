import type { Project, Post, Experience, Profile } from "../../data";
import { ProjectsList, ProjectDetail } from "../../(portfolio)/projects/ProjectsPane";
import { BlogList, PostDetail } from "../../(portfolio)/writing/WritingPane";
import { ExperiencesList } from "../../(portfolio)/itinerary/ItineraryPane";

type Pane = { id: string; label: string; num: string; count: number; sub: string };

type PaneFocusedProps = {
  pane: Pane;
  projects: Project[];
  posts: Post[];
  experiences: Experience[];
  profile: Profile;
  selectedPostId: string | null;
  onSelectPost: (id: string | null) => void;
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
};

const HEADER_ROW_CLASS =
  "flex items-center gap-4 mb-4 text-[11px] text-v3-text-mute tracking-[0.15em] uppercase max-[720px]:gap-[10px] max-[480px]:flex-wrap max-[480px]:gap-2";

function HeaderRule() {
  return <span className="flex-none basis-14 h-px bg-v3-border-strong max-[720px]:basis-6 max-[480px]:hidden" />;
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="bg-transparent border-0 text-v3-accent font-mono text-[11px] tracking-[0.15em] uppercase cursor-pointer py-1 flex items-center gap-2 transition-[color,gap] duration-150 hover:text-v3-accent-2 hover:gap-3 max-[480px]:text-[10.5px] max-[480px]:tracking-[0.12em]"
      onClick={onClick}
    >
      <span className="font-serif text-[16px] tracking-normal">←</span>
      <span>{label}</span>
    </button>
  );
}

export function PaneFocused({
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

  const centeredHead = pane.id === "blog" || !!selectedProject || (pane.id === "projects" && !selectedProject) || pane.id === "experiences";

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
            <div className={HEADER_ROW_CLASS}>
              <BackButton label="Writing" onClick={() => onSelectPost(null)} />
              <HeaderRule />
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
            <div className={HEADER_ROW_CLASS}>
              <BackButton label="Projects" onClick={() => onSelectProject(null)} />
              <HeaderRule />
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
            <div className={HEADER_ROW_CLASS}>
              <span className="font-serif italic text-[18px] text-v3-accent normal-case tracking-normal font-normal">{pane.num}</span>
              <HeaderRule />
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
