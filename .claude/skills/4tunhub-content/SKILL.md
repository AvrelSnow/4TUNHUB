---
name: 4tunhub-content
description: The 4TUNHub content principles and postcard system. Use for ANY 4TUNHub social, marketing or campaign work - LinkedIn or X (Twitter) posts and threads, captions, scripts, postcards/cards, launch or cohort campaigns, partner announcements, content calendars, repurposing, or content metrics. Load before drafting anything that will be published.
---

# 4TUNHub content

Read these before drafting. Each one is the source of truth for its topic.

| File | What's in it |
|---|---|
| `docs/content-engine.md` | The system: pillars, funnel, audiences, photo rules, platform adaptation, timing, metrics, template, pipeline, repurposing, visual system |
| `docs/launch-campaign.md` | The campaign that is running now, and the partner asset gate (§6) |
| `docs/content/postcard-library.md` | Ideas that are ready to script |
| `docs/content/tracker.csv` | What was published and how it performed. Append a row per postcard |
| `docs/content/postcards/` | Full packages for scripted postcards (`P01-…` is the example) |
| `scripts/make-postcards.mjs` | Generates on-brand cards at 1080×1350 and 1080×1920. Add cards here instead of designing them by hand |
| `docs/cohort-0-campaign.md` | Cohort 0 captions and card copy (its schedule is replaced by launch-campaign.md) |
| `docs/launch-plan.md`, `src/lib/cohort.ts` | Cohort 0 facts of record |

## Principles

1. **The brand name is 4TUNHub**: one word, with "Hub" in title case. It is never
   "Fortune", "Fortune Hub", "4TUN Hub" or "4tunhub" in running text. The
   only exceptions are official assets that already spell it differently:
   the logo artwork and the YouTube handle `@4TUNHUB`. Auto-captions will get
   it wrong, so correct them every time.
2. 4TUNHub is an **engineering and education ecosystem being built in public**,
   not a personal portfolio and not a course shop. The founder, Donfack
   Fortune, is the credibility behind it, not the product.
3. **Founder-led storytelling, without the founder on camera.** Fortune's
   face **never appears in videos**. His photograph appears **only on the
   postcards** (static cards: `00-this-is-4tunhub`, `05-who-teaches`), and a
   photo card can be the LinkedIn video thumbnail. Videos are screen
   recordings or engineering footage with his **voice** over them, and they
   open on movement with the hook burned in, never on a logo. The balance
   to aim for is person (photo cards) → platform → community.
4. A **postcard** is a reusable short-form asset that says **one idea**, with
   one CTA. It gets a P/L ID and a row in the tracker.
5. **One idea produces several assets**: X thread, LinkedIn video, LinkedIn
   text, WhatsApp Status, quote card, carousel, a long video, and a later
   offer post.
6. **Balance the pillars**: platform, founder, build in public,
   engineering, education, community, opportunities. **No more than about
   half the posts in any week ask for something**, even during a campaign.
7. **Launches are staged.** Discovery → Curiosity → Understanding → Trust →
   Interest → Intent → Action. Every postcard names its stage and one primary
   audience.
8. **Partnership announcements need a narrative**: why these organisations
   are working together, not a wall of logos. **No partner visual is made
   until the required assets are in hand and the partner has approved, in
   writing, the sentence describing their contribution.**
9. **Cohort promotion grows out of the ecosystem story.** A cohort is the
   first thing 4TUNHub *does*, presented as proof, not as an interruption.
10. **Never invent** partner details, dates, prices, seat counts, curricula,
    links, numbers, testimonials or claims. Every fact must be on record in
    the repo or confirmed by the person it concerns. If a fact is missing,
    leave a visible gap and ask. A build-in-public post that reports small
    real numbers is fine; an inflated one is not.
11. **Mobile-first and professionally designed**, in the site's identity:
    Instrument Sans, ink and white, amber only as a fill for the one thing
    that must not be missed, real photographs, no stock. Details are in
    `content-engine.md` §12 and `docs/art-direction.md`.
12. **The channels are LinkedIn and X**, plus WhatsApp and YouTube for
    distribution. **No TikTok.** Adapt for each platform; never paste the
    same post. LinkedIn goes out from the personal profile: professional
    insight, a real question at the end, no links in awareness posts. X is
    a thread: the hook and the asset in post 1, one idea per reply, and the
    link only in the last reply. One 4:5 video file serves both.
13. **Measure, then iterate.** Qualified views, completion, profile and site
    visits (with UTM tags), follows, saves, and for offers, visits → started →
    completed applications. **Views alone are not success.** After two weeks,
    your own analytics override generic timing advice.
14. **Reuse the system** for every future launch, cohort, event, course and
    partnership. Improve these files instead of starting new ones.
15. **Publishing beats perfecting.** When the choice is between more
    planning and a postcard going out today, the postcard goes out.

## Voice

First person as Fortune: direct, specific, technically confident. Use
numbers, names and places. Avoid: world-class, cutting-edge, seamless,
innovative solutions, unlock, empower. No emoji as section markers, no
exclamation marks in hooks. Claude drafts; Fortune rewrites anything that
isn't true in his own words.
