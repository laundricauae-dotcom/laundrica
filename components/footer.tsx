// components/Footer.tsx
'use client';

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const serviceLinks = [
    { href: "/services/wash-and-press-services-in-dubai/orders", label: "Wash & Press" },
    { href: "/services/dry-cleaning-services-in-dubai/orders", label: "Dry Cleaning" },
    { href: "/services/wash-and-fold-services-in-dubai/orders", label: "Wash & Fold" },
    { href: "/services/steam-press-services-in-dubai/orders", label: "Steam Press" },
  ];

  const specialtyLinks = [
    { href: "/services/shoe-care-services-in-dubai/orders", label: "Shoe Cleaning Dubai" },
    { href: "/services/carpet-care-services-in-dubai/orders", label: "Carpet Cleaning Dubai" },
    // { href: "/services/commercial-laundry", label: "Commercial Laundry" },
    // { href: "/services/wedding-dress", label: "Wedding Dress Care" },
  ];

  const companyLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/contact", label: "Contact Us" },
    { href: "/#about", label: "About Us" },
  ];

  return (
    <footer className="bg-[#F6F8F7] mt-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* LOGO */}
          <div>
            <div className="relative w-32 h-10 mb-4">
              <Image
                src="/images/Loundrica.png"
                alt="Laundrica"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Effortless purity for your wardrobe and home. Professional fabric care delivered to your door.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-emerald-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SHOE & CARPET CLEANING (renamed from "Specialty") */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Shoe & Carpet Cleaning</h3>
            <ul className="space-y-2">
              {specialtyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-emerald-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-emerald-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-xs text-gray-400">
          © 2024 Laundrica Fabric Care. Effortless Purity.
        </div>
      </div>
    </footer>
  );
}