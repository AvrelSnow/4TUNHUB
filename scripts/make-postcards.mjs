#!/usr/bin/env node
/**
 * The Cohort 0 campaign cards — one a day, from launch to the deadline.
 *
 *   node scripts/make-postcards.mjs
 *
 * Writes PNGs to ./postcards (gitignored): a 1080x1350 for LinkedIn and
 * the feeds, and a 1080x1920 for status and Shorts. Captions for each
 * card are in docs/cohort-0-campaign.md.
 *
 * They are generated rather than designed in Canva for one reason: every
 * fact on them — the dates, the price, the voucher — is still moving, and
 * a card is worth nothing the day after it stops being true. Change a
 * line here, run the script, repost.
 *
 * Same renderer as the site's own share card (src/app/opengraph-image.tsx),
 * so the type, the palette and the amber are the page's, not an
 * approximation of it. Satori has no block layout: every element that
 * holds children needs an explicit `display: flex`, which is why the
 * helpers below always set one.
 */
import { createElement as h } from "react";
// `next/og` has no ESM export map, so the CommonJS entry is named directly.
import { ImageResponse } from "next/og.js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const OUT = join(process.cwd(), "postcards");
const FONTS = join(process.cwd(), "node_modules/@fontsource/instrument-sans/files");

// The site's tokens (src/app/globals.css), not lookalikes.
const INK = "#1d1d1f";
const MUTED = "#6e6e73";
const AMBER = "#ffb000";
const AMBER_ON_DARK = "#ffc01f";
const HAIRLINE = "#e8e8ed";

const SIZES = [
  { name: "post", width: 1080, height: 1350 },
  { name: "story", width: 1080, height: 1920 },
];

// ---- layout helpers ------------------------------------------------------

const col = (style, children) =>
  h("div", { style: { display: "flex", flexDirection: "column", ...style } }, children);

const row = (style, children) =>
  h("div", { style: { display: "flex", flexDirection: "row", alignItems: "center", ...style } }, children);

const text = (value, style) => h("div", { style: { display: "flex", ...style } }, value);

/**
 * Stacked lines of display type, where the break matters more than the
 * wrap. One text node with newlines, never one div per line: a flex row
 * per line ignores line-height and the headline drifts apart into a list.
 */
const lines = (values, style) =>
  text(values.join("\n"), { ...style, whiteSpace: "pre-wrap" });

const dot = (color) =>
  h("div", { style: { width: 14, height: 14, borderRadius: 9999, backgroundColor: color } });

/** The wordmark, drawn rather than imported: an SVG logo is not a bitmap. */
const lockup = (dark) =>
  row({ gap: 16 }, [
    h(
      "div",
      {
        key: "mark",
        style: {
          width: 52,
          height: 52,
          borderRadius: 9999,
          backgroundColor: AMBER,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: 34,
          fontWeight: 700,
        },
      },
      "4",
    ),
    text("4TUN Hub", {
      key: "name",
      fontSize: 34,
      fontWeight: 700,
      letterSpacing: -0.6,
      color: dark ? "#ffffff" : INK,
    }),
  ]);

/**
 * Every card is the same three bands: who this is from, what it says, and
 * where to go. Only the middle changes, which is what makes seven of them
 * read as one campaign.
 */
