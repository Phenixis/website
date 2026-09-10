import { getPublishedProject } from "@/lib/db";
import { notFound } from "next/navigation";
import { truncateDescription } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project || project.category === "side") return {};
  const description = truncateDescription(project.blurb);
  return {
    title: `${project.title} — Maxime Duhamel`,
    description,
    openGraph: { title: project.title, description },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project || project.category === "side") notFound();
  return null;
}
