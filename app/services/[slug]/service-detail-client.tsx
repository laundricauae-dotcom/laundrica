// app/services/[slug]/service-detail-client.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useSession } from '@/context/session-context';
import { Minus, Plus, ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Service, ServiceItem } from './page';

interface Props {
    slug: string;
    initialService: Service | null;
    initialItems: ServiceItem[];
    initialError: string | null;
}

export default function ServiceDetailClient({ slug, initialService, initialItems, initialError }: Props) {
    const { addToCart } = useCart();
    const { sessionId } = useSession();

    // Seeded directly from the server — nothing to fetch on mount, so
    // there's no loading flash and no window where the page is blank.
    const [service] = useState<Service | null>(initialService);
    const [items] = useState<ServiceItem[]>(initialItems);
    const [error] = useState<string | null>(initialError);

    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const updateQuantity = (itemId: string, change: number) => {
        setQuantities(prev => {
            const current = prev[itemId] || 0;
            const newValue = Math.max(0, current + change);
            if (newValue === 0) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: newValue };
        });
    };

    const handleAddToCart = async (item: ServiceItem) => {
        const quantity = quantities[item._id] || 0;
        if (quantity === 0) return;

        try {
            await addToCart({
                id: `${service?._id}-${item._id}`,
                name: `${service?.name} - ${item.name}`,
                price: item.price,
                quantity,
                category: item.category,
                description: item.description || '',
                image: service?.image || '',
                serviceItems: []
            });

            toast.success(`Added ${quantity} × ${item.name} to cart!`);
            setQuantities(prev => {
                const { [item._id]: _, ...rest } = prev;
                return rest;
            });
        } catch (err) {
            console.error('Error adding to cart:', err);
            toast.error('Failed to add to cart');
        }
    };

    const handleWhatsAppInquiry = () => {
        const phoneNumber = "971508203555"; // Laundrica's WhatsApp number
        const message = encodeURIComponent(
            `Hello, I'm interested in ${service?.name}. Could you please share more details and pricing?`
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const categories = [
        { id: 'all', label: 'All Items' },
        { id: 'men', label: 'Men' },
        { id: 'women', label: 'Women' },
        { id: 'children', label: 'Children' },
        { id: 'household', label: 'Household' },
    ];

    const filteredItems = activeCategory === 'all'
        ? items
        : items.filter(item => item.category === activeCategory);

    const getTotalItems = () => {
        return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    };

    const getTotalPrice = () => {
        let total = 0;
        filteredItems.forEach(item => {
            total += (quantities[item._id] || 0) * item.price;
        });
        return total;
    };

    if (error || !service) {
        return (
            <main className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <div className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md mx-auto px-4">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
                        <p className="text-gray-600 mb-6">{error || 'The service you are looking for does not exist.'}</p>
                        <Link href="/services">
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <ArrowLeft className="mr-2 w-4 h-4" />
                                Back to Services
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            {/* Hero Banner Section */}
            <section>
                <div
                    className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] bg-cover bg-center bg-fixed flex items-center justify-center"
                    style={{ backgroundImage: "url('/images/curtainCleaning.jpg')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b3d2a]/85 via-[#0b3d2a]/55 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b3d2a]/75 via-transparent to-transparent" />
                    <div className="relative z-30 text-center max-w-4xl mx-auto px-6">
                        <Link href="/services">
                            <button className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Services
                            </button>
                        </Link>
                        <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
                            {service.name}
                        </h1>
                        <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">
                            {service.description}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-5 py-2 rounded-full font-medium transition-all ${activeCategory === cat.id
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Items Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((item) => (
                                <div key={item._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                                        {item.description && (
                                            <p className="text-sm text-gray-500">{item.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <span className="text-2xl font-bold text-emerald-600">AED {item.price}</span>
                                            <span className="text-sm text-gray-500 ml-1">/{item.unit}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-gray-100 rounded-xl">
                                            <button
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-colors disabled:opacity-50"
                                                onClick={() => updateQuantity(item._id, -1)}
                                                disabled={!quantities[item._id]}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 text-center font-medium text-gray-900">
                                                {quantities[item._id] || 0}
                                            </span>
                                            <button
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-colors"
                                                onClick={() => updateQuantity(item._id, 1)}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            className={`flex-1 h-10 rounded-xl font-medium transition-all ${quantities[item._id]
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            onClick={() => handleAddToCart(item)}
                                            disabled={!quantities[item._id]}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredItems.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No items available in this category.</p>
                            </div>
                        )}

                        {/* Floating Cart Summary */}
                        {getTotalItems() > 0 && (
                            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                                <div className="bg-white rounded-full shadow-xl px-6 py-3 flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5 text-emerald-600" />
                                        <span className="font-semibold">{getTotalItems()} items</span>
                                    </div>
                                    <div className="text-lg font-bold text-emerald-600">
                                        AED {getTotalPrice()}
                                    </div>
                                    <Link href="/cart">
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-6">
                                            View Cart
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* WhatsApp CTA */}
                        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need help with your order?</h3>
                            <p className="text-gray-600 mb-4">Contact us on WhatsApp for quick assistance</p>
                            <button
                                onClick={handleWhatsAppInquiry}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-all"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Chat on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}