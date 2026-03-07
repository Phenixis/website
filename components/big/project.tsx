'use client';

import type { ProjectType } from "@/app/blog/utils"
import { useStyle } from "@/contexts/style-context"
import { type StyleVariant } from "@/lib/style-flag"
import { cn, formatDate, isExternalImage } from '@/lib/utils'
import { Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"

export const colorVariants = {
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

import { states } from "@/lib/project-states"
export { states } from "@/lib/project-states"

const record: Record<StyleVariant, React.ComponentType<{ project: ProjectType; showBadge?: boolean }>> = {
    classical: ProjectClassical,
    modern: ProjectModern,
}

export default function Project({
    project,
    showBadge = true,
}: Readonly<{
    project: ProjectType
    showBadge?: boolean,
}>) {
    const { currentStyle } = useStyle();

    const Component = record[currentStyle] || ProjectClassical;

    return <Component project={project} showBadge={showBadge} />;
}

export function ProjectClassical({
    project,
    showBadge = true,
}: Readonly<{
    project: ProjectType
    showBadge?: boolean,
}>) {
    const colorVariant = project.metadata.color && colorVariants[project.metadata.color] ? colorVariants[project.metadata.color] : colorVariants.blue
    const state = project.metadata.tags?.find(tag => (states as readonly string[]).includes(tag))

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
                                    {state}
                                </Badge>
                            ) : null
                        }
                    </header>
                    <p className="text-neutral-500 dark:text-neutral-400 tracking-tight line-clamp-2 text-sm md:text-base">
                        {project.metadata.summary}
                    </p>
                </div>
            </div>
        </Link >
    )
}

export function ProjectModern({
    project,
    showBadge = true,
}: Readonly<{
    project: ProjectType
    showBadge?: boolean,
}>) {
    const colorVariant = project.metadata.color && colorVariants[project.metadata.color] ? colorVariants[project.metadata.color] : colorVariants.blue
    const hasImage = Boolean(project.metadata.image)
    const state = project.metadata.tags?.find(tag => (states as readonly string[]).includes(tag))
    const image = project.metadata.image

    return (
        <Link href={`/blog/${project.slug}`} className="group/project block">
            {/* Card: rounded by default, square on hover */}
            <div className={cn(
                "relative overflow-hidden rounded-b rounded-t-3xl lg:rounded-3xl lg:group-hover/project:rounded-b",
                "transition-[border-radius] duration-500 aspect-4/3",
                colorVariant.selection,
                !hasImage && colorVariant.image,
            )}>
                {/* Cover image */}
                {hasImage && image && (
                    isExternalImage(image) ? (
                        <img
                            src={image}
                            alt={project.metadata.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src={image}
                            alt={project.metadata.title}
                            fill
                            className="object-cover"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    )
                )}

                {/* Dark backdrop: fades in on hover to make the info overlay readable */}
                {hasImage && (
                    <div className="absolute inset-0 bg-black/20 lg:bg-black/0 lg:group-hover/project:bg-black/20 transition-colors duration-500" />
                )}

                {/* Badge: top-right, fades out on hover */}
                {showBadge && state && (
                    <div className="absolute top-2 right-2 lg:group-hover/project:opacity-0 transition-opacity duration-300">
                        <Badge className={cn("glass", colorVariant.border, "text-black dark:text-white text-xs font-light")}>
                            {state}
                        </Badge>
                    </div>
                )}

                {/* Info overlay: slides up from bottom on hover */}
                <div className={cn(
                    "absolute inset-x-0 bottom-0",
                    "lg:translate-y-full lg:group-hover/project:translate-y-0",
                    "transition-transform duration-500 ease-in-out",
                    "px-3 pt-10 pb-3",
                    "bg-linear-to-t from-white dark:from-black to-transparent",
                )}>
                    <header className="flex items-end justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 shrink-0">
                            <h3 className="text-neutral-900 dark:text-neutral-100 tracking-tight md:text-lg font-semibold leading-tight">
                                {project.metadata.title}
                            </h3>
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">{formatDate(project.metadata.publishedAt, false)}</span>
                        </div>
                        <span className="flex items-center gap-1 shrink-0 text-xs text-neutral-600 dark:text-neutral-400 ">
                            {project.metadata.views ?? 0}
                            <Eye className="size-3" />
                        </span>
                    </header>
                    <p className="text-neutral-600 dark:text-neutral-400 tracking-tight line-clamp-2 text-sm mt-1">
                        {project.metadata.summary}
                    </p>
                </div>
            </div>
        </Link>
    )
}