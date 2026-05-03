import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/lib/models/BlogPost'
import Project from '@/lib/models/Project'
import Service from '@/lib/models/Service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mihinteriors.in'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/residential-interiors`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services/commercial-interiors`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/construction-architecture`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    await dbConnect()

    const [blogs, projects, services] = await Promise.all([
      BlogPost.find({ publishStatus: 'published' })
        .select('slug updatedAt publishedAt')
        .lean(),
      Project.find({})
        .select('slug updatedAt')
        .lean(),
      Service.find({ publishStatus: 'published' })
        .select('slug updatedAt')
        .lean(),
    ])

    const blogUrls: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    const projectUrls: MetadataRoute.Sitemap = projects.map((project: any) => ({
      url: `${baseUrl}/projects`,
      lastModified: project.updatedAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const serviceUrls: MetadataRoute.Sitemap = services
      .filter((s: any) => !['residential-interiors', 'commercial-interiors', 'construction-architecture'].includes(s.slug))
      .map((service: any) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.updatedAt || now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    return [...staticPages, ...blogUrls, ...serviceUrls]
  } catch {
    return staticPages
  }
}
