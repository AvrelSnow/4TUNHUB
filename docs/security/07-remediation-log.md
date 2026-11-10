# 07 — Remediation log

## R-01 — Next.js critical advisories (2026-11-10)

- **Finding:** production ran Next 16.2.10; `npm audit` rated it critical
  (Server Action DoS, SSRF, proxy bypass) — evidence E-07.
- **Root cause:** the fix prepared on 2026-10-24
  (`claude/4tunhub-agent-team-d70c93`) was never merged or deployed.
- **Change:** next / eslint-config-next / @next/bundle-analyzer → **16.4.6**,
  sharp → 0.35.5, `npm audit fix` (no `--force`). Rate limiter and CSP note
  taken from `c926eef`; the agent-team files were left out.
- **Files:** `package.json`, `package-lock.json`, `next.config.ts` (comment
  only), `src/lib/form-guard.ts`, `SECURITY.md`.
- **Regression risk:** minor-version framework jump (16.2 → 16.4).
  Mitigated by full build plus local production run; the branch preview must
  still be checked before merge.
- **Recovery point:** `origin/main` @ `c956a69`; revert the branch commit.

### Verification (local, 2026-11-10)
| Check | Result |
|---|---|
| `npm audit --omit=dev` | **0 vulnerabilities** (was 1 critical, 4 high, 1 moderate) |
| `npm audit` incl. dev | 7 moderate, all dev-only (typescript-eslint → minimatch), no runtime exposure |
| `eslint` | pass |
| design-token check | pass |
| `next build` (16.4.6, Turbopack) | pass, same route table as production |
| bundle budget | within budget |
| `next start` headers | CSP, HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy identical to production |
| Locale redirect `/` → `/en` | 307, as production |

## R-02 — Rate limiter keyed on a forgeable IP (2026-11-10)

- **Finding:** P-1. `clientIp()` used the first `X-Forwarded-For` entry,
  which the client writes.
- **Change:** prefer `x-nf-client-connection-ip` (set by Netlify's edge from
  the connection); fall back to XFF only off Netlify.
- **Test:** `formtest` script (session scratchpad) posts the real no-JS
  contact form 7 times against `next start`:

| Scenario | Submissions 1–5 | 6–7 |
|---|---|---|
| Fixed `x-nf-client-connection-ip`, rotating XFF | accepted (`unavailable`: no mail key locally) | **rateLimited** |
| No Netlify header, rotating XFF (local fallback) | accepted | accepted — expected off Netlify |

- **Still to verify on Netlify:** that the edge overwrites a client-supplied
  `x-nf-client-connection-ip`. Test on the deploy preview before merge.
- **Remaining weakness:** the window is in memory per function instance
  (SECURITY.md open item 2).

## Deploy Preview check — PR #1 (2026-11-10, ~23:15–23:35 local)

Target: `https://deploy-preview-1--4tunhub.netlify.app`, built from `beaa67f`
(the later commits are docs-only and were skipped by the `ignore` rule, so
the preview carries exactly the PR's code). Production was not touched.

### Headers, redirect, pages — pass
| Check | Result |
|---|---|
| `/` | **307 → `/en`** |
| `/en` headers | CSP (as production), HSTS 1y + includeSubDomains + preload, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy; no `X-Powered-By`; `X-Robots-Tag: noindex` (preview) |
| 404 page | same security headers |
| `/en`, `/fr`, `/en/contact`, `/fr/contact`, `/en/waitlist`, `/fr/waitlist`, `/en/academy`, `/en/academy/cohort-0`, `/fr/academy/cohort-0`, `/en/academy/cohort-0/screenshots` | all **200** |
| `/en/doesnotexist` | 404 |
| `/_next/static/chunks/*.js` | HSTS and immutable cache, but **no `X-Content-Type-Options`** → P-3 below |

### R-02 on Netlify — forgery fixed, window still per instance
Contact form, no-JS POST, `message` left empty, so every request is rejected
by validation **after** the rate-limit check: it counts towards the limit
but can never send mail. All times UTC.

| Run | Headers sent | Result |
|---|---|---|
| A (22:31:11, first burst after 11 idle min) | XFF, `x-nf-client-connection-ip` and X-Real-IP all forged, **different every request** | 7 / 7 accepted (no limit) |
| B (22:31:58) | XFF forged and rotating, no nf header | 1 accepted, then **rateLimited ×6** |
| C (22:32:17) | one **never-used** forged nf-ip, fixed | **rateLimited ×7** from the first request |
| D (22:32:51) | same rotating pattern as run A | **rateLimited ×5** |

Reading: C and D prove the edge overwrites a client-supplied
`x-nf-client-connection-ip` and that the key is the real connection IP —
**header forgery no longer bypasses the limit (R-02 verified)**. Run A got
7 through because the in-memory window lives per function instance and a
burst after idle fans out over fresh instances (B started at a count of 4,
which only one instance having seen part of A explains). → P-2 below.

### New findings
- **P-2 — rate limit is per instance on Netlify (Medium).** Measured 7/7
  through in 23 s. Matters most for the Cohort application: when `MAIL_FROM`
  is set it mails a receipt to the address the visitor typed, so a burst can
  make 4TUNHub's sender mail arbitrary inboxes. Fix: shared window in
  Netlify Blobs (SECURITY.md open item 2). Not in PR #1.
- **P-3 — no `nosniff` on `/_next/static/*` (Low).** Next's `headers()`
  does not reach CDN-served static files on Netlify. Fix: a `[[headers]]`
  block for `/_next/static/*` in `netlify.toml`. Low risk: same-origin,
  correct `Content-Type`, hashed names.
- **P-4 — the preview held the production mail key (Medium, fixed).** One
  valid test message sent through the preview was **delivered** (Resend log:
  `[4TUNHub] other: Rate Limit Test`, key `netlify-production`, 23:0x local).
  Cause: the preview was built at 22:23 local, before `RESEND_API_KEY` was
  scoped to Production only. Netlify freezes env values into a deploy at build
  time, so changing the scope does not reach existing deploys. The dashboard
  scoping is correct (Production: set; Deploy Previews, Branch deploys, Preview
  Server, Local dev: empty). Fix applied: "Retry without cache" on Deploy
  Preview #1 (free) at 23:34 local. **Verified:** after the rebuild, one valid
  contact message returns `unavailable` (no mail sent), and all six headers
  and the `/` → `/en` redirect are unchanged. **Lesson:** after re-scoping a secret,
  rebuild or delete every older non-production deploy. The old branch deploy
  `claude/project-audit-e95f91` may also still hold the key; check it.

## Status
R-01: verified on the Deploy Preview. R-02: verified on the Deploy Preview
(forgery); P-2 remains. **Not deployed:** ship with one merge to `main`
on the owner's approval.
