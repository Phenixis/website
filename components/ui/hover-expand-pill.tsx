'use client';

import { cn } from "@/lib/utils";
import NextLink from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";

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

interface HoverExpandPillProps {
    /** All available options */
    options: HoverExpandPillOption[];
    /** Value of the currently active / selected option */
    currentValue: string;
    className?: string;
}

/** Shared classes for every non-active option */
const optionClass =
    "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors " +
    "hover:bg-accent hover:text-accent-foreground rounded-full " +
    "flex items-center justify-center gap-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

/** Renders a single non-active option as a link or a button */
function PillOption({
    option,
    onSelect,
}: Readonly<{ option: HoverExpandPillOption; onSelect: () => void }>) {
    const inner = (
        <>
            {option.icon != null && (
                <span className="shrink-0">{option.icon}</span>
            )}
            {option.label}
        </>
    );

    if (option.href != null) {
        return (
            <NextLink href={option.href} className={optionClass} onClick={onSelect}>
                {inner}
            </NextLink>
        );
    }

    return (
        <button
            type="button"
            onClick={() => { option.onClick?.(); onSelect(); }}
            disabled={option.disabled}
            className={optionClass}
        >
            {inner}
        </button>
    );
}

/**
 * Horizontal collapsible strip — desktop only.
 * Revealed purely via CSS group-hover; isOpen has no effect here.
 */
function HorizontalStrip({
    options,
    onSelect,
}: Readonly<{ options: HoverExpandPillOption[]; onSelect: () => void }>) {
    if (options.length === 0) return null;
    return (
        <div
            className={cn(
                "flex items-center overflow-hidden",
                "transition-all duration-300 ease-in-out",
                "max-w-0 opacity-0 group-hover:max-w-screen-sm group-hover:opacity-100",
            )}
        >
            {options.map((opt) => (
                <PillOption key={opt.value} option={opt} onSelect={onSelect} />
            ))}
        </div>
    );
}

/**
 * Vertical collapsible strip — mobile only.
 * Expands downward via max-h animation when isOpen is true.
 */
function VerticalStrip({
    options,
    isOpen,
    onSelect,
}: Readonly<{ options: HoverExpandPillOption[]; isOpen: boolean; onSelect: () => void }>) {
    if (options.length === 0) return null;
    return (
        <div
            className={cn(
                "flex flex-col overflow-hidden w-full",
                "transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 hidden",
            )}
        >
            {options.map((opt) => (
                <PillOption key={opt.value} option={opt} onSelect={onSelect} />
            ))}
        </div>
    );
}

/** The always-visible current option button, shared by both layouts */
function CurrentButton({
    current,
    isOpen,
    onToggle,
}: Readonly<{
    current: HoverExpandPillOption | undefined;
    isOpen: boolean;
    onToggle: () => void;
}>) {
    return (
        <button
            type="button"
            aria-expanded={isOpen}
            onClick={onToggle}
            className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap w-full md:w-fit",
                "bg-primary text-primary-foreground rounded-full",
                "flex items-center justify-center gap-2 cursor-pointer select-none",
            )}
        >
            {current?.icon != null && (
                <span className="shrink-0">{current.icon}</span>
            )}
                {current?.label}
        </button>
    );
}

/**
 * A rounded pill that always shows the current option.
 *
 * - **Desktop (≥md)**: sits in normal flow, expands left/right with CSS hover.
 * - **Mobile (<md)**: tapping the current option opens a vertical dropdown
 *   below it; tapping outside or selecting an option closes it.
 *
 * The `side` field on each option controls left/right placement on desktop.
 * On mobile, the `side` field is ignored — all options appear below.
 */
export function HoverExpandPill({
    options,
    currentValue,
    className,
}: Readonly<HoverExpandPillProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    // Close when the user taps outside the pill
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                close();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [close]);

    const current = options.find((opt) => opt.value === currentValue);
    const others = options.filter((opt) => opt.value !== currentValue);

    // Desktop only — split by side
    const leftOptions = others.filter((opt) => (opt.side ?? 'left') === 'left');
    const rightOptions = others.filter((opt) => opt.side === 'right');

    /** Shared pill shell classes */
    const shell = "bg-background border border-border transition-all duration-300 ease-in-out";

    return (
        <div
            ref={containerRef}
            className={cn("relative group", className)}
        >
            {/*
              * ── MOBILE layout (<md) ──────────────────────────────────────────
              * Absolute pill centred on an invisible spacer so expansion never
              * displaces siblings. All options drop vertically below the button.
              */}
            <div className="md:hidden">
                {/* Spacer — holds the layout slot of the current option only */}
                <div
                    aria-hidden="true"
                    className="invisible px-4 py-2 text-sm font-medium flex items-center gap-2 pointer-events-none select-none whitespace-nowrap"
                >
                    {current?.icon != null && <span className="shrink-0">{current.icon}</span>}
                    {current?.label}
                </div>

                {/* Floating pill — expands vertically downward */}
                <div
                    className={cn(
                        shell,
                        "absolute top-0 left-1/2 -translate-x-1/2 z-50",
                        "flex flex-col items-center rounded-2xl",
                        isOpen && "shadow-lg",
                    )}
                >
                    <CurrentButton current={current} isOpen={isOpen} onToggle={toggle} />
                    <VerticalStrip options={others} isOpen={isOpen} onSelect={close} />
                </div>
            </div>

            {/*
              * ── DESKTOP layout (≥md) ─────────────────────────────────────────
              * Normal-flow horizontal pill. Expands left/right via CSS group-hover.
              */}
            <div
                className={cn(
                    shell,
                    "hidden md:flex items-center rounded-full",
                    "group-hover:shadow-lg",
                )}
            >
                <HorizontalStrip options={leftOptions} onSelect={close} />
                <CurrentButton current={current} isOpen={isOpen} onToggle={toggle} />
                <HorizontalStrip options={rightOptions} onSelect={close} />
            </div>
        </div>
    );
}
