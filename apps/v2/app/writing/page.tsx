import "../portfolio.css";
import { Portfolio } from "../_components/Portfolio";
import { PROFILE } from "../data";
import { getProjects, getPublishedPosts, getExperiences } from "@/lib/db";

export const revalidate = 86400;

export const metadata = {
  title: "Writing — Maxime Duhamel",
  description: "Essays, notes, observations — things that needed to be written.",
};

export default async function WritingPage() {
  const [projects, posts, experiences] = await Promise.all([
    getProjects(),
    getPublishedPosts(),
    getExperiences(),
  ]);

  return (
    <Portfolio
      profile={PROFILE}
      projects={projects}
      posts={posts}
      experiences={experiences}
      initialFocus="blog"
    />
  );
}
