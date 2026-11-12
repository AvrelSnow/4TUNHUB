# 4TUNHub — Visual Experience

> Written 2026-11-11 for the owner's "world-class visual experience" directive.
> It **supersedes the colour, type and motion sections of
> `docs/art-direction.md`** (white page, one accent, one typeface, almost no
> motion). Everything else in that document still holds: real work only, no
> stock standing in for projects, AA contrast in both themes, static per-locale
> pages, the token lint and the JS budget.

## The idea

**Indigo ink on drafting paper by day; an indigo night lit by amber after dark.**
The page is a drawing table that comes alive: light moves behind the claim,
the four parts of the ecosystem each have their own colour, the visitor can load
a steel beam and watch it answer, and every page ends in the same warm night.

Designed for people, not designers: every effect has a job, the page still reads
with all of it switched off, and it stays light enough for a phone on a
Cameroonian data plan.

## How the direction was chosen

1. **Four directions built and rendered** side by side (a lab page, screenshotted
   in headless Chrome): A *Blueprint & Heat* (indigo + amber + ember), B
   *Equatorial* (terracotta, forest, gold), C *Simulation spectrum* (the FEA
   colormap on black), plus A in its day form.
2. **Critique.** B read as folklore, and its colour orb fought the copy. C
   was a rainbow, and it revived the flow ramp the owner had already rejected. A was
   strongest, but the gradient *inside the text* was an AI tic, so it was dropped.
3. **Blind second opinion.** A separate model (Fable 5) was briefed without
   seeing A and proposed three directions of its own. It independently landed
   on the same structure, and improved it in three ways that were adopted:
   - the indigo is **ndop**, the indigo royal cloth of the Grassfields around
     Dschang, as well as the engineer's blueprint, so it says both "from here"
     and "precise";
   - **amber is the action colour in both themes** (the logo's colour is the
     thing you click);
   - night is **indigo #0E1330**, not black.
4. **Reference sites** the owner gathered then shaped the structure: Fapshi
   (grouped menus, the EN | FR pill, column footer, logo strip), Bonsai (mega
   menus with descriptions and a featured story, the closing band with an
   action card and a testimonial), SimScale (newsletter on a dark band),
   Formlabs (equal-weight cookie choices) and Lusion (opt-in sound).

## Colour

| Token | Day | Night | Role |
|---|---|---|---|
| background | `#FAF6EE` | `#0E1330` | drafting paper / indigo night |
| surface | `#F1EADB` | `#141A3D` | alternate bands |
| surface-2 | `#FFFFFF` | `#1C2450` | cards |
| foreground | `#141B3C` (15.6:1) | `#F4EEDF` (15.7:1) | text |
| muted | `#4E5672` (6.7:1) | `#AAB0CC` (8.5:1) | secondary text |
| accent | `#2A3EB1` (8.0:1) | `#FFB000` (9.9:1) | links, eyebrows, the hero's answer line |
| primary | `#FFB000` + `#141B3C` text (9.2:1) | same | the call to action |
| secondary | `#2A3EB1` + white (8.7:1) | `#9DAEFF` + `#0E1330` (8.6:1) | the action that must not compete |

**Pillar hues.** Each hue codes one part of the ecosystem and nothing else, at
most one per section (`src/lib/hues.ts` is the single map):

| Pillar | Day (text-safe) | Night | Why |
|---|---|---|---|
| Services | indigo `#2A3EB1` | `#9DAEFF` | blueprint, precision |
| Academy | ochre `#855600` (amber `#FFB000` for fills) | `#FFB000` | teaching is the light you pass on |
| Research | green `#1F6B45` | `#5FD39A` | the Dschang highlands, energy from living things |
| Community | laterite `#B23A1E` | `#FF8A6B` | the red earth everyone walks on |

