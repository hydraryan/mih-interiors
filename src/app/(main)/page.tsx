import HeroSection from '@/components/home/HeroSection'
import ServicesGrid from '@/components/home/ServicesGrid'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import ProcessSection from '@/components/home/ProcessSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTABanner from '@/components/home/CTABanner'
import { getActiveMediaMap } from '@/lib/media'

export default async function Home() {
  const media = await getActiveMediaMap()
  const serviceImages = [
    '/services-residential.jpg',
    '/services-commercial.jpg',
    '/services-3d.jpg',
    '/services-construction.jpg',
  ]
  const imageMap = Object.fromEntries(
    serviceImages.map((image) => [image, media.resolve(image)]),
  )

  return (
    <>
      <HeroSection imageSrc={media.resolve('/hero_image.jpg')} />
      <ServicesGrid imageMap={imageMap} />
      <FeaturedProjects />
      <ProcessSection />
      <TestimonialsSection />
      <CTABanner imageSrc={media.resolve('/commercial-sites-photos/2.jpeg')} />
    </>
  )
}
