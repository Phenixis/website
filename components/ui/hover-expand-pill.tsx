'use client';

import { useStyle } from "@/contexts/style-context";
import { cn } from "@/lib/utils";
import NextLink from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

// ─── Public types ─────────────────────────────────────────────────────────────

export interface HoverExpandPillOption {
    /** Unique identifier for the option */
    value: string;
    /** Display label */
    label: string;
    /** Optional icon rendered before the label */
    icon?: React.ReactNode;
    /** Navigation target — renders an anchor tag when provided */
    href?: string;
    /** Action callback — used when href is not provided */
    onClick?: () => void;
    /** Disables the option */
    disabled?: boolean;
    /**
     * Which side of the active pill this option expands toward on desktop.
     * Defaults to 'left' when omitted.
     * On mobile all options expand below the current one, this field is ignored.
     */
    side?: 'left' | 'right';
}

export interface HoverExpandPillProps {
    options: HoverExpandPillOption[];
    currentValue: string;
    className?: string;
}

// ─── Variant config ───────────────────────────────────────────────────────────

/**
 * All visual differences between style variants are expressed here — as plain
 * class strings — so no conditional style logic leaks into the components.
 */
interface PillStyles {
    /** Outer desktop pill wrapper (includes background / glass pane) */
    desktopContainer: string;
    /** Outer mobile floating pill wrapper */
    mobileContainer: string;
    /** The always-visible active option button */
    activeBtn: string;
    /** Classes for the icon inside the active button */
    activeBtnIcon: string;
    /**
     * Label span inside the active button.
     * `withIcon` — text hidden until hover; `noIcon` — always visible.
     */
    activeBtnLabel: { withIcon: string; noIcon: string };
    /** Non-active option (link or button) */
    option: string;
}

const classicalStyles: PillStyles = {
    desktopContainer:
        "hidden md:flex items-center rounded-full " +
        "transition-all duration-300 ease-in-out group-hover:shadow-lg",
    mobileContainer:
        "absolute top-0 left-1/2 -translate-x-1/2 z-50 " +
        "flex flex-col items-center rounded-2xl " +
        "transition-all duration-300 ease-in-out",
    activeBtn:
        "px-4 py-2 text-sm font-medium whitespace-nowrap w-full md:w-fit " +
        "rounded-full flex items-center justify-center " +
        "cursor-pointer select-none " +
        "bg-primary text-primary-foreground",
    activeBtnIcon: "shrink-0 group-hover:pr-2",
    activeBtnLabel: {
        withIcon:
            "w-0 opacity-0 duration-500 transition-all " +
            "group-hover:opacity-100 group-hover:w-fit",
        noIcon: "",
    },
    option:
        "px-3 py-1.5 text-sm font-medium whitespace-nowrap " +
        "transition-colors rounded-full " +
        "flex items-center justify-center gap-2 " +
        "hover:bg-accent hover:text-accent-foreground " +
        "disabled:opacity-50 disabled:cursor-not-allowed",
};

const modernStyles: PillStyles = {
    desktopContainer:
        "hidden md:flex items-center p-1 " +
        "glass rounded-full! " +
        "transition-all duration-300 ease-in-out",
    mobileContainer:
        "absolute top-0 left-1/2 -translate-x-1/2 z-50 " +
        "flex flex-col items-center " +
        "glass rounded-2xl! " +
        "transition-all duration-300 ease-in-out",
    activeBtn:
        "px-1 lg:px-4 py-2 text-sm font-semibold whitespace-nowrap w-full md:w-fit " +
        "rounded-full flex items-center justify-center " +
        "cursor-pointer select-none transition-all duration-200 " +
        "group-hover:bg-white/20 dark:group-hover:bg-gray-500/30 ",
    activeBtnIcon: "shrink-0 transition-all duration-200 group-hover:mr-1",
    activeBtnLabel: {
        withIcon:
            "transition-all duration-300 overflow-hidden " +
            "max-w-0 opacity-0 group-data-[state=open]:pl-2 group-data-[state=open]:max-w-xs group-hover:max-w-xs group-data-[state=open]:opacity-100 group-hover:opacity-100",
        noIcon: "transition-all duration-300 overflow-hidden",
    },
    option:
        "cursor-pointer mx-1 px-3 py-1.5 text-sm font-medium whitespace-nowrap " +
        "transition-all duration-200 rounded-full " +
        "flex items-center justify-center gap-2 " +
        "hover:bg-white/15 dark:hover:bg-gray-500/15 " +
        "disabled:opacity-40 disabled:cursor-not-allowed",
};

