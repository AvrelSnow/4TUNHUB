# Launch blueprint — 4tunhub.com

> Written Sunday 20 September 2026, against the site as it was actually
> being served that evening, not against what the repository says it does.
> Every status below was verified over HTTPS from outside; the commands are
> in §1 so anyone can re-run them and disagree with me.
>
> The other three documents answer different questions. `launch-plan.md` is
> **why** we launch on 25 September and what the cohort is.
> `cohort-0-campaign.md` is **what gets posted**, in what words, on which
> day. `ambassadors.md` is **who carries it**. This one answers the only
> question left: **may the site go public, and what happens the day it
> does.**

---

## 0. The rule this document exists to enforce

Decided 19 September, and it holds: **the date is a target, the checklist
is the permission.** The site goes public when every blocker in §2 is
closed and the frozen scorecard in §3 reads **80 or more out of 100**.

Tonight it reads **65**. That is not a reason to move the date — the work
between here and 80 is four evenings — but it is the reason not to
announce anything before Thursday night.

One more rule, because it is the one that gets broken under pressure:
**nothing is marked done from the repository.** A gate closes when
something outside this machine says it closed — an HTTP response, an
email that arrived, a preview card that rendered. The repository is where
intentions live.

---

## 1. Where the site actually stands, 20 September 2026

The site is **already live**. It was deployed on 20 September and has been
serving since; what has not happened is the announcement. So this is not a
deploy plan, it is a readiness audit of something already in public, which
is a better position than it sounds: everything below was measured, not
predicted.

### What is verified good

| Checked | Result |
|---|---|
| `https://4tunhub.com/` | 200, Next.js runtime on Netlify, served from the edge |
| `https://www.4tunhub.com/` | **301 → apex**. One canonical host, correct |
| 13 routes swept (en + fr, cohort-0, screenshots, contact, privacy, waitlist) | all 200 |
| `/fr` and `/fr/academy/cohort-0` | 200, and genuinely French ("Bootcamp CSWA. Cohorte 0.") |
| Security headers | CSP (no `unsafe-eval`, `frame-ancestors 'none'`, `object-src 'none'`), HSTS 2 years, `X-Frame-Options: DENY`, `nosniff`, `strict-origin-when-cross-origin`, minimal Permissions-Policy |
| `robots.txt` | serves, disallows both `/blueprint` locales, points at the sitemap |
| `sitemap.xml` | 24 URLs — 12 pages × 2 locales, hreflang paired |
| `/blueprint` | 200 but `robots: index:false, follow:false` **and** disallowed. Internal spec, reachable by URL only |
| Build gate | `npm run check` exits 0. **207.7 KB of 220 KB** client JS (94%), largest chunk 69.1 KB of 90 KB. The consent system added 1.8 KB of that |
| The CSWE claim | already reads **"CSWE candidate"** in `src/lib/founder.ts`. The launch gate that worried us most is closed |

### What is verified broken or absent

| Checked | Result |
|---|---|
| `og:image` on any page | **Zero.** Not on the homepage, not on the Cohort 0 page |
| `twitter:image` | Zero. The card type is declared `summary_large_image` with no image |
| Analytics on the live page | Zero references to a provider. The env vars were never set |
| HSTS preload list | `4tunhub.com` is **not** on it, though the header claims `preload` |
| Search Console / Bing verification | No verification token anywhere in the served HTML |
| Form delivery from production | **Never tested against the live domain.** Unknown |
| The two LinkedIn company URLs | Still the guess from 18 September |

### How to re-run the audit

```bash
node -e "['','/en','/fr','/en/academy/cohort-0','/en/contact','/en/privacy','/robots.txt','/sitemap.xml'].forEach(p=>fetch('https://4tunhub.com'+p).then(r=>console.log(r.status,p)))"
```

```bash
node -e "fetch('https://4tunhub.com/en').then(r=>r.text()).then(h=>console.log('og:image',(h.match(/og:image/g)||[]).length,'| analytics',(h.match(/umami|plausible/g)||[]).length))"
```

---

## 2. The blockers

Nothing is announced until all six are closed. They are ordered by what
the launch actually runs on.

