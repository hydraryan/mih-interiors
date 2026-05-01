import path from 'path'
import { readdir, stat } from 'fs/promises'

type PublicMediaSeed = {
  title: string
  slug: string
  sourceKey: string
  sourceType: 'public'
  sourceUrl: string
  assetPath: string
  folder: string
  placements: string[]
  minWidth: number
  minHeight: number
  aspectRatio: string
  altText: string
  caption: string
  tags: string[]
  status: 'active'
  fileSizeKb: number
}

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'])

const TITLE_OVERRIDES: Record<string, string> = {
  'hero_image.jpg': 'Hero Interior',
  'logo.png': 'MIH Logo',
  'mih_about_hero_interior.png': 'About Hero Interior',
  'mih_contact_studio.png': 'Contact Studio',
}

const folderMeta = (folder: string, fileName: string) => {
  if (folder.includes('residential')) {
    return {
      placements: ['home', 'projects', 'gallery'],
      minWidth: 1600,
      minHeight: 1200,
      aspectRatio: '4:3',
      tags: ['residential', 'interior'],
    }
  }

  if (folder.includes('commercial')) {
    return {
      placements: ['services', 'projects', 'gallery'],
      minWidth: 1600,
      minHeight: 1000,
      aspectRatio: '16:10',
      tags: ['commercial', 'workspace'],
    }
  }

  if (fileName.includes('logo')) {
    return {
      placements: ['brand', 'header', 'footer'],
      minWidth: 512,
      minHeight: 512,
      aspectRatio: '1:1',
      tags: ['brand', 'logo'],
    }
  }

  if (fileName.includes('hero')) {
    return {
      placements: ['home', 'hero'],
      minWidth: 1920,
      minHeight: 1280,
      aspectRatio: '16:9',
      tags: ['hero', 'banner'],
    }
  }

  if (fileName.includes('contact')) {
    return {
      placements: ['contact', 'about'],
      minWidth: 1400,
      minHeight: 900,
      aspectRatio: '3:2',
      tags: ['contact', 'studio'],
    }
  }

  return {
    placements: ['site'],
    minWidth: 1200,
    minHeight: 900,
    aspectRatio: '4:3',
    tags: ['site'],
  }
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const titleFromFile = (fileName: string) => {
  if (TITLE_OVERRIDES[fileName]) return TITLE_OVERRIDES[fileName]
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const makeSeed = (folder: string, fileName: string, fileSizeKb: number): PublicMediaSeed => {
  const assetPath = folder === 'root' ? `/${fileName}` : `/${folder}/${fileName}`
  const meta = folderMeta(folder, fileName)
  const title = titleFromFile(fileName)
  return {
    title,
    slug: toSlug(`${folder}-${fileName}`),
    sourceKey: `public:${assetPath}`,
    sourceType: 'public',
    sourceUrl: assetPath,
    assetPath,
    folder,
    placements: meta.placements,
    minWidth: meta.minWidth,
    minHeight: meta.minHeight,
    aspectRatio: meta.aspectRatio,
    altText: `${title} for MIH Interiors`,
    caption: `${title} asset from the MIH public library.`,
    tags: meta.tags,
    status: 'active',
    fileSizeKb,
  }
}

export async function scanPublicMediaAssets(): Promise<PublicMediaSeed[]> {
  const publicDir = path.join(process.cwd(), 'public')
  const entries = await readdir(publicDir, { withFileTypes: true })
  const assets: PublicMediaSeed[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const folderName = entry.name
      const folderPath = path.join(publicDir, folderName)
      const folderEntries = await readdir(folderPath, { withFileTypes: true })

      for (const folderEntry of folderEntries) {
        if (!folderEntry.isFile()) continue
        const ext = path.extname(folderEntry.name).toLowerCase()
        if (!IMAGE_EXTENSIONS.has(ext)) continue

        const filePath = path.join(folderPath, folderEntry.name)
        const fileStats = await stat(filePath)
        assets.push(makeSeed(folderName, folderEntry.name, Math.max(1, Math.round(fileStats.size / 1024))))
      }
    } else {
      const ext = path.extname(entry.name).toLowerCase()
      if (!IMAGE_EXTENSIONS.has(ext)) continue

      const filePath = path.join(publicDir, entry.name)
      const fileStats = await stat(filePath)
      assets.push(makeSeed('root', entry.name, Math.max(1, Math.round(fileStats.size / 1024))))
    }
  }

  return assets.sort((a, b) => a.folder.localeCompare(b.folder) || a.title.localeCompare(b.title))
}
