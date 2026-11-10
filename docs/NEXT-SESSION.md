# Next session — continuation prompt

You are continuing the 4TUNHub security audit (master prompt V3). State late on 2026-11-10:

- **PR #1** (https://github.com/AvrelSnow/4TUNHUB/pull/1): Next 16.4.6 + rate limiter
  keyed on `x-nf-client-connection-ip`. **Verified on its Deploy Preview**: headers,
  `/` → `/en`, every page, and forged IP headers are ignored. Results:
  `docs/security/07-remediation-log.md` ("Deploy Preview check").
- New findings from that check: P-2 (rate window per function instance), P-3 (no
  `nosniff` on `/_next/static/*`), P-4 (the preview held the production mail key,
  fixed by rebuilding it).
- INC-001 is closed; its record stays on the local branch `local/inc-001-private`.
  Never push it.

Do this:

1. Read `docs/PROJECT-STATE.md`, then `git status` and `git log --oneline -5`.
2. **Only if the owner has said yes in chat:** merge PR #1 into `main` (15 credits).
   Then send one contact-form message on production, confirm it in Resend (Emails),
   and record the result.
3. Ask whether to check or delete the old branch deploy `claude/project-audit-e95f91`,
   which may still hold the mail key.
4. Phase 0: the owner decides on `docs/security/08-phase-0-tooling-proposal.md`.
   Install nothing without a yes.
5. Plan P-2 (Netlify Blobs window) and P-3 (`netlify.toml` header) as one branch, and
   ship them with the next merge.

Rules: never push to `main` without the owner, never scan production actively, and
never print or copy secret values.
