// components/cookie-consent.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cookie,
    Shield,
    X,
    Check,
    Settings,
    Info,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

type ConsentPreferences = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    performance: boolean;
};

const defaultPreferences: ConsentPreferences = {
    necessary: true, // Always required, cannot be disabled
    analytics: false,
    marketing: false,
    performance: false,
};

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL ;

// Track event function
const trackEvent = async (eventType: string, eventData: any = {}, consent: any = null) => {
    try {
        const sessionId = localStorage.getItem('sessionId') ||
            crypto.randomUUID ? crypto.randomUUID() :
            Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        if (!localStorage.getItem('sessionId')) {
            localStorage.setItem('sessionId', sessionId);
        }

        const response = await fetch(`${API_URL}/analytics/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId,
                'X-Cookie-Consent': localStorage.getItem('cookieConsent') || '',
            },
            body: JSON.stringify({
                eventType,
                eventData,
                consent,
            }),
        });

        if (!response.ok) {
            console.warn('Failed to track event');
        }

        return await response.json();
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return null;
    }
};

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    const [preferences, setPreferences] = useState<ConsentPreferences>(defaultPreferences);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        necessary: true,
        analytics: false,
        marketing: false,
        performance: false,
    });

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Show banner after a short delay with animation
            const timer = setTimeout(() => {
                setShowBanner(true);
                setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            try {
                const parsed = JSON.parse(consent);
                setPreferences(parsed);
                setHasInteracted(true);
                setIsVisible(false);
            } catch (e) {
                setShowBanner(true);
                setIsVisible(true);
            }
        }
    }, []);

    // Track page view when consent is given
    useEffect(() => {
        if (hasInteracted && preferences.analytics) {
            trackEvent('page_view', {
                url: window.location.pathname,
                title: document.title,
            }, preferences);
        }
    }, [hasInteracted, preferences]);

    const handleAcceptAll = async () => {
        const allAccepted: ConsentPreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            performance: true,
        };
        await saveConsent(allAccepted, 'accept_all');
    };

    const handleRejectAll = async () => {
        const allRejected: ConsentPreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            performance: false,
        };
        await saveConsent(allRejected, 'reject_all');
    };

    const handleSavePreferences = async () => {
        await saveConsent(preferences, 'customize');
    };

    const saveConsent = async (prefs: ConsentPreferences, action: string) => {
        // Save to localStorage
        localStorage.setItem('cookieConsent', JSON.stringify(prefs));
        setPreferences(prefs);
        setShowBanner(false);
        setHasInteracted(true);
        setShowCustomize(false);
        setIsVisible(false);

        // Track consent event
        await trackEvent('consent_given', {
            consent_action: action,
            preferences: prefs,
            timestamp: new Date().toISOString(),
        }, prefs);

        // Dispatch event for analytics scripts to react
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
                detail: prefs
            }));

            // Reload analytics if consent was given
            if (prefs.analytics) {
                window.dispatchEvent(new Event('analyticsInit'));
            }
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Don't show anything if user has already interacted
    if (hasInteracted && !showBanner) {
        return null;
    }

    return (
        <AnimatePresence>
            {showBanner && (
                <>
                    {/* Blur Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md"
                        onClick={() => { }} // Prevent click-through
                    />

                    {/* Cookie Consent Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                                type: 'spring',
                                damping: 25,
                                stiffness: 300,
                            }
                        }}
                        exit={{
                            opacity: 0,
                            y: 50,
                            scale: 0.95,
                            transition: { duration: 0.2 }
                        }}
                        className="fixed bottom-0 left-0 right-0 z-[10000] bg-white shadow-2xl border-t-4 border-emerald-500 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                            {!showCustomize ? (
                                // Main Banner View
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                                    {/* Icon and Text */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                                <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-[#00261b]">
                                                    🍪 We Value Your Privacy
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                    We use cookies to enhance your experience, analyze traffic, and personalize content.
                                                    You can choose which cookies you allow.
                                                </p>
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    <Link
                                                        href="/privacy"
                                                        className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors"
                                                    >
                                                        <Shield className="w-3 h-3" />
                                                        Privacy Policy
                                                    </Link>
                                                    <Link
                                                        href="/terms"
                                                        className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors"
                                                    >
                                                        <Info className="w-3 h-3" />
                                                        Terms of Service
                                                    </Link>
                                                    <Link
                                                        href="/cookie-policy"
                                                        className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                        Cookie Policy
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
                                        <button
                                            onClick={handleRejectAll}
                                            className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Reject All
                                        </button>
                                        <button
                                            onClick={() => setShowCustomize(true)}
                                            className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="hidden sm:inline">Customize</span>
                                            <span className="sm:hidden">Custom</span>
                                        </button>
                                        <button
                                            onClick={handleAcceptAll}
                                            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#00261b] text-white rounded-lg font-medium hover:bg-[#003d2e] transition-colors flex items-center gap-2 text-xs sm:text-sm"
                                        >
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Accept All
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Customize View
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                            <h3 className="text-base sm:text-lg font-bold text-[#00261b]">Customize Your Preferences</h3>
                                        </div>
                                        <button
                                            onClick={() => setShowCustomize(false)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        >
                                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>

                                    {/* Cookie Categories */}
                                    <div className="space-y-3">
                                        {/* Necessary Cookies - Always Required */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div
                                                className="flex items-start justify-between p-3 sm:p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => toggleSection('necessary')}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <Check className="w-3 h-3 text-emerald-600" />
                                                        </div>
                                                        <span className="font-medium text-[#00261b] text-sm sm:text-base">Essential Cookies</span>
                                                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Always Active</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Required for core functionality like security, authentication, and basic site operations.
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                                                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                                                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                                                    </div>
                                                    {expandedSections.necessary ? (
                                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            {expandedSections.necessary && (
                                                <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
                                                    <p className="text-xs text-gray-600">
                                                        These cookies are essential for the website to function properly. They enable basic
                                                        features like page navigation, security, and access to secure areas. The website
                                                        cannot function properly without these cookies.
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">session_id</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">csrf_token</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">auth_token</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Analytics Cookies */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div
                                                className="flex items-start justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => toggleSection('analytics')}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-[#00261b] text-sm sm:text-base">Analytics Cookies</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Help us understand how visitors interact with our site to improve user experience.
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreferences(prev => ({ ...prev, analytics: !prev.analytics }));
                                                        }}
                                                        className={`w-10 h-5 rounded-full transition-colors relative ${preferences.analytics ? 'bg-emerald-500' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${preferences.analytics ? 'translate-x-5' : 'translate-x-0.5'
                                                            }`} />
                                                    </button>
                                                    {expandedSections.analytics ? (
                                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            {expandedSections.analytics && (
                                                <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
                                                    <p className="text-xs text-gray-600">
                                                        These cookies collect information about how you use our website, which pages you visit,
                                                        and any errors you experience. This helps us improve our website and provide better
                                                        user experience.
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">_ga</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">_gid</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">_gat</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Marketing Cookies */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div
                                                className="flex items-start justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => toggleSection('marketing')}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-[#00261b] text-sm sm:text-base">Marketing Cookies</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Used to deliver relevant advertisements and track campaign performance.
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreferences(prev => ({ ...prev, marketing: !prev.marketing }));
                                                        }}
                                                        className={`w-10 h-5 rounded-full transition-colors relative ${preferences.marketing ? 'bg-emerald-500' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${preferences.marketing ? 'translate-x-5' : 'translate-x-0.5'
                                                            }`} />
                                                    </button>
                                                    {expandedSections.marketing ? (
                                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            {expandedSections.marketing && (
                                                <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
                                                    <p className="text-xs text-gray-600">
                                                        These cookies are used to track your browsing habits and deliver personalized
                                                        advertisements. They help us measure the effectiveness of our marketing campaigns.
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">_fbp</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">_gcl_au</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">_uetvid</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Performance Cookies */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div
                                                className="flex items-start justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => toggleSection('performance')}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-[#00261b] text-sm sm:text-base">Performance Cookies</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Collect information about site performance and speed to optimize loading times.
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreferences(prev => ({ ...prev, performance: !prev.performance }));
                                                        }}
                                                        className={`w-10 h-5 rounded-full transition-colors relative ${preferences.performance ? 'bg-emerald-500' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${preferences.performance ? 'translate-x-5' : 'translate-x-0.5'
                                                            }`} />
                                                    </button>
                                                    {expandedSections.performance ? (
                                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            {expandedSections.performance && (
                                                <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
                                                    <p className="text-xs text-gray-600">
                                                        These cookies help us understand how our website performs and identify technical
                                                        issues that may affect user experience. They help us optimize loading times and
                                                        overall performance.
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">_pt</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">perf</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-500" />
                                            <span className="text-xs text-gray-500">
                                                Essential cookies are always active
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            <button
                                                onClick={() => setShowCustomize(false)}
                                                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleRejectAll}
                                                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                Reject All
                                            </button>
                                            <button
                                                onClick={handleSavePreferences}
                                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#00261b] text-white rounded-lg font-medium hover:bg-[#003d2e] transition-colors text-xs sm:text-sm"
                                            >
                                                Save Preferences
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}