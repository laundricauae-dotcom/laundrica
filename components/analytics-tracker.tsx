'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import analyticsManager from '@/lib/analytics-manager';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        analyticsManager.initializeAnalytics();
    }, []);

    useEffect(() => {
        if (!pathname) return;

        const url =
            pathname +
            (searchParams.toString() ? `?${searchParams.toString()}` : '');

        analyticsManager.trackPageView(url);
    }, [pathname, searchParams]);

    return null;
}