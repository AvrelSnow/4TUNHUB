import { ImageResponse } from "next/og";

/**
 * Social share card (OpenGraph/Twitter) — generated at build time.
 * Brand: ink-950 field, amber roundel, blueprint grid texture.
 */
export const alt = "4TUN Hub — Engineering Ecosystem";
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
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#0b0d10",
          backgroundImage:
            "linear-gradient(rgba(168,176,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(168,176,184,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 9999,
              backgroundColor: "#ffb000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 60,
              fontWeight: 800,
            }}
          >
            4
          </div>
          <div
            style={{
              color: "#f5f7f8",
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            TUNHUB
          </div>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              backgroundColor: "#ffb000",
              marginTop: 40,
              marginLeft: -18,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#ffb000",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Engineering Ecosystem
          </div>
          <div
            style={{
              color: "#f5f7f8",
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            Engineering services, education, research &amp; products — Dschang,
            Cameroon.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
