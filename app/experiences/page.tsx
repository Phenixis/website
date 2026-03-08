import { getExperiences } from '@/app/blog/utils'
import ExperiencesList from '@/components/big/experiences-client'

export const metadata = {
    title: 'Experiences',
    description: 'A list of my professional experiences, internships and work-study programs.',
}

export default async function Page() {
    const experiences = await getExperiences()

    const sorted = experiences.toSorted((a, b) => {
        const dateA = a.metadata.start ?? ''
        const dateB = b.metadata.start ?? ''
        return dateB.localeCompare(dateA)
    })

    return (
        <section className="page space-y-6">
            <h1 className="page-title">
                My Experiences
            </h1>
            <p className="page-description">
                A timeline of professional experiences that shaped my skills and perspective.
            </p>
            <ExperiencesList experiences={sorted} />
        </section>
    )
}
