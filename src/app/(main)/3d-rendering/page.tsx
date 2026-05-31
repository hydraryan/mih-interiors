import ThreeDRenderingClient from '@/components/three-d-page/ThreeDRenderingClient'
import dbConnect from '@/lib/mongodb'
import Setting from '@/lib/models/Setting'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '3D Visualization & Rendering | See Your Home Before It\'s Built',
  description: 'Premium 3D interior design visualization services by MIH Interiors. Photorealistic renders of your future home. Starting at ₹45/sq.ft.',
  keywords: [
    '3d interior design chandigarh',
    '3d home visualization',
    '3d rendering chandigarh',
    '3d interior rendering',
    'home 3d model chandigarh',
    '3d walkthrough chandigarh',
    'interior visualization',
  ],
}

async function getPrice() {
  await dbConnect()
  const setting = await Setting.findOne({ key: 'three_d_rendering_price_sqft' })
  return setting?.value?.toString() || '45'
}

export default async function ThreeDRenderingPage() {
  const price = await getPrice()

  return <ThreeDRenderingClient price={price} />
}
