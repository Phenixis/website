import BlogPosts from '@/components/big/posts'
import Project, { colorVariants, states } from "@/components/big/project"
import { getProjects } from "@/app/blog/utils"
import { Link } from '@/components/big/link'

export default async function Page() {
    const birthDate = new Date(2005, 3, 18, 10, 1, 0, 0);
    const now = new Date();
    const birthdayThisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    let currentLifeYear = now.getFullYear() - birthDate.getFullYear();
    if (now < birthdayThisYear) {
        currentLifeYear--;
    }
    currentLifeYear = Math.max(0, currentLifeYear); // safeguard in case of negative age
    const projects = await getProjects()

    return (
        <section className="page">
            <h1 className="page-title">
                Welcome !
            </h1>
            <p className="page-description">
                I&apos;m Maxime, a {currentLifeYear} years old french student in computer science. I love building useful applications and websites. I specialize in NextJS, coupled with TailwindCSS and a PostgreSQL database. You can find all my projects <Link href="/projects" dashed>here</Link>. I also write about my projects, my views and my thoughts <Link href="/blog" dashed>here</Link>.
            </p>
            <h2 className="page-title text-2xl">
                <Link href="/projects" underlined={false}>
                    My current projects
                </Link>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {projects.filter((project) => project.metadata.state === "Running" || project.metadata.state === "Building").map((project) => (
                    <Project key={project.metadata.title} project={project} showBadge={false}  />
                ))}
            </div>
            <div className="my-8">
                <h2 className="page-title text-2xl">
                    <Link href="/blog" underlined={false}>
                        My recent blog posts
                    </Link>
                </h2>
                <BlogPosts />
            </div>
        </section>
    )
}
