# 4TUNHub launch campaign: 27 September → first session

> Written 27 September 2026. Replaces the **schedule** in
> `docs/cohort-0-campaign.md`, which assumed posting started on 25 September.
> The captions and cards in that file are still valid and are reused below.
> The system this campaign runs on is described in `docs/content-engine.md`.
> The ideas it draws from are in `docs/content/postcard-library.md`. What was
> posted and how it did goes in `docs/content/tracker.csv`.

> **2 October 2026: Cohort 0 no longer runs with Douala City SWUG.** It is taught
> in partnership with **MKV Academy** (Joseph Celestine Donald, CSWE, co-teaches).
> A seat now asks for four follows (4TUNHub and MKV Academy, each on LinkedIn
> and YouTube) and **four screenshots proving them**; no screenshots, no seat.
> No Bevy: the sessions are online, link sent to the selected (platform to be
> agreed with MKV, likely Jitsi Meet). The voucher stays, no supplier named.
> The copy below has been brought into line with this.

**Working assumption: nothing about the launch has been posted yet.** If the
25 September posts did go out, skip P01–P03 and go straight to Day 4.

---

## 1. Verdict on "3–5 days of 4TUNHub only, then partners, then cohort"

**Don't do it. Spend two days on the platform, open the cohort on day 3, and
reveal the new partners in the middle of the application window instead of
before it opens.**

There are four reasons, and each of them can be checked.

1. **The site is already announcing the cohort.** Every page on 4tunhub.com
   opens with the amber ribbon: *"CSWA Bootcamp · Cohort 0 is free, with 20
   seats. Applications close 11 October."* A "this is 4TUNHub" post that says
   nothing about the cohort sends people to a page whose first line is the
   cohort. So the posts can't keep it a secret; they can only look like
   they're hiding something the site says in the first line.
2. **Every day of the window counts.** There are 14 days to the 11 October
   close, so five quiet days use up 36 % of the window. Applying takes four
   steps (four follows, then four screenshots that prove them), and the screenshots are the known bottleneck. People who
   see the cohort late apply late, and late applicants forget the screenshots.
3. **The cohort is the best evidence of what 4TUNHub is.** "An engineering
   ecosystem" is an abstract claim. "It is running a free CSWA bootcamp with
   MKV Academy, with an exam voucher for everyone who finishes" is
   concrete. The cohort shows what the platform does; it doesn't
   distract from it.
4. **The partner reveal needs things you don't have yet**: logos, a
   photograph of Joseph Celestine Donald, approved wording for each partner's
   contribution. Putting it before the cohort ties the whole campaign to
   other people's response times. Putting it mid-window turns it into a
   news beat on the days when attention usually drops, and the campaign still
   works if it slips.

**Your instinct is right on one point.** The first two posts should feel like
"something has been built," not "apply now." So P01 and P02 are
platform-first, and each ends with one line that points ahead: *"the first
thing it's running opens on Tuesday."*

### How the four strategies compare

| | A: platform first, partners, then cohort | B: platform + early hint | C: platform and cohort on the same day | **D: proof-led (recommended)** |
|---|---|---|---|---|
| Consistent with the live site | No, the ribbon already names the cohort | Partly | Yes | Yes |
| Days of the window used for applications | ~6–8 | ~9 | 14 | **12** |
| Feels like advertising | Low | Low | **High**: the first thing anyone hears from 4TUNHub is a request | Low for 2 days, then the cohort arrives as proof |
| Depends on partner assets arriving | **Yes**, and it blocks everything | Yes | No | **No**, the reveal is a mid-window boost |
| Long-term positioning | Good | Good | Weak: 4TUNHub looks like "the bootcamp people" | Good: the platform is introduced first and the cohort is its first project |

**D is B with the partner reveal moved after the opening.** MKV Academy
signed on 1 October and is already on the site, so it is part of the
opening. No SWUG, Douala or Benin, is part of Cohort 0.

---

## 2. Campaign map

