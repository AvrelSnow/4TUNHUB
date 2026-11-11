# Next session — continuation prompt

Continue the 4TUNHub security audit. State on 2026-11-11 (evening):

- Production = `main` = `a37a83b` (PR #1: Next 16.4.6, IP-keyed rate limiter, Blobs rate
  window, `nosniff` on static assets). Details: `docs/security/07-remediation-log.md`.
- **PR #2 is open, green and NOT merged:** https://github.com/AvrelSnow/4TUNHUB/pull/2
  (branch `claude/4tunhub-security-audit-cont-422de1`). It adds `.github/workflows/security.yml`
  (Gitleaks, OSV-Scanner, Semgrep), `.gitleaks.toml`, `osv-scanner.toml`, and docs. Two CI runs
  passed and did real work (results in `docs/security/08-phase-0-tooling-proposal.md`). Workflow
  now on `actions/checkout@v7` and `osv-scanner-action` v2.7.0, no warnings. Netlify Deploy Preview
  built. The app's PR bar can't bind it (`gh` isn't signed in on this machine); check it in Chrome.
- **Do not merge PR #2 alone:** `.github/` triggers a 15-credit production build. Merge it with
  the next real batch of site work. The minimatch "update" is not possible (typescript-eslint
  still pins `^10.2.2`); the dated ignore stays.
- **P-5 fixed:** the leftover Vercel project `4tunhub` was deleted (`4tunhub.vercel.app` → 404) and
  the Vercel GitHub app now reaches only `AvrelSnow/Portfolio-project`. Still open: the owner
  enables 2FA on Vercel (and checks GitHub 2FA).
- **R-06 on PR #2:** JSON-LD goes through `src/components/JsonLd.tsx` (escapes `<` `>` `&` and line separators);
  the Semgrep rule exclusion is gone from the workflow. This is real site code, so PR #2 now changes the live site.
- **R-05 done:** Netlify production deploys are Git-only (CLI/API/MCP previews still allowed).
- Gotcha: `netlify.toml`'s `ignore` rule can cancel a production deploy whose preview already
  built. Use Trigger deploy → "Deploy project without cache".
- INC-001 is closed; its record stays on local branch `local/inc-001-private`. Never push it.

Do this:

1. Ask whether Vercel 2FA (and GitHub 2FA) is on; record it in the remediation log.
2. Next audit steps (propose first): the R-03 burst test
   (`docs/security/scripts/burst-test.sh`, production only with the owner's OK);
   payment-readiness gaps.

Rules: never push to `main` without the owner, never scan production actively, and
never print or copy secret values. Netlify, Vercel, GitHub and Resend are signed in in the
owner's Chrome (use Claude in Chrome, not the built-in browser).
