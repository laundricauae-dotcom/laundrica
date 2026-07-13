// app/services/services-page-client.tsx
'use client';

import { useState, useRef } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { serviceAPI } from '@/lib/api';
import {
    WashingMachine, Shirt, Footprints, LayoutGrid, Blinds,
    Briefcase, Sparkles, Clock, Truck, Leaf, Shield,
    ChevronRight, Star, MessageCircle, ArrowRight,
    CheckCircle2, Heart, Droplets
} from 'lucide-react';
import type { Service } from './page';

// WhatsApp Configuration
const WHATSAPP_NUMBER = "971508203555";
const WHATSAPP_MESSAGE = "Hi I need Laundrica to sort my laundry WB";

const SERVICE_IMAGES: Record<string, string> = {
    'laundry': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaHDEQVLbQfnwFR9_VyvfLd-ko007XGQDbe8hwTsWY87HzOxSF5OEi1VIUhphuEPzTyIEYGuar_lQbl5IcLFr6Dnz7X7Z7pctJxklYiZfa-c9MxeiY35ivv9-1g0LOse4jxv133UHtIinIC088t7NfjZ_PC9rleHHBGmlsZ69ybT_UKrJ4utQTtvinL1UeEgulkfcg2nUWiJ2DIJYYhlitbNGfkogR5s0XfbMFFqM3gQtqlpbRweKf5r0np3KX1dvRGk_0eUCe4tVi',
    'dry-cleaning': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDSmGE2TtzW6YVlJMSyDumNuxjDafzBKzMdR4qG3eqVcTjAah0uNIQZPkLuWeHPHol4b4KvmlsPFC_KN3p7tWQBQ6QwwY9XUZtHuIIRZFMG-vCYoyJ0_b_XudUiAoeNPHtFhFaLpyFciaiUZmTUIz8SpnuLdtIr0RiWN6TrQRdNdIb0l8hb8_Ixsen9jOJTPqkeWMIP7psQVAw1npMZJXsAkH52LwBCa_R3N1DEIzyDhvtApslLYMdiQNPrDDyWg663DoZ--vmdfsf',
    'wash-and-fold': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP4Fl1mcL71ms-0aDco1bos4KJFJEZx5OQnJIOBWlWluJMOTU3XhoRrxAQvDa2yackx6UDbMN2aeY0HX3vJrKxXZZvOxDngQlZRCw6IC4qNlNInPtj13VA8r8kN-3-D0Jxrt44nDI5JAqB96hap1m-Sa8t_3oq6LroL8Ag9vqpd38eVyGtjT49EfXZUUUEmpo9H8CJRr1964I_IjjhCECEuvi3KYyJIWnmLx6Um420B0z6GG4nyB3DmF5ORn7DB6p1qP9FsFWioqH3',
    'steam-ironing': 'https://static.vecteezy.com/system/resources/thumbnails/075/548/139/small/closeup-electric-steam-iron-pressing-blue-shirt-with-powerful-vapor-mist-photo.jpeg',
    'shoe-cleaning': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyptsqgZUbgwL6Bq4bEsstny-6nDqBiqN5cBGYnfUgzSDXYcQRlm_pDhIj6-7C68tcWLpUVUoyuqYl-KtPTYiEtKvAJKV-rN_GAYoaYWEJWdkhtUtLShsLIqrzAO6qwGzS6zO7N7uSjdF1P9-5EztAjqUgYK-p6ctAHvjW1HY9dOh0XDdiAVOm2igRfKnzzKg7pled4rUzMo9aRGOi5PSI77IxhAP5ks-Hikp_CL0RfODVncfmgpsv7pnnGfj_ibEbUbaBjB1zew3f',
    'carpet-cleaning': '/images/carpet.png',
    'curtain-cleaning': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA45R7mYBYS5a_-9pcT1PdHvi75OrnW6SgurkHhCX-fJ_ymGD8x0ZZuqiCo5Rh908iElZhzYe3KP3UjAx1wUQ4w_Gkwp_0eqEpz_6SyRfDVW2dl0ja2MyCknffKUydongro0YT2wxCiDPDXKNyOovJkMUoqOJr4ZA-NfMZLhrLsPSzz1PycN1W0-fHxB0FkSehzYFH-4oAoWgJiJMcL_xJ9Sn_AkpjsLYsdhmJFybGq8Ju4kHUF-wp0f_OGW_HJf2FKgFPDwm8vZA6D',
    'commercial': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaHDEQVLbQfnwFR9_VyvfLd-ko007XGQDbe8hwTsWY87HzOxSF5OEi1VIUhphuEPzTyIEYGuar_lQbl5IcLFr6Dnz7X7Z7pctJxklYiZfa-c9MxeiY35ivv9-1g0LOse4jxv133UHtIinIC088t7NfjZ_PC9rleHHBGmlsZ69ybT_UKrJ4utQTtvinL1UeEgulkfcg2nUWiJ2DIJYYhlitbNGfkogR5s0XfbMFFqM3gQtqlpbRweKf5r0np3KX1dvRGk_0eUCe4tVi',
};

