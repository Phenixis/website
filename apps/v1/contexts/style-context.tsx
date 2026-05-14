'use client';

import React, { createContext, useContext, useState, useTransition, useMemo } from 'react';
import { setStyleFlag } from '@/lib/flags';
import type { StyleVariant } from '@/lib/style-flag';

interface StyleContextType {
    currentStyle: StyleVariant;
    setStyle: (style: StyleVariant) => void;
    isPending: boolean;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

interface StyleProviderProps {
    readonly children: React.ReactNode;
    readonly initialStyle: StyleVariant;
    /** CSS class string from next/font applied to <body> for the classical style */
    readonly classicalBodyClass: string;
    /** CSS class string from next/font applied to <body> for the modern style */
    readonly modernBodyClass: string;
}

/**
 * Applies style variant class changes directly to the DOM,
 * mirroring what the server does in layout.tsx based on the cookie.
 * This avoids router.refresh() which causes a hooks count crash in
 * Next.js App Router when called on a not-found page.
 */
function applyStyleToDom(
    style: StyleVariant,
    classicalBodyClass: string,
    modernBodyClass: string,
) {
    // Update <html> class — consumed by Tailwind @custom-variant modern/classical
    document.documentElement.classList.remove('classical', 'modern');
    document.documentElement.classList.add(style);

    // Update <body> font class — next/font class names may be space-separated
    const toClasses = (cls: string) => cls.split(' ').filter(Boolean);
    toClasses(classicalBodyClass).forEach((c) => document.body.classList.remove(c));
    toClasses(modernBodyClass).forEach((c) => document.body.classList.remove(c));
    const nextFontClass = style === 'classical' ? classicalBodyClass : modernBodyClass;
    toClasses(nextFontClass).forEach((c) => document.body.classList.add(c));
}

/**
 * Provider component that manages the current style state.
 * Handles optimistic UI updates (DOM + React context) and persists
 * the choice server-side via a cookie without triggering router.refresh().
 */
export function StyleProvider({
    children,
    initialStyle,
    classicalBodyClass,
    modernBodyClass,
}: StyleProviderProps) {
    const [currentStyle, setCurrentStyle] = useState<StyleVariant>(initialStyle);
    const [isPending, startTransition] = useTransition();

    const setStyle = (style: StyleVariant) => {
        // Optimistic DOM update (keeps <html> and <body> classes in sync client-side)
        applyStyleToDom(style, classicalBodyClass, modernBodyClass);

        // Optimistic React context update
        setCurrentStyle(style);

        // Persist cookie to server (no router.refresh() — DOM is already updated above)
        startTransition(async () => {
            await setStyleFlag(style);
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
