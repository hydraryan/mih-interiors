import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mihinteriors.in'),
  title: {
    default: 'MIH Interiors | Best Interior Designer in Chandigarh & Tricity | 18+ Years',
    template: '%s | MIH Interiors Chandigarh',
  },
  description: 'MIH Interiors — Chandigarh\'s most trusted interior design firm since 2007. 1000+ completed projects across Chandigarh, Mohali & Panchkula. Premium residential & commercial interiors, 3D visualization, and construction. Free consultation with Ar. Mohit Mahajan.',
  keywords: [
    'interior designer chandigarh',
    'interior design chandigarh',
    'best interior designer chandigarh',
    'MIH interiors',
    'MIH interiors chandigarh',
    'interior design company chandigarh',
    'home interior design chandigarh',
    'modular kitchen chandigarh',
    'interior designer mohali',
    'interior designer panchkula',
    'interior design tricity',
    'commercial interior design chandigarh',
    'residential interior design chandigarh',
    'interior decorator chandigarh',
    'Ar Mohit Mahajan',
    'luxury interiors chandigarh',
    '3d interior design chandigarh',
    'office interior design chandigarh',
    'home renovation chandigarh',
    'false ceiling chandigarh',
    'modular wardrobe chandigarh',
    'villa interior design chandigarh',
    'kothi interior design chandigarh',
  ],
  authors: [{ name: 'Ar. Mohit Mahajan', url: 'https://mihinteriors.in/about' }],
  creator: 'MIH Interiors',
  publisher: 'MIH Interiors',
  category: 'Interior Design',
  classification: 'Interior Design Services',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://mihinteriors.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mihinteriors.in',
    siteName: 'MIH Interiors',
    title: 'MIH Interiors | Best Interior Designer in Chandigarh | 18+ Years | 1000+ Projects',
    description: 'Transform your space with MIH Interiors — Chandigarh\'s most trusted interior design firm. Residential, commercial, modular kitchen, 3D visualization. Free consultation.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MIH Interiors — Premium Interior Design Chandigarh',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIH Interiors | Best Interior Designer in Chandigarh',
    description: 'Chandigarh\'s premium interior design firm. 1000+ projects, 18+ years. Free consultation with Ar. Mohit Mahajan.',
    images: ['/og-image.jpg'],
    creator: '@mihinteriors',
    site: '@mihinteriors',
  },
  icons: {
    icon: [
      { url: '/mih_interiors_mark.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/mih_interiors_mark.svg',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
  },
  other: {
    'geo.region': 'IN-PB',
    'geo.placename': 'Chandigarh',
    'geo.position': '30.7333;76.7794',
    'ICBM': '30.7333, 76.7794',
    'og:locale:alternate': 'hi_IN',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${outfit.variable} h-full antialiased smooth-scroll`}
    >
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WJCLQ6XN');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WJCLQ6XN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'InteriorDesigner',
                  '@id': 'https://mihinteriors.in/#business',
                  name: 'MIH Interiors',
                  alternateName: ['MIH', 'MIH Architects and Interiors', 'MIH Interiors Chandigarh'],
                  url: 'https://mihinteriors.in',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://mihinteriors.in/logo.png',
                    width: 300,
                    height: 100,
                  },
                  image: 'https://mihinteriors.in/hero_image.jpg',
                  description: 'MIH Interiors is Chandigarh\'s most trusted interior design firm with 18+ years of experience, 1000+ completed projects across Chandigarh, Mohali, and Panchkula.',
                  telephone: '+91-98885-45403',
                  email: 'miharchitect@gmail.com',
                  foundingDate: '2007',
                  numberOfEmployees: { '@type': 'QuantitativeValue', value: 15 },
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
                  areaServed: [
                    { '@type': 'City', name: 'Chandigarh' },
                    { '@type': 'City', name: 'Mohali' },
                    { '@type': 'City', name: 'Panchkula' },
                    { '@type': 'City', name: 'Zirakpur' },
                    { '@type': 'State', name: 'Punjab' },
                  ],
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
                    bestRating: '5',
                    worstRating: '1',
                  },
                  priceRange: '₹₹₹',
                  currenciesAccepted: 'INR',
                  paymentAccepted: 'Cash, Bank Transfer, Cheque',
                  hasMap: 'https://maps.app.goo.gl/nh54NTND4Jgn8wRG6',
                  sameAs: [
                    'https://www.instagram.com/mihinteriors/',
                    'https://www.facebook.com/profile.php?id=100088721091794',
                    'https://www.justdial.com/Chandigarh/Mih-Architects-and-Interiors-Main-Market-Chandigarh-Sector-17a/0172PX172-X172-241024174522-K6P7_BZDET',
                  ],
                  founder: {
                    '@type': 'Person',
                    name: 'Mohit Mahajan',
                    jobTitle: 'Founder & Principal Architect',
                    worksFor: { '@id': 'https://mihinteriors.in/#business' },
                  },
                  knowsAbout: [
                    'Residential Interior Design',
                    'Commercial Interior Design',
                    'Modular Kitchen Design',
                    'False Ceiling Design',
                    'Modular Wardrobes',
                    '3D Visualization',
                    'Home Renovation',
                    'Office Interior Design',
                    'Construction and Architecture',
                  ],
                  serviceArea: {
                    '@type': 'GeoCircle',
                    geoMidpoint: {
                      '@type': 'GeoCoordinates',
                      latitude: 30.7333,
                      longitude: 76.7794,
                    },
                    geoRadius: '50000',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://mihinteriors.in/#website',
                  url: 'https://mihinteriors.in',
                  name: 'MIH Interiors',
                  description: 'Best Interior Designer in Chandigarh',
                  publisher: { '@id': 'https://mihinteriors.in/#business' },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://mihinteriors.in/blogs?search={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                  inLanguage: 'en-IN',
                },
                {
                  '@type': 'BreadcrumbList',
                  '@id': 'https://mihinteriors.in/#breadcrumb',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: 'https://mihinteriors.in',
                    },
                  ],
                },
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
