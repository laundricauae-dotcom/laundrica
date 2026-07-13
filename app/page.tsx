// app/page.tsx
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  TbTruckDelivery,
  TbCoin,
  TbShieldCheck,
  TbClock,
  TbLeaf,
  TbWalk,
  TbDeviceImac,
  TbBox,
  TbDroplet,
  TbFold,
  TbMist,
  TbShoe,
  TbIroningSteam,
  TbLayoutGrid,
  TbBuilding,
  TbBuildingStore,
  TbCalendarEvent,
  TbBriefcase,
  TbCircleCheck,
  TbStar,
  TbMessageCircle,
  TbArrowRight,
  TbShirt,
  TbChevronRight
} from 'react-icons/tb';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { WhatsAppButton } from '@/components/whatsapp-button';

// Trust Strip Component - Icons only with hover
function TrustStrip() {
  const trustItems = [
    { icon: TbTruckDelivery, label: 'Free Pickup & Delivery' },
    { icon: TbCoin, label: 'Affordable Service' },
    { icon: TbShieldCheck, label: 'Quality Checked' },
    { icon: TbClock, label: '24–48 Hours' },
    { icon: TbLeaf, label: 'Eco-Friendly' },
  ];

  return (
    <section className="bg-[#014421] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="group flex items-center gap-2 text-sm font-medium text-white hover:text-gray-300 transition-colors duration-300 cursor-default"
            >
              <item.icon className="text-2xl text-white transition-all duration-300 group-hover:text-gray-300 group-hover:scale-110" />

              <span className="transition-colors duration-300">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
// How It Works Component with hover effects
function HowItWorks() {
  const steps = [
    { icon: TbWalk, title: 'Pickup', description: 'Schedule a pickup at a time that suits you. Your garments, carpets, and shoes are securely collected from your doorstep for a smooth and hassle-free experience.' },
    { icon: TbDeviceImac, title: 'Care Processing', description: 'Every item is carefully processed using professional cleaning, dry cleaning, ironing, carpet care, and shoe care methods suited to its material and condition.' },
    { icon: TbBox, title: 'Delivery', description: 'Your items are returned fresh, hygienic, and perfectly finished—carefully packed and delivered back to your doorstep, ready to wear and use.' },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16  text-center flex flex-col items-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#00261b] mb-4">HOW IT WORKS</h2>
          <p className="text-[#5c5f5e] max-w-md">Seamless garment and fabric care with convenient pickup and delivery across Dubai.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group p-8 sm:p-10 rounded-2xl bg-[#f9faf7] border border-gray-100 hover:border-[#bcedd7] hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <motion.div
                className="w-14 h-14 bg-[#bcedd7] rounded-xl flex items-center justify-center mb-8"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <step.icon className="text-[#00261b] text-2xl" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#00261b] mb-4 group-hover:text-emerald-700 transition-colors">{step.title}</h3>
              <p className="text-[#5c5f5e] leading-relaxed group-hover:text-gray-700 transition-colors">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Services Grid Component with hover effects
function ServicesGrid() {
  const services = [
    {
      name: 'Wash & Press',
      icon: TbShirt,
      description: 'Professional washing and pressing for everyday wear and essentials, finished with care for a fresh and polished look.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaHDEQVLbQfnwFR9_VyvfLd-ko007XGQDbe8hwTsWY87HzOxSF5OEi1VIUhphuEPzTyIEYGuar_lQbl5IcLFr6Dnz7X7Z7pctJxklYiZfa-c9MxeiY35ivv9-1g0LOse4jxv133UHtIinIC088t7NfjZ_PC9rleHHBGmlsZ69ybT_UKrJ4utQTtvinL1UeEgulkfcg2nUWiJ2DIJYYhlitbNGfkogR5s0XfbMFFqM3gQtqlpbRweKf5r0np3KX1dvRGk_0eUCe4tVi',
      slug: 'wash-and-press-services-in-dubai'
    },
    {
      name: 'Dry Cleaning',
      icon: TbDroplet,
      description: 'Premium dry cleaning solutions for delicate fabrics, formal wear, suits, dresses, and specialty garments requiring extra care.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDSmGE2TtzW6YVlJMSyDumNuxjDafzBKzMdR4qG3eqVcTjAah0uNIQZPkLuWeHPHol4b4KvmlsPFC_KN3p7tWQBQ6QwwY9XUZtHuIIRZFMG-vCYoyJ0_b_XudUiAoeNPHtFhFaLpyFciaiUZmTUIz8SpnuLdtIr0RiWN6TrQRdNdIb0l8hb8_Ixsen9jOJTPqkeWMIP7psQVAw1npMZJXsAkH52LwBCa_R3N1DEIzyDhvtApslLYMdiQNPrDDyWg663DoZ--vmdfsf',
      slug: 'dry-cleaning-services-in-dubai'
    },
    {
      name: 'Wash & Fold',
      icon: TbFold,
      description: 'Convenient everyday laundry care, neatly folded and returned fresh, clean, and ready for your wardrobe.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP4Fl1mcL71ms-0aDco1bos4KJFJEZx5OQnJIOBWlWluJMOTU3XhoRrxAQvDa2yackx6UDbMN2aeY0HX3vJrKxXZZvOxDngQlZRCw6IC4qNlNInPtj13VA8r8kN-3-D0Jxrt44nDI5JAqB96hap1m-Sa8t_3oq6LroL8Ag9vqpd38eVyGtjT49EfXZUUUEmpo9H8CJRr1964I_IjjhCECEuvi3KYyJIWnmLx6Um420B0z6GG4nyB3DmF5ORn7DB6p1qP9FsFWioqH3', slug: 'wash-and-fold-services-in-dubai'
    },
    {
      name: 'Steam Ironing',
      icon: TbIroningSteam,
      description: 'Professional steam ironing and pressing for garments that require a crisp, smooth, and refined finish.',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/075/548/139/small/closeup-electric-steam-iron-pressing-blue-shirt-with-powerful-vapor-mist-photo.jpeg',
      slug: 'steam-press-services-in-dubai'
    },
    {
      name: 'Shoe Care',
      icon: TbShoe,
      description: 'Specialized cleaning and care solutions for sneakers, leather shoes, suede, and premium footwear.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyptsqgZUbgwL6Bq4bEsstny-6nDqBiqN5cBGYnfUgzSDXYcQRlm_pDhIj6-7C68tcWLpUVUoyuqYl-KtPTYiEtKvAJKV-rN_GAYoaYWEJWdkhtUtLShsLIqrzAO6qwGzS6zO7N7uSjdF1P9-5EztAjqUgYK-p6ctAHvjW1HY9dOh0XDdiAVOm2igRfKnzzKg7pled4rUzMo9aRGOi5PSI77IxhAP5ks-Hikp_CL0RfODVncfmgpsv7pnnGfj_ibEbUbaBjB1zew3f',

      slug: 'shoe-care-services-in-dubai'
    },
    {
      name: 'Carpet Care',
      icon: TbLayoutGrid,
      description: 'Professional carpet and rug care designed to help maintain freshness, cleanliness, and fabric quality for your home essentials.',
      image: '/images/carpet.png',
      slug: 'carpet-care-services-in-dubai'
    },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-20 bg-[#edeeeb]" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#00261b] mb-4">PREMIUM CARE SERVICES</h2>
          <p className="text-[#5c5f5e] max-w-lg mx-auto">Comprehensive garment, fabric, shoe, and carpet care with convenient pickup and delivery across Dubai.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            >
              <Link href={`/services/${service.slug}/orders`}>
                <div className="h-48 overflow-hidden relative">
                  <motion.img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <motion.div
                    className="flex items-center gap-3 mb-4"
                    whileHover={{ x: 5 }}
                  >
                    <service.icon className="text-emerald-700 text-2xl group-hover:text-[#00261b] transition-colors" />
                    <h3 className="text-xl font-bold text-[#00261b] group-hover:text-emerald-700 transition-colors">{service.name}</h3>
                  </motion.div>
                  <p className="text-[#5c5f5e] text-sm line-clamp-3 group-hover:text-gray-700 transition-colors">{service.description}</p>
                  <motion.div
                    className="flex items-center gap-1 text-emerald-600 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <span className="text-sm font-medium">Learn More</span>
                    <TbChevronRight className="text-sm" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


// Business Request Modal Component
function BusinessRequestModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    businessType: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    { value: 'hotel', label: 'Hotel / Resort' },
    { value: 'restaurant', label: 'Restaurant / Cafe' },
    { value: 'event', label: 'Event Management' },
    { value: 'corporate', label: 'Corporate Office' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.businessType || !formData.phone || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact/business-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Request submitted! Our team will contact you within 24 hours.');
        setFormData({
          name: '',
          businessName: '',
          businessType: '',
          phone: '',
          email: '',
          message: '',
        });
        onClose();
      } else {
        toast.error(data.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#00261b]">Business Service Request</h2>
            <p className="text-gray-600 text-sm mt-1">Get a customized quote for your business</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00261b] focus:ring-1 focus:ring-[#00261b]"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00261b] focus:ring-1 focus:ring-[#00261b]"
              placeholder="Your Business Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type *
            </label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00261b] focus:ring-1 focus:ring-[#00261b]"
            >
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
                <option key={type.value} value={type.label}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00261b] focus:ring-1 focus:ring-[#00261b]"
              placeholder="+971 XX XXX XXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00261b] focus:ring-1 focus:ring-[#00261b]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message / Requirements
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00261b] focus:ring-1 focus:ring-[#00261b]"
              placeholder="Tell us about your business requirements..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00261b] text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              'Submit Request'
            )}
          </button>
        </form>
      </div>
    </>
  );
}

function CommercialSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const features = [
    { icon: TbBuilding, title: 'Hotels & Spas', desc: 'Fresh linens, towels, and guest essentials maintained to premium hospitality standards.' },
    { icon: TbBuildingStore, title: 'Restaurants', desc: 'Professional care for table linens, uniforms, and hospitality fabrics.' },
    { icon: TbCalendarEvent, title: 'Events & Catering', desc: 'Reliable fabric and garment care support for events and special occasions.' },
    { icon: TbBriefcase, title: 'Corporate & Offices', desc: 'Convenient uniform and fabric care solutions for workplaces and teams.' },
  ];

  return (
    <>
      <section ref={sectionRef} className="py-20 bg-[#00261b] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">COMMERCIAL CARE SOLUTIONS</h2>
            <p className="text-[#79a894] text-lg mb-8 leading-relaxed">Scalable garment and fabric care solutions for businesses across Dubai. Laundrica supports hospitality, corporate, and commercial requirements with reliable pickup, delivery, and professionally managed care services designed to maintain consistent quality and presentation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-3 group cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="text-[#bcedd7] text-xl group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold group-hover:text-[#bcedd7] transition-colors">{feature.title}</p>
                    <p className="text-sm text-[#79a894] group-hover:text-white/80 transition-colors">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 bg-white text-[#00261b] rounded-xl font-bold hover:bg-[#bcedd7] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Request Business Service
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-square group cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="/images/requestbuisnessservice.jpeg"
              alt="Commercial Laundry"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <motion.div
              className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.div>
        </div>
      </section>

      <BusinessRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

// Why Laundrica Section with hover effects
function WhyLaundrica() {
  const benefits = [
    { text: 'Fabric-appropriate handling', desc: 'Every item is carefully sorted based on fabric type and color to ensure safe and consistent care.' },
    { text: 'Consistent quality checks', desc: 'Each order goes through multiple inspection steps before being prepared for delivery.' },
    { text: 'Reliable turnaround time', desc: 'Structured pickup and delivery schedules designed for consistency and convenience.' },
    { text: 'Easy pickup & delivery', desc: 'Simple scheduling with doorstep collection and delivery across Dubai.' },
    { text: 'Everyday usability', desc: 'Premium care designed for regular use with accessible and transparent pricing.' },
    { text: 'Scalable service support', desc: 'Built to handle individual, family, and business requirements with ease across Dubai.' },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:w-1/3"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#00261b] mb-6">THE LAUNDRICA STANDARD</h2>
            <p className="text-[#5c5f5e] leading-relaxed">Why customers across Dubai trust our care.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8"
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.text}
                className="space-y-2 group cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-bold text-[#00261b] flex items-center gap-2 group-hover:text-emerald-700 transition-colors">
                  <TbCircleCheck className="text-emerald-600 group-hover:scale-110 transition-transform" />
                  {benefit.text}
                </p>
                <p className="text-sm text-[#5c5f5e] group-hover:text-gray-700 transition-colors">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// About Section with hover effects
function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-20 bg-[#edeeeb]" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 lg:p-16 shadow-xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        >
          <motion.div
            className="lg:w-1/2 overflow-hidden rounded-2xl group cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyX6I42VtuMvpG_fjvHENno8OFXNmaac40XuQja4TCLWcUU9RH3OTDWp76joEn_yaG4OJSZFZufUWdT-lFHypcnNWPLLighIqN24K8z6HkcG3xv69vOKPj3OfVK7mkdDoQnqRFAaljwLSPszzYGst-cgZtoB1vI0iPxcKNDj-Mqf3ZjCqEVK11i562tWLUIxUZ1pJADlp1f4ocPhxJb2CI7pkzti5qfdAIG6aIr3WOoZp-esmZpjc2PLHxMKqMyVsYhXvUp4YbNWOz"
              alt="About Laundrica"
              className="rounded-2xl w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#00261b] mb-6">ABOUT LAUNDRICA</h2>
            <p className="text-lg text-[#5c5f5e] mb-6 leading-relaxed">Premium Laundry Service in Dubai | Pickup & Delivery</p>
            <p className="text-base text-[#5c5f5e] leading-relaxed">Laundrica is a premium laundry service in Dubai offering convenient laundry pickup and delivery across the city for washing, dry cleaning, wash & fold, ironing, carpet care, and shoe cleaning. We provide reliable laundry pickup and delivery in Dubai designed for modern lifestyles, ensuring every garment and fabric item is handled with care and returned fresh, clean, and ready to use.</p>
            <p className="text-base text-[#5c5f5e] leading-relaxed mt-4">We specialize in laundry service Dubai and laundry pickup and delivery Dubai solutions that combine convenience, affordability, and premium garment care for individuals, families, and businesses across the UAE.</p>
            <p className="text-base text-[#5c5f5e] leading-relaxed mt-4">From everyday wash and fold laundry in Dubai to professional dry cleaning, steam ironing, carpet cleaning, and shoe care services, Laundrica delivers consistent quality and a seamless laundry pickup experience across Dubai.</p>

            {/* Buttons moved inside the content column */}
            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/services">
                <motion.button
                  className="px-6 sm:px-8 py-3.5 bg-[#00261b] text-white rounded-xl font-semibold hover:opacity-90 transition cursor-pointer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Online Booking
                </motion.button>
              </Link>
              <a href="https://wa.me/971508203555?text=Hi%20I%20need%20Laundrica%20to%20sort%20my%20laundry%20WB" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="px-6 sm:px-8 py-3.5 bg-white border border-gray-200 text-[#00261b] rounded-xl font-semibold hover:bg-gray-50 transition flex items-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaWhatsapp className="text-emerald-600 text-xl" />
                  WhatsApp Booking
                </motion.button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section with hover effects
function TestimonialsSection() {
  const testimonials = [
    { text: '"The most reliable service I\'ve found in Marina. My suits return looking better than when I bought them. Truly premium."', name: 'James Kensington', role: 'Marina Resident' },
    { text: '"Laundrica handles our boutique hotel linens with incredible care. Their commercial service is unmatched in Dubai."', name: 'Sarah ', role: 'Hospitality Manager' },
    { text: '"Finally, a dry cleaner that understands silk. The pickup process is so easy, I never have to worry about my weekend wear."', name: 'Elena Rodriguez', role: 'Fashion Designer' },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#00261b] mb-4">Trust Across the Emirates</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-6 md:p-8 rounded-2xl bg-[#f9faf7] border border-gray-100 hover:border-[#bcedd7] hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex text-emerald-600 mb-5 gap-1">
                {[...Array(5)].map((_, i) => (
                  <TbStar key={i} className="fill-emerald-600 group-hover:scale-110 transition-transform" />
                ))}
              </div>
              <p className="text-[#00261b] font-medium mb-6 flex-grow italic group-hover:text-emerald-700 transition-colors">{testimonial.text}</p>
              <div>
                <p className="font-bold text-[#00261b] group-hover:text-emerald-700 transition-colors">{testimonial.name}</p>
                <p className="text-sm text-[#5c5f5e] group-hover:text-gray-700 transition-colors">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section with hover effects
function CTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-[#00261b] rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <motion.div
              className="absolute top-0 left-0 w-64 h-64 bg-[#bcedd7] rounded-full blur-[100px]"
              animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px]"
              animate={{ scale: [1, 1.3, 1], x: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-6 group-hover:scale-105 transition-transform duration-500">BOOK YOUR SERVICE TODAY</h2>
            <p className="text-[#79a894] text-lg mb-10 max-w-xl mx-auto group-hover:text-white/80 transition-colors">Experience effortless fabric care with premium laundry and dry cleaning pickup & delivery across Dubai. Fast, reliable, and designed for everyday convenience—schedule your pickup in just a few clicks and enjoy fresh, perfectly finished garments delivered to your doorstep.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services">
                <motion.button
                  className="px-8 py-3.5 bg-white text-[#00261b] rounded-xl font-semibold hover:bg-[#bcedd7] transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Online Booking
                </motion.button>
              </Link>
              <a href="https://wa.me/971508203555?text=Hi%20I%20need%20Laundrica%20to%20sort%20my%20laundry%20WB" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="px-8 py-3.5 border border-white/30 bg-white/5 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaWhatsapp className="text-xl group-hover:scale-110 transition-transform" />
                  WhatsApp Booking
                </motion.button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Hero Section with hover effects
function HeroSection() {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });

  return (
    <section ref={heroRef} className="relative min-h-[800px] lg:min-h-[921px] flex items-center overflow-hidden pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="z-10"
        >
          <motion.span
            className="inline-block px-4 py-1.5 bg-[#bcedd7] text-[#214f3f] rounded-full text-sm mb-6 cursor-default"
            whileHover={{ scale: 1.05 }}
          >
            Premium Care in Dubai
          </motion.span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#00261b] mb-6 leading-tight">Premium Laundry & Dry Cleaning Pickup & Delivery in Dubai</h1>
          <p className="text-lg text-[#5c5f5e] mb-8 max-w-lg">Luxury freshness within reach. Premium garment and fabric care at affordable prices with professional washing, dry cleaning, stain removal, ironing, carpet care, and shoe care services. Every item is handled with expert care and attention, ensuring it is returned fresh, hygienic, and perfectly finished—delivered straight to your doorstep anywhere in Dubai.</p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/services">
              <motion.button
                className="px-6 sm:px-8 py-3.5 bg-[#00261b] text-white rounded-xl font-semibold hover:opacity-90 transition cursor-pointer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Online Booking
              </motion.button>
            </Link>
            <a href="https://wa.me/971508203555?text=Hi%20I%20need%20Laundrica%20to%20sort%20my%20laundry%20WB" target="_blank" rel="noopener noreferrer">
              <motion.button
                className="px-6 sm:px-8 py-3.5 bg-white border border-gray-200 text-[#00261b] rounded-xl font-semibold hover:bg-gray-50 transition flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaWhatsapp className="text-emerald-600 text-xl" />
                WhatsApp Booking
              </motion.button>
            </a>
          </div>
          <div className="space-y-5 pt-5 border-t border-gray-100">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Our Services</p>
              <p className="text-sm font-medium text-[#00261b]/70">Wash & Press • Dry Cleaning • Wash & Fold • Steam Ironing • Shoe Care • Carpet Care</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">The Process</p>
              <p className="text-sm font-medium text-[#00261b] flex items-center gap-2 flex-wrap">
                Pickup <TbArrowRight className="text-xs" /> Care Processing <TbArrowRight className="text-xs" /> Quality Check <TbArrowRight className="text-xs" /> Delivery
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative group"
        >
          <motion.div
            className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-aoAAnkjjQt19efSZRO767z2VuQrDxjdIUzszcRmWkd3WYmW_-XM6VBVhWIVJmZxGrUH1ZYmWeNmZLe66K-CTAAKsh728s2SFb7FVtizkYb9OHvqPgiSGoHbngxXx_ygofpAcrp0pFB8Ql8yeJ5OaGv54zSQDY4UxNX_f6035AqVf3SOyigizbTdMS7o5g3S4_fVp4XiRGlvupVXd1-bI3iGf_yek7nZSxpCYx63O90fL0RYfVcLdYzgVCKEQeqVj6KAirF9bZqd3"
              alt="Luxury Fabric Care"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
          <motion.div
            className="absolute -bottom-5 -left-5 bg-white p-5 rounded-2xl shadow-xl max-w-[180px] cursor-default"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <p className="text-2xl font-semibold text-[#00261b] mb-1">24h</p>
            <p className="text-xs text-[#5c5f5e]">Express turnaround available for your essentials.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Main Page Component
export default function Home() {
  return (
    <main className="bg-[#f9faf7] text-[#1a1c1b] font-['Inter'] overflow-x-hidden">
      <Header />
      <HeroSection />
      <TrustStrip />
      <HowItWorks />
      <ServicesGrid />
      <CommercialSection />
      <WhyLaundrica />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <WhatsAppButton
        phoneNumber="971508203555"
        message="Hi I need Laundrica to sort my laundry WB"
        position="bottom-right"
        size="medium"
        showTooltip={true}
        tooltipText="Chat with us on WhatsApp"
      />
    </main>
  );
}