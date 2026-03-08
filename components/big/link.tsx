'use client';

import React from "react";
import LinkPrimitive from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";
import { cn } from "@/lib/utils";
import { useStyle } from "@/contexts/style-context";
import type { StyleVariant } from "@/lib/style-flag";

// Discriminated union for the desired behavior:
type LinkWithUnderline = {
    underlined?: true;
    dashed?: boolean;
    onlyOnHover?: boolean;
    className?: string;
};

type LinkWithoutUnderline = {
    underlined: false;
    dashed?: never;
    onlyOnHover?: never;
    className?: string;
};

// Final LinkProps type (combines Next.js Link props + children + the discriminated union)
export type LinkProps = NextLinkProps & {
    children: React.ReactNode;
} & (LinkWithUnderline | LinkWithoutUnderline);

const record: Record<StyleVariant, React.ComponentType<LinkProps>> = {
    classical: LinkClassical,
    modern: LinkModern,
};

/**
 * Renders the appropriate Link variant based on the active style.
 */
export function Link(props: LinkProps) {
    const { currentStyle } = useStyle();
    const Component = record[currentStyle] || LinkClassical;
    return <Component {...props} />;
}

export function LinkClassical({
    children,
    underlined = true,
    dashed = false,
    onlyOnHover = false,
    className,
    ...props
}: LinkProps) {
    let underlineClass = "";
    if (underlined) {
        underlineClass = onlyOnHover ? "lg:hover:underline" : "underline";
    }
    return (
        <LinkPrimitive
            {...props}
            className={cn(
                "duration-1000 transition-all underline-offset-6 lg:hover:text-black dark:lg:hover:text-white decoration-neutral-400 lg:hover:decoration-neutral-600 dark:decoration-neutral-600 dark:lg:hover:decoration-neutral-400",
                underlineClass,
                dashed ? "decoration-dashed" : "",
                className
            )}
        >
            {children}
        </LinkPrimitive>
    );
}

/**
 * Modern variant: uses a primary-colored accent underline with a tighter
 * offset and a subtle muted-to-foreground text transition on hover.
 */
export function LinkModern({
    children,
    className,
    ...props
}: LinkProps) {
    return (
        <LinkPrimitive
            {...props}
            className={cn(
                "duration-100 hover:rounded-xl p-1 border-b-2 border-blue-500/70 hover:border-2",
                "text-black hover:bg-blue-500/70",
                className
            )}
        >
            {children}
        </LinkPrimitive>
    );
}