> **B5 was added on 20 September, after this document was first written,
> and it is the reason §3 was re-weighted.** The first version of this
> blueprint listed "a cookie banner" under *deliberately not doing* — the
> reasoning being that the site sets no cookies, so a banner would be
> theatre. That reasoning was correct about cookies and wrong about the
> site: a visitor has no way of knowing that nothing is stored unless
> somebody tells them, the analytics that was about to be switched on is
> a third-party origin the visitor never chose, and in January the
> replays, the payment form and the booking widget all arrive at once.
> Building the machinery under launch-week pressure, with 483 people
> already on the site, is the worst version of that work. It is built
> now. See B5.

### B1 — The link preview has no image *(highest cost, smallest fix)*

Every channel in the campaign is a link-preview channel: the WhatsApp
community, the SWUG's WhatsApp group, LinkedIn, Facebook. On all of them a
link with no image is a grey rectangle with a line of text under it, and
it is scrolled past. The card **exists** — `/opengraph-image` returns a
1200×630 PNG of the CC3300 locomotive — but no page points at it, so no
platform will ever ask for it.

The cause is in `src/app/[locale]/layout.tsx`: `generateMetadata` defines
`openGraph` in code, and a code-defined `openGraph` object replaces the
file-convention image from `src/app/opengraph-image.tsx` instead of
merging with it. The pages under `[locale]` therefore ship OpenGraph tags
with no `images` key.

**Fix:** add an explicit absolute `images` entry to both `openGraph` and
`twitter` in the locale layout, and on the Cohort 0 page's own metadata,
pointing at `${SITE_URL}/opengraph-image` with width 1200, height 630 and
the existing `alt`. Then verify from outside, not from the code:

```bash
node -e "fetch('https://4tunhub.com/en').then(r=>r.text()).then(h=>console.log(/og:image/.test(h)))"
```

**Second, smaller problem on the same card:** the PNG is **731 KB**.
LinkedIn will take it; WhatsApp's preview fetcher is unreliable at that
size and silently falls back to no image — which would reproduce the bug
we just fixed, on the one channel that matters most. Bring it under
~300 KB (fewer full-bleed photographic pixels, or hand the `ImageResponse`
a pre-resized, more compressed source photo), then test the real thing:
paste the URL into a WhatsApp message to yourself and look at it before
483 people do.

**Third:** the Cohort 0 page deserves its own card, not the site card.
The offer is a free voucher for a $99 exam, and a deadline; that belongs
on the image. This is the one piece of new design the launch needs, and it
is worth an hour.

### B2 — Nobody has proved a form delivers from the live domain

An application that vanishes is worse than a form that is honestly
broken, because the applicant believes they applied. The code has a
fallback — when `RESEND_API_KEY` is missing it tells the visitor it could
not send and offers a pre-written email — but nobody has confirmed which
path production actually takes.

**Fix, in this order:**

1. Confirm `RESEND_API_KEY` and `MAIL_TO` are set in Netlify → Site
   configuration → Environment variables.
2. Verify `4tunhub.com` as a sending domain in Resend (DKIM + SPF records
   at Namecheap), then set `MAIL_FROM="4TUN Hub <hello@4tunhub.com>"`.
   Until that is done the sender is Resend's shared test address, which
   can only deliver to the Resend account's own mailbox — that happens to
   be where submissions go, so it *works*, but it means the site cannot
   send to anyone else, including the acceptance replies due 16 October.
3. **Redeploy** — env vars are read when the site is built, not served.
4. Submit one real application and one real contact message on
   `https://4tunhub.com`, from a phone, on mobile data — not localhost,
   and not from an address that has already submitted five times in ten
   minutes, which is the rate limit.
5. Confirm both arrive, and that reply-to is the applicant's address.
6. Do the same on `/fr`. A French applicant meeting an English error
   message is a different bug.

### B3 — Launch-day traffic is not being counted

The one number that never comes back is the first day's. The code is done
and cookieless; two environment variables and a redeploy are missing:
`ANALYTICS_PROVIDER=umami` and `ANALYTICS_SITE_ID=<website id>`. Umami
Cloud's free tier also counts the three named conversions already wired in
`src/lib/track.ts` — waitlist signup, Cohort 0 application, contact
message — which is what turns "we got traffic" into "the SWUG group
converted at 4% and LinkedIn at 0.5%", and that is what Cohort 1 gets
planned on.

