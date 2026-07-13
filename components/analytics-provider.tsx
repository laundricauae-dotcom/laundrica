'use client';

import { Suspense } from 'react';
import AnalyticsTracker from './analytics-tracker';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import analyticsManager from '@/lib/analytics-manager';

export default function AnalyticsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Suspense fallback={null}>
                <AnalyticsTracker />
            </Suspense>

            {children}
        </>
    );

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