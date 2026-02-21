import { colorVariants, states } from '@/components/big/project';
import { getViews } from "@/lib/redis";
import fs from 'node:fs';
import path from 'node:path';

export const dir = path.join(process.cwd(), 'app', 'blog', 'posts')

type Metadata = {
    title: string
    publishedAt: string
    summary: string
    views: number
    link?: string
    image?: string
    isProject?: string // Deprecated: use tags with "Project" instead
    state?: typeof states[number] // Deprecated: use tags with state name instead
    color?: keyof typeof colorVariants
    tags?: string[] // Tags array: ["Project", "Discontinued", "TypeScript", etc.]
}

export type ProjectType = {
    metadata: Metadata
    slug: string
    content: string
}

function parseFrontmatter(fileContent: string) {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
    const match = frontmatterRegex.exec(fileContent)
    const frontMatterBlock = match![1]
    const content = fileContent.replace(frontmatterRegex, '').trim()
    const frontMatterLines = frontMatterBlock.trim().split('\n')
    const metadata: Partial<Metadata> = {}

    frontMatterLines.forEach((line) => {
        const [key, ...valueArr] = line.split(': ')
        let value = valueArr.join(': ').trim()
        value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
        const trimmedKey = key.trim()

        switch (trimmedKey) {
            case 'state':
                metadata.state = value
                break;
            case 'color':
                metadata.color = value as keyof typeof colorVariants
                break;
            case 'tags': {
                // Tags are comma-separated strings
                const tagValues = value.split(',').map((tag) => tag.trim()).filter(Boolean)
                metadata.tags = tagValues
                break;
            }
            default:
                // @ts-ignore
                metadata[trimmedKey as keyof Metadata] = value

        }
    })

    // Backward compatibility: convert old format to new format
    if (metadata.isProject && Boolean(metadata.isProject)) {
        metadata.tags ??= []
        if (!metadata.tags.includes('Project')) {
            metadata.tags.push('Project')
        }
    }
    
    if (metadata.state) {
        metadata.tags ??= []
        if (!metadata.tags.includes(metadata.state)) {
            metadata.tags.push(metadata.state)
        }
    }
    
    // Extract state from tags if not explicitly set (new format to old format)
    if (!metadata.state && metadata.tags) {
        for (const tag of metadata.tags) {
            if (states.includes(tag)) {
                metadata.state = tag
                break
            }
        }
    }

    return {metadata: metadata as Metadata, content}
}

function getMDXFiles(dir: fs.PathLike) {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: fs.PathOrFileDescriptor) {
    const rawContent = fs.readFileSync(filePath, 'utf-8')
    return parseFrontmatter(rawContent)
}

async function getMDXData(dir: string) {
    const mdxFiles = getMDXFiles(dir)
    const postPromises = mdxFiles.map((file) => getBlogPost(file));
    return Promise.all(postPromises); // Wait for all promises to resolve
}

export async function getBlogPosts(options: {
    includeTags?: string[]
    excludeTags?: string[]
} = {}) {
    const { includeTags = [], excludeTags = [] } = options
    const posts = await getMDXData(dir)

    return posts.filter((post) => {
        if (post.metadata.publishedAt === "") return false
        
        const postTags = post.metadata.tags || []
        const isProject = postTags.includes('Project') || Boolean(post.metadata.isProject)
        const allTags = isProject ? [...postTags, 'Project'] : postTags
        
        // If includeTags is specified, post must have at least one of those tags
        if (includeTags.length > 0) {
            const hasIncludedTag = includeTags.some(tag => allTags.includes(tag))
            if (!hasIncludedTag) return false
        }
        
        // Post must not have any of the excluded tags
        if (excludeTags.length > 0) {
            const hasExcludedTag = excludeTags.some(tag => allTags.includes(tag))
            if (hasExcludedTag) return false
        }
        
        return true
    })
}

export async function getBlogPost(slug: string) {
    const slugWithoutMDX = slug.replace(/\.mdx?$/, '')
    const slugWithMDX = `${slugWithoutMDX}.mdx`
    const {metadata, content} = readMDXFile(path.join(dir, slugWithMDX))

    metadata.views = await getViews("/blog/" + formatToKebabCase(slugWithoutMDX))

    return {
        metadata,
        slug: formatToKebabCase(slugWithoutMDX),
        content,
    } as ProjectType
}

export async function getProjects() {
    return await getBlogPosts({ includeTags: ['Project'] })
}

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
        .replaceAll(/[^a-z0-9.]+/g, '-') // Replace non-alphanumeric (except dot) with hyphens
        .replaceAll(/(^-+)|(-+$)/g, '') // Remove leading and trailing hyphens
        .replaceAll(/--+/g, '-') // Replace multiple hyphens with a single hyphen
}