# Next session — continuation prompt

Continue the 4TUNHub security audit. State on 2026-11-11, morning:

- **PR #1** (https://github.com/AvrelSnow/4TUNHUB/pull/1), branch
  `claude/4tunhub-security-audit-0dfa7d`, is **not merged** (the owner said "not yet").
  It now carries:
  - R-01 Next 16.4.6 and R-02 the unforgeable client IP. Both verified on the preview.
  - R-03 the rate window shared in Netlify Blobs (`src/lib/form-guard.ts`). The store
    answers on the preview after the `cache: "no-store"` fix. **The burst test
    hasn't run yet.**
  - R-04 `nosniff` on `/_next/static/*`. Verified.
- P-4 is closed: Deploy Preview #1 and the branch deploy `claude/project-audit-e95f91`
  were both rebuilt and no longer hold the mail key.
- Details: `docs/security/07-remediation-log.md`. Status table: `docs/PROJECT-STATE.md`.
- The owner's local worktree for the PR branch
  (`.claude/worktrees/4tunhub-security-audit-0dfa7d`) is behind origin. Run `git pull`
  there before working in it.
- INC-001 is closed; its record stays on the local branch `local/inc-001-private`.
  Never push it.

Do this:

1. Wait for the Deploy Preview of the latest PR #1 commit to be ready. Its Netlify
   status is on the commit, in the GitHub API.
2. Leave 10 minutes with no form posts, then run
   `bash docs/security/scripts/burst-test.sh`.
   Pass = exactly 5 accepted (`"status":"error"`, from validation), all others
   `rateLimited`, each response under about 2 s. In Netlify (Functions → Next.js
   Server Handler → scope Deploy Preview #1, real-time log), there should be no
   `[rate-limit] shared store …` error. Record the result in 07 (R-03).
3. If it fails: forms must still answer (the 2.5 s deadline falls back to memory).
   Diagnose from the function log, which names the step that stalled.
4. Report to the owner and **ask before merging to `main`** (15 credits). After the
   merge: one production contact test, check Resend → Emails, update the docs.
5. Phase 0: `docs/security/08-phase-0-tooling-proposal.md` waits on the owner.
   Install nothing without a yes.

Rules: never push to `main` without the owner, never scan production actively, and
never print or copy secret values. Netlify and Resend are reachable through the owner's
Chrome. If Netlify shows "Log in", ask the owner to sign in.
