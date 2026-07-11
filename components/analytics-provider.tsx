'use client';

import { Suspense } from 'react';
import AnalyticsTracker from './analytics-tracker';

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
}