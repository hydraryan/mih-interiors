import { getActiveMediaMap } from '@/lib/media'
import AboutClient from '@/components/about/AboutClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AboutPage() {
  const media = await getActiveMediaMap()
  
  const images = {
    hero: media.resolve('/about-hero.png'),
    vision: media.resolve('/about-vision.png'),
    visionDetail: media.resolve('/about-vision-detail.png'),
    craft: media.resolve('/about-craft.png'),
    materials: media.resolve('/about-materials.png'),
    founder: media.resolve('/about-founder.png'),
  }

  return <AboutClient images={images} />
}
