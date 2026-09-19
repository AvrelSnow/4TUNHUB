# Launch plan: site live + free CSWA Cohort 0

> Decided 2026-09-18. Fortune: *"Let's not rush into selling. In the
> beginning it will be free. Plan it so we can launch earlier. We start next
> week, with night shifts if necessary."*
> This supersedes rung 1 of `strategy.md` (paid pre-sale): the first cohort
> is **free**, and the paid cohort follows once there are results to show.

---

## Why free first is the right call

A free cohort buys what money can't yet buy: a **pass rate**, **testimonials**,
an **email list** and **word of mouth** in the SolidWorks group and on
campuses. Cohort 1 is then sold on evidence, not on a promise.

Free only works if it is **not casual**. People value what they had to
earn a place in. So Cohort 0 is:

- **selective:** 20 seats, by application;
- **committed:** attend at least 6 of 8 sessions and hand in the weekly
  exercise, or the seat goes to the waiting list;
- **paid back in proof:** every participant sits a timed mock exam at the
  end, agrees to share their result, and gives a short testimonial.

## Cohort 0 at a glance

| | |
|---|---|
| Name | **Bootcamp CSWA · Cohorte 0** (in French) |
| Price | Free, for 20 selected people |
| Format | 8 live evening sessions over 4 weeks + exercises in a WhatsApp group |
| Schedule | **Wednesday and Friday, 19:30–20:30** (Mon/Tue are teaching days and leave no energy; the W37 score showed it) |
| Tools | Google Meet (60 min fits the free limit). Recorded locally with OBS, so replays exist. |
| Prerequisite | SolidWorks installed on their computer (any recent version) |
| Outcome | Ready to sit the CSWA: two timed mock exams passed |
| The exam | Costs **$99** unless they have a voucher. **The SOLIDWORKS Student Edition includes a free CSWA voucher**, and schools that are Academic Certification Providers can issue vouchers. The course is free; the exam is the participant's choice. Say this plainly on the page. |

### Syllabus (mapped to what the CSWA tests)

| Week | Wednesday | Friday | Exercise |
|---|---|---|---|
| 1 · 7–9 Oct | Sketching, relations, fully defined sketches | Extrude, revolve, cut: first exam-style part | 2 parts from drawings |
| 2 · 14–16 Oct | Advanced features: fillets, patterns, shells, ribs | **Materials and mass properties**: the answer format the CSWA checks | 3 mass-property parts |
| 3 · 21–23 Oct | Assemblies and mates | Coordinate systems, centre of mass in an assembly | 1 assembly, 3 questions |
| 4 · 28–30 Oct | Drawings, plus exam strategy and timing | **Timed mock exam**, reviewed live | Mock exam 2 at home |

Results and testimonials are collected in the first week of November.
Cohort 1 (paid) is announced with those results.

---

## The calendar

Today is Friday 18 Sep. W39 = 21–27 Sep.

### W39: go live and open applications

| Day | Fortune | Claude (in session) |
|---|---|---|
| **Sat 19–Sun 20** | Finish W38. If today's timed CSWE practice went well, book the real exam. | — |
| **Mon 21–Tue 22** | Teaching. **No night shift** on these days. | — |
| **Wed 23** morning | **Buy the domain** (4tunhub.com, about $10–15/yr) · create free **Netlify** and **Resend** accounts · set up `hello@` email forwarding to Gmail | **Cohort 0 page** on the Academy (EN + FR) · application form (topic "CSWA Cohort 0": name, email, WhatsApp, school/employer, SolidWorks version, why) · short **privacy note** (we now collect personal data) |
| **Wed 23** night shift, 20:00–23:00 | **Export the hero simulation** (LS-DYNA still, ≥1600 px, dark or transparent background) | Swap the stock car for it · wire the form to Resend |
| **Thu 24** morning | Write the announcement in your own voice (Claude drafts, you correct) | **Deploy to Netlify** · connect the domain · end-to-end test: submit an application and receive it |
| **Thu 24** night shift, 20:00–23:00 | Syllabus weeks 1–2 in detail · build the exercise parts | Launch-gate checks (below) |
| **Fri 25** | **LAUNCH.** Site public, applications open. Announce in: the WhatsApp community, the SolidWorks user group, LinkedIn, a YouTube community post, one TikTok Volume slot | Watch the form and fix anything live |
| **Sat 26–Sun 27** | YouTube Ep 11 · train · score the week | — |

