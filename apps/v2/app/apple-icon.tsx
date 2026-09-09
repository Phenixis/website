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
          <g fill="#b794f6">
            <rect x="28" y="24" width="44" height="7" rx="2" />
            <rect x="28" y="69" width="44" height="7" rx="2" />
            <polygon points="30,33 70,33 50,50" />
            <polygon points="30,67 70,67 50,50" />
          </g>
        </svg>
      </div>
    ),
    { ...size },
  );
}
