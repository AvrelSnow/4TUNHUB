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
| G-04 | **Provider not chosen** (comparison below, 2026-11-11). Compare CinetPay, NotchPay and Moneroo on: MoMo + Orange Money + card in Cameroon, fees, payout delay and account, KYC for an individual vs a company, hosted payment links, test mode, 2FA on the dashboard, and how refunds work. | Owner, with Claude's research | Everything else depends on it. |
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

## Provider comparison (G-04, researched 2026-11-11)

Public pages only, read on 2026-11-11; no account was opened. Fees are per successful payment.
Re-check every figure with the provider before signing up: these pages change.

| | **Fapshi** | **Notch Pay** | **CinetPay** | **Moneroo** |
|---|---|---|---|---|
| Unregistered individual | **Yes, explicitly**: sign-up has a "Not Legally Registered" option; ID card, receipt or passport plus a selfie ([account help](https://www.fapshi.com/en/help-and-support/topics/account)) | Unclear; docs say to have business registration documents ready before verification ([get started](https://developer.notchpay.co/get-started)) | Unlikely; KYC asks merchants for a tax ID (NIU), bank details and ID ([payments](https://cinetpay.com/products/payments)) | Not stated on public pages |
| MTN MoMo / Orange Money | 3% / 3% ([pricing](https://www.fapshi.com/en/pricing)) | 2.5% ([pricing](https://notchpay.co/pricing)) | 2% / 2.2% ([pricing](https://cinetpay.com/pricing)) | Not stated for Cameroon |
| Cards | Not listed | Not confirmed for Cameroon | Visa/Mastercard 3.5% | — |
| Withdrawal to you | Free | 1% per transfer; MoMo in minutes, bank 1–3 days | Payout requestable after 72 h | — |
| Payment links (option A) | Yes | Yes, plus hosted page and sandbox | Yes | Hosted checkout via API |
| Dashboard 2FA | Yes (code by email) | Not stated | Not stated | — |
| Fixed fees | None | None | None | None |

On a 50,000 FCFA seat paid by MoMo: Fapshi keeps 1,500; Notch Pay 1,250 plus ~490 to withdraw;
CinetPay 1,000–1,100. For 20 seats the difference between them is about 10,000 FCFA in total.

**Moneroo** is dropped for now: its public pages describe one API over several providers but say nothing
about Cameroon methods or who can sign up. Revisit only for option B.

### Registration route (G-03)

- An *établissement* (sole proprietorship, personne physique) is created at a CFCE (Centre de Formalités de
  Création d'Entreprises) in **72 hours** officially, with CNI copies, a location plan and a criminal record extract or
  sworn statement. You get the trade register (RCCM), a taxpayer card (NIU) and a creation certificate
  ([MINFI](https://minfi.gov.cm/espace-de-creation-dentreprise-en-republique-du-cameroun/)).
- Cost: MINFI says **41,500 FCFA**; a third-party guide ([econuma](https://econuma.com/go-digital/creez-votre-boite-au-cameroun-en-72h-le-nouveau-guide-cfce-officiel-1745752441)) puts it at 61,500 with 20,000 of fixed registration duties. Ask the CFCE.
- The CCIMA lists CFCEs in Yaoundé, Douala, **Bafoussam** and Bamenda ([CCIMA](https://ccima.cm/investir-au-cameroun/creation-dentreprise/));
  Bafoussam is the nearest to Dschang. Guides report 3–7 days in practice.
- Tax and accounting duties that follow registration are not covered here: ask an accountant.

### Recommendation

1. **Register an *établissement* now** (about 41,500–61,500 FCFA, one trip to Bafoussam). It unlocks CinetPay and
   probably Notch Pay, cards, lower fees, and a business name that appears on buyers' receipts. Registering also
   answers the "is this a scam?" question for buyers.
2. **Fallback if the pre-sale opens before the papers are back:** Fapshi as an individual. It is the only one of the
   four that says in writing it takes unregistered sellers. MoMo only, 3%. Before relying on it, ask Fapshi support
   in writing whether individual accounts have a monthly cap, and turn on its 2FA.
3. **Once registered:** compare CinetPay (cheapest MoMo, cards) and Notch Pay (sandbox, fast MoMo payouts) on a
   test payment, refund and payout each, and move the payment link. The site code does not change: one URL.

**Owner decision, 2026-11-11: Fapshi first.** Cohort 1 sells through a Fapshi payment link on an individual
("Not Legally Registered") account, Mobile Money only. Registration and a move to CinetPay or Notch Pay come later.
What that means for the gaps:
- G-02: Fapshi's dashboard 2FA (code by email) makes the **Gmail account the real key** to the money; Gmail 2FA
  with an authenticator app or passkey, not SMS, before the account holds anything.
- G-05 terms of sale: say payment is by MTN MoMo or Orange Money through Fapshi, no cards, the payee is
  the founder, in their own name, trading as 4TUNHub (individual, not yet registered), plus the refund rule.
- G-06 privacy: name Fapshi as the payment processor and list what 4TUNHub sees (name, phone, amount, reference).
- Before the link goes live, ask Fapshi in writing about limits on individual accounts and how refunds are made.

**Drafted 2026-11-11 on `claude/4tunhub-security-audit-cont-9a733c`, draft PR #3. Wording approved by the owner as is (2026-11-11), read on Deploy Preview #3; not deployed:**
- G-05: three new sections in `/terms` (EN + FR), "Paying for a seat", "Refunds", "Pay only through this site".
  Price stays on the cohort page. Refunds (owner's rule): full within 7 days and before session 2, half after
  7 days until session 2, none from session 2; full refund or next cohort if 4TUNHub cancels or postpones;
  paid back by MoMo within 7 days.
- G-06: `/privacy` names Fapshi, lists what 4TUNHub sees, and keeps payment records ten years (OHADA).
- A-01: `Purchasable.payment` plus `paymentUrl()`, which returns the link only if it is `https:` on
  `fapshi.com` or a subdomain (tested against `http:`, look-alike hosts, `javascript:` and junk).
- A-03: the scam warning is the "Pay only through this site" section; repeat it next to the Pay button when
  the cohort page gets one.
- H-01: `SECURITY.md` open item 2 marked done.
- Checks: `npm run check` passes (lint, tokens, build, 198 KB / 220 KB); the built `/en|fr/terms` and
  `/en|fr/privacy` pages contain the new text.

### Card payments (open question, researched 2026-11-12)

The question: can Cohort 1 take Visa/Mastercard (diaspora buyers, employers paying) without registering first?
Public pages and search results only, read 2026-11-12; no account was opened. Re-check with each provider.

| Route | Card acceptance for a seller in Cameroon | Unregistered individual? |
|---|---|---|
| **Stripe** | Cameroon is not on Stripe's merchant-account country list; it appears only in Stripe Tax (tax registration, not collection) ([Stripe Tax: Cameroon](https://docs.stripe.com/tax/supported-countries/africa/cameroon)). | No |
| **PayPal** | Cameroon-registered accounts can send but not receive payments, per PayPal Community answers ([thread](https://www.paypal-community.com/t5/Payments-Archives/PAYPAL-OPTIONS-IN-CAMEROON/td-p/2765923)). "Foreign PayPal account" workarounds break PayPal's terms and can freeze the funds. | No |
| **Flutterwave** | Lists card and MoMo collection in XAF ([Cameroon docs](https://developer.flutterwave.com/docs/cameroon), [payment methods](https://developer.flutterwave.com/docs/payment-methods)); licensed in Cameroon through Ecobank since 2025 ([fintech.global](https://fintech.global/2025/06/27/flutterwave-expands-licensed-payments-in-cameroon/)). Whether a Cameroon merchant's hosted link takes XAF cards with 3-D Secure is not confirmed in public docs. | No: full business KYC |
| **Notch Pay** | Conflicting: its WooCommerce plugin lists Visa/Mastercard, its direct-charge API lists only MTN, Orange and PayPal ([direct charge](https://developer.notchpay.co/docs/payments/direct)). | Unclear (docs ask for business papers) |
| **CinetPay** | Visa/Mastercard 3.5% (see comparison above). The only confirmed card route. | No: NIU and RCCM |
| **Fapshi** | No card method found on its pricing page or in search. | Yes, MoMo only |
| **Merchant-of-record platforms** (Lemon Squeezy, Polar, Dodo Payments) | They take cards worldwide, but payouts go through Stripe Connect, bank lists or PayPal; no source confirms a payout to Cameroon. Whether they allow live, taught cohorts (not just digital goods) is also unchecked. | Not confirmed |

**Finding:** no route gives an *unregistered* seller in Cameroon a working, terms-compliant card checkout.
Cards come only with registration (RCCM + NIU), then CinetPay (confirmed) or Flutterwave / Notch Pay (ask in writing).

**What this means for the owner's choice:**
- If the January buyers are students in Cameroon paying 35,000–60,000 FCFA, MoMo covers them; Fapshi first holds,
  and a diaspora relative or employer can pay by sending MoMo to the buyer, who pays the link.
- If cards matter for Cohort 1 (diaspora, employers that pay only by card or invoice), register the *établissement*
  at the Bafoussam CFCE **now** (3–7 days in practice) and start on CinetPay instead; Fapshi becomes the fallback.
- Middle path: open Fapshi now for MoMo, register in parallel, add a CinetPay card link once the papers are back.
  `paymentUrl()` then needs `cinetpay.com` on its allow-list (one line, reviewed in a PR).


1. Owner: GitHub 2FA, then Gmail, Netlify and the rest (G-01, G-02). No deploy, no cost.
2. ~~Entity question~~ answered: not registered. ~~Provider comparison~~ done (above). Owner: register an *établissement* at the Bafoussam CFCE; Fapshi as an individual is the fallback.
3. Owner opens the **Fapshi** account (individual), turns on 2FA, asks support about limits and refunds, and makes one small real payment and refund (A-04). Claude cannot open accounts or enter ID documents.
4. Claude: terms of sale, privacy update, payment link in `commerce.ts`, the scam warning (G-05, G-06, A-01, A-03) on a branch, checked on its preview, merged in **one** deploy (15 credits) with the pending docs.
5. Pre-sale opens. Reconcile by hand (A-02). Revisit option B only when volume asks for it.
