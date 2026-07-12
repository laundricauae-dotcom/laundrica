// app/services/page.tsx
// SERVER COMPONENT — no 'use client' here.
// This runs on the server (or at build time), fetches the service list,
// and renders real HTML before anything reaches the browser. Crawlers
// (and users on slow connections) see the actual content immediately
// instead of a "Loading premium services..." spinner.

import { serviceAPI } from '@/lib/api';
import ServicesPageClient from './services-page-client';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/site-config';

// Re-fetch this page's data at most once every 5 minutes (ISR).
// Bump this up/down depending on how often services change.
export const revalidate = 300;

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  turnaround?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  image?: string;
}

async function getServices(): Promise<{ services: Service[]; error: string | null }> {
  try {
    const data = await serviceAPI.getAllServices();

    let servicesList: Service[] = [];
    if (data?.success && data.services) servicesList = data.services;
    else if (data?.data && Array.isArray(data.data)) servicesList = data.data;
    else if (Array.isArray(data)) servicesList = data;

    servicesList.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return { services: servicesList, error: null };
  } catch (err: any) {
    console.error('Error fetching services on server:', err);
    return { services: [], error: err?.message || 'Failed to load services' };
  }
}

// Gives the /services page a real <title>, <meta description>, and
// OpenGraph tags instead of inheriting the root layout's defaults.
export async function generateMetadata() {
  const title = 'Our Services | Laundrica';
  const description =
    'Choose from premium laundry, dry cleaning, carpet, and shoe cleaning services with free pickup & delivery across Dubai.';
  const url = `${SITE_URL}/services`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Laundrica Services' }],
      locale: 'en_AE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function ServicesPage() {
  const { services, error } = await getServices();

  return <ServicesPageClient initialServices={services} initialError={error} />;
}