```
27 Sep     28 Sep        29 Sep            30 Sep – 4 Oct         5 – 7 Oct            8 – 9 Oct      10 – 11 Oct     12 – 20 Oct     21 Oct
REVEAL  →  UNDERSTAND →  COHORT OPENS   →  REASONS TO APPLY    →  PARTNER REVEAL    →  OBJECTIONS  →  FINAL PUSH  →  ONBOARDING  →  SESSION 1
P01        P02           P03 (+MKV         P04–P07 + ambassador   (gated; if not ready,   P10–P11       P12–P13       replies,
"This is   60 s inside   Academy, already  reveals on their       the slot goes to an                                 WhatsApp group,
4TUNHub"   the platform  public)           own accounts           engineering postcard)                               part-open check
Discovery  Understanding Intent            Trust → Intent         Trust                  Intent          Action          —
```

The funnel levels (Discovery → Action) are defined in
`docs/content-engine.md` §3. Even inside the application window, at least
three posts in seven are not about the cohort. That keeps 4TUNHub from
turning into a bootcamp account.

---

## 3. The 11 October date

**11 October 2026 is a Sunday.** Cohort 0 is scheduled on Wednesday and
Friday evenings. On the site, on the cards and in the decision log, the 11th
is when applications **close**, and the first session is **Wednesday 21
October**.

- **As the application deadline: feasible, but tight.** There are 12 days
  between the cohort opening and the close. Seats are given out on a rolling
  basis, so the pressure stays on even though the window is longer.
- **As the first session: not feasible.** There would be no time to select
  applicants, reply to them, check that each one can open a SOLIDWORKS part,
  or confirm what MKV Academy is contributing. It is also a Sunday, and the
  sessions run midweek. **Keep 21 October.**

**What would force a change:** if the MKV partnership changes the
curriculum, the language, the seat count or the price, update the site
(`src/lib/cohort.ts` and the dictionaries) *before* the partner reveal. If
that can't be done by 4 October, reveal the partners with the cohort as it
stands, and let their contribution appear in Cohort 1.

---

## 4. The first seven days

Times are Cameroon time (WAT, UTC+1). The reasoning is in
`docs/content-engine.md` §7. **Mondays and Tuesdays are teaching days**, so
those posts are recorded on Sunday or are cards that already exist.

**Channels: LinkedIn and X in English, Facebook in French.** No TikTok. **Your face never appears in a
video.** Videos are screen recordings or engineering footage, with your
voice over them. Your face appears only on **postcards** (the static cards),
where your photograph carries the trust.

| # | Date | Stage | Postcard | Video (no face) | Card with your photo? | Length |
|---|---|---|---|---|---|---|
| P01 | **Sun 27 Sep** | Discovery | **This is 4TUNHub** | Screen recording of the site + voice-over | **Yes**: `00-this-is-4tunhub` | 40–60 s |
| P02 | Mon 28 Sep | Understanding | **60 seconds inside 4TUNHub** | Screen recording + voice-over | No | 45–60 s |
| P03 | Tue 29 Sep | Intent | **Cohort 0 is open** | None | No: `01-announcement` | Static |
| P04 | Wed 30 Sep | Intent | **$99 is why most never sit it** | None | No: `02-voucher` | Static |
| P05 | Thu 1 Oct | Interest | **Why people fail the CSWA with a perfect model** | SOLIDWORKS screen + voice-over | No | 45–60 s |
| P06 | Fri 2 Oct | Action | **How to get a seat, in three steps** | Screen recording of the four follows → form → screenshots page | No | 40–50 s |
| P07 | Sat 3 Oct | Trust | **Week one of 4TUNHub, in numbers** | Optional: screen of the analytics | **Yes**: a numbers card with your photo | Static |

Every post needs a reply to its comments within the first hour. LinkedIn
weighs early comments, X weighs replies that the author answers, and a
question answered in public often gets an application from someone else
who reads the answer.

### Detail for each day

