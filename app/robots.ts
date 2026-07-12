// app/robots.ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Cart/checkout are transactional, session-specific pages with no
                // SEO value and shouldn't be indexed or crawled.
                disallow: ['/cart', '/checkout'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}