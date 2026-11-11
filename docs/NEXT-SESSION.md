# Next session — continuation prompt

Continue the 4TUNHub security audit and payment-readiness work. State at the end of 2026-11-11:

- **Production = `main` = `68fa9fe`** (PR #2, Next 16.4.6, IP-keyed rate limiter, Blobs rate window,
  `nosniff`, JSON-LD escaping). Details: `docs/security/07-remediation-log.md`.
- **Open work = draft PR #3**, branch `claude/4tunhub-security-audit-cont-9a733c`, Deploy Preview
  `https://deploy-preview-3--4tunhub.netlify.app`, all checks green (Netlify, Gitleaks, OSV-Scanner, Semgrep).
  It carries:
  - `/terms` (EN + FR): *Paying for a seat*, *Refunds*, *Pay only through this site*. **Owner approved the
    wording as is.** Price stays on the cohort page. Refunds: full within 7 days and before session 2, half until
    session 2, none after; full refund or next cohort if 4TUNHub cancels or postpones.
  - `/privacy` (EN + FR): Fapshi named as processor, payment records kept ten years (OHADA).
  - `src/lib/commerce.ts`: `Purchasable.payment` + `paymentUrl()` (only `https` on `fapshi.com` or a subdomain).
  - `src/lib/blueprint.ts`: phase 9 "Paid Cohort 1 — taking payments" and two locked decisions; Documentation v1.9.
  - `SECURITY.md` item 2 marked done; all the audit docs from this session.
  - Do not merge yet: it ships with the payment link and Pay button, as one 15-credit deploy.
- **R-03 closed:** burst test on Deploy Preview #2 passed (5 of 9 accepted; parallel and forged-IP posts held).
- **Payments:** `docs/security/09-payment-readiness.md` has the gap list, the provider comparison and the
  registration route. Owner decision: **Fapshi first** (individual "Not Legally Registered" account, MoMo only,
  3%), hosted payment link, no webhook. No registered entity yet; an *établissement* at the Bafoussam CFCE
  and a move to CinetPay or Notch Pay come later.
- **Account security (owner, open):** GitHub and Vercel 2FA were **off** on 2026-11-11. GitHub matters most
  (push to `main` deploys production). Gmail needs app/passkey 2FA before Fapshi holds money (Fapshi's 2FA is by
  email). This status is written in a public repo, so closing it soon matters twice.
- **Netlify credits:** ~235.6 / 300 at the last reading, cycle ends Nov 18, resets Nov 19 (Free plan; the site
  pauses if credits run out). Re-read Usage & billing before any merge and log it in PROJECT-STATE.
- `gh` is not installed on this machine: open or read PRs in the owner's Chrome (Claude in Chrome). The app
  cannot bind PR #3 for the same reason.
- Gotcha: `netlify.toml`'s `ignore` rule can cancel a production deploy whose preview already built. Use
  Trigger deploy → "Deploy project without cache".
- INC-001 is closed; its record stays on local branch `local/inc-001-private`. Never push it.

Do this:

1. Ask whether GitHub, Gmail and Vercel 2FA are on now (then Netlify and Resend); record it in the remediation log.
2. Ask whether the Fapshi account is open with 2FA, what support said about limits on individual accounts and
   refunds, whether a test payment and refund worked, and the Cohort 1 price.
3. When the owner has a Fapshi link: on PR #3, add the Cohort 1 item to `catalog` with `payment`, a Pay button on
   the cohort page that uses `paymentUrl()`, and the scam warning next to it (EN + FR). Check it on the preview.
4. Then propose the merge: re-read Netlify credits first, mark PR #3 ready, merge only on the owner's word.

Rules: never push to `main` without the owner, never scan production actively, never print or copy secret
values, and never open accounts or enter ID documents for the owner. Netlify, Vercel, GitHub and Resend are
signed in in the owner's Chrome (use Claude in Chrome, not the built-in browser).
