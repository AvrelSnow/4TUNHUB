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

## Results (2026-11-11) — approved and run locally

Installed with the owner's approval: Gitleaks (winget), OSV-Scanner (winget), Semgrep (pip --user), plus `pip-system-certs` (pip --user) so Python trusts the Windows certificate store; Semgrep's rule download failed TLS verification without it. Semgrep needs `%APPDATA%\Python\Python313\Scripts` on PATH.

| Tool | Result |
|---|---|
| **Gitleaks** (`git --redact --log-opts=--all`, every branch) | **No real secrets in history.** One false positive: rule `linkedin-client-secret` matched the constant name `SWUG_LINKEDIN_URL` in an import list (`screenshots/page.tsx`, commit 0f7e162). Allowlist it when the CI workflow is added. |
| **OSV-Scanner** (`package-lock.json`, 507 packages) | 1 medium: `minimatch` 10.2.6 (GHSA-g3hv-75wg-m249, CVSS 6.9, fix 11.0.1). **Dev-only** (lint tooling), not in the production bundle. Fix in the next routine dependency update. |
| **Semgrep** (`p/nextjs`, `p/typescript`, `p/secrets`, 110 rules, 113 files in `src/`) | 3 findings, all `react-dangerouslysetinnerhtml`, all **false positives**: JSON-LD `<script>` blocks (`about/founder/page.tsx:57`, `about/founder/projects/[slug]/page.tsx:72`, `academy/cohort-0/page.tsx:118`). Content comes from the repo's own dictionaries and project data; `locale` and `slug` are validated (`notFound()`) before use. No visitor input reaches them. Optional hardening: escape `<` as `<` in a shared JSON-LD helper (the same pattern is in `layout.tsx:104`, not flagged). No secrets or injection findings. |

Step 4 (owner approved 2026-11-11): `.github/workflows/security.yml` runs Gitleaks, OSV-Scanner
and Semgrep on pull requests, pushes to `main` and weekly (Mondays). Config: `.gitleaks.toml`
(allowlists `SWUG_LINKEDIN_URL`), `osv-scanner.toml` (ignores the dev-only minimatch advisory
until 2027-02-11), and the Semgrep JSON-LD rule excluded in the workflow. All three pass locally
with that config; the Action versions (`gitleaks` 8.28.0, `osv-scanner-action` v2.0.3,
`semgrep` image 1.131.0) are unverified until the first run on the PR. **Merging it triggers
a Netlify build** (`.github/` is not ignored), so merge it together with other work.
