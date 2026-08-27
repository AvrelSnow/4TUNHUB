import { ImageResponse } from "next/og";

/**
 * Apple touch icon — the branded raster fallback (R4 policy: raster only
 * for favicon/OG). iOS home-screen bookmark uses this; a filled amber
 * roundel with the "4", 180×180.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffb000",
          color: "#ffffff",
          fontSize: 120,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        4
      </div>
    ),
    size,
  );
}
