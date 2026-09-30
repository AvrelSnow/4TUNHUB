# Postcard library

> Ideas ready to be scripted. Each one is **one idea**. When a library idea
> is published it gets a `P` number in `tracker.csv`, and this row keeps its
> `L` number so it can be reused. Pillars, stages and audiences are defined
> in `docs/content-engine.md`.
>
> **Gated** means it can't be made until the assets or facts exist. Never
> fill in the gap with a guess.

**Asset key:** Photo card = a `make-postcards.mjs` card carrying your
portrait · VO = your voice over a video (**your face never appears in
video**) · Screen = screen recording · Card = `make-postcards.mjs` · CAD =
SOLIDWORKS or FEA footage · Photo = real photographs

**Channels:** LinkedIn and X (a thread on X, with the link in the last
reply). No TikTok.

## Platform

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L01** | This is 4TUNHub (= P01) | "I've taught 300+ engineering students. Almost all of them hit the same wall." | Screen + VO; Photo card 00 as thumbnail / X post 1 | Discovery | Students | Follow, visit | Screen, VO, Photo card | Status, quote card, Cohort 1 opener |
| **L02** | 60 seconds inside 4TUNHub | "This is what an engineering ecosystem looks like when it's one person and a lot of nights." | Screen + voice-over | Understanding | Students, young engineers | Follow | Screen | Re-cut after every big site update |
| **L03** | Why the site shows machines, not stock images | "Every image on this site is something we actually built." | Screen + voice-over | Trust | Young engineers, partners | Look at one project | Screen, Photo | Carousel on "real work, not stock" |
| **L04** | The weekly build log (recurring) | "What changed on 4TUNHub this week — and what broke." | Screen + VO | Trust | Everyone who follows | Follow | Screen, VO | A new one every week. Monthly roll-up |

## Founder

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L05** | Why I built 4TUNHub, in the long version | "Tutorials taught me buttons. Machines taught me engineering." | Photo card + LinkedIn essay / X thread | Curiosity | Young engineers | Comment your wall | Photo card | YouTube long, essay, carousel |
| **L06** | What a 319 bn FCFA rail modernisation taught me that school didn't | "At CAMRAIL, nobody asked me for a perfect drawing. They asked me if it would hold." | Photo card + real photos (carousel) | Trust | Young engineers | Save | Photo card, Photo (CAMRAIL, only if allowed) | Carousel, talk |
| **L07** | A decision I reversed: the site went from dark to light | "Six days before launch, I threw away the whole design of 4TUNHub. Here's why." | Before/after screen + VO | Trust | Builders, designers | Follow the build | Screen (the old design, from git), VO | Build log, product-decisions series |

## Build in public

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L08** | What broke this week | "Something on 4TUNHub broke this week. Here's how I found out." | Screen + VO, or Photo card | Trust | Builders, engineers | Follow | Screen, VO | Monthly lessons post |
| **L28** | Week one in numbers (= P07) | "4TUNHub has been public for a week. Here's what happened." | Photo card with the numbers | Trust | Everyone | Follow, apply | Photo card, analytics (**real numbers only**) | Monthly and quarterly numbers |

## Engineering

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L09** | FSAE car: one design decision explained with its FEA plot | "This red spot is where the car would have broken." | CAD + voice-over | Trust | CAD/CAE learners | Save | CAD, FEA images from the project page | Carousel, YouTube lesson |
| **L10** | Banana-pseudostem shredder: problem → approach → result in 45 s | "Farmers throw this away. We built a machine that turns it into something useful." | Photo + voice-over | Interest | Students, partners | Look at the case study | Photo, project page | Services proof, research post |
| **L11** | A fully defined sketch: why the CSWA cares | "Black lines, not blue. Here's why that decides your exam." | SOLIDWORKS screen + VO | Interest | CSWA candidates | Save | CAD, VO | Cohort session teaser, Short |
| **L12** | Engineering judgement: when not to simulate | "The best FEA I ever did was the one I didn't run." | Photo card + LinkedIn essay / X thread | Trust | Young engineers | Comment | Photo card | Essay, carousel |

