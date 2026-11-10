# 01 — Verification evidence (Phase -1)

All commands run 2026-11-10 from the local worktree (Windows 11, Node 24.22.1).
No production write, scan or form submission was performed: production was
touched only by DNS lookups and a handful of ordinary GET/HEAD page requests.

## E-01 Git state
- Branch `claude/4tunhub-security-audit-0dfa7d` = `origin/main` = `c956a69` (2026-10-21). Working tree clean.
- Local `main` ref is 16 commits behind `origin/main` (stale local ref, not a risk).
- 59 commits. Authors: `AvrelSnow` (two owner addresses) and `Claude` co-author only.

## E-02 Stack (package.json + package-lock.json v3)
next 16.2.10 · react/react-dom 19.2.4 · TypeScript 5 · Tailwind 4 · ESLint 9 · npm.
Node on Netlify: 22 (`netlify.toml`). Only 5 runtime deps (next, react,
react-dom, two font packages).

## E-03 Routing
App Router under `src/app/[locale]/…` (en, fr). `src/proxy.ts` redirects
locale-less paths. Route handler: `src/app/academy-card.jpg/route.tsx` (image).
Metadata routes: robots, sitemap, OG image, icons.

## E-04 Netlify config (`netlify.toml`)
`npm run build`, publish `.next`, `@netlify/plugin-nextjs`, NODE_VERSION 22,
`ignore` skips builds for docs/markdown-only commits. No redirects or headers
in the toml — headers come from `next.config.ts`.

## E-05 Server-side entry points and persistence
| Entry point | File | Data | Destination |
|---|---|---|---|
| Contact form (Server Action) | `src/lib/contact-action.ts` | name, email, topic, message | Resend → MAIL_TO |
| Waitlist (Server Action) | `src/lib/waitlist-action.ts` | email, name, tracks | Resend → MAIL_TO |
| Cohort application (Server Action) | `src/lib/apply-action.ts` | name, email, WhatsApp, LinkedIn, school, SW version, motivation, **4 screenshots (≤5 MB body)** | Resend → MAIL_TO; receipt to applicant if MAIL_FROM set |
| Image route | `src/app/academy-card.jpg/route.tsx` | none | — |

Controls present: server-side validation, honeypot, per-IP in-memory rate
limit (5 per 10 min), magic-byte image check, generic error codes, provider
errors logged without payload. No DB, no auth, no cookies set by the app.
Env vars referenced: RESEND_API_KEY, MAIL_TO, MAIL_FROM, ANALYTICS_*,
NEXT_PUBLIC_PREVIEW_APPLICATIONS. No secret carries a `NEXT_PUBLIC_` prefix.

## E-06 Browser storage
`localStorage`: `4tun.theme`, `4tun.consent`. No cookies written by app code.

## E-07 Dependency audit (`npm audit --package-lock-only --omit=dev`)
| Sev | Package | Issue (summary) |
|---|---|---|
| critical | next 16.2.10 (range ≤16.4.0) | Server Action DoS; SSRF; proxy bypass (Turbopack + single-locale variant) |
| high | sharp (≤0.35.5-rc.1) | libvips / libheif / librsvg CVEs |
| high | postcss (≤8.5.22, nested in next) | XSS in stringify; file read via sourceMappingURL |
| high | source-map-js | event-loop DoS |
| high | nanoid | infinite loop with size 0 |
| moderate | baseline-browser-mapping | DoS on invalid input |

Per-advisory applicability is Phase 8 work. The Server Action DoS is directly
relevant: the site's three forms are Server Actions.

## E-08 Production HTTP surface
- DNS: `4tunhub.com` and `www.4tunhub.com` → 75.2.60.5.
- `http://4tunhub.com/` → 301 `https://4tunhub.com/`; `https://www.` → 301 apex.
- `https://4tunhub.com/` → 307 `/en`; this redirect carries only Netlify's
  `Strict-Transport-Security: max-age=31536000`, not the app's headers.
- `https://4tunhub.com/en` → 200 with CSP (incl. `script-src 'self' 'unsafe-inline'
  https://cloud.umami.is`), HSTS 2y + includeSubDomains + preload, XFO DENY,
  nosniff, Referrer-Policy, Permissions-Policy. No `X-Powered-By`.

## E-09 TLS — PARTIALLY VERIFIED
SAN covers `4tunhub.com` and `www.4tunhub.com`; validity 2026-09-19 → 2026-12-18
(a 90-day auto-renewed certificate). **The issuer cannot be verified from this
machine: Avast Web Shield intercepts TLS and re-signs certificates.** Re-check
from a clean network or with SSL Labs.

## E-10 Compromise indicators (none found)
Secret patterns (Resend `re_`, Stripe, AWS, GitHub, Netlify, private keys)
searched across the full `git log --all -p`: no hits. No `.env` file ever
committed. `dangerouslySetInnerHTML` uses: JSON-LD (`JSON.stringify` of static
data), the theme resolver (static), the Plausible queue stub (static). External
hosts in source are all expected (Resend, schema.org, LinkedIn, YouTube, owner sites).

## E-11 Unmerged security work
`claude/4tunhub-agent-team-d70c93` @ `c926eef` (local only): Next 16.4.3,
sharp 0.35.5, rate limiter keyed on Netlify's client-IP header, `SECURITY.md`.
Needs review and re-validation (npm now advises next 16.4.6) before it ships.

## Preliminary application findings (to confirm in Phase 8)
- **P-1** Rate limit keys on the first `X-Forwarded-For` value (client-controlled)
  and lives in memory per function instance → likely bypassable. Fix exists in E-11.
- **P-2** The cohort form sends phone, LinkedIn and screenshots to a US processor
  (Resend) and a mailbox; no retention or deletion rule is documented.
- **P-3** Waitlist builds a CSV line with an unescaped `name` → CSV/formula
  injection if those lines are pasted into a spreadsheet.
- **P-4** CSP keeps `'unsafe-inline'` for scripts (trade-off documented on the E-11 branch).

## Not accessible this session
Netlify dashboard/CLI (env scopes, deploy permissions, build logs, preview
secrets), Resend account, mailbox, Namecheap DNS, GitHub repo settings
(neither `gh` nor `netlify` CLI installed). Scanners Semgrep, Gitleaks, Trivy,
OSV-Scanner not installed.