Do it Wednesday, not Friday. A provider configured an hour before the
announcement is a provider nobody has watched record anything.

### B4 — The two LinkedIn company URLs are still a guess

`src/lib/cohort.ts` carries `SWUG_LINKEDIN_URL` (company/105488333) and
`HUB_LINKEDIN_URL` (company/111010064). Both were handed over as admin
URLs and the mapping was inferred from the numbering. A launch post that
sends 483 people to the wrong company page, in a partnership
announcement, is the error the partner notices first.

**Fix:** open both in a logged-out browser, read the page names, and
either confirm or swap the two lines. Five minutes, and it is the cheapest
gate on this list.

### B5 — Nobody was told what the site stores *(built 20 September)*

**What shipped tonight**

| | |
|---|---|
| A privacy bar | Shown once, at the bottom, over nothing. **Accept** and **Decline** are the same size, the same weight, side by side, and neither is amber — the site spends its one loud colour on the ribbon and the voucher, not on a privacy question. There is no X: not answering is not consent |
| A real gate | `src/components/AnalyticsScripts.tsx` mounts the analytics tag **only** after a yes. Verified with the provider configured locally: before a choice, zero scripts and zero requests to `cloud.umami.is`; after **Accept**, one script; after **Refuse** on the privacy page, gone again on the next page |
| A permanent switch | `/privacy#storage`, linked from the footer of every page. Withdrawing has to be as easy as consenting, so it cannot live only in a bar that vanishes once answered. Turning it off reloads the page, because a script already injected into a document does not leave when the component that asked for it unmounts |
| The full inventory | A table naming every item: `4tun.theme`, `4tun.consent`, and the anonymous visit count — what each is for, where it is kept, and whether it can be refused. **Two of the three never leave the device, and the site sets no cookies at all** |
| Global Privacy Control | A browser-level refusal is honoured as a decline, and the bar does not argue with it |
| A versioned answer | `CONSENT_VERSION`. The day an embed category is switched on, everyone who answered the old question is asked the new one — consent to count visits is not consent to load a video player |
| The rest of the note | Who is responsible, the three processors by name (Netlify, Resend, Umami), the thirty-day answer, the right to complain, and a line for applicants under 18 — the cohort is taught to secondary-school students |
| `/.well-known/security.txt` | RFC 9116. The scorecard had been carrying "remaining pre-launch: security.txt" since July |

**Why opt-in and not a notice.** Cookieless audience measurement can
qualify for an exemption from prior consent, so counting before an answer
would probably be lawful today. It stops being lawful the day the first
YouTube replay or payment form lands, and that day is January. Opt-in is
the rule that does not need revisiting when the site grows. It costs part
of the visit count — expect to see 60–80% of real traffic — and that is
the price, paid knowingly: what the launch actually needs is *which
channel converts*, and a consistent fraction of every channel still
answers that.

**What is still open, and it is his to decide, not mine**

1. **Who the controller is.** The note says "4TUN Hub, Dschang, Cameroon —
   Donfack Fortune decides and answers personally." That is true and
   sufficient today, but the business-entity question has been open since
   18 September, and a registered entity would change this line.
2. **The retention promises are now published** — three months for
   applications not selected, twelve after the cohort. They have to
   actually happen, in the inbox, in February.
3. **Written permission for the three testimonials**, covering the name,
   the photograph, and the "Fortune Hub" → "4TUN Hub" substitution.

### B6 — There is no written way to undo a bad launch day

Netlify keeps every deploy and can restore any of them in about thirty
seconds, but "we can roll back" is not a procedure until someone has
written down which button, who decides, and what gets said. §8 is that
procedure. The blocker closes when it has been read once, before it is
needed.

### The Flovet review, 20 September — three adopted, two rejected

A 43-minute call with an outside reviewer. Taking the good half of an
outside review costs nothing; taking all of it four days before a launch
is how a reviewed site gets churned.

