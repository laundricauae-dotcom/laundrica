'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import {
  Shirt, Home, Crown, Download,
  Heart, Leaf, Zap, Award,
  Phone, MessageCircle, Shield, Truck,
  Gem, ThumbsUp,
  Clock, Star, Flame
} from 'lucide-react';

interface PricingItem {
  id: string;
  name: string;
  washPress: number | string;
  pressOnly: number | string;
  dryClean: number | string;
  category: 'men' | 'women' | 'kids' | 'household' | 'popular';
}

// Static pricing data
const pricingData: PricingItem[] = [
  // MEN'S CLOTHING (10 items)
  { id: 'men-1', name: 'T-Shirt', washPress: 7, pressOnly: 4, dryClean: 10, category: 'men' },
  { id: 'men-2', name: 'Shirt', washPress: 7, pressOnly: 4, dryClean: 10, category: 'men' },
  { id: 'men-3', name: 'Trousers', washPress: 7, pressOnly: 4, dryClean: 10, category: 'men' },
  { id: 'men-4', name: 'Jeans', washPress: 8, pressOnly: 5, dryClean: 12, category: 'men' },
  { id: 'men-5', name: 'Kandoora / Thobe', washPress: 12, pressOnly: 6, dryClean: 15, category: 'men' },
  { id: 'men-6', name: 'Suit 2 Piece', washPress: 'N/A', pressOnly: 12, dryClean: 28, category: 'men' },
  { id: 'men-7', name: 'Blazer', washPress: 'N/A', pressOnly: 12, dryClean: 18, category: 'men' },
  { id: 'men-8', name: 'Jacket / Coat', washPress: 'N/A', pressOnly: 12, dryClean: 20, category: 'men' },
  { id: 'men-9', name: 'Sweater / Hoodie', washPress: 12, pressOnly: 6, dryClean: 15, category: 'men' },
  { id: 'men-10', name: 'Gym Wear', washPress: 8, pressOnly: 'N/A', dryClean: 'N/A', category: 'men' },

  // WOMEN'S CLOTHING (10 items)
  { id: 'women-1', name: 'T-Shirt / Top', washPress: 7, pressOnly: 4, dryClean: 10, category: 'women' },
  { id: 'women-2', name: 'Trousers / Pants', washPress: 7, pressOnly: 4, dryClean: 10, category: 'women' },
  { id: 'women-3', name: 'Jeans', washPress: 8, pressOnly: 5, dryClean: 12, category: 'women' },
  { id: 'women-4', name: 'Abaya', washPress: 15, pressOnly: 10, dryClean: 20, category: 'women' },
  { id: 'women-5', name: 'Saree', washPress: 'N/A', pressOnly: 15, dryClean: 30, category: 'women' },
  { id: 'women-6', name: 'Full Dress (Normal)', washPress: 12, pressOnly: 6, dryClean: 15, category: 'women' },
  { id: 'women-7', name: 'Skirt', washPress: 8, pressOnly: 5, dryClean: 12, category: 'women' },
  { id: 'women-8', name: 'Blouse / Kameez', washPress: 8, pressOnly: 4, dryClean: 12, category: 'women' },
  { id: 'women-9', name: 'Evening Gown', washPress: 'N/A', pressOnly: 10, dryClean: 20, category: 'women' },
  { id: 'women-10', name: 'Hijab / Scarf', washPress: 10, pressOnly: 8, dryClean: 15, category: 'women' },

  // KIDS CLOTHING (10 items)
  { id: 'kids-1', name: 'T-Shirt', washPress: 5, pressOnly: 3, dryClean: 8, category: 'kids' },
  { id: 'kids-2', name: 'Shirt', washPress: 5, pressOnly: 3, dryClean: 8, category: 'kids' },
  { id: 'kids-3', name: 'Trousers / Pants', washPress: 6, pressOnly: 4, dryClean: 8, category: 'kids' },
  { id: 'kids-4', name: 'Jeans', washPress: 7, pressOnly: 4, dryClean: 8, category: 'kids' },
  { id: 'kids-5', name: 'Dress', washPress: 8, pressOnly: 5, dryClean: 10, category: 'kids' },
  { id: 'kids-6', name: 'School Shirt', washPress: 6, pressOnly: 3, dryClean: 'N/A', category: 'kids' },
  { id: 'kids-7', name: 'School Trousers / Skirt', washPress: 6, pressOnly: 3, dryClean: 'N/A', category: 'kids' },
  { id: 'kids-8', name: 'School Blazer', washPress: 'N/A', pressOnly: 6, dryClean: 20, category: 'kids' },
  { id: 'kids-9', name: 'Onesie / Romper', washPress: 8, pressOnly: 4, dryClean: 10, category: 'kids' },
  { id: 'kids-10', name: 'Swimwear', washPress: 7, pressOnly: 'N/A', dryClean: 'N/A', category: 'kids' },

  // HOUSEHOLD ITEMS (10 items)
  { id: 'household-1', name: 'Bed Sheet Single', washPress: 12, pressOnly: 6, dryClean: 'N/A', category: 'household' },
  { id: 'household-2', name: 'Bed Sheet Double', washPress: 16, pressOnly: 8, dryClean: 'N/A', category: 'household' },
  { id: 'household-3', name: 'Duvet Cover Single', washPress: 12, pressOnly: 6, dryClean: 'N/A', category: 'household' },
  { id: 'household-4', name: 'Duvet Cover Double', washPress: 16, pressOnly: 8, dryClean: 'N/A', category: 'household' },
  { id: 'household-5', name: 'Bath Towel Large', washPress: 12, pressOnly: 'N/A', dryClean: 16, category: 'household' },
  { id: 'household-6', name: 'Bath Robe', washPress: 15, pressOnly: 8, dryClean: 20, category: 'household' },
  { id: 'household-7', name: 'Duvet Medium', washPress: 20, pressOnly: 'N/A', dryClean: 25, category: 'household' },
  { id: 'household-8', name: 'Blanket Single', washPress: 12, pressOnly: 'N/A', dryClean: 20, category: 'household' },
  { id: 'household-9', name: 'Pillow Cover', washPress: 6, pressOnly: 4, dryClean: 'N/A', category: 'household' },
  { id: 'household-10', name: 'Table Cloth', washPress: 6, pressOnly: 3, dryClean: 10, category: 'household' },

  // MOST POPULAR ITEMS (Top 10 most requested services)
  { id: 'popular-1', name: 'Shirt (Men)', washPress: 7, pressOnly: 4, dryClean: 10, category: 'popular' },
  { id: 'popular-2', name: 'Trousers (Men)', washPress: 7, pressOnly: 4, dryClean: 10, category: 'popular' },
  { id: 'popular-3', name: 'Abaya', washPress: 15, pressOnly: 10, dryClean: 20, category: 'popular' },
  { id: 'popular-4', name: 'Kandoora / Thobe', washPress: 12, pressOnly: 6, dryClean: 15, category: 'popular' },
  { id: 'popular-5', name: 'Suit 2 Piece', washPress: 'N/A', pressOnly: 12, dryClean: 28, category: 'popular' },
  { id: 'popular-6', name: 'Bed Sheet Double', washPress: 16, pressOnly: 8, dryClean: 'N/A', category: 'popular' },
  { id: 'popular-7', name: 'Jeans', washPress: 8, pressOnly: 5, dryClean: 12, category: 'popular' },
  { id: 'popular-8', name: 'Saree', washPress: 'N/A', pressOnly: 15, dryClean: 30, category: 'popular' },
  { id: 'popular-9', name: 'School Uniform Set', washPress: 20, pressOnly: 10, dryClean: 25, category: 'popular' },
  { id: 'popular-10', name: 'Bath Towel', washPress: 12, pressOnly: 'N/A', dryClean: 16, category: 'popular' },
];

