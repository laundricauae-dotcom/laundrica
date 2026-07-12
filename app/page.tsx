// app/page.tsx
// SERVER COMPONENT. All interactive/animated UI lives in HomeClient.tsx —
// this file's only job is metadata (title, description, OpenGraph) and
// rendering the client tree. No design, layout, or business logic changes.

import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Laundrica | Shoe Cleaning, Carpet Cleaning & Premium Laundry in Dubai',
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Laundrica | Shoe Cleaning, Carpet Cleaning & Premium Laundry in Dubai',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Laundrica — Premium laundry, shoe, and carpet care in Dubai',
      },
    ],
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laundrica | Shoe Cleaning, Carpet Cleaning & Premium Laundry in Dubai',
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Page() {
  return <HomeClient />;
}