| Point | Verdict | What happened |
|---|---|---|
| **Video testimonials (15–20s) from the 20 cohort participants** | **Adopted, with two corrections** | Consent to be filmed is cheapest when it is a *condition of a free seat*, not a favour begged in November — so the deal on the Cohort 0 page now asks for half a minute on camera instead of a written line, in both languages. Corrections: 15 seconds is too short to say anything credible, and twenty near-identical clips shot in one week read as manufactured. The ask is one question — *what can you do now that you could not do in October* — and five or six get published, not twenty. The three written testimonials stay: they are real, named, photographed, and they are what exists on Friday. The player waits for November, when it switches on the `embeds` consent category that shipped inactive for exactly this |
| **A Community page, separated from the paid Academy** | **Adopted** | The page already existed — it sat in the footer, which is why a visitor could not tell the paid Academy from the free WhatsApp group. Now the sixth primary nav item, which is the locked ceiling |
| **A launch checklist: consent, terms, accessibility, responsiveness, 404** | **Adopted in one part; four were already done** | Cookie consent shipped the night before, accessibility swept to AA, responsiveness verified 360→1920, the 404 is branded and leak-free. **Terms of use was the real gap** and is now written in both languages |
| **The home page should sell one service (project consulting)** | **Rejected — diagnosis kept, prescription refused** | See below |
| **Move the founder's biography from the home page to About** | **Rejected — already done before the meeting** | See below |

**On the single-service home page.** The observation is right: a stranger
cannot tell what is sold, and the page carries several competing asks.
The prescription is wrong for three reasons. Friday's launch drives
applications to a *free bootcamp*, so a consulting-only home page would
fight its own campaign. "Ecosystem, not portfolio" is the locked
positioning, and the entire architecture exists so pillars can be added
without a redesign — this is a strategy change dressed as a design note.
And `/services` already exists to do exactly that job. What survived is
one line: the hero's first words said **"Engineering ecosystem"**, and
*ecosystem* is a word a company uses about itself, never one a buyer
searches for. It now reads "Mechanical design, simulation & CAD training ·
Dschang, Cameroon". Restructuring a page that was reviewed and refined
twice in the same week, four days before it is announced, is the risk
this project can least afford.

**On the founder's biography.** There isn't one. The home page carries one
sentence, one portrait and one link, decided on 19 September after the
*previous* reviewer raised the same instinct. Two possibilities, and they
need different answers. If Flovet was describing an older version, worth
asking which page he opened — but two reviewers landing on the same
paragraph means it still reads heavier than it is. If he means remove the
founder entirely, it is refused: `trust.ts` holds zero partners, zero
awards and zero client logos, the statistics strip is explicitly labelled
"the founder's track record", and an anonymous organisation in Dschang
asking students for a WhatsApp number is a worse trade than a company
whose founder is visible once, below the work. Org-first has never meant
founder-absent.

**One thing to send back to Flovet.** His checklist is welcome but four of
its five items were already closed, and waiting on it would cost days this
week does not have. The better use of him is the document you are reading:
send him §2 and §3 and ask which blocker he would add — a reviewer who
argues with a scored checklist is worth more than one who supplies a
generic one.

### Also found in the sweep — not blockers, but not nothing

Asking "what else is a launch supposed to have that this one doesn't"
turned up seven more. None of them justifies holding Friday. Two of them
would be very expensive to discover late.

