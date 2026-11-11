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
- **New finding P-5:** a leftover Vercel project (`fortunedonfack05-4257s-projects/4tunhub`)
  still builds every push and serves `4tunhub.vercel.app` publicly. No env vars (no secrets),
  canonical → 4tunhub.com, previews behind Vercel SSO, **but the Vercel account has no 2FA**.
  Proposed to the owner: delete the project (or disconnect Git), remove the Vercel GitHub app,
  enable 2FA. Record the owner's decision in the remediation log.
- Gotcha: `netlify.toml`'s `ignore` rule can cancel a production deploy whose preview already
  built. Use Trigger deploy → "Deploy project without cache".
- INC-001 is closed; its record stays on local branch `local/inc-001-private`. Never push it.

Do this:

1. Ask the owner what they decided on P-5 (Vercel). Anything that deletes or disconnects is
   the owner's click, or needs their explicit yes first.
2. Next audit steps (propose first): restricting Netlify deploys to Git; optional JSON-LD
   helper that escapes `<` (a good item to batch with PR #2); the R-03 burst test
   (`docs/security/scripts/burst-test.sh`, production only with the owner's OK);
   payment-readiness gaps.

Rules: never push to `main` without the owner, never scan production actively, and
never print or copy secret values. Netlify, Vercel, GitHub and Resend are signed in in the
owner's Chrome (use Claude in Chrome, not the built-in browser).
