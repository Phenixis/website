import { ImageResponse } from "next/og";
import { getLifeElapsed } from "@/lib/life-elapsed";
import { bulbFillPoints } from "@/lib/hourglass-shape";

export const size = { width: 100, height: 100 };
export const contentType = "image/png";
// Without this, Next treats the route as static (no dynamic APIs used) and
// freezes it at whatever day the last build happened to run on.
export const dynamic = "force-dynamic";

export default function Icon() {
  const { daysSpent, daysLeft, totalDays } = getLifeElapsed();
  const topFraction = daysLeft / totalDays;
  const bottomFraction = daysSpent / totalDays;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0a0a0d", borderRadius: 22 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <polygon points="28,29 72,29 50,50" fill="none" stroke="#2c2c38" strokeWidth="2" />
          <polygon points="28,71 72,71 50,50" fill="none" stroke="#2c2c38" strokeWidth="2" />
          <polygon points={bulbFillPoints(29, 50, 28, 72, topFraction)} fill="#b8b8c4" />
          <polygon points={bulbFillPoints(71, 50, 28, 72, bottomFraction)} fill="#b794f6" />
          <rect x="26" y="20" width="48" height="6" rx="1.5" fill="#b8b8c4" />
          <rect x="26" y="74" width="48" height="6" rx="1.5" fill="#b8b8c4" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
