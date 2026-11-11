# Next session — continuation prompt

Continue the 4TUNHub security audit. State on 2026-11-11:

- PR #1 is **merged and live in production** (`main` = `a37a83b`, Next 16.4.6, IP-keyed
  rate limiter, Blobs rate window, `nosniff` on static assets). A production contact
  test was Delivered in Resend. Details: `docs/security/07-remediation-log.md`.
- Gotcha: the `ignore` rule in `netlify.toml` can cancel a production deploy whose
  preview already built. Use "Deploy project without cache".
- INC-001 is closed; its record stays on local branch `local/inc-001-private`. Never push it.

Do this:

1. Phase 0: `docs/security/08-phase-0-tooling-proposal.md` (Gitleaks, OSV-Scanner,
   Semgrep) waits on the owner. Install nothing without a yes.
2. Optional: the R-03 burst test, only with the owner's OK for production
   (`docs/security/scripts/burst-test.sh`).

Rules: never push to `main` without the owner, never scan production actively, and
never print or copy secret values. Netlify and Resend are reachable through the owner's Chrome.
