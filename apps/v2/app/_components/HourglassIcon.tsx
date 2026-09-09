/**
 * The site's emblem — a two-bulb hourglass. Bars + outline are always
 * drawn in full; topFraction/bottomFraction (each 0..1) control how much
 * of each bulb is filled, growing the bottom pile from the neck and
 * shrinking the top pile from the neck, same as sand actually falls.
 */
const BULB_SPAN = 36; // each bulb's height as a % of the 100-unit viewBox
const BULB_TOP = 14; // where the top bulb's fill band starts
const BULB_BOTTOM = 14; // where the bottom bulb's fill band starts, measured from the bottom

export function HourglassIcon({
  className = "w-4 h-5",
  topFraction = 0.5,
  bottomFraction = 0.5,
  outlineClassName = "stroke-v3-text-2 fill-v3-text-2",
  topFillClassName = "fill-v3-text-2",
  bottomFillClassName = "fill-v3-accent",
}: {
  className?: string;
  topFraction?: number;
  bottomFraction?: number;
  outlineClassName?: string;
  topFillClassName?: string;
  bottomFillClassName?: string;
}) {
  return (
    <div className={`relative flex-none ${className}`}>
      <svg className={`absolute inset-0 ${outlineClassName}`} viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="20" y="4" width="60" height="6" rx="1.5" stroke="none" />
        <rect x="20" y="90" width="60" height="6" rx="1.5" stroke="none" />
        <polygon points="22,14 78,14 50,50" fill="none" strokeWidth="4" />
        <polygon points="22,86 78,86 50,50" fill="none" strokeWidth="4" />
      </svg>
      <div
        className="absolute left-0 w-full overflow-hidden"
        style={{ top: `${BULB_TOP}%`, height: `${topFraction * BULB_SPAN}%` }}
      >
        <svg className={`w-full h-full ${topFillClassName}`} viewBox={`0 0 100 ${BULB_SPAN}`} preserveAspectRatio="none">
          <polygon points={`22,0 78,0 50,${BULB_SPAN}`} />
        </svg>
      </div>
      <div
        className="absolute left-0 w-full overflow-hidden"
        style={{ bottom: `${BULB_BOTTOM}%`, height: `${bottomFraction * BULB_SPAN}%` }}
      >
        <svg className={`w-full h-full ${bottomFillClassName}`} viewBox={`0 0 100 ${BULB_SPAN}`} preserveAspectRatio="none">
          <polygon points={`22,${BULB_SPAN} 78,${BULB_SPAN} 50,0`} />
        </svg>
      </div>
    </div>
  );
}
