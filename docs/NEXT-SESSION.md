# Next session — continuation prompt

You are continuing the 4TUNHub security audit (master prompt V3). State on 2026-11-10:

- Phase -1 is done (`docs/00-…`, `docs/01-…`).
- **PR #1** (https://github.com/AvrelSnow/4TUNHUB/pull/1) is open: branch
  `claude/4tunhub-security-audit-0dfa7d` → `main`. It carries Next 16.2.10 → 16.4.6,
  sharp 0.35.5, an `npm audit fix`, and the rate limiter keyed on
  `x-nf-client-connection-ip`. Verified locally (`docs/security/07-remediation-log.md`).
- INC-001 (mail keys in build logs) is **closed**. Its record lives only on the local
  branch `local/inc-001-private` — never push it.
- Netlify deploy logs are private. `RESEND_API_KEY` is secret and set for Production
  only, so the preview's forms will show the "unavailable" fallback. That is expected.

Do this:

1. Read `docs/PROJECT-STATE.md`, then `git status` and `git log --oneline -5` on the branch.
2. Test PR #1's Netlify Deploy Preview (the URL is on the PR's Netlify check):
   - security headers;
   - `/` → `/en`;
   - home, contact, waitlist and Cohort 0 pages render;
   - the contact form returns `unavailable` 5 times, then `rateLimited` on the 6th,
     even with a forged `X-Forwarded-For` and a forged `x-nf-client-connection-ip`.
3. Report the results and ask the owner before merging to `main` (15 Netlify credits).
   After the merge: send one contact-form test on production, confirm it arrives in
   Resend, and update the docs.
4. Then continue with Phase 0: propose Gitleaks, OSV-Scanner and Semgrep, and install
   nothing without approval.

Rules: never push to `main` without the owner, never scan production actively, and
never print or copy secret values.
