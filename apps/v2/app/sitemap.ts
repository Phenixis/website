import type { MetadataRoute } from "next";
import { getPublishedProjects, getPublishedPosts } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getPublishedProjects(), getPublishedPosts()]);

  const staticRoutes = ["", "/writing", "/side-quests", "/itinerary"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${SITE_URL}/${p.category === "side" ? "side-quests" : "projects"}/${p.id}`,
    lastModified: new Date(),
  }));

  const postRoutes = posts.map((p) => ({
    url: `${SITE_URL}/writing/${p.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
