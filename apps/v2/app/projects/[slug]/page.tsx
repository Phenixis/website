import { getProjects } from '@repo/content/server'
import { formatDate } from '@repo/content'
import { CustomMDX } from '@/components/mdx'
import { notFound } from 'next/navigation'

export const dynamicParams = true

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projects = await getProjects()
  const project = projects.find((p) => p.slug === slug)

  if (!project) notFound()

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-zinc-400 text-sm mb-2">
        {formatDate(project.metadata.publishedAt)} · {project.metadata.views} views
      </p>
      <h1 className="text-3xl font-bold mb-4">{project.metadata.title}</h1>
      <p className="text-zinc-500 mb-10">{project.metadata.summary}</p>
      <article className="prose prose-zinc max-w-none">
        <CustomMDX source={project.content} />
      </article>
    </main>
  )
}