| | What | Why it matters | Where it lands |
|---|---|---|---|
| S1 | **DMARC** | SPF and DKIM were on the Wednesday list; DMARC was not. Without a policy record, a bank or a school's mail server is far more likely to junk the acceptance emails — which all go out on the same day, to twenty people, in a burst that looks exactly like bulk mail | Wednesday, with the Resend records. Start at `p=none` and read the reports before tightening |
| S2 | **Auto-renew, domain lock, and 2FA on all five accounts** | Namecheap, Netlify, GitHub, Resend, Google. Everything else on this page is recoverable in an afternoon. A lapsed domain or a taken-over registrar account is the one failure that ends the project, and it costs ten minutes to prevent | Wednesday, before anything else. It is the cheapest insurance on the list |
| S3 | **The applications exist in exactly one Gmail inbox** | That inbox is the entire output of the launch. One accidental delete, one filter, one account lockout | Thursday: a label + filter, and a weekly export. `MAIL_TO` can also take a second address |
| S4 | **Uptime monitoring** | If the site goes down at 14:00 on launch day, the way we find out should not be a WhatsApp message from a stranger | Thursday: UptimeRobot free, 5-minute checks on `/en` and `/en/academy/cohort-0`, alert to his phone |
| S5 | **Written permission for the three testimonials** | Name, photograph, and the "Fortune Hub" → "4TUN Hub" substitution already recorded in the decision log. They are real people who wrote something as a favour | This week, one WhatsApp message each. Keep the replies |
| S6 | **A link sweep of the campaign cards** | Eight cards and four captions carry URLs. One typo posted to 483 people is not correctable in WhatsApp | Thursday: open every link in the campaign doc, from a phone |
| S7 | **`security.txt`** | The scorecard has carried "remaining pre-launch: security.txt" since July | **Done tonight**, `public/.well-known/security.txt` |

---

## 3. The frozen scorecard

Twelve lines, weighted by what a launch actually depends on, scored
honestly. **Frozen** means: this table is not re-weighted to make a number
go up. If a line is wrong, it is argued and changed on the record, not
quietly adjusted the night before.

| # | What | Weight | Tonight | Thursday target | What moves it |
|---|---|---:|---:|---:|---|
| 1 | Hosting, domain, TLS, canonical host | 8 | 8 | 8 | Done |
| 2 | Security headers & form abuse guards | 8 | 7 | 7 | The missing point is the in-memory rate limit, which is per-instance on serverless. Accepted, not fixed |
| 3 | **Forms deliver end to end, in both languages** | 13 | 5 | 13 | B2 |
| 4 | **Link-preview cards** | 8 | 1 | 8 | B1 |
| 5 | **Measurement** | 8 | 2 | 8 | B3 |
| 6 | Content is true (claims, credentials, quotes, links) | 11 | 10 | 11 | B4. CSWE already corrected; testimonials real and named |
| 7 | SEO & indexation | 9 | 6 | 8 | Search Console + Bing verified, sitemap submitted, homepage and Cohort 0 requested for indexing |
| 8 | Performance | 7 | 6 | 6 | The budget passes at 94% of the JS ceiling — 207.7 KB of 220 KB, consent system included. Tight, not broken. A Lighthouse run against the live URL would earn the last point |
| 9 | Accessibility | 6 | 5 | 5 | The AA sweep was done during hardening; the redesign has not been re-swept. Not worth delaying for |
| 10 | Bilingual parity | 6 | 6 | 6 | FR verified live, and the build fails if a key is missing |
| 11 | **Privacy, consent and legal identity** | 10 | 6 | 9 | B5 shipped the machinery. The rest is his: who the controller is, DMARC, the three testimonial permissions, and retention that actually happens |
| 12 | **Operations: rollback, deadline decay, deploy budget** | 6 | 3 | 6 | B6, §8, §9 |
| | **Total** | **100** | **65** | **95** | |

**The re-weighting, on the record.** Line 11 was 6 points and covered
"privacy & legal" as an afterthought, on a site that asks
secondary-school students for a WhatsApp number and was four days from
switching on a third-party script nobody had been told about. Six points
was wrong. It is now 10, and the four came off lines 3, 6, 7 and 8 — one
each, from the categories that were already nearest their ceiling. The
weights were frozen and then changed within the hour, which is exactly
what §3 says is allowed: argued, on the record, with the reason. What is
*not* allowed is moving them on Thursday night to clear 80.

**The number did not move.** Sixty-five before the consent work, sixty-five
after. That is the honest arithmetic and it is worth sitting with: the
category that gained four points was gaining them for work that had not
been done either, so shipping the banner bought back precisely what the
missing category had been hiding. A scorecard that had gone up tonight
would have been measuring effort instead of readiness.

**80 is the permission.** 95 is what four evenings buys. The five points
left on the table — one rate-limit point, one Lighthouse point, one
accessibility point, one SEO point and one legal-identity point — are not
worth a day of delay, and saying so now is how we avoid inventing a reason
to wait on Friday morning.

