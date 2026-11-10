# Next session — continuation prompt

You are continuing the 4TUNHub security audit (master prompt V3). Do this:

1. Read `docs/PROJECT-STATE.md`, `docs/00-assumption-and-fact-register.md`, `docs/01-verification-evidence.md`.
2. Run `git status`; confirm the branch named in PROJECT-STATE and compare it with `origin/main`.
3. Check whether `claude/4tunhub-agent-team-d70c93` has been merged. If not, it still carries the Next 16.4.3 upgrade and the rate-limit fix.
4. Respect the pending approvals in PROJECT-STATE. Never push to `main` without the owner (15 Netlify credits per deploy). Never scan production actively.
5. Resume at the first incomplete phase: Phase 0 (Gitleaks, OSV-Scanner, Semgrep, Playwright — install only once approved), then the Phase 1 docs (`docs/02-repository-reconnaissance.md`, `docs/03-technology-stack.md`).
