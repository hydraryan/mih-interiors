import { scanPublicMediaAssets } from '@/lib/admin/mediaInventory'
import dbConnect from '@/lib/mongodb'
import MediaAsset from '@/lib/models/MediaAsset'
import Project from '@/lib/models/Project'
import Service from '@/lib/models/Service'

type MediaStatus = 'active' | 'draft' | 'archived'

type MediaReferenceSeed = {
  title: string
  slug: string
  sourceKey: string
  sourceType: 'public' | 'remote' | 'upload'
  sourceUrl: string
  assetPath?: string
  folder: string
  placements: string[]
  altText: string
  caption: string
  tags: string[]
  status: MediaStatus
}

const FALLBACK_IMAGE = '/hero_image.jpg'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const titleFromPath = (value: string) => {
  const name = value.split('?')[0].split('/').filter(Boolean).pop() || 'Website photo'
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const normalizeImage = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const sourceTypeFor = (src: string): 'public' | 'remote' | 'upload' => {
  if (src.startsWith('/')) return 'public'
  if (src.includes('res.cloudinary.com')) return 'upload'
  return 'remote'
}

const sourceKeyFor = (src: string) => `${sourceTypeFor(src)}:${src}`

const makeReferenceSeed = (
  src: string,
  context: {
    title: string
    folder: string
    placements: string[]
    tags: string[]
  },
): MediaReferenceSeed | null => {
  const sourceUrl = normalizeImage(src)
  if (!sourceUrl) return null

  const sourceType = sourceTypeFor(sourceUrl)
  const title = context.title || titleFromPath(sourceUrl)

  return {
    title,
    slug: slugify(`${context.folder}-${title}-${sourceUrl}`),
    sourceKey: sourceKeyFor(sourceUrl),
    sourceType,
    sourceUrl,
    assetPath: sourceType === 'public' ? sourceUrl : undefined,
    folder: context.folder,
    placements: context.placements,
    altText: `${title} for MIH Interiors`,
    caption: `${title} used on the MIH website.`,
    tags: context.tags,
    status: 'active',
  }
}

export async function syncWebsiteMediaAssets() {
  await dbConnect()

  const [publicSeeds, projects, services] = await Promise.all([
    scanPublicMediaAssets(),
    Project.find({}).select('title type mainImage images').lean(),
    Service.find({}).select('title category hero sections seo').lean(),
  ])

  const referenceSeeds: MediaReferenceSeed[] = []

  for (const project of projects) {
    const folder = project.type === 'Commercial' ? 'commercial-sites-photos' : 'residential-sites-photos'
    const base = {
      folder,
      placements: ['Projects'],
      tags: [String(project.type || 'project').toLowerCase(), 'project'],
    }

    const mainSeed = makeReferenceSeed(project.mainImage, {
      ...base,
      title: `${project.title} Main Photo`,
    })
    if (mainSeed) referenceSeeds.push(mainSeed)

    for (const image of project.images || []) {
      const seed = makeReferenceSeed(image, {
        ...base,
        title: `${project.title} Gallery Photo`,
      })
      if (seed) referenceSeeds.push(seed)
    }
  }

  for (const service of services) {
    const base = {
      folder: 'root',
      placements: ['Services'],
      tags: [String(service.category || 'service').toLowerCase(), 'service'],
    }

    for (const image of [
      service.hero?.image,
      service.seo?.ogImage,
      ...(service.sections || []).map((section: { content?: { image?: string } }) => section.content?.image),
    ]) {
      const seed = makeReferenceSeed(image, {
        ...base,
        title: `${service.title} Photo`,
      })
      if (seed) referenceSeeds.push(seed)
    }
  }

  const seedsByKey = new Map<string, MediaReferenceSeed | Awaited<ReturnType<typeof scanPublicMediaAssets>>[number]>()
  for (const seed of [...publicSeeds, ...referenceSeeds]) {
    seedsByKey.set(seed.sourceKey, seed)
  }

  await Promise.all(
    [...seedsByKey.values()].map((seed) =>
      MediaAsset.updateOne(
        { sourceKey: seed.sourceKey },
        { $setOnInsert: seed },
        { upsert: true },
      ),
    ),
  )
}

export async function getActiveMediaMap() {
  await syncWebsiteMediaAssets()

  const records = await MediaAsset.find({})
    .select('sourceUrl assetPath sourceKey status')
    .lean()

  const known = new Map<string, { status: MediaStatus; src: string }>()

  for (const record of records) {
    const status = (record.status || 'active') as MediaStatus
    const src = normalizeImage(record.sourceUrl)
    for (const key of [record.sourceUrl, record.assetPath, record.sourceKey?.replace(/^(public|remote|upload):/, '')]) {
      if (!key) continue
      known.set(key, { status, src })
    }
  }

  return {
    isVisible(src: unknown) {
      const value = normalizeImage(src)
      if (!value) return false
      return known.has(value) ? known.get(value)?.status === 'active' : true
    },
    resolve(src: unknown, fallback = FALLBACK_IMAGE) {
      const value = normalizeImage(src)
      const record = known.get(value)

      if (value && !record) {
        return value
      }

      if (record?.status === 'active') {
        return record.src || value
      }

      const fallbackRecord = known.get(fallback)
      if (!fallbackRecord) return fallback
      return fallbackRecord.status === 'active' ? fallbackRecord.src || fallback : ''
    },
    filter(images: unknown[]) {
      return images
        .map((image) => this.resolve(image, ''))
        .filter(Boolean)
    },
  }
}