// Category configuration
const categories = [
  { id: 'popular', label: 'Most Popular', icon: Flame, color: 'bg-orange-50', activeColor: 'bg-orange-600' },
  { id: 'men', label: 'Men\'s Clothing', icon: Shirt, color: 'bg-blue-50', activeColor: 'bg-[#00261b]' },
  { id: 'women', label: 'Women\'s Clothing', icon: Heart, color: 'bg-rose-50', activeColor: 'bg-[#00261b]' },
  { id: 'kids', label: 'Children\'s Clothing', icon: Crown, color: 'bg-purple-50', activeColor: 'bg-[#00261b]' },
  { id: 'household', label: 'Household Items', icon: Home, color: 'bg-emerald-50', activeColor: 'bg-[#00261b]' },
];

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState<'men' | 'women' | 'kids' | 'household' | 'popular'>('popular');
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const handleDownloadPDF = () => {
    const pdfUrl = '/images/Laundrica.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'laundrica-price-list.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get items for current category
  const getCurrentItems = () => {
    return pricingData.filter(item => item.category === activeCategory);
  };

  const currentItems = getCurrentItems();
  const currentCategory = categories.find(c => c.id === activeCategory);

  return (
    <main className="flex flex-col min-h-screen bg-[#f9faf7]">
      <Header />

      {/* Premium Hero Banner */}
      <section ref={heroRef} className="relative min-h-[450px] flex items-center overflow-hidden pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="z-10"
          >
            <span className="inline-block px-4 py-1.5 bg-[#bcedd7] text-[#214f3f] rounded-full text-sm mb-6">Transparent Pricing</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#00261b] mb-6 leading-tight">
              Premium Care for <span className="text-emerald-700">Every Fabric</span>
            </h1>
            <p className="text-lg text-[#5c5f5e] mb-8 leading-relaxed max-w-lg">
              Professional laundry, dry cleaning, and garment care. Free pickup & delivery across Dubai.
              Transparent pricing with no hidden fees.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/services">
                <button className="px-8 py-3.5 bg-[#00261b] text-white rounded-xl font-semibold hover:opacity-90 transition">
                  Book Your Service
                </button>
              </Link>
              <button
                onClick={handleDownloadPDF}
                className="px-8 py-3.5 bg-white border border-gray-200 text-[#00261b] rounded-xl font-semibold hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Price List
              </button>
            </div>
            <div className="space-y-5 pt-5 border-t border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Free Pickup & Delivery</p>
                <p className="text-sm font-medium text-[#00261b]/70">On all orders — no minimum required</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Express Service Available</p>
                <p className="text-sm font-medium text-[#00261b] flex items-center gap-2 flex-wrap">
                  Same-day delivery for orders placed before 10 AM
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/wash&fold.png"
                alt="Laundry Service"
                width={500}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl max-w-[200px]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-[#00261b]">Quality Guaranteed</p>
                  <p className="text-xs text-gray-500">100% satisfaction</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Menu Section with Category Tabs */}
      <section className="py-16 bg-[#edeeeb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 bg-[#bcedd7] text-[#214f3f] rounded-full text-sm mb-4">A La Carte Pricing</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#00261b] mb-4">Complete Price List</motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5c5f5e] max-w-2xl mx-auto">
              Transparent pricing for all our services. No hidden charges, just premium care.
            </motion.p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeCategory === category.id
                    ? 'bg-[#00261b] text-white shadow-lg'
                    : 'bg-white text-[#00261b] hover:bg-[#bcedd7] border border-gray-200'
                  }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          {/* Category Header with Icon */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeCategory === 'popular' ? 'bg-orange-100' :
                  activeCategory === 'men' ? 'bg-blue-100' :
                    activeCategory === 'women' ? 'bg-rose-100' :
                      activeCategory === 'kids' ? 'bg-purple-100' : 'bg-emerald-100'
                }`}>
                {currentCategory && <currentCategory.icon className="w-5 h-5 text-[#00261b]" />}
              </div>
              <h3 className="text-xl font-bold text-[#00261b]">
                {currentCategory?.label} Price List
              </h3>
            </div>
            <div className="text-xs text-gray-400">
              * Prices in AED
            </div>
          </div>

          {/* Pricing Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#00261b]">Item</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#00261b]">Wash & Press</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#00261b]">Press Only</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#00261b]">Dry Cleaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-[#00261b] font-medium group-hover:text-emerald-700 transition-colors">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {typeof item.washPress === 'number' ? (
                          <span className="font-semibold text-emerald-700">AED {item.washPress}</span>
                        ) : (
                          <span className="text-gray-400">{item.washPress}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {typeof item.pressOnly === 'number' ? (
                          <span className="font-semibold text-emerald-700">AED {item.pressOnly}</span>
                        ) : (
                          <span className="text-gray-400">{item.pressOnly}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {typeof item.dryClean === 'number' ? (
                          <span className="font-semibold text-emerald-700">AED {item.dryClean}</span>
                        ) : (
                          <span className="text-gray-400">{item.dryClean}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Special Notes for Popular Tab */}
          {activeCategory === 'popular' && (
            <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-800 mb-1">Most Requested Services</p>
                  <p className="text-xs text-orange-700">
                    These are our most popular services based on customer orders.
                    All prices include free pickup and delivery across Dubai.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Note for Household Items */}
          {activeCategory === 'household' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-700">
                * For heavy curtains, sofa covers, and large rugs, pricing may vary based on size and material.
                Please contact us for a custom quote.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section - Premium */}
      <section className="py-16 bg-[#f9faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 bg-[#bcedd7] text-[#214f3f] rounded-full text-sm mb-4">Our Advantages</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#00261b] mb-4">Why Choose Laundrica</motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5c5f5e] max-w-2xl mx-auto">
              Experience the difference of premium fabric care
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Personalized Care", desc: "Every fabric type treated with precision and expertise", color: "bg-rose-50", iconColor: "text-rose-600" },
              { icon: Gem, title: "Flexible Pricing", desc: "Options designed to suit every budget and need", color: "bg-emerald-50", iconColor: "text-emerald-600" },
              { icon: Clock, title: "Effortless Convenience", desc: "Your laundry completed with a single request", color: "bg-blue-50", iconColor: "text-blue-600" },
              { icon: Award, title: "Premium Products", desc: "Only the finest detergents and cleaning solutions", color: "bg-amber-50", iconColor: "text-amber-600" },
              { icon: Zap, title: "Express Service", desc: "Delivery in as little as eight hours", color: "bg-purple-50", iconColor: "text-purple-600" },
              { icon: ThumbsUp, title: "Real-Time Updates", desc: "Complete transparency throughout the process", color: "bg-cyan-50", iconColor: "text-cyan-600" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>
                <h3 className="font-bold text-xl text-[#00261b] mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}