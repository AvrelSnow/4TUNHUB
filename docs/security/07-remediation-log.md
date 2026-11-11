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

## R-03 — Shared rate-limit window in Netlify Blobs (P-2, 2026-11-11)

- **Change:** `src/lib/form-guard.ts`. `rateLimited()` is now async, and its
  window lives in a Blobs store `form-rate-limit` with strong consistency and
  conditional writes (`onlyIfMatch`/`onlyIfNew`, 4 tries). The key is
  `<UTC day>/sha256(day|ip)`, so no IP is stored, and older days are swept.
  There's a 2.5 s deadline, after which the per-instance memory window
  decides. The three actions `await` it. New dependency `@netlify/blobs`
  11.1.9 (about 60 transitive packages, all Netlify's own; `npm audit
  --omit=dev` = 0; server only, client bundle unchanged at 198 KB).
- **Incident during the work:** the first preview (`0b480a0`) hung every
  form request until the 30 s function timeout. The Blobs read never returned
  under Next's patched `fetch`. Fixed in two steps: a deadline (`3adf417`),
  then `fetch` with `cache: "no-store"` and an abort (`949f119`). After that
  the action ran in 681 ms with no store error in the function log.
- **Local:** `npm run check` passes. `next start` without Blobs falls back to
  memory: submissions 1–5 accepted, 6–7 `rateLimited`.
- **Still to verify on the preview:** the burst test (3 sequential, then
  4 at once, then 2 more after 10 idle minutes). Expected: exactly 5 accepted.

## R-04 — `nosniff` on `/_next/static/*` (P-3, 2026-11-11)

- **Change:** `netlify.toml` `[[headers]]` for `/_next/static/*`.
- **Verified on the preview:** a JS chunk now returns
  `X-Content-Type-Options: nosniff`.

## P-4 follow-up — old branch deploy (2026-11-11)
The branch deploy `claude/project-audit-e95f91` was rebuilt without cache. A
valid contact message there now returns `unavailable`, so no non-production
deploy holds the mail key any more.

## Production deploy (2026-11-11)
- PR #1 was merged by fast-forward: `main` c956a69 → `a37a83b`, the exact commit
  the Deploy Preview tested.
- **The production deploy was canceled by `netlify.toml`'s `ignore` rule.** It diffs
  against `CACHED_COMMIT_REF`, which was the preview build of the same commit, so
  there was no diff and the build was skipped. Canceled builds are free.
  **Lesson:** a merge whose preview already built may skip production. Use
  Trigger deploy → "Deploy project without cache" (empty ref fails open and builds).
- That deploy ran once: 47 s, 15 credits, published. Production now returns the new
  headers (HSTS 2 years), `/` → `/en`, and pages 200.
- **Production contact test:** one message returned "Message sent" and shows as
  Delivered in Resend ("[4TUNHub] services: Security Audit Test"). Nothing else was
  sent to production.

## Status
R-01 to R-04 and P-4: deployed. The formal burst test (R-03) was not run; on the
preview, requests 1–5 were accepted and 6–7 limited despite forged IP headers.

## P-5 — Leftover Vercel project still builds the repo (found 2026-11-11)

PR #2 got a "Vercel Preview Comments" check alongside Netlify's. The owner's Vercel project
`fortunedonfack05-4257s-projects/4tunhub` (Hobby) is still connected to the GitHub repo
from before the move to Netlify, and builds every push. Read-only checks:

- **Environment variables: none** (project and shared). No Resend key, so forms on the
  Vercel copy fail closed. No secret is exposed.
- **Domain:** only `4tunhub.vercel.app` (Production). It serves the current site publicly
  (`/en` 200, same CSP/HSTS) with `index, follow`, but its canonical points at
  `https://4tunhub.com/en`, so the SEO harm is small.
- **Preview URLs** redirect to Vercel SSO (Deployment Protection on).
- **Vercel account has no 2FA** (dashboard shows "Enable 2FA"). Anyone who takes that
  account can publish anything at `4tunhub.vercel.app` and has the Vercel GitHub app's
  access to the repo.

Risk: low-to-medium. A trusted-looking second copy of the site that nobody watches,
plus a third-party app with repo access and a weak account. **Proposed (owner action):**
delete the Vercel project, or at least disconnect its Git repo; remove the Vercel GitHub app
from `AvrelSnow/4TUNHUB` if nothing else uses it; enable 2FA on Vercel either way.

**P-5 done (2026-11-11, owner approved "do what is recommended", deletion confirmed):**
- Vercel project `4tunhub` **deleted**. `4tunhub.vercel.app/en` now returns 404; 4tunhub.com
  (Netlify) and donfackfortune.me (the owner's other Vercel project) still return 200.
- Vercel GitHub app (installation 73193593) went from **All repositories** (read/write to code,
  administration, hooks, PRs…) to **only `AvrelSnow/Portfolio-project`**. The app was kept because
  the portfolio deploys through it. Vercel's pending "permission update" request was left unanswered.
- **Owner action left:** enable 2FA on the Vercel account (needs the owner's authenticator).
  Check GitHub 2FA too, since the GitHub account controls the repo.

## R-05 — Production deploys restricted to Git (2026-11-11, owner request)

- Netlify → Project configuration → Developer settings → **Enforce deployment methods**:
  "Only Git-based production branches can deploy to the production context" is **on**
  (checked again after a reload). The Netlify CLI, MCP and API can no longer publish to production.
  They can still create Deploy Previews and branch deploys.
- Nothing in the repo deploys through the CLI or API (searched for `netlify deploy`, `NETLIFY_AUTH_TOKEN`,
  `api.netlify.com`), so normal work is unaffected.
- Why: a leaked Netlify token, or an agent session with Netlify access, could otherwise push a
  build to 4tunhub.com without it ever touching `main` or GitHub review.
- Not yet checked: the next production deploy. "Trigger deploy → Deploy project without cache"
  builds from `main`, so it should still be allowed. Confirm on the next billed deploy.

## R-06 — JSON-LD escaping helper (2026-11-11, owner request)

- **Change:** new `src/components/JsonLd.tsx`. `serializeJsonLd()` escapes `<`, `>`, `&` and
  U+2028/2029 as JSON unicode escapes (the approach in the Next.js JSON-LD guide). All four JSON-LD
  blocks use `<JsonLd data={...} />`: `layout.tsx` (WebSite and Organization), `about/founder`
  (Person), `about/founder/projects/[slug]` (CreativeWork), `academy/cohort-0` (Course).
- **Why:** the content was static and safe (Semgrep findings triaged as false positives), but raw
  `JSON.stringify` inside `<script>` breaks if a value ever holds `</script>`. Now one place handles it.
- **CI:** the workflow's `--exclude-rule ...react-dangerouslysetinnerhtml` is removed. Locally,
  that rule flags the old inline pattern but not the helper, so a future unescaped injection fails CI.
- **Verified locally:** a round-trip test (`</script><script>alert(1)</script>`, `&`, `>`, separators)
  produced no raw characters and the same data after parsing. `tsc` clean; `npm run check`
  passes (lint, tokens, build 70 pages, client JS 198 KB / 220 KB). Built HTML for `/en`,
  `/en/about/founder`, `/fr/academy/cohort-0` and a project page: every JSON-LD block parses with
  the same `@type`s as before. Semgrep without exclusions: 0 findings.
