# 09 — Payment-readiness gap review (2026-11-11)

Read-only review of `main` = `68fa9fe` (production) plus the plans in `docs/strategy.md`,
`docs/next-deploy.md` (D9) and `src/lib/commerce.ts`. No code was changed and nothing was
scanned. Verdict: **NOT READY**, but the shortest path is short and needs almost no code.

## What the plans say we are selling

- First paid product: the CSWA cohort (Cohort 1, January), priced in **FCFA**, 35,000–60,000
  to be tested by a pre-sale, about 10–20 seats (`strategy.md` §4, §7).
- Buyers pay by **Mobile Money** (MTN MoMo, Orange Money) and card. Candidate aggregators:
  CinetPay, NotchPay, Moneroo. Not chosen (`strategy.md` §6, `next-deploy.md` D9).
- `commerce.ts` already fixes the rule: payments go through a **hosted provider**, card and
  wallet data never touch our servers. The catalogue is empty on purpose.

## What exists today

- No database, accounts, sessions, orders, webhook endpoint or payment code (register A6, A8, A9).
- Three Server Actions behind a shared guard: honeypot, field limits, and a per-IP rate limit
  in Netlify Blobs (R-03, burst test passed today).
- Strict headers. `Permissions-Policy` says `payment=()`, and the CSP's `form-action` and
  `connect-src` are `'self'` only (plus analytics), so nothing on the site can talk to a
  payment provider today. `script-src` keeps `'unsafe-inline'` (SECURITY.md open item 3).
- Resend sends from the verified `4tunhub.com` domain (DKIM, SPF, DMARC resolve).
- Hosting: Netlify **Free** plan. If credits run out the whole site pauses.

## Decision that shapes everything: payment links or integrated checkout

| | **A. Provider-hosted payment links** (recommended for Cohort 1) | **B. Integrated checkout** |
|---|---|---|
| What it is | A "Pay" button that links to a page the provider hosts. The provider confirms each payment to the owner by email and in its dashboard. | The site creates a payment, the provider calls our webhook, we record the order and unlock the seat. |
| Code on the site | One link per product. No CSP change (a plain link is not covered by `form-action`). | Webhook route, order store, signature checks, idempotency, status page, CSP changes. |
| New attack surface | None on 4tunhub.com. | A public endpoint that moves money state. |
| Fits 10–20 seats | Yes; the owner matches payments to applicants by hand. | Overbuilt for 20 seats. |
| When to switch | More than ~50 sales a month, or self-serve digital goods (downloads) that must unlock instantly. | |

The gaps below say which option they apply to.

## Gaps

### Blockers before any money is taken (both options)

| ID | Gap | Owner | Why it blocks |
|---|---|---|---|
| G-01 | **GitHub 2FA is off.** The repo is public and a push to `main` deploys production. | Owner | Whoever takes the GitHub account can swap the "Pay" link or the payee for their own. That is the single most likely way to steal buyers' money. |
| G-02 | **2FA on every account in the money path:** payment provider dashboard, Netlify, the Gmail inbox that gets payment notices, Resend, Vercel. Only Vercel and GitHub have been asked so far (both off). | Owner | The provider dashboard holds payouts; the inbox holds payout and password-reset mail. |
| G-03 | **Legal entity and provider KYC.** Owner confirmed on 2026-11-11: **not registered yet** (`strategy.md` Q4). Aggregators ask for business documents before they pay out. Two routes: a provider that onboards an individual, or register first (what form, cost and delay in Cameroon to be checked from current sources). | Owner | Decides which provider is even possible, and whether registration has to happen before the January pre-sale. |
| G-04 | **Provider not chosen.** Compare CinetPay, NotchPay and Moneroo on: MoMo + Orange Money + card in Cameroon, fees, payout delay and account, KYC for an individual vs a company, hosted payment links, test mode, 2FA on the dashboard, and how refunds work. | Owner, with Claude's research | Everything else depends on it. |
| G-05 | **No terms of sale.** `/terms` covers the free Cohort 0 and recorded sessions, but says nothing about price, currency, what is bought, refunds, cancellation by 4TUNHub, or seat transfer. | Claude drafts, owner approves | Buyers and the provider both expect them; the refund rule prevents disputes. |
| G-06 | **Privacy note does not name a payment processor** or say what payment data 4TUNHub sees (name, phone number, amount, reference) and how long it is kept. | Claude drafts, owner approves | Phone numbers in MoMo receipts are personal data. |
| G-07 | **The site can pause.** Netlify Free stops serving when credits run out (~235.6 / 300 left this cycle). | Owner | A paused site during a pre-sale loses sales and looks like a scam. Option A softens this (links can also be shared in WhatsApp directly), but the cohort page must stay up: check credits before the pre-sale week and keep merges batched. |