const styleVariants: Record<string, PillStyles> = {
    classical: classicalStyles,
    modern: modernStyles,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Renders a single non-active option as a link or button */
function PillOption({
    option,
    styles,
    onSelect,
}: Readonly<{ option: HoverExpandPillOption; styles: PillStyles; onSelect: () => void }>) {
    const inner = (
        <>
            {option.icon != null && <span className="shrink-0">{option.icon}</span>}
            {option.label}
        </>
    );

    if (option.href != null) {
        return (
            <NextLink href={option.href} className={styles.option} onClick={onSelect}>
                {inner}
            </NextLink>
        );
    }

    return (
        <button
            type="button"
            onClick={() => { option.onClick?.(); onSelect(); }}
            disabled={option.disabled}
            className={styles.option}
        >
            {inner}
        </button>
    );
}

/**
 * Desktop-only strip — reveals options horizontally on CSS group-hover.
 */
function HorizontalStrip({
    options,
    styles,
    onSelect,
}: Readonly<{ options: HoverExpandPillOption[]; styles: PillStyles; onSelect: () => void }>) {
    if (options.length === 0) return null;
    return (
        <div
            className={cn(
                "flex items-center overflow-hidden",
                "transition-all duration-300 ease-in-out",
                "max-w-0 opacity-0 group-hover:max-w-96 group-hover:opacity-100",
            )}
        >
            {options.map((opt) => (
                <PillOption key={opt.value} option={opt} styles={styles} onSelect={onSelect} />
            ))}
        </div>
    );
}

/**
 * Mobile-only strip — expands downward when isOpen is true.
 */
function VerticalStrip({
    options,
    styles,
    isOpen,
    onSelect,
}: Readonly<{ options: HoverExpandPillOption[]; styles: PillStyles; isOpen: boolean; onSelect: () => void }>) {
    if (options.length === 0) return null;
    return (
        <div
            className={cn(
                "flex flex-col w-full overflow-hidden",
                "transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 opacity-100 pt-1" : "max-h-0 opacity-0",
            )}
        >
            {options.map((opt) => (
                <PillOption key={opt.value} option={opt} styles={styles} onSelect={onSelect} />
            ))}
        </div>
    );
}

/** The always-visible active option button */
function ActiveButton({
    current,
    styles,
    isOpen,
    onToggle,
}: Readonly<{
    current: HoverExpandPillOption | undefined;
    styles: PillStyles;
    isOpen: boolean;
    onToggle: () => void;
}>) {
    const hasIcon = current?.icon != null;
    const labelClass = hasIcon
        ? styles.activeBtnLabel.withIcon
        : styles.activeBtnLabel.noIcon;

    return (
        <button
            type="button"
            aria-expanded={isOpen}
            onClick={onToggle}
            className={cn(styles.activeBtn, isOpen && "bg-white/20 dark:bg-black/30")}
        >
            {hasIcon && (
                <span className={styles.activeBtnIcon}>{current.icon}</span>
            )}
            <span className={labelClass}>{current?.label}</span>
        </button>
    );
}

// ─── usePillState ─────────────────────────────────────────────────────────────

/**
 * Encapsulates open/close state and the outside-click listener.
 */
function usePillState(containerRef: React.RefObject<HTMLDivElement | null>) {
    const [isOpen, setIsOpen] = useState(false);

    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    useEffect(() => {
        const onOutsideInteraction = (e: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener("mousedown", onOutsideInteraction);
        document.addEventListener("touchstart", onOutsideInteraction);
        return () => {
            document.removeEventListener("mousedown", onOutsideInteraction);
            document.removeEventListener("touchstart", onOutsideInteraction);
        };
    }, [close, containerRef]);

    return { isOpen, close, toggle };
}

// ─── HoverExpandPill ──────────────────────────────────────────────────────────

/**
 * A rounded pill that always shows the active option and reveals the rest on interaction.
 *
 * - **Desktop (≥md)**: expands left/right via CSS group-hover.
 * - **Mobile (<md)**: tapping the active option opens a vertical dropdown.
 *
 * Visual appearance is driven by the active style variant (classical / modern).
 * Adding a new variant only requires a new entry in `styleVariants` above.
 */
export function HoverExpandPill({
    options,
    currentValue,
    className,
}: Readonly<HoverExpandPillProps>) {
    const { currentStyle } = useStyle();
    const containerRef = useRef<HTMLDivElement>(null);
    const { isOpen, close, toggle } = usePillState(containerRef);

    const styles = styleVariants[currentStyle] ?? classicalStyles;

    const current = options.find((opt) => opt.value === currentValue);
    const others = options.filter((opt) => opt.value !== currentValue);
    const leftOptions = others.filter((opt) => (opt.side ?? 'left') === 'left');
    const rightOptions = others.filter((opt) => opt.side === 'right');

    return (
        <div
            ref={containerRef}
            data-state={isOpen ? "open" : "closed"}
            className={cn("relative group rounded-full", className)}
        >
            {/* ── MOBILE layout (<md) ────────────────────────────────────────── */}
            <div className="md:hidden">
                {/* Invisible spacer — reserves the layout footprint of the active option */}
                {/* <div
                    aria-hidden="true"
                    className="invisible px-4 py-2 text-sm font-medium flex items-center gap-2 pointer-events-none select-none whitespace-nowrap"
                >
                    {current?.icon != null && <span className="shrink-0">{current.icon}</span>}
                    {current?.label}
                </div> */}

                {/* Floating pill — expands vertically on tap */}
                <div className={cn(styles.mobileContainer, isOpen && "shadow-lg")}>
                    <ActiveButton current={current} styles={styles} isOpen={isOpen} onToggle={toggle} />
                    <VerticalStrip options={others} styles={styles} isOpen={isOpen} onSelect={close} />
                </div>
            </div>

            {/* ── DESKTOP layout (≥md) ───────────────────────────────────────── */}
            <div className={styles.desktopContainer}>
                <HorizontalStrip options={leftOptions} styles={styles} onSelect={close} />
                <ActiveButton current={current} styles={styles} isOpen={isOpen} onToggle={toggle} />
                <HorizontalStrip options={rightOptions} styles={styles} onSelect={close} />
            </div>
        </div>
    );
}
