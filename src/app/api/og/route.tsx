import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'MIH Interiors'
  const subtitle = searchParams.get('subtitle') || 'Best Interior Designer in Chandigarh'

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#FAF8F4"/>
      <rect x="0" y="0" width="8" height="630" fill="#3D1F0D"/>
      <text x="60" y="200" font-family="Georgia, serif" font-size="72" font-weight="bold" fill="#1A1A1A" text-anchor="start">${title.slice(0, 40)}</text>
      <text x="60" y="280" font-family="Georgia, serif" font-size="36" fill="#3D1F0D" text-anchor="start">${subtitle.slice(0, 60)}</text>
      <text x="60" y="560" font-family="Arial, sans-serif" font-size="28" fill="#888" text-anchor="start">MIH Interiors · Chandigarh · +91 6399936333</text>
      <text x="60" y="510" font-family="Arial, sans-serif" font-size="24" fill="#3D1F0D" text-anchor="start">Interior Design · Construction · 3D Visualization</text>
    </svg>
  `

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