### W40: applications and preparation (28 Sep–4 Oct)

- Applications close **Thursday 1 Oct**. Select 20, keep a waiting list.
- **Fri 2 Oct:** acceptance messages, create the WhatsApp group, check
  everyone has SolidWorks running (a 10-minute "can you open this part" test).
- Night shifts **Wed 30 Sep and Thu 1 Oct**: session 1–4 material.

### W41–W44: the cohort runs (7 Oct–30 Oct)

Two sessions a week, Wednesday and Friday evenings. Material for weeks 3–4
is finished during weeks 1–2, never the night before.

---

## Synced plans

- **The Lab** (`lab.4tunhub.com`) has its own repo and plan:
  `C:\4TUNHUBLAB.COM\docs\lab-plan.md`. Target public beta mid-December 2026.
  It never takes a night shift during W39–W44.
- **Launch rule for both sites** (decided 2026-09-19): go live only when
  every gate below passes AND the site scores ≥ 80/100 on its frozen
  checklist. The dates are targets; the checklist permits the launch.
- **Posting in public** (LinkedIn + X): `C:\4TUNHUBLAB.COM\docs\build-in-public.md`.
  Before the first post: domain bought, all handles secured (Wed 23 Sep).
  Series A starts on launch day.

## Launch gates: nothing goes public until each is true

| Gate | Why | Status |
|---|---|---|
| Stock CFD car removed from the hero | A pngwing image with unclear licence, on a commercial site | Needs his simulation (Wed 23) |
| The CSWE line is true | The founder page lists "CSWE, 2026". He has not sat it yet. If it isn't passed by Fri 25, the public site says **"CSWE candidate"** until the day he passes. Changing one word back is trivial; a false certification claim found by a student or client is not. | Open |
| The contact form really delivers | Applications that silently vanish would kill Cohort 0 | Needs Resend (Wed–Thu) |
| Contact email on our domain | `hello@4tunhub.com` instead of Gmail | Needs the domain (Wed 23) |
| Privacy note published | The form collects names, emails and phone numbers | Claude, Wed 23 |
| Host allows commercial use | Vercel's free Hobby plan forbids commercial use. **Netlify's free plan allows it.** | Netlify chosen |
| `/blueprint` stays out of search | Internal spec page | Already noindex + robots |

**Plan B if the deploy slips:** applications go through a Google Form linked
from the WhatsApp announcement, and the site follows a few days later. The
cohort date does not move.

---

## What comes out of W39 to make room

The weekly system allows 13 tasks. Launch week can't add work on top of
them, so this is the proposed W39:

**Tier A (50)**
- **20:** 4TUN Hub go-live: site public, Cohort 0 page, applications open
- **15:** Sit the CSWE (if Friday's practice exam passed), else CSWE prep
- **15:** Cohort 0 preparation: syllabus weeks 1–2, exercise parts, selection criteria

**Tier B (25):**
- REM Ep 11
- YouTube Ep 11 (owed twice)
- **Cohort 0 announcement pack** (WhatsApp + SolidWorks group + LinkedIn + YouTube post)
- **1** TikTok Volume, down from 2

**Out this week:**
- **YouTube Ep 12:** the announcement pack is the week's second piece of content.
- **The second TikTok Volume.**
- **The Ansys courses, if they are unfinished.** They move to W40.

**Unchanged:** BOOK, Train, and the four Tier D habits.

Night shifts: **Wed and Thu only, 20:00–23:00, two per week at most.** The
40% week (25 Aug–2 Sep) showed that overload doesn't produce more finished
work.
