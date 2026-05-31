import dbConnect from '@/lib/mongodb'
import Service from '@/lib/models/Service'
import { getActiveMediaMap } from '@/lib/media'
import ServicesClient from '@/components/services/ServicesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ServicesPage() {
  await dbConnect()
  const [services, media] = await Promise.all([
    Service.find({}).lean(),
    getActiveMediaMap()
  ])

  // Convert Mongoose docs to plain objects
  const plainServices = JSON.parse(JSON.stringify(services))
  const heroImage = media.resolve('/services-hero.png')
  
  const showcaseImages = [
    media.resolve('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'),
    media.resolve('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'),
    media.resolve('https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200'),
    media.resolve('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200'),
    media.resolve('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'),
    media.resolve('https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200'),
    media.resolve('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200'),
    media.resolve('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'),
    media.resolve('https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=1200'),
    media.resolve('https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200'),
  ]

  return (
    <ServicesClient 
      initialServices={plainServices} 
      heroImage={heroImage} 
      showcaseImages={showcaseImages}
    />
  )
}
