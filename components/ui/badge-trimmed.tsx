"use client"

import {useState, useEffect, useRef} from "react"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const ANIMATION_DURATION = 1000

export function BadgeTrimmed({
    text,
    className = "",
    trimmedLength = 3,
    untilSpace = false,
    forceFull
}: {
    text: string
    className?: string
    trimmedLength?: number
    untilSpace?: boolean
    forceFull?: boolean
}) {
    const isMobile = useIsMobile();
    const defaultValue = untilSpace ? text.split(" ")[0] : (text.length > trimmedLength ? text.slice(0, trimmedLength) : text)

    // Animate the text so it appears letter by letter when hovered, starting with the first 3 characters,
    // and animates disappearing letter by letter when not hovered.
    const [isHovered, setIsHovered] = useState<boolean | null>(null)
    const [displayedText, setDisplayedText] = useState(defaultValue)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Clean up any running interval on unmount or hover change
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        if (isHovered) {
            let i = defaultValue.length;
            setDisplayedText(defaultValue);
            intervalRef.current = setInterval(() => {
                setDisplayedText((prev) => {
                    const next = text.slice(0, i + 1);
                    i++;
                    if (i >= text.length) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                    }
                    return next;
                });
            }, ANIMATION_DURATION / text.length);
        } else if (isHovered === false) {
            let i = displayedText.length;
            intervalRef.current = setInterval(() => {
                setDisplayedText((prev) => {
                    const next = text.slice(0, i - 1);
                    i--;
                    if (i <= defaultValue.length) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        return defaultValue;
                    }
                    return next;
                });
            }, ANIMATION_DURATION / text.length);
        }

        // Clean up interval on unmount or when dependencies change
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHovered, text, defaultValue]);

    if (forceFull) {
        return (
            <Badge className={cn("transition-all hover:border", className)}>
                {text}
            </Badge>
        )
    }

    // On mobile, display the full text without animation
    if (isMobile) {
        return (
            <Badge className={cn("transition-all border", className)}>
                {defaultValue}
            </Badge>
        )
    }

    return (
        <Badge
            className={cn("transition-all hover:border", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {displayedText}
        </Badge>
    )
}