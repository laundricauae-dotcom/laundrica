// app/services/[slug]/orders/page.tsx
// SERVER COMPONENT — fetches the product/service and its items on the
// server, with the same productAPI -> serviceAPI -> local-fallback chain
// the original client code used. Whatever is found is already in the
// HTML before the browser does anything.
//
// NOTE: LOCAL_SERVICES keys below use a different slug convention than
// the homepage ServicesGrid / lib/service-seo-content.ts (e.g.
// 'shoe-cleaning-services-in-dubai' here vs 'shoe-care-services-in-dubai'
// there). This wasn't changed as part of this pass since it's an existing
// fallback map, not new code — but it should be reconciled so the
// no-API fallback actually matches real links on the site.

import { productAPI, serviceAPI } from '@/lib/api';
import OrderPageClient from './order-page-client';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/site-config';

export const revalidate = 300; // ISR — adjust to taste

export interface ServiceItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  category: string;
  image?: string;
  contactForPricing?: boolean;
  minQuantity?: number;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  tagline?: string;
  category: string;
  turnaround?: string;
  features?: string[];
  image?: string;
  icon?: string;
  isActive: boolean;
}

const LOCAL_SERVICES: Record<string, Service> = {
  'professional-laundry-services-in-dubai': {
    _id: 'laundry-1',
    name: 'Laundry Services (Wash & Press)',
    slug: 'professional-laundry-services-in-dubai',
    description: 'Professional wash and press for all your clothing needs.',
    tagline: 'Fresh, clean, and perfectly pressed',
    category: 'laundry',
    turnaround: '24-48 hours',
    isActive: true,
  },
  'dry-cleaning-services-in-dubai': {
    _id: 'dry-clean-1',
    name: 'Dry Cleaning Services',
    slug: 'dry-cleaning-services-in-dubai',
    description: 'Expert dry cleaning for delicate and formal garments.',
    tagline: 'Gentle care for delicate fabrics',
    category: 'dry-cleaning',
    turnaround: '24-48 hours',
    isActive: true,
  },
  'carpet-cleaning-services-in-dubai': {
    _id: 'carpet-1',
    name: 'Carpet Cleaning Services',
    slug: 'carpet-cleaning-services-in-dubai',
    description: 'Professional deep cleaning for carpets and rugs.',
    tagline: 'Deep clean, fresh carpets',
    category: 'carpet-cleaning',
    turnaround: '24-48 hours',
    isActive: true,
  },
  'shoe-cleaning-services-in-dubai': {
    _id: 'shoe-1',
    name: 'Shoe Cleaning Services',
    slug: 'shoe-cleaning-services-in-dubai',
    description: 'Premium shoe cleaning and restoration.',
    tagline: 'Like new, every time',
    category: 'shoe-cleaning',
    turnaround: '24-48 hours',
    isActive: true,
  },
};

async function getServiceAndItems(slug: string): Promise<{
  service: Service | null;
  serviceItems: ServiceItem[];
  error: string | null;
}> {
  if (!slug) {
    return { service: null, serviceItems: [], error: 'Service not found' };
  }

  try {
    const response = await productAPI.getProductBySlug(slug);

    if (response.success && response.product) {
      const foundService: Service = response.product;
      let serviceItems: ServiceItem[] = [];

      try {
        const itemsResponse = await productAPI.getServiceItemsForProduct(foundService._id);
        if (itemsResponse.success && itemsResponse.items && itemsResponse.items.length > 0) {
          serviceItems = itemsResponse.items;
        }
      } catch (itemsError) {
        console.error('Error fetching service items:', itemsError);
      }

      return { service: foundService, serviceItems, error: null };
    }

    // Fallback: serviceAPI
    const servicesData = await serviceAPI.getAllServices();
    let foundService: Service | null = null;
    if (servicesData.success && servicesData.services) {
      foundService = servicesData.services.find((s: any) => s.slug === slug) || null;
    }

    if (foundService) {
      let serviceItems: ServiceItem[] = [];
      const itemsResponse = await serviceAPI.getServiceItems(foundService._id);
      if (itemsResponse.success && itemsResponse.items) {
        serviceItems = itemsResponse.items;
      }
      return { service: foundService, serviceItems, error: null };
    }

    // Final fallback: hardcoded local service
    const localService = LOCAL_SERVICES[slug] || null;
    if (localService) {
      return { service: localService, serviceItems: [], error: null };
    }

    return { service: null, serviceItems: [], error: 'Service not found' };
  } catch (err: any) {
    console.error('Error fetching service on server:', err);
    const localService = LOCAL_SERVICES[slug] || null;
    if (localService) {
      return { service: localService, serviceItems: [], error: null };
    }
    return { service: null, serviceItems: [], error: err?.message || 'Failed to load service' };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { service } = await getServiceAndItems(slug);
  if (!service) {
    return { title: 'Service Not Found | Laundrica' };
  }

  const title = `Order ${service.name} | Laundrica`;
  const description = service.tagline || service.description;
  const url = `${SITE_URL}/services/${slug}/orders`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: service.name }],
      locale: 'en_AE',
      type: 'website',
    },
  };
}

export default async function ServiceOrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { service, serviceItems, error } = await getServiceAndItems(slug);

  return (
    <OrderPageClient
      slug={slug}
      initialService={service}
      initialServiceItems={serviceItems}
      initialError={error}
    />
  );
}