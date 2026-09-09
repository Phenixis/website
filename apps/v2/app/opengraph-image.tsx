import { ImageResponse } from "next/og";

export const alt = "Maxime Duhamel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#0a0a0d",
          color: "#ededf3",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", width: 56, height: 4, background: "#b794f6", marginBottom: 28 }} />
        <div style={{ display: "flex", fontSize: 72, fontWeight: 300, letterSpacing: "-0.02em" }}>
          Maxime Duhamel
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#b8b8c4", marginTop: 20 }}>
          Designer &amp; builder. Lives in Saint-Brieuc, thinks in margins.
        </div>
      </div>
    ),
    { ...size },
  );
}
