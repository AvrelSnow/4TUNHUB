import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { ImageResponse } from "next/og";

/**
 * Social share card (OpenGraph/Twitter), generated at build time: what
 * WhatsApp, LinkedIn and X show when someone shares 4tunhub.com.
 *
 * Same language as the site: a white page, one typeface, the claim, and a
 * real photograph (the CC3300 locomotive from the braking project). Kept
 * evergreen on purpose: platforms cache this card for weeks, so it never
 * carries a date.
 *
 * The renderer reads WOFF/TTF and PNG/JPEG only, so the font comes from
 * the static Fontsource package and the photo is converted here.
 */
export const alt = "4TUN Hub: we design machines, and teach you how.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#1d1d1f";
const MUTED = "#6e6e73";
const AMBER = "#ffb000";

export default async function OpengraphImage() {
  const fontDir = join(process.cwd(), "node_modules/@fontsource/instrument-sans/files");
  const [bold, semibold, photo] = await Promise.all([
    readFile(join(fontDir, "instrument-sans-latin-700-normal.woff")),
    readFile(join(fontDir, "instrument-sans-latin-600-normal.woff")),
    sharp(join(process.cwd(), "public/images/projects/braking-hero.webp"))
      .resize(460, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82 })
      .toBuffer(),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#ffffff",
          fontFamily: "Instrument Sans",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 56px 60px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 9999,
                backgroundColor: AMBER,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 36,
                fontWeight: 700,
              }}
            >
              4
            </div>
            <div style={{ color: INK, fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>
              4TUN Hub
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: INK,
                display: "flex",
                flexDirection: "column",
                fontSize: 64,
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: -2.5,
              }}
            >
              <div style={{ display: "flex" }}>We design machines.</div>
              <div style={{ display: "flex" }}>And teach you how.</div>
            </div>
            <div style={{ marginTop: 26, color: MUTED, fontSize: 28, fontWeight: 600, lineHeight: 1.35 }}>
              Design · FEA simulation · CAD training
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, color: MUTED, fontSize: 24, fontWeight: 600 }}>
            <div style={{ width: 10, height: 10, borderRadius: 9999, backgroundColor: AMBER }} />
            4tunhub.com · Dschang, Cameroon
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoSrc} width={460} height={630} alt="" style={{ objectFit: "cover" }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Sans", data: bold, weight: 700, style: "normal" },
        { name: "Instrument Sans", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
