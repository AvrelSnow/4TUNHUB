# 08 — Phase 0: scanning tools (proposal, nothing installed)

_Drafted 2026-11-10. Waiting on the owner's approval. None of these tools are on
this machine yet (checked: gitleaks, osv-scanner, semgrep, docker all absent).
The repo has no `.github/workflows`._

Why: the repo is **public** and INC-001 was a leaked mail key. The next leak, or
the next vulnerable dependency, should be caught by a machine before a person
finds it.

| Tool | What it catches here | Where it runs | Cost |
|---|---|---|---|
| **Gitleaks** | Secrets in code and in **all git history** (the INC-001 class) | Local scan of the full history once; then a GitHub Action on every PR | Free, MIT |
| **OSV-Scanner** | Known-vulnerable packages in `package-lock.json` (the R-01 class); wider data than `npm audit` | Local, then a GitHub Action weekly + on PRs | Free, Apache-2.0 |
| **Semgrep** (community rules) | Risky code patterns: unvalidated input in server actions, `dangerouslySetInnerHTML`, SSRF via `fetch`, open redirects | Local, then a GitHub Action on PRs | Free (OSS rules, no login needed) |

## Proposed order
1. **Gitleaks, local, read-only:** `gitleaks git --redact -v` over the whole
   history. `--redact` keeps secret values out of the output. Any hit becomes
   an INC-001 follow-up on the private branch, not in this public repo.
2. **OSV-Scanner, local:** `osv-scanner scan -L package-lock.json`.
3. **Semgrep, local:** `semgrep scan --config p/nextjs --config p/typescript --config p/secrets src/`.
4. Only once 1–3 run clean or are triaged: one GitHub Actions workflow
   (`.github/workflows/security.yml`) running all three on PRs. Actions on a
   public repo are free. A `.github/` change *does* trigger a Netlify build
   (the `ignore` rule only skips `docs/` and markdown), so ship the workflow
   **in the same merge as other work** to save 15 credits.

## How to install (Windows, needs approval)
- Gitleaks: `winget install gitleaks.gitleaks`
- OSV-Scanner: `winget install Google.OSVScanner`
- Semgrep: `python -m pip install --user semgrep` (Python 3.13 is present)

## Decisions for the owner
- Approve the local installs (steps 1–3)? → yes / no / some.
- Add the GitHub Actions workflow later (step 4)? → yes / no.
