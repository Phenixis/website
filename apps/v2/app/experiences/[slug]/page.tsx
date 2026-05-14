import { getExperiences } from '@repo/content/server'
import { CustomMDX } from '@/components/mdx'
import { notFound } from 'next/navigation'

export const dynamicParams = true

export async function generateStaticParams() {
  const experiences = await getExperiences()
  return experiences.map((e) => ({ slug: e.slug }))
}

export default async function ExperiencePost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experiences = await getExperiences()
  const exp = experiences.find((e) => e.slug === slug)

  if (!exp) notFound()

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-zinc-400 text-sm mb-2">
        {exp.metadata.start} → {exp.metadata.end ?? 'now'}
      </p>
      <h1 className="text-3xl font-bold mb-4">{exp.metadata.title}</h1>
      <p className="text-zinc-500 mb-10">{exp.metadata.summary}</p>
      <article className="prose prose-zinc max-w-none">
        <CustomMDX source={exp.content} />
      </article>
    </main>
  )
}
