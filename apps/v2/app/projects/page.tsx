import { getProjects } from '@repo/content/server'
import { formatDate } from '@repo/content'
import Link from 'next/link'

export default async function ProjectsPage() {
  const projects = await getProjects()
  const sorted = projects.sort((a, b) =>
    new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-10">Projects</h1>
      <ul className="space-y-6">
        {sorted.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <p className="font-semibold group-hover:underline">{project.metadata.title}</p>
              <p className="text-zinc-500 text-sm mt-1">{project.metadata.summary}</p>
              <p className="text-zinc-400 text-xs mt-1">
                {formatDate(project.metadata.publishedAt)} · {project.metadata.views} views
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
