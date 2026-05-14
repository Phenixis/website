'use client';

import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ViewCounterProps {
    slug: string;
    className?: string;
}

export function ViewCounter({ slug, className }: Readonly<ViewCounterProps>) {
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

    return (
        <p className={cn("flex items-center gap-1", className)}>
        {
            isLoading ? (
                <span className="animate-pulse">...</span>
            ) : (
                views ?? 0
            )
        }
            <Eye className="size-4" />
        </p>
    );
}
