// lib/service-seo-content.ts
// Server-only static content. No 'use client' — this file is imported
// exclusively by server components (app/services/[slug]/page.tsx,
// generateMetadata functions, and app/sitemap.ts).
//
// SLUG NOTE: standardized on the slugs used in the homepage ServicesGrid
// (app/HomeClient.tsx), since that's the most recent source of truth.
// This does NOT match the LOCAL_SERVICES fallback slugs currently in
// app/services/[slug]/orders/page.tsx (e.g. 'shoe-cleaning-services-in-dubai'
// vs 'shoe-care-services-in-dubai') — that file's LOCAL_SERVICES keys need
// updating to match, or its offline fallback will silently 404 for two services.

export interface FaqItem {
    question: string;
    answer: string;
}

export interface ServiceSeoContent {
    headline: string;
    intro: string;
    whatWeClean: string[];
    steps: { title: string; description: string }[];
    pricesParagraph: string; // contains [PRICE] placeholder for the owner to fill in
    faq: FaqItem[];
    whatsappButtonLabel: string;
}

export interface ServiceSeoMeta {
    title: string;
    description: string;
    ogImage?: string;
}

// Canonical slug list — used by app/sitemap.ts so every service page is
// listed exactly once, from one place.
export const SERVICE_SLUGS = [
    'shoe-care-services-in-dubai',
    'carpet-care-services-in-dubai',
    'wash-and-press-services-in-dubai',
    'dry-cleaning-services-in-dubai',
    'wash-and-fold-services-in-dubai',
    'steam-press-services-in-dubai',
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// Meta title/description overrides — Part 2 table.
// Fill in the real copy from your pack; these are placeholders that
// follow the same pattern as the shoe/carpet pages below.
export const SERVICE_SEO_META: Record<string, ServiceSeoMeta> = {
    'wash-and-press-services-in-dubai': {
        title: 'Wash & Press Laundry Service in Dubai | Laundrica',
        description:
            'Professional wash and press laundry service in Dubai with free pickup and delivery. Fast 24-48 hour turnaround.',
    },
    'dry-cleaning-services-in-dubai': {
        title: 'Dry Cleaning Services in Dubai | Laundrica',
        description:
            'Expert dry cleaning for delicate and formal garments in Dubai. Free doorstep pickup and delivery.',
    },
    'wash-and-fold-services-in-dubai': {
        title: 'Wash & Fold Laundry Service in Dubai | Laundrica',
        description:
            'Everyday wash and fold laundry service in Dubai, priced by the kilo, with free pickup and delivery.',
    },
    'steam-press-services-in-dubai': {
        title: 'Steam Pressing & Ironing Service in Dubai | Laundrica',
        description:
            'Professional steam pressing service in Dubai for crisp, wrinkle-free clothes. Free pickup and delivery.',
    },
    'shoe-care-services-in-dubai': {
        title: 'Shoe Cleaning in Dubai — Sneakers, Leather & Suede | Laundrica',
        description:
            'Professional shoe cleaning in Dubai for sneakers, leather, and suede. Free pickup and delivery, picked up at your door.',
        ogImage: '/images/shoe-cleaning-og.jpg',
    },
    'carpet-care-services-in-dubai': {
        title: 'Carpet Cleaning in Dubai — Rugs & Carpets Deep-Cleaned | Laundrica',
        description:
            'Deep carpet and rug cleaning in Dubai with free pickup and delivery. Professional stain removal and protection.',
        ogImage: '/images/carpet-cleaning-og.jpg',
    },
};

const WHATSAPP_NUMBER = '971508203555';

function whatsappLink(message: string) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const SERVICE_SEO_CONTENT: Record<string, ServiceSeoContent> = {
    'shoe-care-services-in-dubai': {
        headline: 'Shoe Cleaning in Dubai — Sneakers, Leather & Suede, Picked Up and Delivered',
        intro:
            'Laundrica offers professional shoe cleaning in Dubai for sneakers, leather shoes, suede, and luxury footwear. ' +
            'We collect your shoes from your doorstep, clean and restore them with material-specific techniques, and deliver them back looking their best — no trip to a store required.',
        whatWeClean: [
            'Sneakers and trainers',
            'Leather shoes and boots',
            'Suede and nubuck footwear',
            'Luxury and designer footwear',
            'School and work shoes',
            'Sports and running shoes',
        ],
        steps: [
            { title: 'Book a pickup', description: 'Schedule a free pickup online or via WhatsApp at a time that suits you.' },
            { title: 'We collect your shoes', description: 'Our driver picks up your shoes from your home or office at no extra cost.' },
            { title: 'Inspection & treatment plan', description: 'Each pair is inspected and matched to the right cleaning method for its material.' },
            { title: 'Cleaning & restoration', description: 'We deep clean, deodorize, and restore color and texture where needed.' },
            { title: 'Free delivery back to you', description: 'Your shoes are delivered back to your door, ready to wear.' },
        ],
        pricesParagraph:
            'Shoe cleaning prices start from [PRICE] per pair and vary depending on material, condition, and any restoration work required. ' +
            'For an exact quote, add your shoes to the order form or message us on WhatsApp with a photo.',
        faq: [
            {
                question: 'How long does shoe cleaning take?',
                answer: 'Most orders are completed within 24-48 hours from pickup, depending on the service and material.',
            },
            {
                question: 'Do you clean suede and nubuck shoes?',
                answer: 'Yes, we use specialized techniques and products designed specifically for suede and nubuck to avoid damaging the material.',
            },
            {
                question: 'Is pickup and delivery really free?',
                answer: 'Yes, pickup and delivery are free across our Dubai service area with no minimum order required.',
            },
            {
                question: 'Can you remove scuffs and stains from leather shoes?',
                answer: 'In most cases yes. Our team assesses each pair and applies the appropriate stain removal and restoration treatment.',
            },
            {
                question: 'Do you clean designer or luxury footwear?',
                answer: 'Yes, we offer specialized care for luxury and designer shoes with extra attention to preserving materials and finishes.',
            },
            {
                question: 'How do I get an exact price for my shoes?',
                answer: 'Contact us on WhatsApp with a photo of your shoes, or add them to your order and our team will confirm pricing before starting any work.',
            },
        ],
        whatsappButtonLabel: 'Book shoe cleaning on WhatsApp',
    },

    'carpet-care-services-in-dubai': {
        headline: 'Carpet Cleaning in Dubai — Rugs & Carpets Deep-Cleaned, Picked Up and Delivered',
        intro:
            'Laundrica provides professional carpet and rug cleaning in Dubai, with free pickup and delivery. ' +
            'From area rugs to wall-to-wall carpeting, our team deep cleans, removes stains, and refreshes your carpets without you having to leave home.',
        whatWeClean: [
            'Area rugs of all sizes',
            'Wall-to-wall carpets',
            'Persian and handmade rugs',
            'Office and commercial carpeting',
            'Car mats and floor coverings',
            'Stained or heavily soiled carpets',
        ],
        steps: [
            { title: 'Book a pickup', description: 'Schedule a free pickup online or via WhatsApp at a time that works for you.' },
            { title: 'We collect your carpet', description: 'Our team picks up your carpet or rug directly from your home or office.' },
            { title: 'Inspection & assessment', description: 'We assess the material, size, and condition to determine the right cleaning method.' },
            { title: 'Deep cleaning & stain treatment', description: 'Carpets are deep cleaned, stain-treated, and dried using professional equipment.' },
            { title: 'Free delivery back to you', description: 'Your carpet is delivered back fresh, clean, and ready to use.' },
        ],
        pricesParagraph:
            'Carpet cleaning prices start from [PRICE] and depend on size, material, and condition. ' +
            'For an accurate quote, share your carpet details on the order form or send us photos on WhatsApp.',
        faq: [
            {
                question: 'How long does carpet cleaning take?',
                answer: 'Most carpets are cleaned and returned within 24-48 hours, though larger or heavily soiled carpets may take longer.',
            },
            {
                question: 'Do you clean wall-to-wall carpets or only rugs?',
                answer: 'We clean both area rugs and wall-to-wall carpeting, including office and commercial spaces.',
            },
            {
                question: 'Can you remove tough stains from carpets?',
                answer: 'Yes, our team uses specialized stain treatments for common issues like food, pet, and beverage stains, with results depending on stain age and type.',
            },
            {
                question: 'Is pickup and delivery free for carpets?',
                answer: 'Yes, pickup and delivery are free across our Dubai service area.',
            },
            {
                question: 'Do you offer carpet protection treatments?',
                answer: 'Yes, we offer a protective coating treatment that can be added to help carpets resist future stains.',
            },
            {
                question: 'How do I get a price for my carpet?',
                answer: 'Message us on WhatsApp with your carpet size and photos, or submit the details through the order form for a confirmed quote.',
            },
        ],
        whatsappButtonLabel: 'Book carpet cleaning on WhatsApp',
    },
};

export function getWhatsappBookingLink(content: ServiceSeoContent, serviceName: string) {
    return whatsappLink(`Hi, I'd like to book ${serviceName} with Laundrica`);
}

// Slugs that get Service + FAQ JSON-LD (requirement #8: only shoe & carpet).
export const JSON_LD_ENABLED_SLUGS: readonly string[] = [
    'shoe-care-services-in-dubai',
    'carpet-care-services-in-dubai',
];