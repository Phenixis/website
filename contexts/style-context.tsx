'use client';

import React, { createContext, useContext, useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { setStyleFlag } from '@/lib/flags';
import type { StyleVariant } from '@/components/style-registry';

interface StyleContextType {
    currentStyle: StyleVariant;
    setStyle: (style: StyleVariant) => void;
    isPending: boolean;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

interface StyleProviderProps {
    readonly children: React.ReactNode;
    readonly initialStyle: StyleVariant;
}

/**
 * Provider component that manages the current style state
 * Handles both optimistic updates and server-side persistence
 */
export function StyleProvider({ children, initialStyle }: StyleProviderProps) {
    const [currentStyle, setCurrentStyle] = useState<StyleVariant>(initialStyle);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const setStyle = (style: StyleVariant) => {
        // Optimistic update
        setCurrentStyle(style);
        
        // Persist to server and refresh
        startTransition(async () => {
            await setStyleFlag(style);
            router.refresh();
        });
    };

    const value = useMemo(
        () => ({ currentStyle, setStyle, isPending }),
        [currentStyle, isPending]
    );

    return (
        <StyleContext.Provider value={value}>
            {children}
        </StyleContext.Provider>
    );
}

/**
 * Hook to access the current style and style setter
 * Must be used within a StyleProvider
 */
export function useStyle() {
    const context = useContext(StyleContext);
    if (context === undefined) {
        throw new Error('useStyle must be used within a StyleProvider');
    }
    return context;
}
