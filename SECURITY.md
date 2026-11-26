# Security

## Reporting a vulnerability

If you find a security problem on 4tunhub.com, tell us privately through the
contact page: <https://4tunhub.com/en/contact> (choose any topic and start the
message with "Security"). You can also write to the address published on that
page, 4tunhub@gmail.com.

Please include what you found, the page or form involved, and the steps to
reproduce it. Do not test against other people's data, do not run automated
scanners against the forms, and give us a reasonable time to fix the issue
before you talk about it publicly. We reply to every report.

## What the site collects

The site has no accounts, no database and no cookies. Three forms post to
server actions, and their content is emailed through Resend to the 4TUNHub
inbox (and a backup inbox when `MAIL_TO` names one). Nothing is stored on the
web host.

| Form | Fields |
| --- | --- |
| Contact (`src/lib/contact-action.ts`) | name, email, topic, message |
| Waitlist (`src/lib/waitlist-action.ts`) | name, email, tracks of interest |
| Cohort application (`src/lib/apply-action.ts`) | name, email, WhatsApp number, LinkedIn URL, organisation, SOLIDWORKS version, motivation, consent, up to four screenshots (JPEG/PNG/WebP, 1.2 MB each) |

Every action is treated as a public endpoint (`src/lib/form-guard.ts`): a
honeypot field, a per-IP rate limit (5 submissions per 10 minutes across all
forms), length limits on every field, an allow-list for select values, file
type and size checks on uploads, and generic error messages. Server Action
bodies are capped at 5 MB in `next.config.ts`.

Analytics is off unless the host configures a cookieless provider (Umami or
Plausible) and the visitor opts in; see `src/lib/analytics.ts` and
`src/lib/consent.ts`. The browser keeps only small preferences in local
storage, never cookies. What is kept and for how long is
stated on `/privacy`.

## Security headers

Set for every route in `next.config.ts`: `X-Content-Type-Options`,
`X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`,
`Strict-Transport-Security` (2 years, preload) and, in production, a
Content-Security-Policy. `poweredByHeader` is off.

## Batch of 2026-11-10 (supersedes the unshipped 2026-10-24 batch)

The 2026-10-24 batch below was prepared on a branch that never reached
production; on 2026-11-10 production still ran Next 16.2.10. This batch
re-applies it on top of `origin/main` with Next **16.4.6** (latest 16.4
patch; `npm audit` flagged every version up to 16.4.0, and 16.4.3 is now
superseded). The agent team and its `.claude/settings.json` from that branch
are not part of this batch, so open item 4 applies only once they land.

## Batch of 2026-10-24

- **Next.js 16.2.10 → 16.4.3** (with `eslint-config-next` and
  `@next/bundle-analyzer`). Closes the advisories `npm audit` rated
  critical/high, including the Server Action denial of service
  (GHSA-p3m5-59mp-jv5r / CVE-2026-64641 in the July 2026 Next.js security
  release) that applies to the site's three server actions, plus the Image
  Optimization, `use cache`, cache-poisoning and metadata-route advisories.
  Next 16.4.3 also brings postcss 8.5.23 and sharp 0.35.5.
- **sharp 0.34.5 → 0.35.5** (devDependency, used by
  `scripts/optimize-images.mjs`, `make-postcards.mjs`, `make-thumbnails.mjs`).
  The 0.35 breaking changes (Node ≥ 20.9, no install script, AVIF tuning,
  `limitInputChannels` default 5, removed `failOnError` / `paletteBitDepth` /
  old `sharpen` options, `jp2k` renamed `jp2`) touch none of the calls those
  scripts make; every call they use was exercised against 0.35.5.
- **`npm audit fix`** (no `--force`) for the transitive findings:
  baseline-browser-mapping, nanoid, source-map-js, zod.
- **Rate limiter keys on an IP the visitor cannot forge.** `clientIp()` now
  prefers `x-nf-client-connection-ip`, which Netlify's edge sets from the
  connection itself (Netlify's recommended client-IP header; their functions
  docs expose the same value as `context.ip`). The first entry of
  `x-forwarded-for` is only the fallback for local development and other
  hosts, because a client can write it.

`npm audit` after the batch: 0 vulnerabilities (production and dev).

## Open items

1. **Verify the Resend sending domain (Fortune, by hand).** Add 4tunhub.com
   in Resend, then create the SPF, DKIM and DMARC records Resend lists in
   Namecheap DNS. Start DMARC at `p=none` with a report address, move to
   `quarantine` once reports are clean. Then set `MAIL_FROM` on Netlify to
   `4TUNHub <hello@4tunhub.com>`. Until then mail goes out from Resend's
   test sender, which only reaches the Resend account's own address and
   cannot be authenticated as 4TUNHub.
2. ~~**Shared rate-limit store.**~~ Done (R-03, deployed 2026-11-11): the window
   lives in Netlify Blobs, shared by every instance, and the burst test on Deploy
   Preview #2 accepted exactly 5 of 9 posts, parallel ones included. See
   `docs/security/07-remediation-log.md`.
3. **CSP: `script-src` keeps `'unsafe-inline'`.** Nonces are the only way to
   drop it while keeping Next's inline scripts, and the Next.js docs are
   explicit that nonces require every page to be dynamically rendered: no
   static generation, no CDN caching. That would break the static
   performance budgets for a marketing site with no user-generated HTML.
   The experimental `experimental.sri` option hashes external script files
   only; it does not cover the inline flight-data scripts Next emits or the
   blocking theme resolver in `src/app/[locale]/layout.tsx`, so it cannot
   remove `'unsafe-inline'` on its own. The rest of the policy is strict
   (`default-src 'self'`, `object-src 'none'`, `base-uri 'self'`,
   `form-action 'self'`, `frame-ancestors 'none'`). Revisit if the site ever
   renders user-supplied HTML, or if Next ships hash-based CSP for inline
   scripts on static pages.
4. **Agent permissions on Fortune's machine.** The shared
   `.claude/settings.json` now asks before `npm install`, `npm i`,
   `npm uninstall` and `npx --yes`, and denies `npm audit fix --force`,
   pushes to `main` and reading `.env*`. Fortune's personal
   `.claude/settings.local.json` pre-approves `npm install *` and
   `node -e '*'`; local settings win, so on that machine installs still go
   through without a prompt and `node -e` can run arbitrary code unasked.
   Fortune should remove those two entries from `settings.local.json` so the
   shared guardrail applies.
5. **`next dev` writes to `AGENTS.md`.** Since 16.3 Next's `agentRules`
   option (on by default) maintains a managed block in `AGENTS.md` when it
   detects a coding agent. It is version-matched documentation, not a
   threat, but it is text from a dependency that lands in the agents'
   instructions. Review that block like any other change to `AGENTS.md`, or
   set `agentRules: false` in `next.config.ts`.
