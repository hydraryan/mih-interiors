import HeroSection from '@/components/home/HeroSection'
import ServicesGrid from '@/components/home/ServicesGrid'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import ProcessSection from '@/components/home/ProcessSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTABanner from '@/components/home/CTABanner'
import { getActiveMediaMap } from '@/lib/media'
import dbConnect from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export default async function Home() {
  await dbConnect()
  const [media, homepageServices] = await Promise.all([
    getActiveMediaMap(),
    Service.find({ showOnHomepage: true }).sort({ order: 1 }).lean()
  ])

  // Map images for both fallback and dynamic services
  const serviceImages = [
    '/services-residential.jpg',
    '/services-commercial.jpg',
    '/services-3d.jpg',
    '/services-construction.jpg',
    ...homepageServices.map(s => s.hero?.image).filter(Boolean)
  ]
  const imageMap = Object.fromEntries(
    serviceImages.map((image) => [image, media.resolve(image)]),
  )

  return (
    <>
      <HeroSection imageSrc={media.resolve('/hero_image.jpg')} />
      <ServicesGrid 
        imageMap={imageMap} 
        initialServices={JSON.parse(JSON.stringify(homepageServices))} 
      />
      <FeaturedProjects />
      <ProcessSection />
      <TestimonialsSection />
      <CTABanner imageSrc={media.resolve('/commercial-sites-photos/2.jpeg')} />
    </>
  )
}
