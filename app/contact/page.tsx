import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site-config";

const title = "Contact Us | Laundrica";
const description =
  "Contact Laundrica for laundry services, free pickup and delivery, pricing enquiries, or customer support. Reach us by phone, WhatsApp, or email.";
const url = `${SITE_URL}/contact`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Contact Laundrica" }],
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
  return <ContactClient />;
}