// app/services/[slug]/page.tsx
// SERVER COMPONENT — fetches the service + items on the server (unchanged
// logic), renders the long-form SEO copy as server JSX around the untouched
// booking widget, and now also adds:
//   - OpenGraph metadata (requirement #3)
//   - Service + FAQ JSON-LD, but ONLY for the shoe & carpet slugs (requirement #8)
//
// None of this touches ServiceDetailClient's props, state, or cart logic.

import { serviceAPI } from '@/lib/api';
import ServiceDetailClient from './service-detail-client';
import {
  SERVICE_SEO_CONTENT,
  SERVICE_SEO_META,
  JSON_LD_ENABLED_SLUGS,
  getWhatsappBookingLink,
} from '@/lib/service-seo-content';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/site-config';

export const revalidate = 300; // ISR — adjust to taste

export interface ServiceItem {
  _id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  description?: string;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  turnaround?: string;
  features?: string[];
  image?: string;
}

async function getServiceAndItems(slug: string): Promise<{
  service: Service | null;
  items: ServiceItem[];
  error: string | null;
}> {
  if (!slug) {
    return { service: null, items: [], error: 'Service not found' };
  }

  try {
    const serviceData = await serviceAPI.getAllServices();
    let foundService: Service | null = null;

    if (serviceData.success && serviceData.services) {
      foundService = serviceData.services.find((s: any) => s.slug === slug) || null;
    } else if (Array.isArray(serviceData)) {
      foundService = serviceData.find((s: any) => s.slug === slug) || null;
    }

    if (!foundService) {
      return { service: null, items: [], error: 'Service not found' };
    }

    const itemsData = await serviceAPI.getServiceItems(foundService._id);
    let items: ServiceItem[] = [];
    if (itemsData.success && itemsData.items) items = itemsData.items;
    else if (Array.isArray(itemsData)) items = itemsData;

    return { service: foundService, items, error: null };
  } catch (err: any) {
    console.error('Error fetching service on server:', err);
    return { service: null, items: [], error: err?.message || 'Failed to load service' };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { service } = await getServiceAndItems(slug);

  const override = SERVICE_SEO_META[slug];
  const url = `${SITE_URL}/services/${slug}`;

  if (override) {
    const ogImage = override.ogImage || DEFAULT_OG_IMAGE;
    return {
      title: override.title,
      description: override.description,
      alternates: { canonical: url },
      openGraph: {
        title: override.title,
        description: override.description,
        url,
        siteName: SITE_NAME,
        images: [{ url: ogImage, width: 1200, height: 630, alt: override.title }],
        locale: 'en_AE',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: override.title,
        description: override.description,
        images: [ogImage],
      },
    };
  }

  if (!service) {
    return { title: 'Service Not Found | Laundrica' };
  }

  return {
    title: `${service.name} | Laundrica`,
    description: service.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.name} | Laundrica`,
      description: service.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: service.name }],
      locale: 'en_AE',
      type: 'website',
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { service, items, error } = await getServiceAndItems(slug);

  const seo = SERVICE_SEO_CONTENT[slug];
  const showJsonLd = JSON_LD_ENABLED_SLUGS.includes(slug) && seo && service;

  const serviceJsonLd = showJsonLd
    ? {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service!.name,
      description: seo!.intro,
      provider: {
        '@type': 'LocalBusiness',
        name: SITE_NAME,
        url: SITE_URL,
      },
      areaServed: {
        '@type': 'City',
        name: 'Dubai',
      },
      url: `${SITE_URL}/services/${slug}`,
    }
    : null;

  const faqJsonLd = showJsonLd
    ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seo!.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }
    : null;

  return (
    <>
      {serviceJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {seo && service && (
        <section className="bg-[#f9faf7]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00261b] mb-4">
              {seo.headline}
            </h1>
            <p className="text-[#5c5f5e] leading-relaxed mb-8">{seo.intro}</p>

            <h2 className="text-xl font-semibold text-[#00261b] mb-3">What we clean</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 list-disc list-inside text-[#5c5f5e]">
              {seo.whatWeClean.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold text-[#00261b] mb-4">
              How {service.name.toLowerCase()} works
            </h2>
            <ol className="space-y-4 mb-8">
              {seo.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00261b] text-white flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-[#00261b]">{step.title}</p>
                    <p className="text-sm text-[#5c5f5e]">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="text-[#5c5f5e] leading-relaxed mb-10 bg-[#bcedd7]/20 rounded-xl p-4">
              {seo.pricesParagraph}
            </p>
          </div>
        </section>
      )}

      {/* Booking widget — untouched, same component and props as before */}
      <ServiceDetailClient
        slug={slug}
        initialService={service}
        initialItems={items}
        initialError={error}
      />

      {seo && service && (
        <section className="bg-[#f9faf7]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-xl font-semibold text-[#00261b] mb-6">Frequently asked questions</h2>
            <div className="space-y-4 mb-10">
              {seo.faq.map((item) => (
                <div key={item.question} className="bg-white rounded-xl border border-gray-100 p-5">
                  <p className="font-medium text-[#00261b] mb-1">{item.question}</p>
                  <p className="text-sm text-[#5c5f5e]">{item.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href={getWhatsappBookingLink(seo, service.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                {seo.whatsappButtonLabel}
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}