function card({ dark = false, eyebrow, body, foot }, size) {
  const tall = size.height > 1500;
  const pad = 88;
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: dark ? INK : "#ffffff",
        fontFamily: "Instrument Sans",
        padding: tall ? `${pad + 120}px ${pad}px ${pad + 140}px` : `${pad}px`,
      },
    },
    [
      col({ key: "head", gap: 26 }, [
        lockup(dark),
        eyebrow
          ? row({ key: "eyebrow", gap: 12 }, [
              dot(dark ? AMBER_ON_DARK : AMBER),
              text(eyebrow, {
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: 0.2,
                color: dark ? AMBER_ON_DARK : "#b25000",
              }),
            ])
          : null,
      ]),
      // 4:5 sits on the rule like a poster, with the white space in one
      // block under the lockup. 9:16 is too tall for that — the words end
      // up marooned at the bottom of a phone screen — so it centres.
      col(
        {
          key: "body",
          flexGrow: 1,
          justifyContent: tall ? "center" : "flex-end",
          paddingTop: 48,
          paddingBottom: 56,
        },
        body,
      ),
      col({ key: "foot", gap: 14 }, [
        h("div", {
          key: "rule",
          style: { width: "100%", height: 1, backgroundColor: dark ? "rgba(255,255,255,0.22)" : HAIRLINE },
        }),
        row({ key: "line", justifyContent: "space-between", width: "100%", paddingTop: 12 }, [
          text(foot?.left ?? "4tunhub.com", {
            fontSize: 26,
            fontWeight: 600,
            color: dark ? "rgba(255,255,255,0.72)" : MUTED,
          }),
          text(foot?.right ?? "Applications close 11 October", {
            fontSize: 26,
            fontWeight: 600,
            color: dark ? "rgba(255,255,255,0.72)" : MUTED,
          }),
        ]),
      ]),
    ],
  );
}

const display = (dark, size = 96) => ({
  fontSize: size,
  fontWeight: 700,
  lineHeight: 1.04,
  letterSpacing: -3,
  color: dark ? "#ffffff" : INK,
});

const lead = (dark) => ({
  fontSize: 34,
  fontWeight: 500,
  lineHeight: 1.4,
  color: dark ? "rgba(255,255,255,0.74)" : MUTED,
});

/** A numbered or labelled row, used by the programme and the steps. */
const listItem = (label, value, dark) =>
  row({ gap: 24, paddingTop: 22, paddingBottom: 22, borderTop: `1px solid ${dark ? "rgba(255,255,255,0.22)" : HAIRLINE}` }, [
    text(label, {
      key: "l",
      width: 190,
      flexShrink: 0,
      fontSize: 28,
      fontWeight: 700,
      color: dark ? AMBER_ON_DARK : "#b25000",
    }),
    text(value, {
      key: "v",
      flexGrow: 1,
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 1.3,
      color: dark ? "#ffffff" : INK,
    }),
  ]);

// ---- the seven cards -----------------------------------------------------

const PARTNER = "4TUN Hub × Douala City SWUG";

/**
 * Seats still open, for the urgency card. Selection is rolling, so this
 * number moves during the window — change it and rerun; the card takes a
 * second to rebuild and a stale count is the fastest way to look careless.
 */
const SEATS_LEFT = 20;

/**
 * The ten ambassadors, revealed two a day once they are chosen. Each gets
 * a card with their own face on it, and posts it themselves: ten networks
 * instead of one, which is the whole point of the programme.
 *
 * Add an entry per person — `photo` is a path to a JPEG or PNG anywhere
 * under the project (the renderer reads no other formats, and no .webp).
 * An empty list simply generates no reveal cards.
 *
 *   { name: "...", role: "3rd year, Mechanical · IUC Douala", photo: "inbox/ambassadors/name.jpg" }
 */
const AMBASSADORS = [];

