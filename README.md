# 4TUNHUB

The website of 4TUN Hub, an engineering organisation in Dschang, Cameroon:
mechanical design, FEA simulation and hands-on CAD training. Live at
[4tunhub.com](https://4tunhub.com), in English and French.

Next.js 16 (App Router) + Tailwind CSS 4. Every page is static per locale;
the forms are server actions.

## Work on it

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + design tokens + production build + JS budget
```

After a production build, delete `.next` before running `npm run dev` again.

## Where things are

- `docs/art-direction.md`: governs every visual decision. Read it first.
- `docs/strategy.md`, `docs/launch-plan.md`: what the site is for.
- `src/lib/i18n/dictionaries/`: all copy. `en.ts` is the source; `fr.ts` must
  match its shape, or the build fails.
- `src/lib/sitemap.ts`: the site map, navigation and `sitemap.xml`.
- `src/lib/cohort.ts`: Cohort 0 dates. The banner and panels hide
  themselves after `APPLICATIONS_CLOSE`.

## Deploy

Netlify builds `main` automatically (`netlify.toml`). Set these in
Netlify → Site configuration → Environment variables:

| Variable | Needed | What it does |
|---|---|---|
| `RESEND_API_KEY` | yes | Delivers the contact form and Cohort 0 applications. Without it, the forms say they could not send and offer a ready-written email instead. |
| `MAIL_TO` | no | Where submissions go. Defaults to `4tunhub@gmail.com`. |
| `MAIL_FROM` | no | Sender. Defaults to Resend's test sender, which only delivers to the Resend account's own address. Use `4TUN Hub <hello@4tunhub.com>` once the domain is verified in Resend. |
