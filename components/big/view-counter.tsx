'use client';

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ViewCounterProps {
    readonly slug: string;
}

export function ViewCounter({ slug }: Readonly<ViewCounterProps>) {
    const [views, setViews] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const trackView = async () => {
            try {
                // Increment view and get the updated count
                const response = await fetch('/views', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ slug }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setViews(data.views);
                } else {
                    console.error('Failed to track view');
                    setViews(0);
                }
            } catch (error) {
                console.error('Error tracking view:', error);
                setViews(0);
            } finally {
                setIsLoading(false);
            }
        };

        trackView();
    }, [slug]);

    if (isLoading) {
        return (
            <p className="flex items-center gap-1">
                <span className="animate-pulse">...</span>
                <Eye className="size-4" />
            </p>
        );
    }

    return (
        <p className="flex items-center gap-1">
            {views ?? 0}
            <Eye className="size-4" />
        </p>
    );
}
