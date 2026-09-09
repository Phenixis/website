"use client";

import { useId } from "react";

/**
 * The site's emblem — a two-bulb hourglass. Bars + outline are always
 * drawn in full; topFraction/bottomFraction (each 0..1) control how much
 * of each bulb is filled, growing the bottom pile from the neck and
 * shrinking the top pile from the neck, same as sand actually falls.
 *
 * Single SVG with <clipPath>-based reveals, colors passed as explicit hex
 * (not Tailwind classes) — deliberately avoids CSS inheritance across
 * nested SVGs and percentage-height absolute-positioned divs, which is a
 * fragile pattern prone to rendering differently than expected.
 */
const BULB_SPAN = 36; // each bulb's height as a % of the 100-unit viewBox
const BULB_TOP = 14; // where the top bulb starts
const BULB_BOTTOM = 14; // where the bottom bulb ends, measured from the bottom

export function HourglassIcon({
  className = "w-4 h-5",
  topFraction = 0.5,
  bottomFraction = 0.5,
  outlineColor = "#b8b8c4", // v3-text-2
  topFillColor = "#b8b8c4", // v3-text-2
  bottomFillColor = "#b794f6", // v3-accent
}: {
  className?: string;
  topFraction?: number;
  bottomFraction?: number;
  outlineColor?: string;
  topFillColor?: string;
  bottomFillColor?: string;
}) {
  const id = useId();
  const topClipHeight = topFraction * BULB_SPAN;
  const bottomClipHeight = bottomFraction * BULB_SPAN;

  return (
    <svg className={`flex-none ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <clipPath id={`${id}-top`}>
          <rect x="0" y={BULB_TOP} width="100" height={topClipHeight} />
        </clipPath>
        <clipPath id={`${id}-bottom`}>
          <rect x="0" y={100 - BULB_BOTTOM - bottomClipHeight} width="100" height={bottomClipHeight} />
        </clipPath>
      </defs>

      <rect x="20" y="4" width="60" height="6" rx="1.5" fill={outlineColor} />
      <rect x="20" y="90" width="60" height="6" rx="1.5" fill={outlineColor} />
      <polygon points="22,14 78,14 50,50" fill="none" stroke={outlineColor} strokeWidth="4" />
      <polygon points="22,86 78,86 50,50" fill="none" stroke={outlineColor} strokeWidth="4" />

      <polygon points="22,14 78,14 50,50" fill={topFillColor} clipPath={`url(#${id}-top)`} />
      <polygon points="22,86 78,86 50,50" fill={bottomFillColor} clipPath={`url(#${id}-bottom)`} />
    </svg>
  );
}
