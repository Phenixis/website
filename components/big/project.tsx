import { kebabCasetoTitleCase, ProjectType } from "@/app/blog/utils"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { BadgeTrimmed } from "../ui/badge-trimmed"

export const colorVariants = {
    "blue": {
        "background": "bg-blue-300/10 dark:bg-blue-300/20",
        "image": "bg-blue-300/50 hover:bg-blue-300/70",
        "border": "border border-blue-300/90 lg:border-blue-300/10 lg:dark:border-blue-300/20 lg:hover:border-blue-300/90",
        "selection": "selection:bg-blue-300/50 selection:text-neutral-900 dark:selection:text-neutral-100"
    },
    "green": {
        "background": "bg-green-300/10 dark:bg-green-300/20",
        "image": "bg-green-300/50 hover:bg-green-300/70",
        "border": "border border-green-300/90 lg:border-green-300/10 lg:dark:border-green-300/20 lg:hover:border-green-300/90",
        "selection": "selection:bg-green-300/50 selection:text-neutral-900 dark:selection:text-neutral-100"
    },
    "red": {
        "background": "bg-red-300/10 dark:bg-red-300/20",
        "image": "bg-red-300/50 hover:bg-red-300/70",
        "border": "border border-red-300/90 lg:border-red-300/10 lg:dark:border-red-300/20 lg:hover:border-red-300/90",
        "selection": "selection:bg-red-300/50 selection:text-neutral-900 dark:selection:text-neutral-100"
    },
    "yellow": {
        "background": "bg-yellow-300/10 dark:bg-yellow-300/20",
        "image": "bg-yellow-300/50 hover:bg-yellow-300/70",
        "border": "border border-yellow-300/90 lg:border-yellow-300/10 lg:dark:border-yellow-300/20 lg:hover:border-yellow-300/90",
        "selection": "selection:bg-yellow-300/50 selection:text-neutral-900 dark:selection:text-neutral-100"
    },
    "purple": {
        "background": "bg-purple-300/10 dark:bg-purple-300/20",
        "image": "bg-purple-300/50 hover:bg-purple-300/70",
        "border": "border border-purple-300/90 lg:border-purple-300/10 lg:dark:border-purple-300/20 lg:hover:border-purple-300/90",
        "selection": "selection:bg-purple-300/50 selection:text-neutral-900 dark:selection:text-neutral-100"
    },
    "orange": {
        "background": "bg-orange-300/10 dark:bg-orange-300/20",
        "image": "bg-orange-300/50 hover:bg-orange-300/70",
        "border": "border border-orange-300/90 lg:border-orange-300/10 lg:dark:border-orange-300/20 lg:hover:border-orange-300/90",
        "selection": "selection:bg-orange-300/50 selection:text-neutral-900 dark:selection:text-neutral-100"
    },
    "black": {
        "background": "bg-neutral-300/10 dark:bg-neutral-300/20",
        "image": "bg-neutral-800/50 hover:bg-neutral-800/70",
        "border": "border border-neutral-300/90 lg:border-neutral-300/10 lg:dark:border-neutral-300/20 lg:hover:border-neutral-300/90",
        "selection": "selection:bg-neutral-300/50 selection:text-neutral-900 dark:selection:text-neutral-100"
    }
}

export const skills = [
    {
        index: 1,
        name: "Réaliser une solution informatique",
        color: "bg-red-500/50 hover:bg-red-500/70 dark:bg-red-500/80 dark:hover:bg-red-500"
    },
    {
        index: 2,
        name: "Optimiser des programmes",
        color: "bg-orange-500/50 hover:bg-orange-500/70 dark:bg-orange-500/80 dark:hover:bg-orange-500"
    },
    {
        index: 3,
        name: "Administrer des infrastructures et services",
        color: "bg-yellow-500/50 hover:bg-yellow-500/70 dark:bg-yellow-500/80 dark:hover:bg-yellow-500"
    },
    {
        index: 4,
        name: "Gérer les données pour les rendre disponibles",
        color: "bg-green-500/50 hover:bg-green-500/70 dark:bg-green-500/80 dark:hover:bg-green-500"
    },
    {
        index: 5,
        name: "Conduire un projet en méthode agile",
        color: "bg-blue-500/50 hover:bg-blue-500/70 dark:bg-blue-500/80 dark:hover:bg-blue-500"
    },
    {
        index: 6,
        name: "Collaborer pour travailler en équipe",
        color: "bg-neutral-500/50 hover:bg-neutral-500/70 dark:bg-neutral-500/80 dark:hover:bg-neutral-500 "
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
        <Link href={`/blog/${project.slug}`}>
            <div className={cn(
                "size-full p-2 rounded-md duration-1000 grid grid-cols-1",
                showBadge ? "md:items-center" : "",
                "md:grid-cols-5 gap-2",
                colorVariant.selection,
                colorVariant.background,
                colorVariant.border)
            }>
                {
                    showBadge ? (
                        <div className="md:col-span-1 tabular-nums shrink-0">
                            <div className={`text-xs p-1 rounded-md w-fit md:mx-auto ${colorVariant.image}`}>
                                {project.metadata.state}
                            </div>
                        </div>
                    ) : null
                }
                <div className={showBadge ? "md:col-span-4" : "md:col-span-5"}>
                    <h3 className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                        {project.metadata.title}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 tracking-tight line-clamp-2">
                        {project.metadata.summary}
                    </p>
                </div>
                {
                    project.metadata.tags && project.metadata.tags.length > 0 ? (
                        <div className="md:col-span-5 text-xs font-light flex flex-row items-end gap-2">
                            {project.metadata.tags.map((tag) => (
                                <BadgeTrimmed
                                    key={tag.index}
                                    className={cn(tag.color)}
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