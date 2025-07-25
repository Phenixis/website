import fs from 'fs'
import path from 'path'

export const dir = path.join(process.cwd(), 'app', 'blog', 'posts')

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  isProject?: string
  state?: string
  color?: string
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
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir: fs.PathLike) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: fs.PathOrFileDescriptor) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => getBlogPost(file))
}

export function getBlogPosts(withProjects: boolean = false) {
  const posts = getMDXData(dir)

  return posts.filter((post) => {
    return withProjects || !Boolean(post.metadata.isProject)
  })
}

export function getBlogPost(slug: string) {
  const slugWithMDX = slug.endsWith('.mdx') ? slug : `${slug}.mdx`
  const slugWithoutMDX = slug.endsWith('.mdx') ? slug.slice(0, -4) : slug
  const { metadata, content } = readMDXFile(path.join(dir, slugWithMDX))

  return {
    metadata,
    slug: slugWithoutMDX,
    content,
  }
}

export function getProjects() {
  return getBlogPosts(true).filter((post) => {
    return post.metadata.isProject !== undefined && Boolean(post.metadata.isProject)
  })
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
