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

  return (
    <ServicesClient 
      initialServices={plainServices} 
      heroImage={heroImage} 
    />
  )
}
