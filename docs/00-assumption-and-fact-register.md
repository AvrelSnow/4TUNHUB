# 00 — Assumption and fact register

Phase -1 of the security audit. Verified 2026-11-10 on branch
`claude/4tunhub-security-audit-0dfa7d`, which is identical to `origin/main`
(commit `c956a69`, i.e. the code serving production). Evidence IDs (E-xx)
refer to `docs/01-verification-evidence.md`.

Statuses: VERIFIED · OWNER-CONFIRMED · PARTIALLY VERIFIED · UNVERIFIED ·
CONTRADICTED · NOT ACCESSIBLE.

| # | Statement | Status | Evidence | Note |
|---|---|---|---|---|
| A1 | Primary domain is 4tunhub.com | VERIFIED | E-08, E-09 | Apex serves the site; `www` and `http://` 301 to `https://4tunhub.com/`; `/` 307s to `/en` (or `/fr`). |
| A2 | Application uses React | VERIFIED | E-02 | React 19.2.4 / react-dom 19.2.4 (lockfile). |
| A3 | Application uses Next.js | VERIFIED | E-02, E-03 | Next **16.2.10**, App Router, `src/proxy.ts` (Next 16 rename of middleware), TypeScript. |
| A4 | Hosting is Netlify | VERIFIED | E-04, E-08 | `netlify.toml` + `@netlify/plugin-nextjs`; DNS → 75.2.60.5 (Netlify load balancer); `Server: Netlify`, `X-Nf-Request-Id`. Dashboard settings: NOT ACCESSIBLE (no Netlify CLI or login). |
| A5 | A backend exists | PARTIALLY VERIFIED | E-05 | No separate backend. Server-side code = 3 Server Actions (contact, waitlist, cohort application), 1 image route handler, the proxy. Runs as Netlify Functions. |
| A6 | A database exists | CONTRADICTED | E-05 | No database, ORM, schema or DB client in code or dependencies. |
| A7 | Data is persisted | PARTIALLY VERIFIED | E-05, E-06 | Not by the app. Form data is emailed through **Resend** (third party) to the MAIL_TO inbox(es); it then persists in Resend's logs and the mailbox(es). Netlify function logs may hold IPs. Browser `localStorage` holds theme and consent choice only. |
| A8 | Authentication exists | CONTRADICTED | E-05 | No login, sessions, accounts or admin area. |
| A9 | Transactions are recorded | CONTRADICTED | E-05 | No payment code. `src/lib/commerce.ts` is a type/catalog model only and states payments will go through a hosted provider. |
| A10 | Site has security vulnerabilities | VERIFIED (dependency level) | E-07 | `npm audit` on production deps: 1 critical (**next ≤16.4.0**: Server Action DoS, SSRF, proxy bypass), 4 high, 1 moderate. Application-code findings are preliminary (P-1…P-4 in the evidence file). |
| A11 | Site has been compromised | UNVERIFIED — no indicator found | E-10 | Git history: only the owner's addresses plus the Claude co-author; no secrets in history; no unexpected scripts or external hosts in source. Deploy logs and DNS history not inspectable. Not proof of absence. |
| A12 | Payment integration is possible | Requires assessment | — | No DB, no auth, no webhook endpoint yet: all are prerequisites (Phases 13–14). |
| A13 | (new) A security fix already exists | VERIFIED | E-11 | Local branch `claude/4tunhub-agent-team-d70c93` (`c926eef`) upgrades Next → 16.4.3 and fixes the rate-limit IP key. **Not pushed, not deployed.** npm now advises 16.4.6. |
| A14 | (new) Analytics is live | VERIFIED | E-08 | Production CSP allows `https://cloud.umami.is`, so `ANALYTICS_PROVIDER=umami` is set on Netlify. Opt-in consent gate in code. |
