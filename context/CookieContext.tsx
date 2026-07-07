'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type ConsentPreferences = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    performance: boolean;
};

interface CookieContextType {
    preferences: ConsentPreferences;
    hasConsent: (type: keyof ConsentPreferences) => boolean;
    updatePreferences: (newPrefs: Partial<ConsentPreferences>) => void;
    isConsentGiven: boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
        performance: false,
    });
    const [isConsentGiven, setIsConsentGiven] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('cookieConsent');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setPreferences(parsed);
                setIsConsentGiven(true);
            } catch (e) {
                // Invalid JSON
            }
        }
    }, []);

    const hasConsent = (type: keyof ConsentPreferences): boolean => {
        return preferences[type] || false;
    };

    const updatePreferences = (newPrefs: Partial<ConsentPreferences>) => {
        const updated = { ...preferences, ...newPrefs };
        setPreferences(updated);
        localStorage.setItem('cookieConsent', JSON.stringify(updated));
        setIsConsentGiven(true);

        // Dispatch event for analytics
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: updated }));
    };

    return (
        <CookieContext.Provider value={{ preferences, hasConsent, updatePreferences, isConsentGiven }}>
            {children}
        </CookieContext.Provider>
    );
}

export function useCookieConsent() {
    const context = useContext(CookieContext);
    if (context === undefined) {
        throw new Error('useCookieConsent must be used within a CookieProvider');
    }
    return context;
}