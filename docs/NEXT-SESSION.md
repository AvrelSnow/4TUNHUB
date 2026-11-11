# Next session — continuation prompt

Continue the 4TUNHub security audit. State on 2026-11-11 (evening):

- **Production = `main` = `68fa9fe`** (PR #2 merged 2026-11-11, on top of PR #1's Next 16.4.6,
  IP-keyed rate limiter, Blobs rate window and `nosniff`). Details: `docs/security/07-remediation-log.md`.
- **Security CI live:** `.github/workflows/security.yml` (Gitleaks, OSV-Scanner, Semgrep with no rule
  exclusions) runs on PRs, `main` and weekly. The first run on `main` passed. `gh` isn't signed in on this
  machine, so check runs in Chrome. The minimatch advisory is ignored until 2027-02-11 (typescript-eslint
  still pins `^10.2.2`).
- **R-06 live:** JSON-LD goes through `src/components/JsonLd.tsx` (escapes `<` `>` `&` and line separators).
- **R-05 done:** Netlify production deploys are Git-only (CLI/API/MCP previews still allowed). The PR #2
  production deploy built by itself after the merge (35 s).
- **P-5 fixed:** the leftover Vercel project `4tunhub` was deleted (`4tunhub.vercel.app` → 404) and
  the Vercel GitHub app now reaches only `AvrelSnow/Portfolio-project`. Still open: the owner
  enables 2FA on Vercel (and checks GitHub 2FA).
- **Netlify credits:** ~235.6 / 300 left after the PR #2 deploy, cycle ending Nov 18 (Free plan; the
  site pauses if credits run out). Re-read Usage & billing → General before any merge and log it in PROJECT-STATE.
- **R-03 closed:** the burst test passed on Deploy Preview #2 (5 of 9 accepted, parallel race and forged
  IP headers held). The Blobs window is site-wide, so a preview test also limits the tester on production.
- **Payment readiness:** gap review written, `docs/security/09-payment-readiness.md`. Recommended:
  provider-hosted payment links for Cohort 1; integrated checkout only when volume asks for it.
- **2FA:** owner confirmed on 2026-11-11 that GitHub and Vercel 2FA are both still **off**.
- **These doc updates** sit on branch `claude/4tunhub-security-audit-cont-9a733c` (on top of `…-c7aed1`),
  not on `main` (docs-only; ship them with the next PR).
- Gotcha: `netlify.toml`'s `ignore` rule can cancel a production deploy whose preview already
  built. Use Trigger deploy → "Deploy project without cache".
- INC-001 is closed; its record stays on local branch `local/inc-001-private`. Never push it.

Do this:

1. Ask whether GitHub 2FA and Vercel 2FA are on now; record it in the remediation log.
2. Entity: **not registered** (owner, 2026-11-11). Ask about 2FA on Gmail, Netlify, Resend (G-02).
3. Propose next: the provider comparison (G-04, current sources, no sign-ups; first filter: does it
   onboard an unregistered individual, and what registration would it take), then the terms of
   sale and privacy drafts (G-05, G-06) on a branch. Fix `SECURITY.md` H-01 in the same PR.

Rules: never push to `main` without the owner, never scan production actively, and
never print or copy secret values. Netlify, Vercel, GitHub and Resend are signed in in the
owner's Chrome (use Claude in Chrome, not the built-in browser).