function cards({ portrait }) {
  return [
    {
      slug: "01-announcement",
      day: "Fri 25 Sep",
      build: (size) =>
        card(
          {
            eyebrow: "Applications open",
            body: [
              lines(["CSWA Bootcamp.", "Cohort 0."], { key: "t", ...display(false, 104) }),
              text(
                "Eight live evenings, from 21 October, to get you ready for the Certified SOLIDWORKS Associate exam. Free, for twenty people.",
                { key: "s", ...lead(false), marginTop: 36 },
              ),
            ],
            foot: { left: PARTNER, right: "Apply by 11 October" },
          },
          size,
        ),
    },
    {
      slug: "02-voucher",
      day: "Sat 26 Sep",
      build: (size) =>
        card(
          {
            dark: true,
            eyebrow: "What it is worth",
            body: [
              row({ key: "fig", gap: 28, alignItems: "baseline" }, [
                text("$99", { key: "a", fontSize: 140, fontWeight: 700, letterSpacing: -5, color: "rgba(255,255,255,0.35)" }),
                text("→", { key: "b", fontSize: 90, fontWeight: 700, color: AMBER_ON_DARK }),
                text("$0", { key: "c", fontSize: 140, fontWeight: 700, letterSpacing: -5, color: "#ffffff" }),
              ]),
              lines(["Finish the cohort,", "keep the voucher."], { key: "t", ...display(true, 84), marginTop: 44 }),
              text(
                "Sitting the CSWA costs $99. Everyone who finishes Cohort 0 gets a voucher for it, free.",
                { key: "s", ...lead(true), marginTop: 30 },
              ),
            ],
            foot: { left: PARTNER, right: "4tunhub.com" },
          },
          size,
        ),
    },
    {
      slug: "03-programme",
      day: "Sun 27 Sep",
      build: (size) =>
        card(
          {
            eyebrow: "Four weeks",
            body: [
              text("Mapped to what the exam actually tests.", { key: "t", ...display(false, 72), marginBottom: 40 }),
              col({ key: "weeks" }, [
                listItem("21–23 Oct", "Sketches, relations, and a first exam-style part", false),
                listItem("28–30 Oct", "Features, materials and mass properties", false),
                listItem("4–6 Nov", "Assemblies, mates and centre of mass", false),
                listItem("11–13 Nov", "Drawings, then two timed mock exams", false),
              ]),
            ],
            foot: { left: "Wed & Fri, 19:30–20:30 · in English", right: "4tunhub.com" },
          },
          size,
        ),
    },
    {
      slug: "04-how-to-get-a-seat",
      day: "Mon 28 Sep",
      build: (size) =>
        card(
          {
            eyebrow: "How to get a seat",
            body: [
              text("Four things, none of which cost money.", { key: "t", ...display(false, 72), marginBottom: 40 }),
              col({ key: "steps" }, [
                listItem("01", "Join Douala City SWUG on Bevy", false),
                listItem("02", "Follow the group on LinkedIn", false),
                listItem("03", "Follow 4TUN Hub on LinkedIn and YouTube", false),
                listItem("04", "Apply, and send a screenshot of each", false),
              ]),
            ],
            foot: { left: "4tunhub.com/academy/cohort-0", right: "Closes 11 October" },
          },
          size,
        ),
    },
    {
      slug: "05-who-teaches",
      day: "Sun 4 Oct",
      build: (size) =>
        card(
          {
            eyebrow: "Who teaches",
            body: [
              row({ key: "who", gap: 36 }, [
                h("img", {
                  key: "p",
                  src: portrait,
                  width: 220,
                  height: 220,
                  style: { borderRadius: 9999, objectFit: "cover" },
                }),
                col({ key: "n", gap: 10 }, [
                  text("Donfack Fortune", { key: "a", fontSize: 58, fontWeight: 700, letterSpacing: -1.6, color: INK }),
                  text("Mechanical engineer · CSWP", { key: "b", fontSize: 30, fontWeight: 600, color: MUTED }),
                ]),
              ]),
              text(
                "Organiser of Douala City SWUG. Six machines designed, simulated and built. More than 300 students taught.",
                { key: "s", ...lead(false), marginTop: 48 },
              ),
            ],
            foot: { left: PARTNER, right: "4tunhub.com" },
          },
          size,
        ),
    },
    {
      slug: "06-one-thing",
      day: "Tue 6 Oct",
      build: (size) =>
        card(
          {
            eyebrow: "One thing about the CSWA",
            body: [
              lines(["It is not a test", "of modelling.", "It is a test of", "reading."], {
                key: "t",
                ...display(false, 86),
              }),
              text(
                "Most candidates who fail can model the part. They lose the marks on units, on decimal places, and on the clock. Week 2 is spent on nothing else.",
                { key: "s", ...lead(false), marginTop: 40 },
              ),
            ],
            foot: { left: PARTNER, right: "Applications close 11 October" },
          },
          size,
        ),
    },
    {
      slug: "08-seats-left",
      day: "Thu 8 Oct",
      build: (size) =>
        card(
          {
            eyebrow: "Rolling selection",
            body: [
              lines([`${SEATS_LEFT} seats`, "still open."], { key: "t", ...display(false, 104) }),
              text(
                "Seats are given out as applications arrive, not all at the end. The people already in applied in the first week.",
                { key: "s", ...lead(false), marginTop: 40 },
              ),
            ],
            foot: { left: "4tunhub.com/academy/cohort-0", right: "Closes Sunday 11 October" },
          },
          size,
        ),
    },
    {
      slug: "07-closing",
      day: "Sun 11 Oct",
      build: (size) =>
        card(
          {
            dark: true,
            eyebrow: "Last day",
            body: [
              lines(["Applications", "close tonight."], { key: "t", ...display(true, 104) }),
              text(
                "Twenty seats, free, eight live evenings from 21 October, and a CSWA voucher for everyone who finishes. After tonight, the next one is January.",
                { key: "s", ...lead(true), marginTop: 40 },
              ),
            ],
            foot: { left: "4tunhub.com/academy/cohort-0", right: "Sunday 11 October" },
          },
          size,
        ),
    },
  ];
}

