import { getExperiences } from '@repo/content/server'
import Link from 'next/link'

export default async function ExperiencesPage() {
  const experiences = await getExperiences()
  const sorted = experiences.sort((a, b) =>
    new Date(b.metadata.start ?? '').getTime() - new Date(a.metadata.start ?? '').getTime()
  )

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-10">Experiences</h1>
      <ul className="space-y-6">
        {sorted.map((exp) => (
          <li key={exp.slug}>
            <Link href={`/experiences/${exp.slug}`} className="group block">
              <p className="font-semibold group-hover:underline">{exp.metadata.title}</p>
              <p className="text-zinc-500 text-sm mt-1">{exp.metadata.summary}</p>
              <p className="text-zinc-400 text-xs mt-1">
                {exp.metadata.start} → {exp.metadata.end ?? 'now'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
