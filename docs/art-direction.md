# 4TUN Hub — Art Direction

> This document governs every visual decision on the site. If a change can't
> be justified against it, the change is wrong.
>
> Rewritten 2026-09-19. It replaces "the dark instrument panel" (the
> near-black ground, the flow-ramp gradient, corner ticks, mono readouts and
> eight canvas simulations). Fortune judged that site unappealing and asked
> for a design that reads as the work of the best designer in the world, and
> not as AI-generated. The old document is in git history.

---

## The sentence

**The work is the design. Everything else gets out of its way.**

The machines, the drawings and the stress plots are the most interesting
things on this site. The page is a white table they are laid on: quiet
surfaces, one typeface, generous space, and colour used once.

## What "not AI-generated" means here

A generated site is recognisable by its tics. None of them are allowed:

- Gradient text, glowing accents, neon on black.
- Uppercase mono labels with wide tracking stamped on every section.
- Numbered "01 / 02 / 03" cards when the order means nothing.
- Icon-in-a-circle feature grids.
- Decorative backgrounds: grids, dots, particles, blobs, simulated fields.
- Counters that animate numbers up from zero.
- Stock photography standing in for real work.

Numbers appear only where order is real (the four steps of how we work, the
case studies on the CAMRAIL page).

## Light by day, dark by night

The visitor's clock decides: the light page from 06:00 to 18:00, the dark
page otherwise. The audience is near the equator, where sunrise and sunset
sit at about 06:00 and 18:20 all year. Anyone can pin Light or Dark from the
footer and is obeyed permanently; the choice is remembered.

The theme is set by a blocking script before first paint (`src/lib/theme.ts`),
so the page never flashes the wrong one. If the script cannot run, the page
is light, because the base tokens are the day values.

Both themes are first-class. Every text pair is measured against both.

## Colour

| Token | Day | Night | Use |
|---|---|---|---|
| background | `#ffffff` | `#000000` | the page |
| surface | `#f5f5f7` | `#141416` | alternate bands, tiles |
| surface-2 | `#ffffff` | `#1d1d1f` | a card on a grey band |
| foreground | `#1d1d1f` (16.8:1) | `#f5f5f7` (19.3:1) | text |
| muted | `#6e6e73` (5.1:1) | `#a1a1a6` (8.2:1) | secondary text |
| accent | `#b25000` (5.2:1) | `#ffb340` (11.8:1) | links, the eyebrow |
| primary | `#1d1d1f` | `#f5f5f7` | the button fill |

Amber is the logo's colour and it appears in exactly three roles: the logo,
text links and eyebrows (deepened to `#b25000` by day so it reads as text),
and small live indicators. Buttons are black by day and white by night, so
the amber never has to compete with them.

## Type

One family: **Instrument Sans**, self-hosted, weight axis 400–700. No mono.

- Display (hero, page titles): 700, tracking −0.034 to −0.04em, line-height ~1.
- Section titles: 700, −0.028em.
- Card titles: 600.
- Lead paragraphs: 21px at desktop, muted.
- Body: 17px, line-height 1.53.
- Figures use tabular numerals (`.figure`).

The eyebrow above a title is sentence case, semibold, in the accent: the
section's name, not a label stamped on it.

## Space and shape

- Sections breathe: 96–176px of vertical space on desktop.
- Grey bands (`surface`) separate one idea from the next. Never two grey
  bands in a row without a hairline between them.
- Corners: 12px on fields, 18px on small cards, 28px on tiles and media,
  36px on hero media. Controls are pills.
- Separation comes from tone, not borders or shadows. A shadow appears only
  on hover, as a card lifts.

## Imagery

Real photographs and real engineering documents only.

1. **Photographs are shown as they were taken.** No tint, no vignette, no
   grade. They are cropped into generous rounded frames and ease in slightly
   on hover.
2. **Documents are shown whole, on white, in both themes** (`.media-doc`),
   with a faint frame so a white sheet does not float on a white page.
3. **Anything can be opened full size** where detail matters (`Zoomable`).
4. **A reference image is labelled as one.** The FSAE photograph is not the
   founder's car; it carries its note and stays out of the proof gallery.

The home hero is a fan of five real photographs: four machines and the
founder on site. Service, Academy and Research tiles each carry their own
evidence: a von Mises plot, a SolidWorks render, a lab trial sheet.

## Motion

- Content rises 24px and fades in once as it enters the viewport, with an
  Apple-style ease (`--ease-apple`). Anything above the fold is never hidden.
- Cards lift 4px on hover; images inside them scale 3.5%.
- Colours cross-fade when the theme changes.
- Reduced motion turns all of it off.

## What this does not change

Static per-locale rendering, full EN/FR parity, self-hosted fonts, the
design-token lint (`npm run lint:tokens`), the client-JS budget
(`performance-budgets.json`) and WCAG AA in both themes. `npm run check`
runs all of them.
