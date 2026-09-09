import { AdminShell } from "./_components/AdminShell";
import { getProjects, getPosts, getExperiences, getProfile } from "@/lib/db";
import { PROFILE } from "../data";

export const metadata = {
  title: "Back-office · Maxime Duhamel",
};

// Admin is authenticated and low-traffic; always render fresh from Turso
// instead of freezing counts/profile at build time.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, posts, experiences, profile] = await Promise.all([
    getProjects(),
    getPosts(),
    getExperiences(),
    getProfile(),
  ]);

  const counts = {
    mainProjects: projects.filter((p) => p.category !== "side").length,
    sideQuests: projects.filter((p) => p.category === "side").length,
    posts: posts.length,
    experiences: experiences.length,
    drafts: posts.filter((p) => p.published === false).length,
    archived: projects.filter((p) => p.status === "archived").length,
    tags: new Set(posts.flatMap((p) => p.tags)).size,
  };

  return (
    <AdminShell profile={profile ?? PROFILE} counts={counts}>
      {children}
    </AdminShell>
  );
}
