type ConsentPreferences = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    performance: boolean;
};

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
        fbq?: (...args: any[]) => void;
    }
}

class AnalyticsManager {
    private static instance: AnalyticsManager;
    private consent: ConsentPreferences | null = null;

    private constructor() {
        // Load consent from localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cookieConsent');
            if (saved) {
                try {
                    this.consent = JSON.parse(saved);
                } catch (e) {
                    this.consent = null;
                }
            }
        }

        // Listen for consent updates
        if (typeof window !== 'undefined') {
            window.addEventListener('cookieConsentUpdated', ((e: CustomEvent) => {
                this.consent = e.detail;
                this.initializeAnalytics();
            }) as EventListener);
        }
    }

    static getInstance(): AnalyticsManager {
        if (!AnalyticsManager.instance) {
            AnalyticsManager.instance = new AnalyticsManager();
        }
        return AnalyticsManager.instance;
    }

    hasConsent(type: keyof ConsentPreferences): boolean {
        if (!this.consent) return false;
        return this.consent[type] || false;
    }

    initializeAnalytics() {
        if (typeof window === 'undefined') return;

        // Initialize Google Analytics
        if (this.hasConsent('analytics')) {
            this.initGoogleAnalytics();
        }

        // Initialize Facebook Pixel
        if (this.hasConsent('marketing')) {
            this.initFacebookPixel();
        }

        // Initialize other analytics as needed
    }

    private initGoogleAnalytics() {
        if (typeof window === 'undefined') return;

        // Your Google Analytics initialization
        if (!window.gtag) {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () {
                window.dataLayer?.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '');
        }
    }

    private initFacebookPixel() {
        if (typeof window === "undefined") return;

        if (window.fbq) return;

        ((f: any, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Element) => {
            if (f.fbq) return;

            n = f.fbq = function () {
                if (n.callMethod) {
                    n.callMethod.apply(n, arguments);
                } else {
                    n.queue.push(arguments);
                }
            };

            if (!f._fbq) {
                f._fbq = n;
            }

            n.push = n;
            n.loaded = true;
            n.version = "2.0";
            n.queue = [];

            t = b.createElement(e) as HTMLScriptElement;
            t.async = true;
            t.src = "https://connect.facebook.net/en_US/fbevents.js";

            s = b.getElementsByTagName(e)[0];
            s.parentNode?.insertBefore(t, s);
        })(window, document, "script", "");

        window.fbq!(
            "init",
            process.env.NEXT_PUBLIC_FB_PIXEL_ID
        );

        window.fbq!("track", "PageView");
    }

    // Track events
    trackEvent(eventName: string, params?: Record<string, any>) {
        if (typeof window === 'undefined') return;

        // Track with Google Analytics
        if (this.hasConsent('analytics') && window.gtag) {
            window.gtag('event', eventName, params);
        }

        // Track with Facebook Pixel
        if (this.hasConsent('marketing') && window.fbq) {
            window.fbq('trackCustom', eventName, params);
        }
    }

    // Track page view
    trackPageView(url: string) {
        if (typeof window === 'undefined') return;

        if (this.hasConsent('analytics') && window.gtag) {
            window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
                page_path: url,
            });
        }

        if (this.hasConsent('marketing') && window.fbq) {
            window.fbq('track', 'PageView');
        }
    }
}

export default AnalyticsManager.getInstance();