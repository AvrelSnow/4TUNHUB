# Project state — security and payment-readiness programme

_Last updated 2026-11-10 (Phase -1 complete)._

- **Identity:** 4TUNHub, https://4tunhub.com (apex canonical, www → apex).
- **Stack:** Next 16.2.10 App Router, React 19.2.4, TypeScript, npm; Node 22 on Netlify via `@netlify/plugin-nextjs`.
- **Repo:** `C:\4TUNHUB.com`, GitHub `AvrelSnow/4TUNHUB`. Audit branch `claude/4tunhub-security-audit-0dfa7d`.
- **Architecture:** SSR marketing site + 3 Server Actions that email through Resend. No DB, no auth, no payments.
- **Phase:** -1 complete → Phase 0 (skills/tools) waiting on owner approval.
- **Confirmed vulnerabilities:** dependency level — next (critical), sharp, postcss, source-map-js, nanoid (high). A partial fix sits on the unmerged branch `claude/4tunhub-agent-team-d70c93`.
- **Fixed:** none yet.
- **Payment readiness:** NOT READY (no DB, no auth, no webhook path, critical dependency open).
- **Deploy rule:** every push to `main` costs 15 Netlify credits — batch fixes, preview on branch deploys.
- **Pending approvals:** tool installs (Phase 0); Netlify read access; any change to `main`.
- **Immediate next action:** owner approves the tool plan; then patch Next to ≥16.4.6 on a branch and verify on a branch deploy.

Details: `docs/00-assumption-and-fact-register.md`, `docs/01-verification-evidence.md`.