---

## 4. Monday to Thursday

Mon 21 and Tue 22 are teaching days: **no night shift**. That was decided
once already, and paid for once, by the 40% week.

### Monday 21 · Tuesday 22 — nothing on the site

Fortune teaches. The only launch task in these two days is **B4**, which
is five minutes on a phone between classes: open both LinkedIn company
pages, confirm which is which, say so, and the two lines change.

### Wednesday 23, night shift 20:00–23:00

| Who | What |
|---|---|
| Fortune | **First, ten minutes, before anything else (S2):** auto-renew and domain lock on at Namecheap, two-factor authentication on Namecheap, Netlify, GitHub, Resend and the Gmail account |
| Fortune | Resend: verify `4tunhub.com` (DKIM + SPF **and a `p=none` DMARC record**, S1). Create the Umami Cloud site, copy the website ID. Set all five variables in Netlify |
| Claude | B1: wire `og:image` into the locale layout and the Cohort 0 page, bring the card under 300 KB, design the Cohort 0 card |
| Fortune | Google Search Console and Bing Webmaster Tools: verify by **DNS TXT** at Namecheap, not the HTML-file method — a TXT record survives every redeploy |
| Both | One deploy at the end of the night, carrying all of it. **One.** |

### Thursday 24, night shift 20:00–23:00

| Who | What |
|---|---|
| Both | B2 in full: two submissions from a phone on mobile data, EN and FR, confirmed received |
| Fortune | Paste `4tunhub.com/en/academy/cohort-0` into a WhatsApp message to yourself. Look at the card. Then LinkedIn's composer, same link, same look |
| Fortune | Submit the sitemap in both consoles; request indexing for `/en`, `/fr` and both Cohort 0 pages |
| Fortune | Write the announcement in your own voice. The drafts in `cohort-0-campaign.md` carry the facts, not the wording |
| Fortune | S3: a label and filter for applications, plus a second address on `MAIL_TO`. S4: UptimeRobot on `/en` and the Cohort 0 page, alerting his phone. S6: open every link in `cohort-0-campaign.md` from a phone |
| Claude | Re-run the §1 audit, including the consent gate against the live domain. Score §3 again, out loud, line by line |
| Both | **The go/no-go**, in writing, before midnight (§6) |

Thursday's deploy is the **launch build**. Nothing goes to `main` on
Friday unless something is broken.

---

## 5. What must be true before a single link is shared

Read this list on Thursday night and answer each line aloud. Any "I think
so" is a no.

1. A test application submitted from a phone arrived in the inbox, with
   the applicant's address as reply-to.
2. The same for the French form.
3. `4tunhub.com/en/academy/cohort-0` pasted into WhatsApp shows a card
   with a picture.
4. The same link in LinkedIn's composer shows a card with a picture.
5. Umami shows the visit you just made.
6. Both LinkedIn URLs open the company page their variable name claims.
7. The founder page says "CSWE candidate".
8. The homepage hero is his own work, and no image on the site has an
   unclear licence.
9. `/blueprint` is still `noindex` and disallowed after the Thursday
   deploy.
10. The privacy note names the analytics provider, the three processors
    and who is responsible.
11. On the live site, in a fresh private window: the bar appears once,
    **Decline** leaves zero requests to the analytics origin, **Accept**
    loads exactly one script, and `/privacy#storage` can turn it off
    again. Check it in French too.
12. Applications close **Sunday 11 October** everywhere it is written:
    the site, the cards, the captions, the Bevy event.
13. The score is ≥ 80.

---

## 6. The go/no-go, Thursday night

Written, not felt. Three outcomes, and only three:

- **GO** — all five blockers closed, score ≥ 80. Launch Friday as planned.
- **GO, DEGRADED** — forms, cards and analytics are green but something
  cosmetic is not. Launch anyway. Cosmetic problems get fixed in public,
  on a branch, and batched into the next deploy.
- **NO-GO** — a blocker is open. Then **Plan B runs and the cohort dates
  do not move**: applications are taken through a Google Form linked from
  the WhatsApp announcement, the site follows on Saturday or Sunday, and
  the deadline stays 11 October. A launch that slips a weekend costs
  nothing. A cohort that slips loses the November evidence, which is the
  entire reason Cohort 0 is free.

