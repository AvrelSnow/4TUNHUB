import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { ImageResponse } from "next/og";

/**
 * The one renderer for every link-preview card (1200×630), so the site
 * card and the Academy card cannot drift apart.
 *
 * Same language as the site (docs/visual-experience.md): indigo ink on
 * drafting paper, Mona Sans set wide and heavy for the claim, the amber
 * roundel, the indigo→amber→laterite hairline the nav uses for reading
 * progress, and a real photograph on the right. A card for one pillar sets
 * its eyebrow in that pillar's hue.
 *
 * The renderer reads TTF/WOFF and PNG/JPEG only, and draws a variable font
 * at its default instance, so the fonts are two static Mona Sans instances
 * cut by scripts/make-og-fonts.py, and the photo is converted here.
 *
 * Served as JPEG, not the PNG the renderer makes: the PNG of a photograph
 * is ~730 KB, and WhatsApp's preview fetcher silently drops images that
 * large, which is the one channel the campaign cannot lose.
 */
export const OG_SIZE = { width: 1200, height: 630 };

// Day tokens from globals.css. A card is a still image: it does not follow
// the visitor's clock, and paper is the ground every feed renders well.
const PAPER = "#faf6ee";
const INK = "#141b3c"; // 15.6:1 on paper
const MUTED = "#4e5672"; // 6.7:1
const AMBER = "#ffb000"; // a fill, never text on paper
const INDIGO = "#2a3eb1";
const LATERITE = "#b23a1e";

/** Text-safe day inks of the pillar hues (src/lib/hues.ts). */
const HUE_INK = {
  indigo: INDIGO,
  amber: "#855600",
  green: "#1f6b45",
  laterite: LATERITE,
} as const;

const PHOTO_W = 440;

export type CardContent = {
  /** Small line above the claim, in the pillar's hue. Optional. */
  eyebrow?: string;
  /** The pillar this card speaks for; colours the eyebrow. Default indigo. */
  hue?: keyof typeof HUE_INK;
  /** The claim, one entry per line. Two lines fit. */
  lines: string[];
  sub: string;
  foot: string;
  /** Path under /public. Cropped to 440×630. */
  photo: string;
  /** Where the photo crop anchors, as sharp's `position`. */
  position?: string;
};

export async function renderCard(c: CardContent): Promise<Response> {
  const fontDir = join(process.cwd(), "src/assets/fonts");
  const [display, semibold, photo] = await Promise.all([
    readFile(join(fontDir, "mona-sans-display.ttf")),
    readFile(join(fontDir, "mona-sans-semibold.ttf")),
    sharp(join(process.cwd(), "public", c.photo))
      .resize(PHOTO_W, 630, { fit: "cover", position: c.position ?? "centre" })
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
          backgroundColor: PAPER,
          fontFamily: "Mona Sans",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 52px 56px 68px",
          }}
        >
          {/* The lockup: the amber roundel as drawn in public/4tunhub-mark.svg
              (a white "4" over a soft ink shadow). A mark is not a token. */}
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
                fontSize: 34,
                fontWeight: 800,
                textShadow: "1px 2px 0 rgba(20, 24, 29, 0.28)",
              }}
            >
              4
            </div>
            <div style={{ color: INK, fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>
              4TUNHub
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {c.eyebrow && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 18,
                  color: HUE_INK[c.hue ?? "indigo"],
                  fontSize: 26,
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 9999,
                    backgroundColor: HUE_INK[c.hue ?? "indigo"],
                  }}
                />
                {c.eyebrow}
              </div>
            )}
            <div
              style={{
                color: INK,
                display: "flex",
                flexDirection: "column",
                fontSize: 54,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: -2.2,
              }}
            >
              {c.lines.map((l) => (
                <div key={l} style={{ display: "flex" }}>
                  {l}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 24,
                color: MUTED,
                fontSize: 27,
                fontWeight: 600,
                lineHeight: 1.35,
                textWrap: "balance",
              }}
            >
              {c.sub}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* The site's reading-progress hairline, as the card's rule. */}
            <div
              style={{
                width: 120,
                height: 4,
                borderRadius: 4,
                backgroundImage: `linear-gradient(90deg, ${INDIGO}, ${AMBER} 55%, ${LATERITE})`,
              }}
            />
            <div style={{ color: MUTED, fontSize: 23, fontWeight: 600 }}>{c.foot}</div>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoSrc} width={PHOTO_W} height={630} alt="" style={{ objectFit: "cover" }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Mona Sans", data: display, weight: 800, style: "normal" },
        { name: "Mona Sans", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
}
