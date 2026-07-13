// app/contact/page.tsx
'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Mail, Phone, Clock, Globe, Instagram, Facebook, CheckCircle, MessageCircle, Send, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { toast } from 'sonner';


const WHATSAPP_NUMBER = "971508203555";


export default function ContactPage() {
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
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

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsSubscribing(true);
        try {
            const response = await fetch('/api/contact/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Subscribed! Check your inbox for updates.');
                setEmail('');
            } else {
                toast.error(data.error || 'Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('Network error. Please try again.');
        } finally {
            setIsSubscribing(false);
        }
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent("Hello! I need assistance with Laundrica services. Can you help me?");
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    return (
       
            <main className="flex flex-col min-h-screen bg-[#f9faf7]">
                <Header />

                <section ref={heroRef} className="relative min-h-[400px] flex items-center overflow-hidden pt-10 pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7 }}
                            className="z-10"
                        >
                            <span className="inline-block px-4 py-1.5 bg-[#bcedd7] text-[#214f3f] rounded-full text-sm mb-6">Get in Touch</span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#00261b] mb-6 leading-tight">
                                We'd Love to <span className="text-emerald-700">Hear From You</span>
                            </h1>
                            <p className="text-lg text-[#5c5f5e] mb-8 leading-relaxed">
                                Have questions about our services? Need a custom quote? Our team is here to help you 7 days a week.
                            </p>
                            <div className="flex flex-wrap gap-4 mb-10">
                                <a href="tel:+971508203555">
                                    <button className="px-8 py-3.5 bg-[#00261b] text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Call Us Now
                                    </button>
                                </a>
                                <button onClick={handleWhatsApp} className="px-8 py-3.5 bg-white border border-gray-200 text-[#00261b] rounded-xl font-semibold hover:bg-gray-50 transition flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4 text-green-600" />
                                    WhatsApp Chat
                                </button>
                            </div>
                            <div className="space-y-5 pt-5 border-t border-gray-100">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Response Time</p>
                                    <p className="text-sm font-medium text-[#00261b]/70">Our team will get back to you within 24 hours</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-[#bcedd7]/30 to-[#00261b]/10 flex items-center justify-center p-8">
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto bg-[#bcedd7] rounded-full flex items-center justify-center mb-6">
                                        <Mail className="w-16 h-16 text-[#00261b]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#00261b]">24/7 Support</h3>
                                    <p className="text-[#5c5f5e] mt-2">support@laundrica.com</p>
                                    <p className="text-[#5c5f5e]">+971 50 820 3555</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl max-w-[200px]">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-[#00261b]">Free Pickup</p>
                                        <p className="text-xs text-gray-500">On all orders</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center"
                        >
                            {[
                                { icon: Phone, title: 'Phone', details: ['+971 50 820 3555'], subtitle: 'Mon-Sat, 10AM - 10PM', color: 'bg-blue-50', iconColor: 'text-blue-600', action: () => window.location.href = 'tel:+971508203555' },
                                { icon: MessageCircle, title: 'WhatsApp', details: ['+971 50 820 3555'], subtitle: 'Fast Response', color: 'bg-green-50', iconColor: 'text-green-600', action: () => { const msg = encodeURIComponent("Hello! I need assistance with Laundrica services."); window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank'); } },
                                { icon: Mail, title: 'Email', details: ['support@laundrica.com'], subtitle: '24/7 Support', color: 'bg-emerald-50', iconColor: 'text-emerald-600', action: () => window.location.href = 'mailto:support@laundrica.com' },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    onClick={item.action}
                                    className="w-full h-full flex flex-col justify-between bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                                >
                                    <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                        <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                                    </div>
                                    <h3 className="font-bold text-xl text-[#00261b] mb-3">{item.title}</h3>
                                    {item.details.map((detail, i) => (
                                        <p key={i} className="text-gray-600 text-sm mb-1">{detail}</p>
                                    ))}
                                    <p className="text-xs text-gray-400 mt-3">{item.subtitle}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block px-4 py-1.5 bg-[#bcedd7] text-[#214f3f] rounded-full text-sm mb-4">Social</span>
                                <h2 className="text-3xl font-bold text-[#00261b] mb-4">Connect With Us</h2>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Follow us on social media for updates, promotions, and laundry tips. We'd love to connect with you!
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {[
                                        { icon: Instagram, name: 'Instagram', handle: 'https://www.instagram.com/laundricauae/', color: 'hover:text-pink-600', bgColor: 'bg-pink-50' },
                                        { icon: Facebook, name: 'Facebook', handle: 'https://www.facebook.com/profile.php?id=61588883551033', color: 'hover:text-blue-600', bgColor: 'bg-blue-50' },
                                        { icon: Music2, name: 'TikTok', handle: 'https://www.tiktok.com/@laundricauae', color: 'hover:text-black', bgColor: 'bg-gray-100' },
                                        { icon: Globe, name: 'Website', handle: 'laundrica.com', color: 'hover:text-emerald-600', bgColor: 'bg-emerald-50' },
                                    ].map((social, idx) => (
                                        <a
                                            key={idx}
                                            href={social.name === "Website" ? `https://${social.handle}` : social.handle}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-lg transition-all group bg-white"
                                        >
                                            <div className={`w-12 h-12 ${social.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <social.icon className={`w-6 h-6 text-gray-600 ${social.color} transition-colors`} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#00261b]">{social.name}</p>
                                                <p className="text-xs text-gray-400">{social.handle}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                <div className="bg-[#edeeeb] rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Send className="w-5 h-5 text-[#00261b]" />
                                        <h3 className="font-semibold text-lg text-[#00261b]">Stay Updated</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Subscribe to our newsletter for exclusive offers and laundry care tips.
                                    </p>
                                    <form onSubmit={handleSubscribe} className="flex gap-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Your email address"
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#00261b] focus:ring-1 focus:ring-[#00261b] text-sm"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isSubscribing}
                                            className="bg-[#00261b] hover:bg-emerald-800 text-white px-5 rounded-xl"
                                        >
                                            {isSubscribing ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                'Subscribe'
                                            )}
                                        </Button>
                                    </form>
                                    <p className="text-xs text-gray-400 mt-3">
                                        No spam, unsubscribe anytime.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        

    );
}