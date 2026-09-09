import { Portfolio } from "../_components/portfolio/Portfolio";
import { PROFILE } from "../data";
import { getPublishedProjects, getPublishedPosts, getPublishedExperiences, getProfile } from "@/lib/db";

export const revalidate = 86400;

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, posts, experiences, profile] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts(),
    getPublishedExperiences(),
    getProfile(),
  ]);

  const mainProjects = projects.filter((p) => p.category !== "side");
  const sideQuests = projects.filter((p) => p.category === "side");

  return (
    <>
      <Portfolio
        profile={profile ?? PROFILE}
        mainProjects={mainProjects}
        sideQuests={sideQuests}
        posts={posts}
        experiences={experiences}
      />
      {children}
    </>
  );
}
