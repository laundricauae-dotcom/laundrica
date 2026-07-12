import type { Metadata } from "next";
import PricingClient from "./PricingClient";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site-config";

const title = "Pricing | Laundrica";
const description =
  "View Laundrica's transparent pricing for laundry, dry cleaning, wash & fold, ironing, and premium garment care with free pickup and delivery across Dubai.";
const url = `${SITE_URL}/pricing`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Laundrica Pricing" }],
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Page() {
  return <PricingClient />;
}