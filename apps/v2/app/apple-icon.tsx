import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0d",
        }}
      >
        <svg width="126" height="126" viewBox="0 0 100 100">
          {/* glass outline, subtle */}
          <polygon points="28,29 72,29 50,50" fill="none" stroke="#2c2c38" strokeWidth="2" />
          <polygon points="28,71 72,71 50,50" fill="none" stroke="#2c2c38" strokeWidth="2" />

          {/* sand fill — pre-computed trapezoids (60% top / 40% bottom), matching
              the header emblem's proportions instead of relying on <clipPath>,
              which isn't confirmed to work in this route's renderer */}
          <polygon points="28,29 72,29 58.8,41.6 41.2,41.6" fill="#b8b8c4" />
          <polygon points="28,71 72,71 58.8,62.6 41.2,62.6" fill="#b794f6" />

          {/* bars, on top */}
          <rect x="26" y="20" width="48" height="6" rx="1.5" fill="#b8b8c4" />
          <rect x="26" y="74" width="48" height="6" rx="1.5" fill="#b8b8c4" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
