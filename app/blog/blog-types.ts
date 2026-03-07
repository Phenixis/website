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
}

export type ProjectType = {
    metadata: Metadata
    slug: string
    content: string
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
