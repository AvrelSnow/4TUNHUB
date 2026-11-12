import Link from "next/link";
import { Logo } from "./ui/Logo";
import { Button } from "./ui/Button";
import { Glyph, type GlyphName } from "./ui/Glyph";
import { NavLink } from "./NavLink";
import { NavMenu } from "./NavMenu";
import { MobileNav } from "./MobileNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SoundToggle } from "./SoundToggle";
import { primaryNav } from "@/lib/sitemap";
import { projectDetailPath } from "@/lib/projects";
import { MEDIUM_URL, WHATSAPP_COMMUNITY_URL, YOUTUBE_URL } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * The bar floats: a glass pill held 12px off the top and sides. As the page
 * scrolls it gains its shadow (scroll-driven CSS, `.nav-pill`).
 *
 * Four entries, grouped the way a visitor asks (after Fapshi and Bonsai):
 *   What we do ▾  — for companies (Services, Research) and for learners
 *                   (Academy, the YouTube tutorials, The REM), with one
 *                   real project as the featured story
 *   Projects      — the proof, one click away
 *   Community     — live and free, so it never hides in a menu
 *   About ▾       — the organisation, the founder, the CAMRAIL record,
 *                   contact; the WhatsApp community as the featured card
 * Every menu item says in one line what is behind it. Only live pages and
 * real external channels appear: hidden pages stay out.
 *
 * Right side: sound (off by default), EN | FR, and one indigo action; amber
 * is kept for the page's own call to action.
 */
export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const m = dict.nav.menus;
  const L = (path: string) => localizeHref(locale, path);
  const braking = dict.projects.items["locomotive-braking-analysis"];

  // The phone menu keeps the flat list of pillars.
  const items = primaryNav.map(({ key, href }) => ({
    key,
    label: dict.routes[key] ?? key,
    href: L(href),
  }));

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="glass nav-pill relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border border-border pl-5 pr-2 sm:pl-6">
        <Logo href={L("/")} size="sm" />

        <nav aria-label={dict.nav.primary} className="hidden items-center gap-0.5 lg:flex">
          <NavMenu label={m.work}>
            <div className="grid grid-cols-[1fr_1fr_17rem] gap-2 p-3">
              <MenuColumn title={m.forCompanies}>
                <MenuItem href={L("/services")} icon="gear" title={dict.routes.services} desc={m.services} />
                <MenuItem href={L("/research")} icon="leaf" title={dict.routes.research} desc={m.research} />
                <MenuItem href={L("/projects")} icon="cube" title={dict.routes.projects} desc={m.projectsDesc} />
              </MenuColumn>
              <MenuColumn title={m.forLearners}>
                <MenuItem href={L("/academy")} icon="cap" title={dict.routes.academy} desc={m.academy} />
                <MenuItem href={YOUTUBE_URL} external icon="play" title={m.youtube} desc={m.youtubeDesc} />
                <MenuItem href={MEDIUM_URL} external icon="letter" title={m.rem} desc={m.remDesc} />
              </MenuColumn>
              {braking && (
                <Link
                  href={L(projectDetailPath("locomotive-braking-analysis"))}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-surface"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/projects/braking-hero-sm.webp"
                    alt=""
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="p-4">
                    <p className="text-2xs font-semibold text-accent">{m.featured}</p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-foreground">{braking.title}</p>
                    <p className="mt-1 line-clamp-2 text-2xs text-muted">{braking.outcome}</p>
                  </div>
                </Link>
              )}
            </div>
          </NavMenu>

          <NavLink href={L("/projects")}>{dict.routes.projects}</NavLink>
          <NavLink href={L("/community")}>
            {dict.routes.community}
          </NavLink>

          <NavMenu label={m.about}>
            <div className="grid grid-cols-[1fr_1fr_17rem] gap-2 p-3">
              <div className="col-span-2 p-2">
                <p className="px-3 pt-1 pb-2 text-2xs font-semibold text-muted">{m.company}</p>
                <ul className="grid grid-cols-2 gap-0.5">
                  <MenuItem href={L("/about")} icon="building" title={m.aboutOrg} desc={m.aboutOrgDesc} />
                  <MenuItem href={L("/about/founder")} icon="person" title={m.founder} desc={m.founderDesc} />
                  <MenuItem href={L("/about/founder/camrail")} icon="train" title={m.camrail} desc={m.camrailDesc} />
                  <MenuItem href={L("/contact")} icon="mail" title={m.contact} desc={m.contactDesc} />
                </ul>
              </div>
              <div className="spotlight flex flex-col justify-between rounded-2xl bg-surface p-5">
                <div>
                  <p className="inline-flex items-center gap-2 text-2xs font-semibold text-foreground">
                    <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                    {dict.community.live}
                  </p>
                  <p className="mt-2 font-semibold leading-snug text-foreground">{m.communityTitle}</p>
                  <p className="mt-1.5 text-2xs leading-5 text-muted">{m.communityBody}</p>
                </div>
                <a
                  href={WHATSAPP_COMMUNITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-9 w-fit items-center gap-2 rounded-full bg-secondary px-4 text-2xs font-semibold text-secondary-foreground transition-opacity hover:opacity-90"
                >
                  <Glyph name="whatsapp" className="h-4 w-4" />
                  {m.communityCta}
                </a>
              </div>
            </div>
          </NavMenu>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <SoundToggle label={m.sound} on={m.soundOn} off={m.soundOff} className="hidden sm:flex" />
          <LanguageSwitcher locale={locale} label={dict.nav.language} />
          <Button
            as="a"
            href={L("/contact")}
            size="md"
            variant="ink"
            className="ml-1 hidden sm:inline-flex"
          >
            {dict.nav.workWithUs}
          </Button>
          <MobileNav items={items} nav={dict.nav} ctaHref={L("/contact")} locale={locale} />
        </div>

        {/* Reading progress, held to the pill's straight run. */}
      </div>
    </header>
  );
}

function MenuColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-2">
      <p className="px-3 pt-1 pb-2 text-2xs font-semibold text-muted">{title}</p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function MenuItem({
  href,
  icon,
  title,
  desc,
  external = false,
}: {
  href: string;
  icon: GlyphName;
  title: string;
  desc: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface transition-transform duration-300 group-hover:scale-105",
          "text-foreground",
        )}
      >
        <Glyph name={icon} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
          {title}
          {external && <span aria-hidden="true" className="text-muted">↗</span>}
        </span>
        <span className="mt-0.5 block text-2xs leading-[1.45] text-muted">{desc}</span>
      </span>
    </>
  );
  const cls = "group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-surface";
  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      )}
    </li>
  );
}
