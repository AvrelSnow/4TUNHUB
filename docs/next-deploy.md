# The next production deploy — one batch, checked before it ships

> Written 20 October 2026, the day before Cohort 0's first session.
> Fortune's direction: the next push to `main` is **one complete deploy**,
> and nothing goes out until everything in it has been seen working —
> locally first, then on a free branch deploy. One merge, 15 credits.

Work happens on the branch `claude/project-audit-e95f91`. Every step below
is previewed on `localhost` (`npm run dev`, or `next start -p 3001` for the
production build) before it is ticked.

---

## 1. What went wrong with applications (read from the inbox, 20 Oct)

The application form takes no uploads, so the four screenshots had to come
by email. The "Send the screenshots" button opened a blank email with a
fixed subject, `[Cohort 0] Screenshots`, and an empty `Name I applied with:`
line. What 38 threads in `4tunhub@gmail.com` show:

Applicants are not named here: this repository is not the place for their
details. The threads are in the inbox under `[Cohort 0]`.

| What happened | How often |
|---|---|
| Screenshot emails arrive with the name line **empty**, in a thread separate from the application, so they cannot be matched without detective work | at least 5 applicants |
| Screenshot emails arrive with **no images attached** | 1, asked again the day before the deadline |
| Screenshots sent **without ever applying**; the details then came piecemeal, by reply, after selection | 1 |
| Replies come from a **second address**, so one person is two senders | 1 |
| Sent twice, or under someone else's name, then an "Appeal" thread to correct it | 2 |
| Every receipt, reminder and selection was **written by hand**, one thread at a time | all of them |

The form itself worked. The problem is everything after it: a second step
that lives in an email client, with nothing tying it to the first.

**The fix (code, task C3 below):** one submission carries everything.

1. The application form takes the four screenshots itself (image inputs,
   compressed in the browser to about 250 KB each, because a Netlify
   function accepts at most ~6 MB per request).
2. The server checks there are four images of an allowed type and size, and
   rejects an incomplete application with a clear message, in EN and FR.
3. One email reaches the inbox per applicant: details + four attachments +
   a short reference code (`C1-7F3K`) in the subject.
4. The applicant gets an automatic receipt carrying the same reference, so a
   reply lands in the same thread. *(Needs the Resend domain verified, A2.)*
5. The screenshots page stays only as a fallback, and its email is
   pre-filled with the name and the reference instead of a blank line.

This is for Cohort 1: Cohort 0's applications are closed. Whether Cohort 1
keeps the four-follows condition is still Fortune's call; the upload works
either way and can be switched off per cohort.

**During the cohort** the same thing will happen with exercises and
questions if they come by email. Decide one channel before Wednesday: the
exercises go to the cohort WhatsApp group (as the launch plan says), and
the inbox is for admin only. Say it in session 1.

---

## 2. Design and build: what is not finished

Checked against `docs/art-direction.md`, the `/blueprint` scorecard and the
live site.

