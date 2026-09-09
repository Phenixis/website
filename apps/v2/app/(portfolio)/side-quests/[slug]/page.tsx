import { getPublishedProject } from "@/lib/db";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project || project.category !== "side") return {};
  return {
    title: `${project.title} — Maxime Duhamel`,
    description: project.blurb,
    openGraph: { title: project.title, description: project.blurb },
  };
}

export default async function SideQuestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project || project.category !== "side") notFound();
  return null;
}