Every text pair passes WCAG AA in both themes; the tightest is laterite on the
day surface at 4.99:1. `glow-*` tokens are for atmosphere only, never text.
Rules: no gradient text; raw amber is never text on paper; the four hues
appear together only where they *are* a scale (the beam's stress colours, the
progress line, the marquee's dots).

## Type

**Mona Sans** (OFL, self-hosted via Fontsource), one variable file covering weight
200–900 and **width 75–125%**. Headlines run wide (116%, 108% on phones) and
heavy, like lettering stamped on a machine plate. Body text stays at normal width
for reading. It is less common on generated sites than Inter, Geist, Space
Grotesk, Bricolage or Instrument Sans, and the width axis gives the brand a
voice without a second family. Cost: one ~98 KB latin woff2 replacing
Instrument Sans.

## Motion — one language, CSS first

Each entry: purpose · trigger · behaviour · duration/easing · mobile · cost ·
reduced motion.

| Effect | Purpose | Trigger | Behaviour | Timing | Mobile | Cost | Reduced |
|---|---|---|---|---|---|---|---|
| Atmosphere | living workshop light behind the hero and the closing band | always | three radial glows drift | 26 s loop, in-out-quart | same | one layer; only a registered `@property` animates | still |
| Headline words | the claim lands as it would be said | load | each word rises 0.45em out of a light blur | 0.8 s, 55 ms stagger, out-quart | same | CSS | static |
| Scroll reveal | content arrives as you reach it | element enters viewport | rise 32 px + fade | first 35% of entry, scroll-linked | same | **no JS** (scroll-driven) | shown |
| Reading progress | how far down the page you are | page scroll | indigo→amber→laterite hairline under the nav | scroll-linked | same | no JS | stays |
| Nav raise | the bar gains weight once content is under it | first 120 px of scroll | shadow e1→e2 | scroll-linked | same | no JS | stays |
| Marquee | the disciplines, like a shop-floor ticker | always; pauses on hover/focus | 40 s linear loop | — | same | CSS | stops and wraps |
| Photo fan | the set opens like cards in a hand | hover on the hero photos | ±10 px, ±2° | 0.7 s out-quart | none (no hover) | CSS | none |
| Spotlight | tiles answer the pointer in their hue | pointer move | radial glow follows the cursor | per frame, batched | resting glow | one delegated listener (PointerFX) | none |
| Lift | a card rises like a part picked off the bench | hover | −6 px + shadow | 0.5 s out-quart | none | CSS | none |
| Magnetic CTA | the main action leans toward the pointer | pointer over it | ≤6 px pull, spring back | 0.35 s spring | none | same listener | none |
| Mega menu | grouped choices with one-line descriptions | click, or hover after 90 ms | fade in | 0.6 s out-quart | phone menu instead | small client component | instant |

Scroll-driven animations ship in Chrome, Safari 26+ and Firefox 159+ (all
engines since October 2026, per caniuse). Browsers without them get the
finished state, never hidden content. The old JS `Reveal` (IntersectionObserver)
is now a server component with no client code.

## Sound (opt-in)

Off by default; a speaker toggle in the bar turns it on and the choice is
remembered. Everything is synthesised with the Web Audio API when it plays, so
**no audio files are downloaded**. Sound marks only moments that carry
information: a ratchet detent every 250 N as the beam is loaded (pitch rises
with load), a low two-tone when the steel would yield, and a click on toggles.
Nothing plays on hover, scroll or page load (`src/lib/sound.ts`).

## The interactive engineering graphic

"Load the beam" (`src/components/BeamLab.tsx`): a steel cantilever, 1 m span,
30 × 50 mm section, S235, E = 200 GPa, Euler–Bernoulli theory. The real control
is a range input (keyboard, screen reader, touch); dragging on the drawing moves
the same value. Colour along the beam is the local bending stress on a scale
made from the four pillar hues, so the hot zone grows from the wall as the load
rises. The deflection is drawn ×10, and the drawing says so. Every value and
formula is stated on screen; nothing is a claim about a project.

## Structure

- **Header**: a floating glass pill. What we do ▾ (for companies / for learners,
  with a real project as the featured story) · Projects · Community · About ▾
  (with the live WhatsApp community as the featured card). Then sound, EN | FR,
  and one indigo action. Only live pages and real channels appear.
- **Home**: hero → honest logo strip ("where the founder has worked and taught";
  the Hub's partner listed apart) → four pillar tiles → the beam lab → projects
  rail → testimonials → founder, *with his track record* (moved out from under the
  hero: they are his numbers, and the Hub is young) → closing band.
- **Closing band + footer**: one continuous indigo night in both themes. The band
  has the question on the left and, on the right, an atmosphere-lit action card
  above a real, named testimonial (picked per page; off on home, which prints all
  of them). The footer has a newsletter card, logo with social icons, columns
  matching the nav groups, a contact column, the founder's affiliations, and a
  wide "4TUNHub" wordmark as the full stop.

## Tools — researched, and what was decided

"Authoring" means a tool for making assets; "runtime" means code that ships.
Prices were checked 2026-11-11.

| Tool | What it is | Licence / price | Fit here | Decision |
|---|---|---|---|---|
| Figma | design and prototyping (authoring) | free tier; paid seats | an MCP is configured but **not authorised in this environment** | not used; nothing was designed in Figma |
| GSAP | timeline animation (runtime) | **100% free incl. commercial use and all plugins** since Webflow, Apr 2025 | ~25–40 KB; strongest for complex choreography | not needed: every effect above is CSS. Revisit for a scroll-told case study |
| Motion | React animation (runtime) | MIT | layout/gesture animation | not needed yet; the budget is better spent on content |
| Rive | interactive vector + state machines (authoring + runtime) | editor free; free exports carry a splash screen, paid plans remove it; runtimes MIT | great for an animated mascot or explainer | later, only with a designed asset to justify it |
| Spline | 3D scenes (authoring + hosted runtime) | free tier; Pro about $25/seat/month | heavy on mobile data | no: 3D/WebGL was rejected before for bandwidth, and that still holds |
| Three.js / R3F | WebGL (runtime) | MIT | as above | no, for the same reason; the beam lab gives interactivity in SVG |
| Theatre.js | timeline editor for the web | free, open source | little recent activity | no |
| Lottie / dotLottie | lightweight vector animations (runtime) | MIT players | good for small loops | later, if an illustrator supplies assets |
| Lenis | smooth scrolling | MIT | changes native scroll feel; can annoy and harms a11y | no |
| Jitter | motion graphics for video/social (authoring) | free tier, paid plans | useful for the YouTube channel and social clips, not the site | yes, for content, outside the site |
| ProtoPie | high-fidelity interaction prototyping | free tier, paid plans | for testing flows with users | optional |
| Framer | site builder + prototyping | paid hosting | a different stack | no |
| Modern CSS / Houdini | `@property`, scroll-driven animations, `color-mix`, masks | browser-native | zero bytes, runs on the compositor | **chosen**: the backbone of the motion language |
| SVG | vector drawing | native | precise, tiny, themable | **chosen** for the beam lab and the icons |
| Web Audio API | synthesised sound | native | no files to download | **chosen** for opt-in sound |

Claude Code wrote code and rendered pages in a real browser (headless Chrome via
CDP) for every critique pass. No design application was installed or used.

## Pillar pages (added 2026-11-11, second pass)

Each pillar page is one room of the same house, in its own hue:
Services indigo, Academy amber, Research green, Community laterite.

- The page is wrapped in `.pillar.hue-*`, which makes the hue the accent:
  eyebrows, inline links, arrow links and focus rings speak in it. The text
  ink of each hue is already AA on paper, surface and night, so no new pair
  was introduced.
- `PageHero` takes `hue`: the hero gets its own atmosphere lit by that hue
  alone (two glows, top-right and left, fading into the page) and the eyebrow
  carries the hue's dot, like the home tiles.
- The rules above step lists (Services' process, Academy's formats,
  Community's ethos) are a 2 px rule in the hue; Services' step numbers too.
- What does **not** change: the action is still amber (the logo's colour is
  the thing you click), the header and footer stay neutral, and the closing
  band stays the shared indigo night (`.band-night` resets the accent).

## Link-preview card and home-screen icon

- `src/lib/og-card.tsx`: drafting paper, indigo ink, the claim in Mona Sans
  800 at 116% width (as the site's headlines), the amber roundel as drawn,
  the indigo→amber→laterite progress hairline as the card's rule. A pillar's
  card sets its eyebrow in that pillar's hue (the Academy card is ochre).
  Always the day palette: a card is a still image and does not follow a clock.
- next/og cannot read WOFF2 or pick a variable instance, so
  `scripts/make-og-fonts.py` cuts two static TTFs from the site's own
  variable file into `src/assets/fonts/` (800/116 and 600/100, 45 KB each).
- `apple-icon`: the amber roundel on the indigo night, "4" in Mona Sans.
  It was never actually served before: the language proxy redirected
  `/apple-icon` to `/en/apple-icon` (a 404). The matcher now excludes it.

## Still to do

- Pillar-page and project-page motion: a scroll-told case study is where GSAP
  would earn its weight.
- The favicon (`icon.svg`) and `4tunhub-mark.svg` still set the "4" in Arial
  Black; redraw them as outlines from Mona Sans when the mark is next touched.
