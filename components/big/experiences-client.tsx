'use client';

import Link from 'next/link'
import { Link as PersoLink } from '@/components/big/link'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/app/blog/blog-types'
import type { ProjectType } from '@/app/blog/utils'
import { useStyle } from '@/contexts/style-context'
import { cn } from '@/lib/utils'

// ─── Classical ───────────────────────────────────────────────────────────────

function ExperienceClassical({ experience }: Readonly<{ experience: ProjectType }>) {
    const { title, summary, tags, start, end } = experience.metadata
    const endLabel = end ? formatDate(end) : 'Present'
    const dateRange = start ? `${formatDate(start)} – ${endLabel}` : null

    return (
        <PersoLink
            href={`/experiences/${experience.slug}`}
            underlined={false}
        >
            <article className="group/experience flex flex-col gap-2 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-100/25 hover:bg-gray-50 dark:hover:bg-slate-100/10 p-4 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h2 className="font-semibold text-base leading-snug group-hover/experience:underline">
                        {title}
                    </h2>
                    {dateRange && (
                        <span className="text-xs text-muted-foreground shrink-0">
                            {dateRange}
                        </span>
                    )}
                </div>
                {summary && (
                    <p className="text-sm text-muted-foreground">
                        {summary}
                    </p>
                )}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </article>
        </PersoLink>
    )
}

// ─── Modern (Timeline) ────────────────────────────────────────────────────────

function ExperienceModern({ experience, isLast }: Readonly<{ experience: ProjectType; isLast: boolean }>) {
    const { title, summary, tags, start, end } = experience.metadata
    const endLabel = end ? formatDate(end) : 'Present'
    const startLabel = start ? formatDate(start) : null

    return (
        <div className="relative flex gap-4 sm:gap-6">
            {/* Timeline stem + dot */}
            <div className="flex flex-col items-center shrink-0 w-4">
                {/* Dot */}
                <div className="mt-1.5 size-3 rounded-full border-2 border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-950 shrink-0 z-10" />
                {/* Vertical line below dot (hidden for last item) */}
                {!isLast && (
                    <div className="flex-1 w-px bg-neutral-200 dark:bg-neutral-700 mt-1" />
                )}
            </div>

            {/* Content */}
            <div className={cn(
                "flex-1 pb-8 group/experience",
                isLast && "pb-0"
            )}>
                <Link href={`/experiences/${experience.slug}`}>
                    <article className="rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-100/25 hover:bg-gray-50 dark:hover:bg-slate-100/10 p-3 -ml-3 transition-all duration-300">
                        {/* Date range */}
                        {(startLabel || endLabel) && (
                            <p className="text-xs text-black mb-1 tabular-nums">
                                {startLabel ? `${startLabel} – ${endLabel}` : endLabel}
                            </p>
                        )}

                        {/* Title */}
                        <h2 className="font-semibold text-base leading-snug group-hover/experience:underline">
                            {title}
                        </h2>

                        {/* Summary: hidden by default, expands on hover */}
                        {summary && (
                            <div className="grid lg:grid-rows-[0fr] lg:group-hover/experience:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                                <div className="overflow-hidden">
                                    <p className="pt-1 text-sm text-muted-foreground line-clamp-3">
                                        {summary}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </article>
                </Link>
            </div>
        </div>
    )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function ExperiencesList({
    experiences,
}: Readonly<{
    experiences: ProjectType[]
}>) {
    const { currentStyle } = useStyle()

    if (currentStyle === 'modern') {
        return (
            <div className="flex flex-col pl-2">
                {experiences.map((experience, index) => (
                    <ExperienceModern
                        key={experience.slug}
                        experience={experience}
                        isLast={index === experiences.length - 1}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {experiences.map((experience) => (
                <ExperienceClassical key={experience.slug} experience={experience} />
            ))}
        </div>
    )
}
