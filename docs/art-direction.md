# 4TUN Hub — Art Direction

> This document governs every visual decision on the site. If a change can't be
> justified against it, the change is wrong. Written before the redesign, on
> purpose: direction first, code second.

---

## The sentence

**4TUN Hub renders like an engineering instrument — a dark measurement surface
where the only colour is real data from real work.**

Everything below is a consequence of that sentence.

## Three adjectives

**Instrumented.** Every surface behaves like a viewport with a readout. Corner
ticks, dimension rules, mono labels, tabular figures. Nothing is decorative that
couldn't plausibly be a measurement.

**Grave.** Near-black ground, enormous type, long silences between sections.
The work is serious infrastructure — 560 km of railway, not a landing page.

**Evidential.** Claims are shown, not asserted. The CFD render, the shredder in
the workshop, the FCFA figure. Proof is the design system's payload.

## References

| Site | What we take |
|---|---|
| **Anduril** | Gravity. Dark ground, enormous type, full-bleed technical imagery, total absence of stock-photo cheer. |
| **Linear** | Precision. Motion that demonstrates a claim rather than decorating one. Designed easing curves. |
| **Vercel** | Dark-first information density that stays warm and legible. |
| **Oracle Red Bull Racing** | Telemetry as decoration — data readouts used as visual texture. |

Deliberately **not** taken: WebGL spectacle (Igloo Inc, Lando Norris). Our
audience includes engineers and students in Cameroon on variable mobile
connections. Elite here means art direction, not payload.

---

## The two signature moves

Exactly two. Repeated everywhere. Nothing else gets to be a signature.

### 1. The flow ramp

The pressure-map gradient from our own CFD output — deep blue → cyan → green →
amber → red — becomes the brand's data language. It is the *only* place
multi-colour appears.

Used for: section rules, active/hover states, stat underlines, progress and
status indicators, clipped display type on the single most important word per
page.

Never used for: backgrounds behind text, decorative fills, or anything that
isn't standing in for a measured quantity.

Rationale: no competitor can copy it, because it is derived from our actual
simulation work. It is the one asset nobody else has.

### 2. The instrument frame

Technical-drawing chrome applied to panels and imagery: hairline borders with
corner ticks, a mono readout in the frame's gutter, dimension rules with tick
marks.

Every card, figure and panel is a *viewport onto something measured*, and it is
labelled as such. This is what turns a generic rounded card into an instrument.

---

## Rules

**Colour.** Dark is home. `--color-background` is near-black and the light
surfaces are gone. Amber is action and brand — buttons, links, the mark. The
flow ramp is data. There is no fourth colour. Every foreground/background pair
clears WCAG AA at its rendered size, verified, not assumed.

**Type.** One family (Geist) worked hard, rather than three families worked
lightly. Display sizes run to ~136px with tracking tightened to -0.04em; mono
carries every label, figure and readout at 10–12px with wide tracking. The gap
between the largest and smallest type on a page should be violent. If a page's
biggest element is 48px, that page has no hero.

**Rhythm.** Three section rhythms only — `compressed`, `normal`, `cinematic` —
and a page must not use the same one three times consecutively. Uniform vertical
padding is the single strongest signal of a template.

**Texture.** One texture: the instrument lattice. It is applied at a density you
can actually see, or it is not applied. A pattern masked to invisibility is a
pattern you should delete.

**Imagery.** One treatment, applied as a class (`.plate`) so the originals stay
untouched on disk. Photographs are graded toward the ink ground: temperature
pulled to one neutral, contrast seated, edges dissolved into the page — because
the source material is uncontrolled phone photography, warm workshop tungsten
next to cool overcast daylight, and ungraded it reads as a jumble rather than
one body of work.

Three rules govern it:

1. **The grade is presentation, never evidence.** It lifts on hover and on
   keyboard focus, and the lightbox shows the photograph completely untouched.
   This is an engineering-proof site; the proof stays available at full
   fidelity.
2. **Documents are not photographs.** Drawings, BOMs and schematics are *read*.
   The vignette and the tint attack exactly the corners and small type where a
   title block and a parts table live, so documents take `.plate-doc` — same
   family, grading removed, dimmed only enough that a white sheet stops glaring.
   The signal is the fit: `contain` means "show the whole sheet", which a
   document needs and a photograph never asks for.
3. **A mark that can't take the treatment doesn't get forced through it.** The
   affiliation logos are opaque assets drawn for white grounds, in three
   unrelated shapes; a knock-out or a tint breaks them. So what gets made
   uniform is the plate, not the mark.

**Known asset debt.** `public/images/logos/rem.webp` is a photograph of a
lightbulb, not a logo, and sits in a row of logos. `solidworks-ug.webp` is
illegible at chip size. No treatment fixes either — they need real vector
marks.

**Motion.** Motion demonstrates or it doesn't exist. The background flow field
is the case in point: the hero image is a CFD pressure map, so the live field is
the site's own subject matter running, not a particle effect borrowed from
somewhere else. Colour in it still encodes local speed — the ramp never becomes
decoration.

Reveals must never leave content invisible on load; anything above the fold
renders immediately. Figures count up like a gauge settling, from a
server-rendered final value, so they are correct without JS. Curves come from
the token set; `ease` and `linear` are not on the menu.

Three hard rules for any live layer:

1. **Measure the contrast, don't assume it.** A bright streak passing behind
   muted body copy measured 3.2:1 — a fail. The fix is `.copy-scrim`, which
   lifts the ground back up under the text only, so the field keeps running at
   full strength everywhere else. Any new live layer behind text gets sampled
   the same way before it ships.
2. **It stops when nobody is looking.** Offscreen and hidden-tab both pause the
   loop outright. Verified, not asserted.
3. **Reduced motion gets a still frame, not an empty box.** The simulation runs
   forward a bounded number of steps and then stops for good.

**Budget.** Live layers are hand-rolled on canvas. A particle library would cost
more than the entire remaining client-JS headroom; the flow field and the
counters together cost 1.9 KB gzipped.

## What this does not change

The engineering contract stays intact: static per-locale rendering, full EN/FR
parity, self-hosted fonts with no network dependency, the design-token lint, the
bundle budget, and WCAG AA. The redesign is judged on all of those *and* on
whether it stops people scrolling.