**P01 · Sun 27 Sep · "This is 4TUNHub"**: the full package is in
`docs/content/postcards/P01-this-is-4tunhub.md`.
- Hook: *"I've taught more than three hundred engineering students. Almost all of them hit the same wall."*
- Message: 4TUNHub exists, it is live, and it is built in public.
- CTA: follow, and look at 4tunhub.com.
- LinkedIn: from your **personal profile**. A native video (the site on screen, your voice) with card `00` as its **custom thumbnail**, so the first thing people see is your face on a postcard. 180-word post, **no link in the text**. The company page reshares two hours later.
- X: a three-post thread. (1) The hook plus card `00` with your photo. (2) The video. (3) The link, with UTM tags. X's link penalty applies to the post itself, so the link goes in the reply.

**P02 · Mon 28 Sep · "60 seconds inside 4TUNHub"** (record it on Sunday, straight after P01)
- Hook: *"This is what an engineering ecosystem looks like when it's one person and a lot of nights."* (Change it if it isn't true in your own words.)
- Message: what is live today: Projects (six machines), Services, Academy, Research, the founder page with twelve talks.
- Visuals: a phone screen recording of 4tunhub.com. Scroll the home page, open one project, then Academy → Cohort 0, and stop on the ribbon.
- Last line: *"And the first thing it runs opens on Tuesday."*
- LinkedIn: the video with a 120-word caption listing the five sections in one line each.
- X: the video in post 1 with a one-line hook, then one reply per section (five short posts), then the link.
- CTA: follow so you see Tuesday's post.

**P03 · Tue 29 Sep · "Cohort 0 is open"**
- Reuse the launch copy from `docs/cohort-0-campaign.md` for WhatsApp, LinkedIn and YouTube. Every fact in it matches the live site. Its TikTok to-camera script is dropped.
- LinkedIn: card `01-announcement` plus the existing LinkedIn caption. This is a conversion post, so **the link goes in the text** and you accept the reach penalty. The research note in section 8 has the numbers.
- X: a thread. (1) *"The SOLIDWORKS certification costs $99. That's why most engineering students here never sit it. So we're running a free bootcamp for it."* plus card `01`. (2) Dates, format, the voucher. (3) The four conditions. (4) The deadline and the link.
- Same day: send the ambassador invites if they haven't gone out (see section 5).

**P04 · Wed 30 Sep · "$99"**: card `02-voucher` with its existing caption on LinkedIn. On X, the card plus one sentence: *"Finish Cohort 0, keep the voucher."* The link goes in the reply.

**P05 · Thu 1 Oct · "A perfect model, a failed exam"**: an engineering lesson with no face. A SOLIDWORKS screen recording shows a mass-properties answer in the wrong units or with the wrong number of decimal places, with your voice explaining. This is the idea behind the old `06-one-thing` caption, moved earlier because it is the most useful thing in the set.
- Hook: *"You can model the part perfectly and still fail the CSWA."*
- CTA: *"Save this for exam day. Week 2 of Cohort 0 is about nothing else."*
- X: the video plus a 3-post thread of the three traps (units, decimals, the clock). Threads hold attention on X.

**P06 · Fri 2 Oct · "How to get a seat"**: a screen recording of the three steps (four follows, the form, four screenshots), in the order the applicant does them. Card `04-how-to-get-a-seat` goes on LinkedIn; the video goes on both.
- End on the screenshots page (`/academy/cohort-0/screenshots`), because that is the step people forget.

**P07 · Sat 3 Oct · "Week one, in numbers"**: build in public, as a **card with your photo** and the real numbers from analytics and the form: visits, applications, countries, and whatever broke. Claude generates the card once you have the numbers. **Invent nothing.** If a number is small, say it's small. That is part of the trust this post is building.
- Hook: *"4TUNHub has been public for a week. Here's what happened."*
- X: the card, then one reply per number, each with a sentence on what it taught you.

### Facebook, in French

The same postcard each day, written for Facebook in French, not
translated line by line. Use the French card where there is one (P01:
`00-this-is-4tunhub-fr`). Cards 01–08 exist only in English for now. Every
link goes to the French site (`4tunhub.com/fr/…`) with
`utm_source=facebook`. **The sessions are in English, and every
cohort post says so.** A French-speaking reader who finds that out on day
one of the cohort is a seat lost.

**P01 · dim. 27 sept.**: the full text is in `docs/content/postcards/P01-this-is-4tunhub.md`.

**P02 · lun. 28 sept.**
> Voici ce qui existe déjà sur 4TUNHub, en 60 secondes : six machines
> documentées de bout en bout — le problème, la démarche, le résultat —, des
> services d'ingénierie, une Académie, de la recherche, et douze
> interventions publiques sur la page du fondateur.
>
> Tout n'est pas fini. Mais tout ce que vous voyez est réel.
>
> Et la première chose que 4TUNHub lance ouvre mardi.

**P03 · mar. 29 sept.**: card `01-announcement`
> La certification SOLIDWORKS (CSWA) coûte 99 $. C'est pour ça que la
> plupart des étudiants en ingénierie d'ici ne la passent jamais.
>
> Alors 4TUNHub et MKV Academy lancent un bootcamp gratuit pour s'y
> préparer, animé par Donfack Fortune et Joseph Celestine Donald, CSWE :
> huit soirées en direct, les mercredis et vendredis de 19h30 à 20h30, du
> 21 octobre au 13 novembre. **Les sessions sont en anglais**, en ligne, et
> enregistrées.
>
> Tous ceux qui terminent la cohorte reçoivent un bon d'examen CSWA
> gratuit.
>
> 20 places, sur candidature. Pour être accepté :
> 1. Suivre 4TUNHub sur LinkedIn et YouTube
> 2. Suivre MKV Academy sur LinkedIn et YouTube
> 3. Candidater, puis envoyer **quatre captures d'écran**, une par
>    abonnement. Pas de captures, pas de place.
>
> Il vous faut SOLIDWORKS sur votre ordinateur — n'importe quelle version
> récente, l'édition étudiante suffit.
>
> Candidatures jusqu'au dimanche 11 octobre. Les places sont attribuées au
> fil des candidatures, pas toutes à la fin.
>
> Candidater : https://4tunhub.com/fr/academy/cohort-0?utm_source=facebook&utm_medium=social&utm_campaign=launch-2026&utm_content=p03

**P04 · mer. 30 sept.**: card `02-voucher`
> Passer la CSWA coûte 99 $. Pour beaucoup de très bons étudiants, c'est la
> seule raison pour laquelle ils ne la passent jamais.
>
> Terminez la Cohorte 0, et le bon d'examen est à vous, gratuitement.
> 20 places, candidatures jusqu'au 11 octobre. Sessions en anglais.

**P05 · jeu. 1 oct.**: the SOLIDWORKS video, with a French voice-over or subtitles
> On peut modéliser la pièce parfaitement et quand même échouer à la CSWA.
>
> Les trois pièges : les unités, les décimales, et le chrono. L'examen
> vérifie votre réponse dans le format qu'il demande — pas dans celui de
> votre document.
>
> Enregistrez ce post pour le jour de l'examen. La semaine 2 de la Cohorte 0
> ne parle que de ça.

**P06 · ven. 2 oct.**: the screen recording plus card `04-how-to-get-a-seat`
> Une place gratuite qui ne coûte rien à obtenir, c'est une place où
> personne ne vient.
>
> Alors voici ce que coûte une place dans la Cohorte 0 : trois étapes, et
> aucune n'est de l'argent. Suivre 4TUNHub et MKV Academy, candidater,
> envoyer les quatre captures d'écran. La plus oubliée, c'est la dernière,
> et sans elle il n'y a pas de place.
>
> Faites-les cette semaine, pas le 10.

**P07 · sam. 3 oct.**: a card with your photo and the real numbers
> 4TUNHub est en ligne depuis une semaine. Voici ce qui s'est passé :
> [les vrais chiffres — visites, candidatures, pays, et ce qui a cassé].
>
> Rien d'inventé. Si un chiffre est petit, il est petit — c'est comme ça
> qu'on construit en public.

---

## 5. The rest of the window

| Date | Stage | What goes out | Condition |
|---|---|---|---|
| Sun 4 Oct | Trust | Card `05-who-teaches` + caption (founder) | — |
| Mon 5 – Wed 7 Oct | **Partner reveal** | Two posts: (1) *why* 4TUNHub and MKV Academy are teaching together, (2) spotlight on Joseph Celestine Donald, CSWE, co-instructor. Library L24–L25 | **Only if the gate in §6 is met.** Otherwise put engineering postcards in these slots (L09, L10) and move the reveal as late as Thu 8 Oct |
| Thu 8 Oct | Action | Card `08-seats-left`, with `SEATS_LEFT` set to the **real** number | Regenerate the card the same morning |
| Fri 9 Oct | Objections | L21 FAQ, as a card with your photo on LinkedIn and a thread on X: *"I'm a beginner / I only have the Student Edition / I work evenings."* WhatsApp nudge to everyone who applied without all four screenshots | — |
| Sat 10 Oct | Action | X: "Tomorrow night" post, reposting the P03 thread | — |
| Sun 11 Oct | Action | Card `07-closing` + caption. Applications close at the end of the day | — |
| Mon 12 – Fri 16 Oct | Onboarding | Select 20 and keep a waiting list. **Every applicant gets a reply by Fri 16**. Cohort WhatsApp group, 10-minute "can you open this part" check | Night shifts on Wed 14 and Thu 15 for session 1–4 material |
| Sat 17 – Tue 20 Oct | Onboarding | Reminder with the session link to the 20 selected. A build-in-public post: *"Twenty people start on Wednesday."* | — |
| **Wed 21 Oct** | — | Session 1 | — |

**Ambassadors.** The original plan depended on a 48-hour task on launch
day. If that didn't happen, run a smaller version:
- Invite 20–30 people on Mon 28 and Tue 29.
- The task: share P03 and send a screenshot within 48 hours. It closes on Thu 1 Oct.
- Reveal cards go out Sat 3 to Tue 6 Oct, two a day, and **each ambassador posts their own**.

Everything else in `docs/ambassadors.md` stays as written.

---

## 6. Partner asset checklist

**The gate: no partner visual is made until all the "required" items for
that partner are in hand, including written approval of the sentence that
describes what they contribute.** Nothing about any partner is written from
memory or inferred.

### MKV Academy (Joseph Celestine Donald, CSWE)

| Item | Required? | Notes |
|---|---|---|
| Official logo, SVG or PNG with a transparent background, plus a version for dark backgrounds | Required | And permission to use it on social media and on 4tunhub.com |
| Professional photograph of Joseph Celestine Donald | Received 2 Oct | Portrait, at least 1080 px, with permission to use it |
| Exact name and title | Done | Joseph Celestine Donald, CSWE, Co-Founder (from the signed agreement) |
| The academy's official name and a one- or two-sentence description in their own words | Required | |
| **What MKV contributes to Cohort 0**, in one sentence they approve | Done | Co-teaching and practical guidance (agreement clause 2) |
| Does this change anything on the site? Language, dates, seat count, price, curriculum, platform | Required | Platform still open (clause 5): likely Jitsi Meet |
| Social links: LinkedIn page, X account, website | Required | For tagging. Check that each one opens |
| Who approves the joint posts on their side, and how quickly they can | Required | |
| Relevant achievements (numbers, students trained, accreditations) | Optional | Only what they can support with evidence |
| Brand requirements: colour, clear space, how their logo sits next to ours | Optional | |
| A 15–30 s video of Joseph saying why MKV joined | Optional | The strongest single asset for the reveal |

*(The Douala City and Benin SWUG checklists were removed on 2 October:
neither group is part of Cohort 0.)*

**Ask for all of it today, in one message per partner**, listing the
required items and asking for them **by Thursday 1 October**. That leaves
Friday and Saturday to build the reveal cards.

---

## 7. Metrics that decide what happens next

The full model is in `docs/content-engine.md` §8. For this window:

| Stage | Decision metric | Signal that something is wrong | What to do |
|---|---|---|---|
| Reveal (P01–P02) | Profile visits, follows, **site visits by source** | Views but no site visits | Put the URL on screen earlier and name one specific thing to look at |
| Cohort open (P03–P06) | **Cohort page visits → applications started → completed with screenshots** | Visits but few applications | The form or the requirements are the friction, not the content. Ask three people who didn't apply why |
| Final push | Completed applications against the target | Below target by Thu 8 | Lean on ambassadors and personal DMs. DMs convert far better than posts |
| Onboarding | Replies sent, part-open checks passed, **session-1 attendance** | — | — |

**Target, stated as an assumption to replace by 1 October:** 20 seats need
roughly **40–50 completed applications**. That allows for a waiting list and
the no-show rate usual for free programmes (free webinars average 40–50 %
live attendance, per Livestorm and ON24). Selection and the four conditions
should do better than that, but plan as if they don't. At an unmeasured
2–4 % visit-to-application rate, that is about **1,200–2,500 visits to the
cohort page**. Replace both rates with real numbers once P03 has run for
48 hours.

**Before P01 goes out, check that analytics is actually running.**
`ANALYTICS_PROVIDER` and `ANALYTICS_SITE_ID` must be set on Netlify, and the
site redeployed. Without that, none of the platform metrics above can be
measured, and launch week's numbers can't be recovered later.

---

## 8. What the research says, and how far to trust it

Most 2026 sources on this are platform-tool vendors (SocialPilot, Hootsuite,
Sprout, Buffer). Treat their percentages as directions, not constants.

- **Post from the personal profile.** Company-page organic reach on LinkedIn
  is reported at about 1–2 %, and personal profiles reach several times
  further ([SocialPilot](https://www.socialpilot.co/blog/linkedin-algorithm),
  [Dataslayer](https://www.dataslayer.ai/blog/linkedin-algorithm-february-2026-whats-working-now)).
  The 4TUNHub page reshares posts; it doesn't lead.
- **Links cost reach on LinkedIn, and so does putting the link in the first
  comment.** That workaround is reported as penalised since early 2026. So
  awareness posts carry no link, and conversion posts include the link
  and accept the cost. *This corrects `docs/cohort-0-campaign.md`, which
  said to put the link in the first comment.*
- **LinkedIn rewards dwell time, comments and saves** over likes
  ([meet-lea](https://meet-lea.com/en/blog/linkedin-algorithm-explained)).
  Text that holds attention for more than 15 seconds and ends with a real
  question does better than a slogan.
- **On X, links in the post itself cost reach.** Estimates run from about
  30–50 % for one link to more, and posting the link in the first reply
  is the accepted workaround. Native video under about 60 s gets the most
  distribution, and threads hold attention longer than single posts
  ([SocialPilot](https://www.socialpilot.co/blog/twitter-algorithm),
  [Sprout](https://sproutsocial.com/insights/twitter-algorithm/)). So X
  posts are threads: the hook and the asset first, the link last.
- **In any feed video, the first seconds decide whether it's watched.**
  Without a face, the opening frame has to do that job: move on screen, the
  hook burned in as text, and the most striking image first (a machine, a
  red FEA hotspot), never a logo.
- **Timing.** Sprout (about 2 bn engagements) and Buffer (4.8 m LinkedIn
  posts) disagree on morning versus late afternoon, but agree on Tuesday to
  Thursday, late morning into afternoon
  ([Sprout](https://sproutsocial.com/insights/best-times-to-post-on-linkedin/),
  [Buffer data via PostFast](https://postfa.st/blog/best-time-to-post-on-linkedin)).
  Both datasets are mostly US and European audiences, and neither is made of
  Cameroonian students. `content-engine.md` §7 sets a starting slot. **Your
  own analytics replace it after two weeks.**
- **Free events lose about half their registrants.** Webinar show-up rates
  are about 41–57 % ([Livestorm via Contrast](https://www.getcontrast.io/learn/webinar-benchmarks),
  [Digital Applied](https://www.digitalapplied.com/blog/webinar-statistics-2026-attendance-conversion-data)).
  The conditions on each seat exist to beat that number.
