import { Portfolio } from "../_components/Portfolio";
import { PROFILE } from "../data";
import { getProjects, getPublishedPosts, getExperiences, getProfile } from "@/lib/db";

export const revalidate = 86400;

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, posts, experiences, profile] = await Promise.all([
    getProjects(),
    getPublishedPosts(),
    getExperiences(),
    getProfile(),
  ]);

  return (
    <>
      <Portfolio profile={profile ?? PROFILE} projects={projects} posts={posts} experiences={experiences} />
      {children}
    </>
  );
}
