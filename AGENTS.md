<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Pushing to `main` costs money

Netlify bills a flat **15 credits per production deploy**, regardless of how
long the build runs. The plan is 300 credits a month, so `main` has a budget
of **20 deploys a month** — about one every day and a half.

Branch deploys, deploy previews and failed builds are **free and unlimited**.

So:

- Work on a branch and review it on its branch-deploy URL. Iterate there as
  much as you like; none of it is billed.
- Merge to `main` only when a batch of work is finished. One merge, one
  deploy, one charge.
- Never push a change to `main` to see what it looks like. Preview it
  locally (`npm run dev`) or on a branch first. A change pushed and then
  reverted costs 30 credits and lands nowhere.
- Batch related commits into a single push. The bill counts deploys, not
  commits.

`netlify.toml` cancels the deploy for commits that only touch `docs/` or
markdown. Everything else builds.
