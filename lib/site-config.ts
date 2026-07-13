// lib/site-config.ts
// Single source of truth for site-wide values used across metadata,
// JSON-LD, sitemap.ts, and robots.ts. Update the domain here once
// deployed — everything else reads from this file.

export const SITE_URL = 'https://www.laundrica.com'; // TODO: confirm production domain
export const SITE_NAME = 'Laundrica';
export const SITE_DESCRIPTION =
    'Premium laundry, dry cleaning, wash & fold, ironing, carpet, and shoe cleaning in Dubai with free pickup and delivery.';

export const CONTACT_PHONE = '+971508203555';
export const CONTACT_PHONE_DISPLAY = '+971 50 820 3555';
export const CONTACT_EMAIL = 'support@laundrica.com';

export const SOCIAL_LINKS = {
    instagram: 'https://www.instagram.com/laundricauae/',
    facebook: 'https://www.facebook.com/profile.php?id=61588883551033',
    tiktok: 'https://www.tiktok.com/@laundricauae',
};

// Default OG image used when a page doesn't specify its own.
// TODO: replace with a real 1200x630 branded image at this path.
export const DEFAULT_OG_IMAGE = '/images/og-default.jpg';