interface Props {
    initialServices: Service[];
    initialError: string | null;
}

export default function ServicesPageClient({ initialServices, initialError }: Props) {
    // Seeded from the server — no blank/loading state on first paint.
    const [services, setServices] = useState<Service[]>(initialServices);
    const [selectedService, setSelectedService] = useState<Service | null>(
        initialServices.length > 0 ? initialServices[0] : null
    );
    const [error, setError] = useState<string | null>(initialError);
    const [isRetrying, setIsRetrying] = useState(false);
    const [activeTab, setActiveTab] = useState<'website' | 'whatsapp'>('website');

    const contentRef = useRef<HTMLDivElement>(null);

    // Only used if the server-side fetch failed and the user clicks "Try Again".
    const retryFetch = async () => {
        try {
            setIsRetrying(true);
            const data = await serviceAPI.getAllServices();
            let servicesList: Service[] = [];
            if (data?.success && data.services) servicesList = data.services;
            else if (data?.data && Array.isArray(data.data)) servicesList = data.data;
            else if (Array.isArray(data)) servicesList = data;
            servicesList.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
            setServices(servicesList);
            setSelectedService(servicesList[0] || null);
            setError(null);
        } catch (err: any) {
            setError(err?.message || 'Failed to load services');
        } finally {
            setIsRetrying(false);
        }
    };

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        const isMobile = window.innerWidth < 1024;
        if (isMobile && contentRef.current) {
            setTimeout(() => {
                contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const getCategoryIcon = (category: string, size = "w-5 h-5") => {
        const iconMap: Record<string, React.ReactNode> = {
            'laundry': <WashingMachine className={size} />,
            'dry-cleaning': <Shirt className={size} />,
            'shoe-cleaning': <Footprints className={size} />,
            'carpet-cleaning': <LayoutGrid className={size} />,
            'curtain-cleaning': <Blinds className={size} />,
            'commercial': <Briefcase className={size} />,
            'wash-and-fold': <Sparkles className={size} />,
            'steam-ironing': <Sparkles className={size} />,
        };
        return iconMap[category] || <Sparkles className={size} />;
    };

    const getCategoryLabel = (category: string) => {
        const labelMap: Record<string, string> = {
            'laundry': 'Laundry',
            'dry-cleaning': 'Dry Cleaning',
            'shoe-cleaning': 'Shoe Care',
            'carpet-cleaning': 'Carpet',
            'curtain-cleaning': 'Curtains',
            'commercial': 'Commercial',
            'wash-and-fold': 'Wash & Fold',
            'steam-ironing': 'Steam Ironing',
        };
        return labelMap[category] || category;
    };

    const getServiceImage = (service: Service) => {
        if (SERVICE_IMAGES[service.category]) return SERVICE_IMAGES[service.category];
        if (service.image) return service.image;
        return '/images/laundry-service.jpg';
    };

    const handleWhatsAppOrder = () => {
        const message = `Hi I need Laundrica to sort my laundry WB`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (error && services.length === 0) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9faf7]">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={retryFetch}
                            disabled={isRetrying}
                            className="bg-[#00261b] text-white px-6 py-2 rounded-xl disabled:opacity-50"
                        >
                            {isRetrying ? 'Retrying...' : 'Try Again'}
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9faf7]">
            <Header />

            {/* Premium Hero Section */}
            <section className="relative min-h-[400px] flex items-center overflow-hidden pt-10 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <span className="inline-block px-4 py-1.5 bg-[#bcedd7] text-[#214f3f] rounded-full text-sm mb-6">Premium Services</span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#00261b] mb-6 leading-tight">
                            Care That <span className="text-emerald-700">Your Clothes Deserve</span>
                        </h1>
                        <p className="text-lg text-[#5c5f5e] mb-8 max-w-2xl mx-auto">
                            Choose from our premium laundry, dry cleaning, and specialty care services.
                            Free pickup & delivery across Dubai.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content - Sidebar + Content Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT SIDEBAR */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <div className="bg-[#00261b] p-5"><h2 className="font-semibold text-white">All Services</h2><p className="text-xs text-emerald-200 mt-0.5">{services.length} premium services</p></div>
                            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                                {services.map((service) => (
                                    <button
                                        key={service._id}
                                        onClick={() => handleServiceSelect(service)}
                                        className={`w-full text-left p-4 transition-all duration-200 group ${selectedService?._id === service._id ? 'bg-[#bcedd7]/30 border-l-4 border-l-[#00261b]' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${selectedService?._id === service._id ? 'bg-[#00261b] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#bcedd7] group-hover:text-[#00261b]'}`}>
                                                {getCategoryIcon(service.category, "w-5 h-5")}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`font-medium truncate ${selectedService?._id === service._id ? 'text-[#00261b]' : 'text-gray-900'}`}>{service.name}</h3>
                                                <div className="flex items-center gap-2 mt-1"><span className="text-xs text-gray-400">{getCategoryLabel(service.category)}</span>{service.turnaround && <span className="text-xs text-gray-300">• {service.turnaround}</span>}</div>
                                            </div>
                                            {selectedService?._id === service._id && <ChevronRight className="w-4 h-4 text-[#00261b]" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex-1" ref={contentRef}>
                        <AnimatePresence mode="wait">
                            {selectedService && (
                                <motion.div key={selectedService._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                                    <div className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url('${getServiceImage(selectedService)}')` }}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#00261b]/80 to-[#00261b]/30" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#00261b]/60 to-transparent" />
                                        <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                                    {getCategoryIcon(selectedService.category, "w-5 h-5 text-[#00261b]")}
                                                </div>
                                                {selectedService.isFeatured && (
                                                    <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                                                        <Star className="w-3 h-3 inline fill-white mr-1" />Featured
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-2xl font-bold text-white">{selectedService.name}</h2>
                                            <p className="text-white/80 text-sm mt-1">{getCategoryLabel(selectedService.category)}</p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-6">
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                <div className="bg-[#f9faf7] rounded-xl p-1 flex">
                                                    <button
                                                        onClick={() => setActiveTab('website')}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'website' ? 'bg-white text-[#00261b] shadow-sm' : 'text-gray-500'}`}
                                                    >
                                                        <span className="text-lg">🌐</span> Book Online
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveTab('whatsapp')}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'whatsapp' ? 'bg-white text-[#00261b] shadow-sm' : 'text-gray-500'}`}
                                                    >
                                                        <MessageCircle className="w-4 h-4" /> WhatsApp
                                                    </button>
                                                </div>
                                            </div>

                                            {activeTab === 'website' ? (
                                                <Link href={`/services/${selectedService.slug}/orders`}>
                                                    <button className="w-full md:w-auto bg-[#00261b] text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-all flex items-center justify-center gap-2">
                                                        Book Now <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                            ) : (
                                                <button onClick={handleWhatsAppOrder} className="w-full md:w-auto bg-[#25D366] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                                    <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                                                </button>
                                            )}

                                            {activeTab === 'whatsapp' && (
                                                <div className="mt-4 p-3 bg-emerald-50 rounded-xl flex items-start gap-2">
                                                    <Heart className="w-4 h-4 text-emerald-600" />
                                                    <p className="text-xs text-emerald-800">Order via WhatsApp and get personalized assistance with pricing, scheduling, and special requirements.</p>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-600 leading-relaxed mb-6">{selectedService.description || 'Professional cleaning service with premium quality and gentle care.'}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                            <div className="bg-[#f9faf7] rounded-xl p-3 text-center"><Truck className="w-5 h-5 text-[#00261b] mx-auto mb-1" /><p className="text-xs text-gray-400">Pickup</p><p className="text-sm font-semibold text-[#00261b]">Free Doorstep</p></div>
                                            <div className="bg-[#f9faf7] rounded-xl p-3 text-center"><Clock className="w-5 h-5 text-[#00261b] mx-auto mb-1" /><p className="text-xs text-gray-400">Turnaround</p><p className="text-sm font-semibold text-[#00261b]">{selectedService.turnaround || '24-48 hrs'}</p></div>
                                            <div className="bg-[#f9faf7] rounded-xl p-3 text-center"><Leaf className="w-5 h-5 text-[#00261b] mx-auto mb-1" /><p className="text-xs text-gray-400">Products</p><p className="text-sm font-semibold text-[#00261b]">Eco-Friendly</p></div>
                                            <div className="bg-[#f9faf7] rounded-xl p-3 text-center"><Shield className="w-5 h-5 text-[#00261b] mx-auto mb-1" /><p className="text-xs text-gray-400">Quality</p><p className="text-sm font-semibold text-[#00261b]">100% Guaranteed</p></div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="font-semibold text-[#00261b] mb-3">Why choose this service?</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {['Professional cleaning techniques', 'Premium eco-friendly products', 'Stain removal specialists', 'Quality checked before return', 'Free pickup & delivery', '24/7 customer support'].map((b, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                        <span>{b}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Trust Bar */}
            <section className="bg-white border-t border-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {[
                            { icon: Truck, title: 'Free Pickup', sub: 'From your doorstep' },
                            { icon: Clock, title: '24-48hr Service', sub: 'Quick turnaround' },
                            { icon: Shield, title: '100% Safe', sub: 'Quality assured' },
                            { icon: MessageCircle, title: '24/7 Support', sub: 'WhatsApp & Call' }
                        ].map((item) => (
                            <div key={item.title} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#bcedd7] rounded-xl flex items-center justify-center">
                                    <item.icon className="w-5 h-5 text-[#00261b]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#00261b] text-sm">{item.title}</p>
                                    <p className="text-xs text-gray-400">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-[#00261b] rounded-3xl p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-[#bcedd7] rounded-full blur-[100px]"></div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px]"></div>
                        </div>
                        <div className="relative z-10">
                            <Droplets className="w-12 h-12 text-[#bcedd7] mx-auto mb-6" />
                            <h2 className="text-2xl sm:text-3xl text-white font-bold mb-4">Not sure which service to choose?</h2>
                            <p className="text-[#79a894] mb-8">Our experts are here to help you find the perfect care solution.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#25D366] text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition"
                                >
                                    <MessageCircle className="w-4 h-4" /> WhatsApp Us
                                </a>
                                <Link href="/contact">
                                    <button className="border border-white/30 bg-white/5 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition">
                                        Contact Support
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}