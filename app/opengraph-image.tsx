import { ImageResponse } from "next/og";
import { siteConfig } from "./site";
import { YinYangMark } from "./lib/brand";

export const dynamic = "force-static";
export const alt = "Jason Zhang — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          background:
            "linear-gradient(135deg, #000000 0%, #0b0b0d 35%, #23262d 70%, #5b6068 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <YinYangMark size={150} />
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#d1d5db" }}>
          Full Stack Developer
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#9ca3af",
            marginTop: 8,
          }}
        >
          {siteConfig.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size }
  );
}
