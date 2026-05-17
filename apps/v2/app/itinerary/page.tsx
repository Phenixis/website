import "../portfolio.css";
import { Portfolio } from "../_components/Portfolio";
import { PROFILE } from "../data";
import { getProjects, getPosts, getExperiences } from "@/lib/db";

export const revalidate = 86400;

export const metadata = {
  title: "Itinerary — Maxime Duhamel",
  description: "Where I went, what I did, who I worked with.",
};

export default async function ItineraryPage() {
  const [projects, posts, experiences] = await Promise.all([
    getProjects(),
    getPosts(),
    getExperiences(),
  ]);

  return (
    <Portfolio
      profile={PROFILE}
      projects={projects}
      posts={posts}
      experiences={experiences}
      initialFocus="experiences"
    />
  );
}
