// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { ShoppingCart, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

const WHATSAPP_NUMBER = "971508203555";

export function Header() {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const bookDropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        if (openDropdown === 'services') setOpenDropdown(null);
      }
      if (bookDropdownRef.current && !bookDropdownRef.current.contains(event.target as Node)) {
        if (openDropdown === 'book') setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        setTimeout(() => {
          const retryElement = document.getElementById(sectionId);
          if (retryElement) {
            const headerOffset = 80;
            const elementPosition = retryElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }, 50);
  };

  const handleNavClick = async (href: string, sectionId?: string) => {
    setIsMenuOpen(false);
    setOpenDropdown(null);

    if (pathname === '/') {
      if (sectionId) {
        scrollToSection(sectionId);
      } else {
        router.push(href);
      }
    } else {
      if (sectionId) {
        sessionStorage.setItem('scrollToSection', sectionId);
        router.push('/');
      } else {
        router.push(href);
      }
    }
  };

  useEffect(() => {
    if (pathname === '/') {
      const sectionToScroll = sessionStorage.getItem('scrollToSection');
      if (sectionToScroll) {
        sessionStorage.removeItem('scrollToSection');
        setTimeout(() => {
          scrollToSection(sectionToScroll);
        }, 100);
      }

      if (window.location.hash) {
        const sectionId = window.location.hash.slice(1);
        setTimeout(() => {
          scrollToSection(sectionId);
          window.history.pushState(null, '', '/');
        }, 100);
      }
    }
  }, [pathname]);

  const serviceLinks = [
    { href: '/services/wash-and-press-services-in-dubai/orders', label: 'Wash & Press' },
    { href: '/services/dry-cleaning-services-in-dubai/orders', label: 'Dry Cleaning' },
    { href: '/services/wash-and-fold-services-in-dubai/orders', label: 'Wash & Fold' },
    // { href: '/services/steam-press-services-in-dubai/orders', label: 'Steam Press' },
    { href: '/services/shoe-care-services-in-dubai/orders', label: 'Shoe Care' },
    { href: '/services/carpet-care-services-in-dubai/orders', label: 'Carpet Care' },
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'd like to book a laundry service. Can you help me?");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const bookOptions = [
    { href: '/services', label: 'Online Booking', icon: '🌐', action: null },
    { label: 'WhatsApp Booking', icon: '💬', action: handleWhatsApp, external: true },
  ];

  const navLinks = [
    { href: '/pricing', label: 'Pricing', sectionId: null },
    { href: '/about', label: 'About Us', sectionId: 'about' },
    { href: '/contact', label: 'Contact', sectionId: null },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex-shrink-0 min-w-[90px]">
              <Link href="/" className="flex">
                <div className="relative w-24 h-10 sm:w-28 sm:h-11 lg:w-32 lg:h-12">
                  <Image
                    src="/images/Loundrica.png"
                    alt="Laundrica Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              <div ref={servicesDropdownRef} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
                  className={`relative px-1 py-2 text-gray-600 hover:text-emerald-900 font-medium transition-colors duration-300 text-sm tracking-tight flex items-center gap-1 ${openDropdown === 'services' ? 'text-emerald-900' : ''}`}
                >
                  Services
                  <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openDropdown === 'services' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {navLinks.map((link) => (
                link.sectionId ? (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href, link.sectionId!)}
                    className="relative px-1 py-2 text-gray-600 hover:text-emerald-900 font-medium transition-colors duration-300 text-sm tracking-tight cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-1 py-2 text-gray-600 hover:text-emerald-900 font-medium transition-colors duration-300 text-sm tracking-tight"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/cart">
                <button className="relative w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-emerald-900 transition-all duration-300 group flex items-center justify-center">
                  <ShoppingCart size={18} className="text-gray-600 group-hover:text-emerald-900 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              <div ref={bookDropdownRef} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'book' ? null : 'book')}
                  className="hidden lg:flex relative h-11 px-6 bg-emerald-900 hover:bg-emerald-800 transition-all duration-300 items-center justify-center gap-2 rounded-full shadow-lg"
                >
                  <Sparkles size={16} className="text-white" />
                  <span className="text-white font-semibold text-sm">Book a Wash</span>
                  <ChevronDown size={14} className={`text-white transition-transform duration-200 ${openDropdown === 'book' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openDropdown === 'book' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {bookOptions.map((option) => (
                          option.action ? (
                            <button
                              key={option.label}
                              onClick={() => {
                                setOpenDropdown(null);
                                option.action();
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                            >
                              <span className="text-lg">{option.icon}</span>
                              <span>{option.label}</span>
                            </button>
                          ) : (
                            <Link
                              key={option.href}
                              href={option.href!}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span className="text-lg">{option.icon}</span>
                              <span>{option.label}</span>
                            </Link>
                          )
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                className="lg:hidden relative w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={18} className="text-gray-600" /> : <Menu size={18} className="text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100"
            >
              <div className="p-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  link.sectionId ? (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href, link.sectionId!)}
                      className="px-4 py-3 text-gray-700 hover:text-emerald-900 hover:bg-emerald-50 font-medium transition-all rounded-lg text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-3 text-gray-700 hover:text-emerald-900 hover:bg-emerald-50 font-medium transition-all rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                ))}

                <div className="px-4 py-2">
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Our Services</p>
                  <div className="space-y-1">
                    {serviceLinks.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block py-2.5 text-sm text-gray-600 hover:text-emerald-900 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 my-2"></div>

                <Link href="/services" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full h-11 bg-emerald-900 text-white rounded-full font-semibold mb-2">
                    Online Booking
                  </button>
                </Link>
                <button onClick={handleWhatsApp} className="w-full h-11 border border-emerald-900 text-emerald-900 rounded-full font-semibold">
                  WhatsApp Booking
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}