Never a fourth outcome, which is the one that actually kills launches:
"let's give it another week to be safe." Twelve scripts written and never
shipped is what that sentence produces.

---

## 7. Friday 25 September — launch day

Cameroon time. The order is deliberate: the smallest, most forgiving
audience first, so anything embarrassing is found by fifteen friends
rather than by 483 strangers.

| Time | What | Why in this order |
|---|---|---|
| 08:00 | Re-run the §1 audit. Open the site on a phone, on mobile data, as a first-time visitor: read the homepage, reach the application form, stop before submitting | An overnight edge-cache surprise is found now, not after the post |
| 08:30 | Post in the **4TUN Hub WhatsApp community** | Warmest audience, and they will tell you if something is broken |
| 09:00 | Watch for thirty minutes: Umami recording, links resolving, no error mail | The last moment where stopping is still cheap |
| 09:30 | Post in the **Douala City SWUG WhatsApp group** | The partner's audience, where the offer actually lands |
| 10:00 | **LinkedIn**, from Fortune's profile, card attached, **link in the first comment** — the feed suppresses posts that send people away | Peak weekday reach |
| 10:15 | Reshare from the 4TUN Hub company page, and from the SWUG's page if its admin is willing | Three surfaces, one post |
| 12:00 | **YouTube community post** on @4TUNHUB, plus the WhatsApp status / story card | Different audience, different hour |
| 13:00 | **First check-in:** visits, applications received, any error | The first number of the day that means anything |
| 15:00 | Reply to every comment and every DM. No exceptions today | Reply speed on day one is the entire reputation of a new thing |
| 18:00 | One short-form slot (TikTok / Reels / Shorts) | The evening audience |
| 21:00 | **Day-one close:** visits by source, applications, waitlist signups, screenshots received — written into `launch-plan.md` | It is never reconstructible later |

Two rules for the day:

- **No code goes to `main` on Friday** unless something is broken. A typo
  is fixed on a branch and batched.
- **Screenshots are the bottleneck, not the form.** Every application is
  incomplete until its two membership screenshots arrive. Chase them from
  day one, in WhatsApp, not by email.

---

## 8. What breaks, and what to do

**Who decides:** Fortune. **How long to think about it:** two minutes.

| Symptom | First move | Then |
|---|---|---|
| Site down, or a route 404s | Netlify → Deploys → the last known-good deploy → **Publish deploy**. About thirty seconds, no rebuild, **no credits** | Diagnose afterwards. Never diagnose while it is down |
| Forms fail silently | Check Resend's dashboard for rejects before touching code — it is nearly always the sending domain, not the site | If it is not fixed in fifteen minutes, post the Google Form link in the same threads and say plainly that the form is being repaired |
| A wrong fact is published (a link, a date, a name) | Correct it in the same thread, in the same hour. Then fix the site on a branch | Do not delete the original post. An edited thread with a visible correction reads better than a silent deletion |
| A flood of junk applications | The rate limit is five per IP per ten minutes, and per-instance on serverless, so it is a speed bump rather than a wall | Applications are selected by hand anyway. Do nothing on launch day |
| A card still renders without an image somewhere | Nothing can be done live — platforms cache previews for days. Attach the PNG to that post manually | Fix the tag, then re-scrape through LinkedIn's Post Inspector |

**The rule that makes rollback cheap:** the deploy running on Friday
morning is the one built on Thursday night and tested. Anything newer is
a change nobody has tested, on the day of the announcement.

---

## 9. The deploy budget, now through mid-November

Netlify bills **15 credits per production deploy**, flat. The plan carries
300 a month, so `main` has **20 deploys a month** — and eleven were spent
in two days on 19–20 September. Branch deploys and previews are free and
unlimited, and `netlify.toml` already skips builds for commits that only
touch `docs/` or markdown, so **this document costs nothing to commit.**

