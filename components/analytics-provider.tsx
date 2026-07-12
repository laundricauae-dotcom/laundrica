'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import analyticsManager from '@/lib/analytics-manager';

export default function AnalyticsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    useEffect(() => {
        analyticsManager.initializeAnalytics();
    }, []);

    useEffect(() => {
        if (pathname) {
            analyticsManager.trackPageView(pathname);
        }
    }, [pathname]);

    return <>{children}</>;
}