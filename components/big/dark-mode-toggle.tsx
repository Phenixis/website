"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStyle } from "@/contexts/style-context"
import { type StyleVariant } from "@/lib/style-flag"
import { HoverExpandPill } from "@/components/ui/hover-expand-pill"

// Small helpers to read/write the 'theme' cookie from the browser.
// We prefer a cookie to keep SSR (server) and CSR (client) in sync.
const setThemeCookie = (theme: 'light' | 'dark') => {
    try {
        // Persist for 1 year; path=/ so it's available app-wide
        const maxAge = 60 * 60 * 24 * 365;
        document.cookie = `theme=${theme}; path=/; max-age=${maxAge}`;
    } catch {
        // No-op: if cookies are disabled, we still toggle class client-side
    }
};

const getThemeCookie = (): 'light' | 'dark' | null => {
    try {
        const match = new RegExp(/(?:^|; )theme=([^;]+)/).exec(document.cookie);
        const value = match ? decodeURIComponent(match[1]) : null;
        return value === 'dark' || value === 'light' ? value : null;
    } catch {
        return null;
    }
};

const record: Record<StyleVariant, React.ComponentType<{ className?: string }>> = {
    classical: DarkModeToggleClassical,
    modern: DarkModeToggleModern,
}

export default function DarkModeToggle({
    className
}: Readonly<{
    className?: string
}>) {
    const { currentStyle } = useStyle();

    const Component = record[currentStyle] || DarkModeToggleClassical;

    return <Component className={className} />;
}

function DarkModeToggleClassical({
    className
}: Readonly<{
    className?: string
}>) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const toggleDarkMode = () => {
        const nextIsDark = !isDarkMode;
        setIsDarkMode(nextIsDark);

        // Toggle class on <html> for Tailwind's dark mode
        if (nextIsDark) {
            document.documentElement.classList.add('dark');
            setThemeCookie('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setThemeCookie('light');
        }
    }

    useEffect(() => {
        // Initialize from cookie if present, otherwise read current DOM class.
        // Root layout sets the class from the cookie on SSR to avoid FOUC.
        const cookieTheme = getThemeCookie();
        const initialIsDark = cookieTheme
            ? cookieTheme === 'dark'
            : document.documentElement.classList.contains('dark');

        setIsDarkMode(initialIsDark);

        // Ensure the class matches the resolved initial state (idempotent)
        if (initialIsDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [])
    
    return (
        <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className={cn(
                "lg:hover:rotate-46 duration-1000 flex align-middle relative transition-all text-neutral-800 lg:hover:text-neutral-500 dark:text-neutral-200 dark:lg:hover:text-neutral-500 cursor-pointer",
                className,
            )}
        >
            {isDarkMode ? <Moon /> : <Sun />}
        </button>
    )
}

function DarkModeToggleModern({
    className
}: Readonly<{
    className?: string
}>) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const applyTheme = (nextIsDark: boolean) => {
        setIsDarkMode(nextIsDark);

        // Toggle class on <html> for Tailwind's dark mode
        if (nextIsDark) {
            document.documentElement.classList.add('dark');
            setThemeCookie('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setThemeCookie('light');
        }
    }

    useEffect(() => {
        // Initialize from cookie if present, otherwise read current DOM class.
        const cookieTheme = getThemeCookie();
        const initialIsDark = cookieTheme
            ? cookieTheme === 'dark'
            : document.documentElement.classList.contains('dark');

        setIsDarkMode(initialIsDark);

        // Ensure the class matches the resolved initial state (idempotent)
        if (initialIsDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [])

    const pillOptions = [
        {
            value: 'light',
            label: 'Light',
            icon: <Sun className="w-4 h-4" />,
            onClick: () => applyTheme(false),
            // Light is always on the left side of the pill
            side: 'left' as const,
        },
        {
            value: 'dark',
            label: 'Dark',
            icon: <Moon className="w-4 h-4" />,
            onClick: () => applyTheme(true),
            // Dark is always on the right side of the pill
            side: 'right' as const,
        },
    ];

    return (
        <HoverExpandPill
            options={pillOptions}
            currentValue={isDarkMode ? 'dark' : 'light'}
            className={cn(className)}
        />
    )
}
