# 4TUN Hub — Art Direction

> This document governs every visual decision on the site. If a change can't be
> justified against it, the change is wrong. Written before the redesign, on
> purpose: direction first, code second.

---

## The sentence

**4TUN Hub renders like an engineering instrument — a measurement surface where
the only colour is real data from real work.**

Everything below is a consequence of that sentence.

*One word was struck from it: "dark". The surface now has two states — a screen
by night, a drafting sheet by day — and the sentence had to stop naming one of
them as though it were the whole idea. Nothing else in it moved, because nothing
else needed to: the instrument, the measurement and the rule that colour has to
mean something are all untouched. See "The two grounds".*

## Three adjectives

**Instrumented.** Every surface behaves like a viewport with a readout. Corner
ticks, dimension rules, mono labels, tabular figures. Nothing is decorative that
couldn't plausibly be a measurement.

**Grave.** Enormous type, long silences between sections, a ground that gets out
of the way — near-black by night, near-white by day, and never anything in
between. The work is serious infrastructure — 560 km of railway, not a landing
page.

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

## The two grounds

*Amended. This document previously said dark was home and that there was no
light theme; the code said the same in three places. That is no longer true,
and the amendment is written here rather than quietly dropped, because a
governing document that revises itself silently stops governing anything.*

The site runs two grounds, and the visitor's own clock chooses: the **day
sheet** from 06:00 to 18:00 local, the **night ground** outside those hours.

This is not a light theme bolted onto a dark one. It is a surface the system
already contained. `.plate-doc` has always laid drawings, BOMs and schematics
on a pale sheet, on the stated grounds that **a document is read and a readout
is watched**. By day the whole instrument becomes that sheet — a drafting
surface — and by night it is the measurement screen it has always been. Same
two signature moves, same ramp, same mono furniture. Only the ground changes.

**Night is still home**, and it is the fallback in every failure mode: no
JavaScript, storage refused, an exception thrown, no stated preference and no
clock. The degraded state is the designed state.

Three rules govern it.

1. **The ground is decided before first paint, never after.** Every page is
   static per locale, so the server cannot know a visitor's local hour. A
   blocking inline resolver sets one attribute on `<html>` before the
   stylesheet paints. No markup anywhere depends on the theme, so there is
   nothing to hydrate and nothing that can mismatch — and no flash of the
   wrong ground, which would be worse than having no day sheet at all.
2. **The clock is a default, not a sentence.** Anyone can pin Day or Night and
   is then obeyed permanently. A site that insists it knows the visitor's room
   better than they do has stopped being an instrument and started being an
   opinion.
3. **Both grounds are measured, and the ramp is inked for paper.** Two failures
   were found by measuring rather than by looking, and both are recorded in
   `globals.css` with their ratios rather than fixed silently. The vivid brand
   amber cannot be *text* on a pale ground (1.6:1), so links deepen to
   `#8a5700` and the amber that *fills* a control keeps `#ffb000` with a
   `#b87400` edge for WCAG 1.4.11. And the flow ramp clipped to display type
   fails outright by day — cyan 1.97:1, green 1.50:1, amber 1.25:1 — on the
   largest word on the page. So `.flow-text` and `.flow-rule` read a separate
   inked ramp by day: identical hue order, every stop and midpoint between
   4.68:1 and 6.83:1. The raw `--color-flow-*` tokens are untouched, because
   deepening them would break filled chips that already pass.

**Why the clock and not `prefers-color-scheme`.** The OS setting is a stated
preference on the machines of people who have stated one, and a factory default
everywhere else — and a site obeying a factory default is obeying nobody. The
clock at least tracks something real about the room. The hours are 06:00–18:00
because 4TUN Hub's audience is in Cameroon, three degrees off the equator,
where sunrise sits near 06:00 and sunset near 18:20 in every month of the year:
genuinely accurate for the people the site is for, merely conventional for
everyone else, which is the right way round.

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

**Colour.** Night is home and day is the sheet — see "The two grounds" above.
Amber is action and brand — buttons, links, the mark. The flow ramp is data.
There is no fourth colour. Every foreground/background pair clears WCAG AA at
its rendered size, verified, not assumed, **on both grounds**.

**Type.** One family (Geist) worked hard, rather than three families worked
lightly. Display sizes run to ~136px with tracking tightened to -0.04em; mono
carries every label, figure and readout at 10–12px with wide tracking. The gap
between the largest and smallest type on a page should be violent. If a page's
biggest element is 48px, that page has no hero.

**Rhythm.** Three section rhythms only — `compressed`, `normal`, `cinematic` —
and a page must not use the same one three times consecutively. Uniform vertical
padding is the single strongest signal of a template.

**Backgrounds.** No patterns. No lattice. A square grid is the laziest signal a
technical site can send, and we shipped one briefly before admitting it.

Every background is a real engineering phenomenon being simulated, chosen so
each page runs the physics of what that page is actually about:

| Field | Phenomenon | Where |
|---|---|---|
| `flow` | fluid velocity field | home — the hero is a CFD pressure map |
| `stress` | load paths through a truss | services · store · simulation case studies |
| `wave` | interference of emitters | research · human-factors work · in-progress pages |
| `draft` | a drawing constructing itself | academy · about · resources · blueprint |
| `signal` | oscilloscope traces | products · electronics work |
| `growth` | branching biomass | sustainability work |
| `kinematic` | linkages turning and tracing | projects · mechanical work · founder |
| `network` | a graph finding its edges | community · contact |

No two neighbouring pages share a field, and a project case study takes the
field of its own discipline — so the shredder page grows biomass and the
braking-analysis page carries load through a truss.

All eight share one canvas engine and one colour ramp, so the site reads as one
instrument showing different measurements rather than eight unrelated toys.
Colour inside a field always encodes something measured: local speed, load,
height, distance travelled.

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
4. **A ground change re-draws it.** A canvas cannot resolve `var()`, so the
   neutral it strokes guide lines with is pushed in from CSS and the field
   re-initialises when `data-theme` changes. Without that, the still frame a
   reduced-motion visitor gets at 17:59 would keep the night ground's greys
   baked into it for the rest of the session.

**Budget.** Live layers are hand-rolled on canvas. A particle library would cost
more than the entire remaining client-JS headroom; the flow field and the
counters together cost 1.9 KB gzipped.

## What this does not change

The engineering contract stays intact: static per-locale rendering, full EN/FR
parity, self-hosted fonts with no network dependency, the design-token lint, the
bundle budget, and WCAG AA — the last of these now owed on both grounds, not
one. The redesign is judged on all of those *and* on
whether it stops people scrolling.
