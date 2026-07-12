import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/app/providers'
import { Toaster } from 'sonner'
import { GlobalWhatsApp } from '@/components/GlobalWhatsApp'
import { CookieProvider } from '@/context/CookieContext'
import AnalyticsProvider from '@/components/analytics-provider'
import CookieConsent from '@/components/cookie-consent'
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT_PHONE,
  SOCIAL_LINKS,
  DEFAULT_OG_IMAGE,
} from '@/lib/site-config'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Laundrica - Professional Laundry Services',
    template: '%s | Laundrica',
  },
  description: SITE_DESCRIPTION,
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  // Default OpenGraph — individual pages can override any of these fields
  // via their own `metadata`/`generateMetadata`, which Next.js merges on
  // top of this default rather than replacing it wholesale.
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Laundrica - Professional Laundry Services',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laundrica - Professional Laundry Services',
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
}

// Global LocalBusiness structured data. Applies site-wide (every page
// benefits from this without needing to repeat it), separate from the
// page-specific Service/FAQ JSON-LD added only on the shoe & carpet pages.
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  url: SITE_URL,
  telephone: CONTACT_PHONE,
  priceRange: 'AED',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE',
  },
  areaServed: {
    '@type': 'City',
    name: 'Dubai',
  },
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook, SOCIAL_LINKS.tiktok],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <CookieProvider>
            <AnalyticsProvider>
              {children}
              <CookieConsent />
            </AnalyticsProvider>
          </CookieProvider>
          <Toaster position="top-right" richColors />
          <GlobalWhatsApp />
        </Providers>
      </body>
    </html>
  )
}