| # | Item | Why it matters | Who |
|---|---|---|---|
| D1 | **Blueprint scorecard is out of date.** The Brand, Colour, Components and Motion notes still describe the dark instrument site — "dark is the only theme", eight canvas simulations, counters — all removed on 19 Sep. Phase 7 still lists B4 as open | `/blueprint` is public by URL and the internal source of truth; it contradicts the art direction | Claude |
| D2 | **A dedicated Cohort card** for link previews (B1's leftover). Every page shares the site card | The cohort is what gets shared. Build it as the Cohort 1 card, with the January date, so it is ready when Cohort 1 is announced | Claude |
| D3 | **Affiliation logos are raster** (`public/images/logos/*.webp`) | Soft at 2× and in dark mode. Needs SVGs from CAMRAIL, IUC, MKV, etc. | Fortune: ask for the files |
| D4 | **Professional photographs of the machines** | Craft is 95/97 on the scorecard because of this one line | Fortune |
| D5 | **Lighthouse run** on the production build | The last performance point; never run against the redesign | Claude |
| D6 | **Blog and Careers are honest empty pages** | Fine to ship. A post per talk is the SEO lever named in the strategy | Content, later |
| D7 | **Product detail pages are placeholders** (`noindex`) | Correct as they are until a product ships | Later |
| D8 | **Cohort 0 results state** (after 13 Nov): pass rate, filmed testimonials, the `embeds` consent category switched on | Needs the results and clips, which do not exist until the week of 16 Nov | Separate deploy, late Nov |
| D9 | **Payments (Mobile Money)** for a paid Cohort 1 | Provider not chosen; registered business entity open | Fortune decides first |

Already done on this branch: the closed Cohort 0 state, and the
accessibility re-sweep (one failure, fixed).

---

## 3. The order of work

### A — Accounts and settings (Fortune, no deploy needed)

These are outside the code. Several of them are why the code can be
tested at all.

1. **2FA and domain lock**: Namecheap (auto-renew + lock), Netlify, GitHub,
   Resend, Gmail. Ten minutes; it is the cheapest insurance there is.
2. **Resend**: verify `4tunhub.com` (DKIM + SPF at Namecheap). DMARC
   `p=none` is already published. Then set `MAIL_FROM="4TUNHub
   <hello@4tunhub.com>"` in Netlify. Without it, the automatic receipt in
   C3 cannot reach applicants.
3. **Netlify environment variables**: confirm `RESEND_API_KEY` and
   `MAIL_TO`; add `ANALYTICS_PROVIDER=umami` and `ANALYTICS_SITE_ID`.
4. **Search Console and Bing**: verify by DNS TXT at Namecheap.
5. **UptimeRobot** (free): `/en` and the Academy page, alerts to your phone.
6. **Inbox backup**: a Gmail label + filter for `[Cohort` subjects, and a
   second address on `MAIL_TO`.
7. **Testimonial permissions**: one WhatsApp message to each of the three
   people quoted on the home page; keep the replies.
8. **Session platform** agreed with MKV before Wednesday 21 Oct (operational,
   not site).

### B — Already on the branch ✓

- B-1 Cohort 0 page in its "under way" state, EN + FR, pointing to the
  Cohort 1 waitlist.
- B-2 Accessibility re-sweep, both themes, $99 contrast fixed.

### C — Code (Claude, on the branch, previewed locally) ✓ 20 Oct

1. ✓ **D1** `/blueprint` scorecard and roadmap match the redesign and today.
2. ✓ **D2** The Academy card (`/academy-card.jpg`, 73 KB): "CSWA Bootcamp.
   Cohort 1 · January." Used by the Academy and Cohort 0 pages, which also
   now share under their own title and address instead of the home page's.
3. ✓ **C3** Screenshots travel with the application: four slots in the
   form, shrunk in the browser (a phone screenshot comes out ~270 KB), checked
   on the server by type, size and file signature, one inbox email per
   applicant with a reference (`C0-7F3KQ`) and four attachments, and a
   receipt in the applicant's language. Tested in EN and FR: empty submit,
   a bad field with the four screenshots kept, a fake image refused on its
   own slot, and success. Found and fixed on the way: the SolidWorks
   dropdown used to empty itself after any error.
   *Not done:* the fallback email on the screenshots page is still the old
   blank one. With uploads in the form it is rarely needed; rewrite it with
   Cohort 1's copy.
   *Preview it:* `npm run dev:apply` opens the form locally after the
   deadline. The switch is compiled out of production builds (verified:
   zero upload fields on the built Cohort 0 page).
   *The receipt only sends once `MAIL_FROM` is set* (A2). Until then the
   success screen tells the applicant to keep the reference instead.
4. ✓ **D5** Lighthouse, production build. Desktop 85–99 performance; 100 for
   accessibility, best practices and SEO on `/en` and `/fr`. Mobile
   (simulated) 57–63, LCP 3.4–4.5 s. Fixed: the mobile menu was sent the
   whole dictionary on every page (inline payload halved, `/en` 134 → 64 KB);
   inline links now underlined (colour alone failed); the home "Learn more"
   beside the WhatsApp button now says where it goes. Not fixed: the mobile
   floor is the framework itself; the next step is fewer client components,
   which is a project of its own, not a pre-deploy fix.
5. ✓ `npm run check` green: 209.4 KB of 220 KB client JS (+1.7 KB for the
   uploads), largest chunk 69.1 KB.

### D — Verify on a free branch deploy

Push **the branch only**. Netlify builds a branch-deploy URL; it costs
nothing. On that URL, from a phone on mobile data:

1. Submit an application with four screenshots, in English and in French.
   Both arrive as one email each with four attachments; reply-to is the
   applicant; the receipt arrives with the same reference.
2. Submit the contact form and the waitlist form, EN and FR.
3. Paste the Academy and Cohort 0 links into WhatsApp and LinkedIn: each
   shows a card with a picture.
4. Fresh private window: the privacy bar appears once; Decline loads
   nothing from Umami; Accept loads one script; `/privacy#storage` turns it
   off.
5. Every page in both themes and both languages, and the 404.

Anything that fails is fixed on the branch and re-checked there. Free.

### E — One deploy

When every line in D passes: merge to `main`, once. 15 credits. Then re-run
the outside checks from `launch-blueprint.md` §1 against
`https://4tunhub.com` and confirm Umami shows the visit.

### Later, each its own deploy

- **Late November:** Cohort 0 results and filmed testimonials (D8).
- **Before Cohort 1 opens:** payments, once the provider and the entity are
  decided (D9).
- Blog posts, machine photography, vector logos: whenever they exist.