| When | Deploys | For |
|---|---:|---|
| Wed 23 Sep | 1 | Cards, analytics variables, metadata — one build carrying everything |
| Thu 24 Sep | 1 | The launch build, after the form test |
| Fri 25 Sep | 0 | Reserved. Spent only if something is broken |
| W40–W41 (28 Sep–11 Oct) | 3 | Ambassador names on the site, two content batches |
| **Mon 12 Oct** | **1** | **Mandatory — see below** |
| W42–W46 | 4 | Cohort weeks: replays, materials, corrections. One batch a week |
| Mid-November | 2 | Results, pass rate, testimonials, the Cohort 1 announcement |
| Reserve | 4 | Unplanned |

**The 12 October deploy is not optional.** Every page except the ribbon
reads the deadline at **build time**: `applicationsOpen()` is evaluated
while the page is prerendered, so `/academy`, `/academy/cohort-0`,
`/waitlist` and the screenshots page will go on saying applications are
open after they have closed. The ribbon is the only element that re-reads
the clock in the browser, and `apply-action.ts` already refuses late
submissions — so no bad data can enter, but the site will be lying to
readers until it is rebuilt. Rebuild on Monday 12 October, with the
"applications closed, Cohort 1 opens in January" copy in the same push.

Moving those checks client-side like the ribbon would cost a deploy now to
save one later, so it is not worth it. Rebuild instead.

---

## 10. The first two weeks after launch

| When | What |
|---|---|
| Sat 26 – Sun 27 Sep | Close the 48-hour ambassador task. The ten who did it are the ambassadors (`ambassadors.md`) |
| Mon 28 Sep | Ambassador group, brief, card pack. Add the ten names to `scripts/make-postcards.mjs` and generate the reveal cards |
| Through 11 Oct | Two reveals a day. Every applicant without screenshots gets one WhatsApp chase on Friday 9 October |
| Weekly | Check indexation: `site:4tunhub.com` in Google, plus Search Console coverage. If the Cohort 0 page is not indexed by 5 October, request it again |
| Weekly | Read the Umami numbers **by source** and write one line into `launch-plan.md`. Which channel converts is the most valuable thing this launch produces — worth more than the applications themselves |
| Ongoing | **A post per conference talk.** Twelve public sessions sit on the founder page as twelve titles. Turned into twelve pages, they are the only organic-search asset this site has that nobody else can copy. It needs his writing, not code, and it is the highest-return thing he can do in October |

---

## 11. Deliberately not doing this before launch

Written down so none of it gets re-argued at 22:00 on Thursday.

- **HSTS preload submission.** The header claims `preload`; the domain is
  not on the list, and that is the right state. Getting on is easy;
  getting off takes months, and every subdomain is bound by it. A
  marketing site gains nothing from it.
- ~~**A cookie banner.**~~ **Reversed the same evening.** The original
  reasoning — no cookies, so a banner would be theatre — was right about
  cookies and wrong about the visitor, who has no way of knowing that
  unless the site says so. What shipped instead is not a banner that
  claims to manage cookies it does not set: it is an inventory of the two
  things stored, a real gate in front of the one third-party script, and
  a switch that still works in January when the replays and the payment
  form arrive. See B5. Kept from the original reasoning: it is not a
  blocking modal, it does not sit on top of the Cohort 0 call to action,
  and refusing is exactly as easy as accepting.
- **Making `/blueprint` private.** It is `noindex` and disallowed, which
  was the whole requirement. It is also, frankly, one of the more
  persuasive pages on the site for a technical visitor who finds it.
- **Lighthouse CI gating deploys.** `.lighthouserc.json` exists and can be
  run by hand. Gating a 15-credit deploy on a flaky headless-Chrome score
  is how a launch week gets lost.
- **Re-running the full accessibility sweep on the new design.** One point
  on the scorecard. It happens in W40.
- **Anything about Cohort 1, pricing, or the Lab.** The Lab has its own
  repository and its own plan, and takes no night shift before W44.

---

## 12. Sign-off

| | Name | Date |
|---|---|---|
| Blockers closed | | |
| Score ≥ 80 (record the number) | | |
| Go / Go-degraded / No-go | | |
| Launched | | |

Record the decision here on Thursday night, in one line, with the number.
A launch that was argued for and written down is one that cannot be
quietly reversed on Friday morning by a feeling.
