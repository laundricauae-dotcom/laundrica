import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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

// FIX: added weight '700' — the site uses `font-bold` (700) extensively
// (headings, buttons, cards) but only 400/500/600 were being fetched by
// next/font, forcing the browser to synthesize (fake) bold instead of
// rendering the real Inter Bold glyphs.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Set these in .env.local (and in your hosting provider's env settings):
//   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
//   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
// Scripts below no-op (render nothing) if the corresponding env var is unset,
// so this is safe to deploy before the real IDs are supplied.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Laundrica | Shoe Cleaning & Carpet Cleaning Dubai — Laundry & Dry Cleaning Pickup',
    template: '%s | Laundrica',
  },
  description:
    'Shoe cleaning, carpet cleaning, laundry & dry cleaning in Dubai with free pickup & delivery. Sneaker cleaning, rug cleaning, wash & press — quality-checked, delivered to your door.',
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
    title:
      'Laundrica | Shoe Cleaning & Carpet Cleaning Dubai — Laundry & Dry Cleaning Pickup',
    description:
      'Shoe cleaning, carpet cleaning, laundry & dry cleaning in Dubai with free pickup & delivery. Sneaker cleaning, rug cleaning, wash & press — quality-checked, delivered to your door.',
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
    title:
      'Laundrica | Shoe Cleaning & Carpet Cleaning Dubai — Laundry & Dry Cleaning Pickup',
    description:
      'Shoe cleaning, carpet cleaning, laundry & dry cleaning in Dubai with free pickup &delivery. Sneaker cleaning, rug cleaning, wash & press — quality-checked, delivered to your door.',
    images: [DEFAULT_OG_IMAGE],
  },
};

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

  description:
    'Shoe cleaning, carpet cleaning, laundry and dry cleaning pickup & delivery service in Dubai.',

  knowsAbout: [
    'shoe cleaning',
    'sneaker cleaning',
    'carpet cleaning',
    'rug cleaning',
    'laundry pickup and delivery',
    'dry cleaning',
  ],

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

  sameAs: [
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.tiktok,
  ],
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

        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}

        {/* Google Analytics 4 (gtag.js) — only needed if you're not routing
            GA4 through GTM. If GA4 is configured as a tag inside your GTM
            container instead, you can remove this block to avoid double-counting. */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              id="ga4-src"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Google Tag Manager (noscript) — must be immediately after <body> opens */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="gtm"
            />
          </noscript>
        )}

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