import { colorVariants } from '@/components/big/project';
import { formatDate as libFormatDate } from "@/lib/utils";

export type Metadata = {
    title: string
    publishedAt: string
    summary: string
    views: number
    link?: string
    image?: string
    color?: keyof typeof colorVariants
    tags?: string[]
    /** Start date for experience entries (replaces publishedAt) */
    start?: string
    /** End date for experience entries — omit or leave blank if ongoing */
    end?: string
    /**
     * Alternative URL paths (e.g. ["/blog/work-study", "/projects/work-study"])
     * that should redirect to this post. View counts are merged across all aliases.
     */
    alias?: string[]
}

export type PostType = 'blog' | 'project' | 'experiences'

export type ProjectType = {
    metadata: Metadata
    slug: string
    content: string
    type: PostType
}

export function formatDate(date: string, includeRelative = false) {
    return libFormatDate(date, includeRelative)
}

export function kebabCasetoTitleCase(str: string) {
    return str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function formatToKebabCase(str: string) {
    return str
        .toLowerCase()
        .replaceAll(/[^a-z0-9.]+/g, '-')
        .replaceAll(/(^-+)|(-+$)/g, '')
        .replaceAll(/--+/g, '-')
}

/** Returns the URL route prefix for a given post type. */
export function getPostRoutePrefix(type: PostType): string {
    switch (type) {
        case 'project': return '/projects'
        case 'experiences': return '/experiences'
        default: return '/blog'
    }
}
