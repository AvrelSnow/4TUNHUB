# Project state — security and payment-readiness programme

_Last updated 2026-11-11 (PR #2 live; R-03 burst test passed on Deploy Preview #2; 2FA still off on Vercel and GitHub)._

- **Identity:** 4TUNHub, https://4tunhub.com (apex canonical, www → apex).
- **Stack:** production **Next 16.4.6** (since 2026-11-11; `main` = `68fa9fe` after PR #2). React 19.2.4, TypeScript, npm; Node 22 on Netlify (Next.js Runtime v5.16.1).
- **Repo:** `C:\4TUNHUB.com`, GitHub `AvrelSnow/4TUNHUB` (**public**). Audit branch `claude/4tunhub-security-audit-0dfa7d`.
- **Architecture:** SSR/SSG marketing site + 3 Server Actions that email through Resend. No DB, no auth, no payments.

## Open incident
- **INC-001** — credential incident, **closed 2026-11-10**. Details stay off this public repo.
  Full record: local-only branch `local/inc-001-private` (never push it). **Highest priority.**

## Netlify, verified in the dashboard (read-only, 2026-11-10)
- Project `4tunhub`, team `fortunedonfack05`, linked to `github.com/AvrelSnow/4TUNHUB`.
- Deploy log visibility: **private** (changed 2026-11-10).
- `RESEND_API_KEY`: secret; scoped to Builds, Functions, Runtime; value in **Production only** since 2026-11-10 (previews and branch deploys can no longer send mail).
- `MAIL_FROM`, `MAIL_TO`, `ANALYTICS_*`: all scopes, same value everywhere.
- Branch deploys: only `claude/project-audit-e95f91`. Deploy Previews: every PR against `main`.
- Untrusted (fork) deploy previews: **require approval** — good.
- Production deploys: **Git only** since 2026-11-11 (R-05). CLI/API/MCP can still make previews.
- **Credits (Free plan, 300 per cycle, 19th→18th, no overage: the site pauses if they run out):** 2026-11-11, cycle Oct 19 → Nov 18: **~235.6 left after the PR #2 deploy** (250.6 before it), ~64.4 used (3 production deploys = 45, running cost 19.4 ≈ 0.85/day). Unused credits expire Nov 19. Check Usage & billing before every merge.
- Netlify secret scanning is on and caught the leak in early October (that build failed).

## Remediation
| ID | What | Status |
|---|---|---|
| R-01 | Next 16.2.10 → 16.4.6, sharp 0.35.5, audit fix | **deployed to production** 2026-11-11 |
| R-02 | Rate limiter keyed on Netlify client IP | **deployed**; preview check: forged headers ignored |
| P-2 / R-03 | Rate window shared in Netlify Blobs | **deployed**; burst test **passed** 2026-11-11 on Deploy Preview #2: 5 of 9 accepted, parallel race and forged IPs held |
| P-3 / R-04 | `nosniff` on `/_next/static/*` | **deployed** |
| P-4 | Non-production deploys held the production mail key | fixed: Deploy Preview #1 and branch deploy `claude/project-audit-e95f91` rebuilt, both return `unavailable` |
| P-5 | Leftover Vercel project builds every push, serves `4tunhub.vercel.app`; Vercel account has no 2FA | **fixed 2026-11-11**: project deleted (404), Vercel GitHub app limited to Portfolio-project. Owner reports 2FA still off on Vercel and GitHub (2026-11-11). |
| R-05 | Netlify production deploys restricted to Git | **done** 2026-11-11 (dashboard setting) |
| R-06 | JSON-LD escaped through one `JsonLd` component; Semgrep rule exclusion removed | **deployed** 2026-11-11 (`main` = `68fa9fe`); production JSON-LD verified |

Details: `docs/security/07-remediation-log.md`.

## Pending approvals and owner actions
1. ~~INC-001 containment~~ done.
2. ~~Merge PR #1 → `main`~~ done 2026-11-11 (fast-forward to `a37a83b`).
3. ~~Production deploy~~ done: Netlify first **canceled** it (see remediation log), then
   "Deploy project without cache" built it (47 s, 15 credits).
4. ~~Production contact test~~ done: "Message sent", Delivered in Resend.
5. ~~Phase 0 tool installs~~ done; CI workflow on **PR #2** (green, two runs). Merge only with the next batch (15 credits).
6. ~~P-5 Vercel~~ project deleted, app access narrowed. **Owner: enable 2FA on GitHub and Vercel — confirmed off on 2026-11-11.**
7. ~~R-03 burst test~~ passed on Deploy Preview #2.

- **Payment readiness:** NOT READY. Gap review done 2026-11-11: `docs/security/09-payment-readiness.md`. Recommended path: provider-hosted payment links for Cohort 1 (no webhook, no order store). Blockers: GitHub 2FA (G-01), 2FA on every money-path account (G-02), legal entity (G-03), provider choice (G-04), terms of sale and privacy update (G-05, G-06), site pause risk on Netlify Free (G-07).
- **Immediate next action:** owner enables GitHub 2FA (first) and Vercel 2FA. No registered entity yet (owner, 2026-11-11). Provider comparison done (09): register an *établissement* at the Bafoussam CFCE (72 h official, ~41,500–61,500 FCFA), then CinetPay or Notch Pay; **Owner chose Fapshi first** (individual account, MoMo only, 3%); registration and CinetPay/Notch Pay later. Terms of sale + privacy update approved as is, on draft PR #3 (not merged).
