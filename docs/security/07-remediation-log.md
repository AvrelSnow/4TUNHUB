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

## Status
R-01, R-02: **fixed locally, not deployed.** Ship with one merge to `main`
after the preview check.
