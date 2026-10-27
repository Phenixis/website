import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/db";
import { PROFILE } from "./data";

export const alt = "Maxime Duhamel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const profile = (await getProfile().catch(() => null)) ?? PROFILE;
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
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#b8b8c4", marginTop: 20 }}>
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