/** One ambassador, one card, one network. */
function ambassadorCards(photos) {
  return AMBASSADORS.map((a, i) => ({
    slug: `amb-${String(i + 1).padStart(2, "0")}-${a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    day: "Reveal",
    build: (size) =>
      card(
        {
          eyebrow: "Cohort 0 ambassador",
          body: [
            row({ key: "who", gap: 36 }, [
              h("img", {
                key: "p",
                src: photos[i],
                width: 220,
                height: 220,
                style: { borderRadius: 9999, objectFit: "cover" },
              }),
              col({ key: "n", gap: 10 }, [
                text(a.name, { key: "a", fontSize: 58, fontWeight: 700, letterSpacing: -1.6, color: INK }),
                text(a.role, { key: "b", fontSize: 30, fontWeight: 600, color: MUTED }),
              ]),
            ]),
            text(
              "One of ten engineers carrying Cohort 0 to their own circle \u2014 and sitting in it. Ask them anything about the bootcamp.",
              { key: "s", ...lead(false), marginTop: 48 },
            ),
          ],
          foot: { left: PARTNER, right: "Apply by 11 October" },
        },
        size,
      ),
  }));
}

// ---- render --------------------------------------------------------------

const [w700, w600, w500, portraitBuffer] = await Promise.all([
  readFile(join(FONTS, "instrument-sans-latin-700-normal.woff")),
  readFile(join(FONTS, "instrument-sans-latin-600-normal.woff")),
  readFile(join(FONTS, "instrument-sans-latin-500-normal.woff")),
  // The renderer reads PNG and JPEG only, so the site's .webp is converted.
  sharp(join(process.cwd(), "public/images/founder-portrait.webp"))
    .resize(440, 440, { fit: "cover", position: "top" })
    .jpeg({ quality: 86 })
    .toBuffer(),
]);

const fonts = [
  { name: "Instrument Sans", data: w700, weight: 700, style: "normal" },
  { name: "Instrument Sans", data: w600, weight: 600, style: "normal" },
  { name: "Instrument Sans", data: w500, weight: 500, style: "normal" },
];

await mkdir(OUT, { recursive: true });

// Ambassador portraits, converted the same way the founder's is.
const ambassadorPhotos = await Promise.all(
  AMBASSADORS.map(async (a) => {
    const buf = await sharp(join(process.cwd(), a.photo))
      .resize(440, 440, { fit: "cover", position: "top" })
      .jpeg({ quality: 86 })
      .toBuffer();
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  }),
);

const all = [
  ...cards({ portrait: `data:image/jpeg;base64,${portraitBuffer.toString("base64")}` }),
  ...ambassadorCards(ambassadorPhotos),
];
let count = 0;
for (const c of all) {
  for (const size of SIZES) {
    const res = new ImageResponse(c.build(size), { width: size.width, height: size.height, fonts });
    const file = join(OUT, `${c.slug}-${size.name}.png`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    count += 1;
  }
  console.log(`${c.day.padEnd(10)} ${c.slug}`);
}
console.log(`\n${count} images in ./postcards`);
