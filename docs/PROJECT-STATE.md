# Project state — security and payment-readiness programme

_Last updated 2026-11-11 evening (Phase 0 in CI on PR #2, green, unmerged; P-5 Vercel leftover found)._

- **Identity:** 4TUNHub, https://4tunhub.com (apex canonical, www → apex).
- **Stack:** production **Next 16.4.6** (since 2026-11-11). React 19.2.4, TypeScript, npm; Node 22 on Netlify (Next.js Runtime v5.16.1).
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
- All deployment methods (CLI, API, MCP, Git) may deploy to production. Consider restricting to Git.
- Netlify secret scanning is on and caught the leak in early October (that build failed).

## Remediation
| ID | What | Status |
|---|---|---|
| R-01 | Next 16.2.10 → 16.4.6, sharp 0.35.5, audit fix | **deployed to production** 2026-11-11 |
| R-02 | Rate limiter keyed on Netlify client IP | **deployed**; preview check: forged headers ignored |
| P-2 / R-03 | Rate window shared in Netlify Blobs | **deployed**; formal burst test never run (5 accepted then limited was seen on the preview) |
| P-3 / R-04 | `nosniff` on `/_next/static/*` | **deployed** |
| P-4 | Non-production deploys held the production mail key | fixed: Deploy Preview #1 and branch deploy `claude/project-audit-e95f91` rebuilt, both return `unavailable` |
| P-5 | Leftover Vercel project builds every push, serves `4tunhub.vercel.app`; Vercel account has no 2FA | **open, owner decision**: delete project / disconnect Git, remove Vercel GitHub app, enable 2FA. No env vars on it. |

Details: `docs/security/07-remediation-log.md`.

## Pending approvals and owner actions
1. ~~INC-001 containment~~ done.
2. ~~Merge PR #1 → `main`~~ done 2026-11-11 (fast-forward to `a37a83b`).
3. ~~Production deploy~~ done: Netlify first **canceled** it (see remediation log), then
   "Deploy project without cache" built it (47 s, 15 credits).
4. ~~Production contact test~~ done: "Message sent", Delivered in Resend.
5. ~~Phase 0 tool installs~~ done; CI workflow on **PR #2** (green, two runs). Merge only with the next batch (15 credits).
6. **P-5 Vercel:** owner decides (delete or disconnect the project, remove the GitHub app, enable 2FA).

- **Payment readiness:** NOT READY.
- **Immediate next action:** owner decides on P-5 (Vercel); then propose restricting Netlify deploys to Git.
