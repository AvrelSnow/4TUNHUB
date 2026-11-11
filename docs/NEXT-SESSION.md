# Next session — continuation prompt

Continue the 4TUNHub security audit. State on 2026-11-11:

- PR #1 is **merged and live in production** (`main` = `a37a83b`: Next 16.4.6, IP-keyed
  rate limiter, Blobs rate window, `nosniff` on static assets). A production contact test
  was Delivered in Resend. Details: `docs/security/07-remediation-log.md`.
- **Phase 0 scans are done** (`docs/security/08-phase-0-tooling-proposal.md`): Gitleaks, no real
  secrets in any branch; OSV-Scanner, one dev-only minimatch advisory; Semgrep, 3 false positives.
  Tools are installed locally. Semgrep needs `%APPDATA%\Python\Python313\Scripts` on PATH.
- **Branch `claude/4tunhub-security-audit-cont-422de1`** (pushed, no PR yet, not on `main`) carries
  the docs updates plus `.github/workflows/security.yml`, `.gitleaks.toml`, `osv-scanner.toml`.
  The workflow's Action versions are unverified until it runs once on a PR.
- Gotcha: `netlify.toml`'s `ignore` rule can cancel a production deploy whose preview already
  built. Use Trigger deploy → "Deploy project without cache".
- INC-001 is closed; its record stays on local branch `local/inc-001-private`. Never push it.

Do this:

1. Ask the owner, then open a PR from the branch above (no `gh` CLI here; use the GitHub URL
   `https://github.com/AvrelSnow/4TUNHUB/pull/new/claude/4tunhub-security-audit-cont-422de1`).
   It runs the workflow and a Deploy Preview, both free. Fix any workflow errors on the branch.
2. Do not merge to `main` yet: `.github/` triggers a 15-credit build. Batch it with other work,
   e.g. the minimatch update (`10.2.6` → `11.0.1`, dev-only), then merge once.
3. Next audit steps (propose first): optional JSON-LD helper that escapes `<`; the R-03 burst
   test (`docs/security/scripts/burst-test.sh`, production only with the owner's OK);
   restricting Netlify deploys to Git; payment-readiness gaps.

Rules: never push to `main` without the owner, never scan production actively, and
never print or copy secret values. Netlify and Resend are reachable through the owner's Chrome.
