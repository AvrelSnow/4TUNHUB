import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { ImageResponse } from "next/og";

/**
 * The one renderer for every link-preview card (1200×630), so the site
 * card and the Academy card cannot drift apart.
 *
 * Same language as the site: a white page, one typeface, the claim, and a
 * real photograph on the right. The renderer reads WOFF/TTF and PNG/JPEG
 * only, so the font comes from the static Fontsource package and the photo
 * is converted here.
 *
 * Served as JPEG, not the PNG the renderer makes: the PNG of a photograph
 * is ~730 KB, and WhatsApp's preview fetcher silently drops images that
 * large, which is the one channel the campaign cannot lose.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#1d1d1f";
const MUTED = "#6e6e73";
const AMBER = "#ffb000";
const ACCENT = "#b25000";

export type CardContent = {
  /** Small line above the claim, in the accent. Optional. */
  eyebrow?: string;
  /** The claim, one entry per line. Two lines fit. */
  lines: string[];
  sub: string;
  foot: string;
  /** Path under /public. Cropped to 460×630. */
  photo: string;
  /** Where the photo crop anchors, as sharp's `position`. */
  position?: string;
};

export async function renderCard(c: CardContent): Promise<Response> {
  const fontDir = join(process.cwd(), "node_modules/@fontsource/instrument-sans/files");
  const [bold, semibold, photo] = await Promise.all([
    readFile(join(fontDir, "instrument-sans-latin-700-normal.woff")),
    readFile(join(fontDir, "instrument-sans-latin-600-normal.woff")),
    sharp(join(process.cwd(), "public", c.photo))
      .resize(460, 630, { fit: "cover", position: c.position ?? "centre" })
      .jpeg({ quality: 82 })
      .toBuffer(),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const png = new ImageResponse(
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
              4TUNHub
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {c.eyebrow && (
              <div style={{ marginBottom: 18, color: ACCENT, fontSize: 26, fontWeight: 600 }}>
                {c.eyebrow}
              </div>
            )}
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
              {c.lines.map((l) => (
                <div key={l} style={{ display: "flex" }}>
                  {l}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 26, color: MUTED, fontSize: 28, fontWeight: 600, lineHeight: 1.35 }}>
              {c.sub}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, color: MUTED, fontSize: 24, fontWeight: 600 }}>
            <div style={{ width: 10, height: 10, borderRadius: 9999, backgroundColor: AMBER }} />
            {c.foot}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoSrc} width={460} height={630} alt="" style={{ objectFit: "cover" }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Instrument Sans", data: bold, weight: 700, style: "normal" },
        { name: "Instrument Sans", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
}
