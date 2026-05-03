import { NextResponse } from 'next/server'

export async function GET() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesigner',
    name: 'MIH Interiors',
    alternateName: 'MIH Architects and Interiors',
    url: 'https://mihinteriors.in',
    telephone: '+91-98885-45403',
    email: 'miharchitect@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'SCO 62-63, 3rd Floor, Sector 17A, Near Oyster Hotel',
      addressLocality: 'Chandigarh',
      addressRegion: 'Chandigarh',
      postalCode: '160017',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.7333,
      longitude: 76.7794,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '85',
    },
    priceRange: '₹₹₹',
    sameAs: [
      'https://www.instagram.com/mihinteriors/',
      'https://www.facebook.com/profile.php?id=100088721091794',
    ],
  }

  return NextResponse.json(schema, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'application/ld+json',
    },
  })
}
