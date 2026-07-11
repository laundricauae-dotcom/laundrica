'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import analyticsManager from '@/lib/analytics-manager';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Initialize analytics on mount
        analyticsManager.initializeAnalytics();
    }, []);

    useEffect(() => {
        // Track page views on route change
        if (pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
            analyticsManager.trackPageView(url);
        }
    }, [pathname, searchParams]);

    return <>{children}</>;
}