### Option A only (payment links)

| ID | Gap | Owner |
|---|---|---|
| A-01 | Put the links in **one place in code** (e.g. a `paymentUrl` on the `Purchasable` record), pointing only at the chosen provider's domain, so a review can see every payee at once. | Claude |
| A-02 | A short **reconciliation routine**: who checks the provider dashboard, how a payment is matched to an applicant, how the seat is confirmed, and how a refund is made. Written in the cohort runbook. | Owner + Claude |
| A-03 | Warn buyers in the page copy: **4TUNHub never asks for payment by personal MoMo number or WhatsApp.** Scammers clone cohort announcements; this sentence is the cheapest defence. | Claude |
| A-04 | Use the provider's **test mode once** end-to-end (pay, receive notice, refund) before the real link goes live. | Owner |

### Option B only (integrated checkout) — later

Each of these is required before option B ships; none is needed for option A.

1. **Durable order store** with strong consistency (Netlify Blobs could hold it at this volume; a real DB once orders need queries).
2. **Webhook route** that verifies the provider's signature on the raw body, rejects stale timestamps and replays, and is idempotent per transaction id.
3. **Never trust the browser for the amount or the result.** Price comes from the server-side catalogue; a payment counts only when the provider confirms it server-to-server (webhook or status API), never because the buyer reached a "success" URL.
4. **Secrets:** provider live keys scoped to Production only (as `RESEND_API_KEY` is since P-4); test keys on previews; nothing in the repo (Gitleaks already in CI).
5. **CSP and Permissions-Policy** changes, limited to the provider's exact origins.
6. **Rate limit** on payment creation (reuse `form-guard.ts`), and logs that never hold phone numbers, references or tokens in full.
7. **Monitoring:** alert on webhook failures and on a paid order that never got a seat.
8. Re-run the audit's threat model, Semgrep and a preview test on the new endpoints before merge.

### Housekeeping found during the review

| ID | Gap | Owner |
|---|---|---|
| H-01 | `SECURITY.md` open item 2 still says the rate-limit window is per instance; it has been shared in Blobs since R-03. The batch notes stop at 2026-11-10. | Claude (next PR) |
| H-02 | `SECURITY.md` open item 4: the owner's `.claude/settings.local.json` still pre-approves `npm install *` and `node -e '*'` (not re-checked today). | Owner |

## Recommended order

1. Owner: GitHub 2FA, then Gmail, Netlify and the rest (G-01, G-02). No deploy, no cost.
2. ~~Entity question~~ answered: not registered. Claude: provider comparison from current sources (G-04), starting with which providers onboard an unregistered individual, and the registration route and delay in Cameroon (G-03).
3. Owner picks a provider and opens the account with 2FA. Test payment and refund in test mode (A-04).
4. Claude: terms of sale, privacy update, payment link in `commerce.ts`, the scam warning (G-05, G-06, A-01, A-03) on a branch, checked on its preview, merged in **one** deploy (15 credits) with the pending docs.
5. Pre-sale opens. Reconcile by hand (A-02). Revisit option B only when volume asks for it.