## Education

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L13** | Tutorial vs project: what employers look at | "Nobody hires you for finishing a tutorial." | Card with 5 points (carousel on LinkedIn, thread on X) | Curiosity | Students | Save, share with a classmate | Card | Carousel, quote card |
| **L14** | A perfect model, a failed exam (= P05) | "You can model the part perfectly and still fail the CSWA." | SOLIDWORKS screen + VO | Interest → Intent | CSWA candidates | Save; Cohort 0 week 2 | CAD, VO | Every cohort's promotion |
| **L15** | $99 is why most never sit it (= P04) | "The SOLIDWORKS certification costs ninety-nine dollars." | Card 02 | Intent | Students | Apply | Card | Every cohort with a voucher |

## Community

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L16** | What a SOLIDWORKS user group actually does | "483 engineers in one group. Here's what happens there." (recheck the count on the day) | Photos + voice-over | Trust | SOLIDWORKS users | Join the SWUG on Bevy | Photo (real meetups) | Partner post, Cohort promotion |
| **L17** | One member, one sentence (one of the three testimonials on the site) | Their sentence, as the hook | Quote card with their photo | Trust | Students | Visit | The photo and quote in `src/lib/testimonials.ts` | **Confirm the "Fortune Hub" → "4TUNHub" substitution with each person first** |
| **L18** | Ambassador reveals | "One of ten engineers carrying Cohort 0 to their own circle." | Card with their face, **posted by them** | Discovery | Their networks | Apply | `AMBASSADORS` in the script | Cohort 1 ambassadors |

## Vision

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L19** | Where 4TUNHub is going: what's live, what's being built, what's only an idea | "Here's what exists on 4TUNHub, and what doesn't yet." | Screen + VO, with an honest status for each | Interest | Partners, young engineers | Follow | Screen (Products page statuses), VO | Quarterly update |

## Cohort / opportunities

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L20** | Cohort 0 is open (= P03) | Existing copy in `cohort-0-campaign.md` | Card 01 (+ X thread) | Intent | Students | Apply | Card | Template for every cohort |
| **L21** | FAQ: "I'm a beginner / Student Edition only / I work evenings" | "Three reasons people think they can't apply. None of them are true." (only answers that are on record) | Photo card (LinkedIn) / thread (X) | Intent → Action | Students | Apply | Photo card | Pinned FAQ, cohort page copy |
| **L22** | How to get a seat in four steps (= P06) | "Four steps, none of them cost money." | Screen recording of Bevy → LinkedIn → form → screenshots | Action | Applicants | Apply today | Screen, Card 04 | Every cohort with conditions |
| **L23** | Seats left / closing tonight | "{real number} seats left." | Card 08 / 07 | Action | Warm audience | Apply | Card (set `SEATS_LEFT`) | Every deadline |

## Partnership (all gated on `launch-campaign.md` §6)

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L24** | Why these groups are teaching together | Written only after each partner's contribution is confirmed in writing | Card with the partners' photos and logos, as a story rather than a logo wall | Trust | SOLIDWORKS users, students | Apply | Every partner's required assets | Cohort 1 and joint events |
| **L25** | Partner spotlight: MKV Academy / Celestine Dona, in their own words | Their own 15–30 s video, if they send one | Their video, or a card with a photo | Trust | Students, educators | Follow them, apply | Photo, logo, approved description | Repeat for each partner |

## Social proof (from 21 October)

| ID | Concept | Hook | Format | Stage | Audience | CTA | Assets | Reuse |
|---|---|---|---|---|---|---|---|---|
| **L26** | Cohort 0, week N: what the participants built | "Week 2. This is what twenty engineers built." | Screenshots from participants (with permission) | Trust | Students | Follow | Participant work | Cohort 1 promotion |
| **L27** | Results: pass rate and testimonials | The real pass rate, whatever it is | Photo card | Intent (Cohort 1) | Students | Join the waitlist | **Real results only, mid-November** | The Cohort 1 launch, the Academy page |
