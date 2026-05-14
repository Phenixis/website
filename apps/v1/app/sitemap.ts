import { getBlogPosts, getExperiences, getProjects } from '@/app/blog/utils'

export const baseUrl = 'https://www.maximeduhamel.com'

export default async function sitemap() {
  const [blogs, projects, experiences] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getExperiences(),
  ])

  const blogEntries = blogs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  const projectEntries = projects.map((post) => ({
    url: `${baseUrl}/projects/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  const experienceEntries = experiences.map((post) => ({
    url: `${baseUrl}/experiences/${post.slug}`,
    lastModified: post.metadata.start,
  }))

  const routes = ['', '/blog', '/projects', '/experiences'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogEntries, ...projectEntries, ...experienceEntries]
}
