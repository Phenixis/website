export function formatDate(date: string, includeRelative = false) {
    const currentDate = new Date()
    if (!date.includes('T')) {
        date = `${date}T00:00:00`
    }
    const targetDate = new Date(date)

    const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
    const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
    const daysAgo = currentDate.getDate() - targetDate.getDate()

    let formattedDate = ''

    if (yearsAgo > 0) {
        formattedDate = `${yearsAgo}y ago`
    } else if (monthsAgo > 0) {
        formattedDate = `${monthsAgo}mo ago`
    } else if (daysAgo > 0) {
        formattedDate = `${daysAgo}d ago`
    } else {
        formattedDate = 'Today'
    }

    const fullDate = targetDate.toLocaleString('en-us', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

    if (!includeRelative) {
        return fullDate
    }

    return `${fullDate} (${formattedDate})`
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

import type { PostType } from './types'

export function getPostRoutePrefix(type: PostType): string {
    switch (type) {
        case 'project': return '/projects'
        case 'experiences': return '/experiences'
        default: return '/blog'
    }
}
