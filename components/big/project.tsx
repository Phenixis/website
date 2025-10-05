import { kebabCasetoTitleCase, ProjectType } from "@/app/blog/utils"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { BadgeTrimmed } from "../ui/badge-trimmed"
import { Badge } from "../ui/badge"

export let colorVariants = {
    "blue": {
        "background": "bg-blue-300/10 lg:group-hover/project:bg-blue-300/20",
        "image": "bg-blue-300/50 lg:group-hover/project:bg-blue-300/70",
        "border": "border border-blue-300/90",
        "selection": "selection:bg-blue-300/50 selection:text-neutral-900 dark:selection:text-neutral-100",
        "tag": "text-black dark:text-white font-light duration-1000 bg-blue-300/10 lg:hover:bg-blue-300/30 border border-blue-300/90"
    },
    "green": {
        "background": "bg-green-300/10 lg:group-hover/project:bg-green-300/20",
        "image": "bg-green-300/50 lg:group-hover/project:bg-green-300/70",
        "border": "border border-green-300/90",
        "selection": "selection:bg-green-300/50 selection:text-neutral-900 dark:selection:text-neutral-100",
        "tag": "text-black dark:text-white font-light duration-1000 bg-green-500/10 lg:hover:bg-green-500/20 border border-green-300/90"
    },
    "red": {
        "background": "bg-red-300/10 lg:group-hover/project:bg-red-300/20",
        "image": "bg-red-300/50 lg:group-hover/project:bg-red-300/70",
        "border": "border border-red-300/90",
        "selection": "selection:bg-red-300/50 selection:text-neutral-900 dark:selection:text-neutral-100",
        "tag": "text-black dark:text-white font-light duration-1000 bg-red-500/10 lg:hover:bg-red-500/20 border border-red-300/90"
    },
    "yellow": {
        "background": "bg-yellow-300/10 lg:group-hover/project:bg-yellow-300/20",
        "image": "bg-yellow-300/50 lg:group-hover/project:bg-yellow-300/70",
        "border": "border border-yellow-300/90",
        "selection": "selection:bg-yellow-300/50 selection:text-neutral-900 dark:selection:text-neutral-100",
        "tag": "text-black dark:text-white font-light duration-1000 bg-yellow-500/10 lg:hover:bg-yellow-500/20 border border-yellow-300/90"
    },
    "purple": {
        "background": "bg-purple-300/10 lg:group-hover/project:bg-purple-300/20",
        "image": "bg-purple-300/50 lg:group-hover/project:bg-purple-300/70",
        "border": "border border-purple-300/90",
        "selection": "selection:bg-purple-300/50 selection:text-neutral-900 dark:selection:text-neutral-100",
        "tag": "text-black dark:text-white font-light duration-1000 bg-purple-500/10 lg:hover:bg-purple-500/20 border border-purple-300/90"
    },
    "orange": {
        "background": "bg-orange-300/10 lg:group-hover/project:bg-orange-300/20",
        "image": "bg-orange-300/50 lg:group-hover/project:bg-orange-300/70",
        "border": "border border-orange-300/90",
        "selection": "selection:bg-orange-300/50 selection:text-neutral-900 dark:selection:text-neutral-100",
        "tag": "text-black dark:text-white font-light duration-1000 bg-orange-500/10 lg:hover:bg-orange-500/20 border border-orange-300/90"
    },
    "black": {
        "background": "bg-neutral-300/10 lg:group-hover/project:bg-neutral-300/20",
        "image": "bg-neutral-800/50 lg:group-hover/project:bg-neutral-800/70",
        "border": "border border-neutral-300/90",
        "selection": "selection:bg-neutral-300/50 selection:text-neutral-900 dark:selection:text-neutral-100",
        "tag": "text-black dark:text-white font-light duration-1000 bg-neutral-500/10 lg:hover:bg-neutral-500/20 border border-neutral-300/90"
    }
}
export const skills = [
    {
        index: 1,
        name: "Réaliser une solution informatique",
        color: colorVariants.red
    },
    {
        index: 2,
        name: "Optimiser des programmes",
        color: colorVariants.orange
    },
    {
        index: 3,
        name: "Administrer des infrastructures et services",
        color: colorVariants.yellow
    },
    {
        index: 4,
        name: "Gérer les données pour les rendre disponibles",
        color: colorVariants.green
    },
    {
        index: 5,
        name: "Conduire un projet en méthode agile",
        color: colorVariants.blue
    },
    {
        index: 6,
        name: "Collaborer pour travailler en équipe",
        color: colorVariants.black
    },
]

export const states = ["Running", "Building", "Idea", "Built", "Sold", "Discontinued"]

export default function Project({
    project,
    showBadge = true,
}: {
    project: ProjectType
    showBadge?: boolean,
}) {
    const colorVariant = project.metadata.color && colorVariants[project.metadata.color] ? colorVariants[project.metadata.color] : colorVariants.blue

    return (
        <Link href={`/blog/${project.slug}`} className="group/project">
            <div className={cn(
                "size-full p-2 rounded-md duration-1000 space-y-4 md:space-y-6 flex flex-col justify-between",
                colorVariant.selection,
                colorVariant.background)
            }>
                <div className="space-y-2">
                    <header className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-neutral-900 dark:text-neutral-100 tracking-tight md:text-lg">
                            {project.metadata.title}
                        </h3>
                        {
                            showBadge ? (
                                <Badge className={cn("shrink-0", colorVariant.selection, colorVariant.background, colorVariant.border, "text-black dark:text-white text-xs md:text-sm font-light")}>
                                    {project.metadata.state}
                                </Badge>
                            ) : null
                        }
                    </header>
                    <p className="text-neutral-500 dark:text-neutral-400 tracking-tight line-clamp-2 text-sm md:text-base">
                        {project.metadata.summary}
                    </p>
                </div>
                {
                    project.metadata.tags && project.metadata.tags.length > 0 ? (
                        <div className="text-xs font-light flex flex-row flex-wrap items-end gap-2">
                            {project.metadata.tags.map((tag) => (
                                <BadgeTrimmed
                                    key={tag.index}
                                    className={cn(tag.color.tag, "text-xs")}
                                    text={kebabCasetoTitleCase(tag.name)}
                                    untilSpace
                                />
                            ))}
                        </div>
                    ) : null
                }
            </div>
        </Link >
    )
}