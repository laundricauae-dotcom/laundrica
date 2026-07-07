'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import {
    Cookie,
    Shield,
    Info,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicyPage() {
    return (
        <main className="flex flex-col min-h-screen bg-[#f9faf7]">
            <Header />

            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Cookie className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#00261b] mb-4">Cookie Policy</h1>
                        <p className="text-[#5c5f5e]">Last Updated: 12 May 2026</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#f9faf7] rounded-xl p-6">
                            <h2 className="text-xl font-bold text-[#00261b] mb-3">What Are Cookies?</h2>
                            <p className="text-[#5c5f5e]">
                                Cookies are small text files stored on your device when you visit a website.
                                They help us improve your experience by remembering your preferences and understanding how you use our site.
                            </p>
                        </div>

                        <div className="bg-[#f9faf7] rounded-xl p-6">
                            <h2 className="text-xl font-bold text-[#00261b] mb-3">How We Use Cookies</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-[#00261b] flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        Essential Cookies
                                    </h3>
                                    <p className="text-sm text-[#5c5f5e] ml-6">
                                        Required for basic site functionality like security and authentication. Cannot be disabled.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#00261b] flex items-center gap-2">
                                        <Info className="w-4 h-4 text-emerald-600" />
                                        Analytics Cookies
                                    </h3>
                                    <p className="text-sm text-[#5c5f5e] ml-6">
                                        Help us understand how visitors interact with our site to improve user experience.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#00261b] flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-emerald-600" />
                                        Marketing Cookies
                                    </h3>
                                    <p className="text-sm text-[#5c5f5e] ml-6">
                                        Used to deliver relevant advertisements and track campaign performance.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f9faf7] rounded-xl p-6">
                            <h2 className="text-xl font-bold text-[#00261b] mb-3">Your Choices</h2>
                            <p className="text-[#5c5f5e]">
                                You can manage your cookie preferences at any time by clicking the cookie icon
                                in the bottom-left corner of our website or by using our cookie consent banner.
                            </p>
                        </div>

                        <div className="bg-[#edeeeb] rounded-xl p-6 text-center">
                            <p className="text-sm text-[#00261b] font-medium">
                                By continuing to use Laundrica, you agree to our use of cookies as described in this policy.
                            </p>
                            <Link href="/" className="inline-block mt-4 px-6 py-2 bg-[#00261b] text-white rounded-lg hover:bg-[#003d2e] transition">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}