# Project state — security and payment-readiness programme

_Last updated 2026-11-10 (Phase -1 done; PR #1 open with the first remediation batch; INC-001 closed)._

- **Identity:** 4TUNHub, https://4tunhub.com (apex canonical, www → apex).
- **Stack:** production Next 16.2.10; branch Next **16.4.6**. React 19.2.4, TypeScript, npm; Node 22 on Netlify (Next.js Runtime v5.16.1).
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
| R-01 | Next 16.2.10 → 16.4.6, sharp 0.35.5, audit fix | fixed locally, verified; not deployed |
| R-02 | Rate limiter keyed on Netlify client IP | fixed locally, verified; Netlify-side check pending |

Details: `docs/security/07-remediation-log.md`.

## Pending approvals and owner actions
1. ~~INC-001 containment~~ done.
2. Draft PR open → free Deploy Preview to verify R-01/R-02 on Netlify.
3. Then one merge to `main` (15 credits).
4. Phase 0 tool installs (Gitleaks, OSV-Scanner, Semgrep).

- **Payment readiness:** NOT READY.
- **Immediate next action:** verify the Deploy Preview of this branch, then one merge to `main`.
