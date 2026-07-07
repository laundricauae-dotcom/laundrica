import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/app/providers'
import { Toaster } from 'sonner'
import { GlobalWhatsApp } from '@/components/GlobalWhatsApp'
import { CookieProvider } from '@/context/CookieContext'
import AnalyticsProvider from '@/components/analytics-provider'
import CookieConsent from '@/components/cookie-consent'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Laundrica - Professional Laundry Services',
  description: 'Premium laundry services for your home and business. Free pickup & delivery in Dubai.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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