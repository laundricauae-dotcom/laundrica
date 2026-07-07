// lib/analytics-api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TrackEventParams {
    eventType: string;
    eventData?: Record<string, any>;
    consent?: {
        analytics: boolean;
        marketing: boolean;
        performance: boolean;
    };
}

export async function trackEvent({ eventType, eventData = {}, consent }: TrackEventParams) {
    try {
        const response = await fetch(`${API_URL}/analytics/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': localStorage.getItem('sessionId') || '',
                'X-Cookie-Consent': localStorage.getItem('cookieConsent') || '',
            },
            body: JSON.stringify({
                eventType,
                eventData,
                consent,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to track event');
        }

        return await response.json();
    } catch (error) {
        console.error('Analytics tracking error:', error);
        // Don't throw - analytics should not break the UI
        return null;
    }
}