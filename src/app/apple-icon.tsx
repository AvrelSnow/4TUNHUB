import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Apple touch icon — the branded raster fallback (R4 policy: raster only
 * for favicon/OG). iOS home-screen bookmark uses this, 180×180.
 *
 * The amber roundel as drawn in public/4tunhub-mark.svg (white "4", soft
 * ink shadow), set on white, the logo's own ground, so the home-screen tile
 * reads as the logo. The "4" is Mona Sans, from the same
 * static instance as the link-preview cards (scripts/make-og-fonts.py).
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const display = await readFile(join(process.cwd(), "src/assets/fonts/mona-sans-display.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            width: 136,
            height: 136,
            borderRadius: 9999,
            backgroundColor: "#ffb000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: 92,
            fontWeight: 800,
            fontFamily: "Mona Sans",
            textShadow: "3px 5px 0 rgba(20, 24, 29, 0.28)",
          }}
        >
          4
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Mona Sans", data: display, weight: 800, style: "normal" }],
    },
  );
}
