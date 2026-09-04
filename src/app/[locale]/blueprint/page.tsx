import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Field } from "@/components/Field";
import { Logo } from "@/components/ui/Logo";
import {
  siteTree,
  flattenTree,
  primaryNav,
  footerNav,
  type NodeStatus,
  type SiteNode,
} from "@/lib/sitemap";
import {
  pageSpecs,
  phases,
  decisions,
  priorityMeta,
  precisionRules,
  craftRules,
  securityRules,
  seoRules,
  scorecard,
  reviewChallenges,
  optimizationReview,
  logoFormats,
  logoRules,
  type Priority,
  type PageSpec,
  type Rule,
  type ReviewPriority,
  type Recommendation,
  type LogoFormat,
} from "@/lib/blueprint";

export const metadata: Metadata = {
  title: "Execution Blueprint",
  description:
    "The single source of truth for building 4TUN Hub — architecture, standards, security, SEO, per-page specs and acceptance criteria.",
  robots: { index: false, follow: false }, // internal spec — never in search
};

const BLUEPRINT_VERSION = "v2.3";
const LAST_UPDATED = "4 Sep 2026";

/* ---------- small primitives ---------- */

const statusLabel: Record<NodeStatus, string> = {
  active: "Active",
  building: "Building",
  planned: "Planned",
};

function StatusDot({ status }: { status: NodeStatus }) {
  const color =
    status === "active"
      ? "bg-brand-500"
      : status === "building"
        ? "bg-muted"
        : "bg-transparent border border-hairline";
  return <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${color}`} />;
}

function StatusBadge({ status }: { status: NodeStatus }) {
  const styles: Record<NodeStatus, string> = {
    active: "bg-brand-500/15 text-accent border-brand-500/40",
    building: "bg-surface-2 text-foreground border-hairline",
    planned: "border-dashed bg-transparent text-muted border-hairline",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-3xs font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    P0: "bg-brand-500 text-ink-900",
    P1: "bg-ink-300 text-ink-900",
    P2: "border border-hairline bg-transparent text-muted",
  };
  return (
    <span
      className={`rounded-md px-2 py-0.5 font-mono text-2xs font-bold ${styles[priority]}`}
      title={priorityMeta[priority].note}
    >
      {priority}
    </span>
  );
}

function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <p className="eyebrow">
        {index} · {eyebrow}
      </p>
      <h2 className="mt-5 text-display-sm text-foreground">
        {title}
      </h2>
      {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
    </div>
  );
}

/** Numbered rule cards — used by the precision / craft / security / SEO contracts. */
function RuleGrid({ rules, accent = false }: { rules: Rule[]; accent?: boolean }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {rules.map((r, i) => (
        <div
          key={r.t}
          className={`rounded-2xl border p-5 ${
            accent && r.t.includes("✓")
              ? "border-brand-500/40 bg-brand-500/10"
              : "border-border bg-surface"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs font-bold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{r.t}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">{r.d}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- TOC ---------- */

const toc = [
  { id: "how", label: "00 · How to use this" },
  { id: "standards", label: "01 · Design standards" },
  { id: "precision", label: "02 · Precision & positioning" },
  { id: "craft", label: "03 · Craft & art direction" },
  { id: "conventions", label: "04 · Conventions & recipe" },
  { id: "ia", label: "05 · Information architecture" },
  { id: "specs", label: "06 · Page specifications" },
  { id: "security", label: "07 · Security standards" },
  { id: "seo", label: "08 · SEO & discoverability" },
  { id: "review", label: "09 · Optimization review" },
  { id: "roadmap", label: "10 · Build roadmap" },
  { id: "decisions", label: "11 · Decisions log" },
  { id: "scorecard", label: "12 · Scorecard" },
];

// Severity reads on the flow ramp — the system's own language for a
// measured quantity — instead of a stray Tailwind red.
const reviewPriorityStyles: Record<ReviewPriority, string> = {
  Critical: "bg-flow-5 text-ink-900",
  High: "bg-brand-500 text-ink-900",
  Medium: "bg-ink-300 text-ink-900",
  Defer: "border border-hairline bg-transparent text-muted",
};

const recStatusStyles: Record<Recommendation["status"], string> = {
  approved: "border-hairline text-muted",
  "in-progress": "border-brand-400 text-accent bg-brand-500/10",
  done: "border-brand-500 text-accent bg-brand-500/15",
  deferred: "border-dashed border-hairline text-muted",
};

function RecCard({ rec }: { rec: Recommendation }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-bold text-muted">{rec.id}</span>
        <span
          className={`rounded-md px-2 py-0.5 font-mono text-3xs font-bold ${reviewPriorityStyles[rec.priority]}`}
        >
          {rec.priority}
        </span>
        <span className="rounded-md bg-background px-2 py-0.5 font-mono text-3xs text-muted">
          effort {rec.effort}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-3xs font-semibold uppercase tracking-wider ${recStatusStyles[rec.status]}`}
        >
          {rec.status}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">{rec.area}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="font-mono text-3xs uppercase tracking-wider text-muted">Problem</dt>
          <dd className="text-muted">{rec.problem}</dd>
        </div>
        <div>
          <dt className="font-mono text-3xs uppercase tracking-wider text-muted">Solution</dt>
          <dd className="text-foreground">{rec.solution}</dd>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
          <div className="min-w-[45%] flex-1">
            <dt className="font-mono text-3xs uppercase tracking-wider text-muted">Impact</dt>
            <dd className="text-muted">{rec.impact}</dd>
          </div>
          <div className="min-w-[45%] flex-1">
            <dt className="font-mono text-3xs uppercase tracking-wider text-muted">Trade-off</dt>
            <dd className="text-muted">{rec.tradeoff}</dd>
          </div>
        </div>
      </dl>
    </article>
  );
}

/* ---------- IA tree ---------- */

function TreeBranch({ node, depth = 0 }: { node: SiteNode; depth?: number }) {
  return (
    <li>
      <div className="flex items-center gap-2 py-1">
        <StatusDot status={node.status} />
        <span
          className={
            depth === 0
              ? "text-sm font-semibold text-foreground"
              : "text-sm text-muted"
          }
        >
          {node.label}
        </span>
        <code className="font-mono text-2xs text-muted">{node.href}</code>
      </div>
      {node.children && (
        <ul className="ml-3 border-l border-border pl-4">
          {node.children.map((c) => (
            <TreeBranch key={c.key} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function NodeCard({ node }: { node: SiteNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{node.label}</h3>
          <code className="font-mono text-2xs text-muted">{node.href}</code>
        </div>
        <StatusBadge status={node.status} />
      </div>
      {node.desc && <p className="mt-2 text-sm leading-6 text-muted">{node.desc}</p>}
      {node.children && (
        <ul className="mt-4 space-y-1.5 border-t border-border pt-3">
          {node.children.map((c) => (
            <li key={c.key} className="flex items-center gap-2">
              <StatusDot status={c.status} />
              <span className="text-sm text-muted">{c.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- spec card ---------- */

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 py-2">
      <dt className="font-mono text-2xs uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

function SpecCard({ spec, status }: { spec: PageSpec; status: NodeStatus }) {
  return (
    <article className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-6 py-4">
        <div className="flex items-center gap-3">
          <PriorityBadge priority={spec.priority} />
          <div>
            <h3 className="text-lg font-semibold text-foreground">{spec.title}</h3>
            <code className="font-mono text-2xs text-muted">{spec.route}</code>
          </div>
        </div>
        <StatusBadge status={status} />
      </header>

      <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-2xs font-mono uppercase tracking-wider text-accent">
            Objective
          </p>
          <p className="mt-1.5 text-sm leading-6 text-foreground">{spec.objective}</p>

          <dl className="mt-4 divide-y divide-border border-t border-border">
            <MetaRow label="Audience">{spec.audience}</MetaRow>
            <MetaRow label="Primary CTA">
              <span className="font-medium text-accent">{spec.primaryCTA}</span>
            </MetaRow>
            <MetaRow label="Content">{spec.contentSource}</MetaRow>
            <MetaRow label="Depends on">
              <div className="flex flex-wrap gap-1.5">
                {spec.dependencies.map((d) => (
                  <span
                    key={d}
                    className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </MetaRow>
          </dl>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-2xs font-mono uppercase tracking-wider text-muted">
              Required sections (top → bottom)
            </p>
            <ol className="mt-2 space-y-1.5">
              {spec.sections.map((s, i) => (
                <li key={s} className="flex gap-2 text-sm text-foreground">
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-muted">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-4">
            <p className="text-2xs font-mono uppercase tracking-wider text-accent">
              Definition of done
            </p>
            <ul className="mt-2 space-y-1.5">
              {spec.acceptance.map((a) => (
                <li key={a} className="flex gap-2 text-sm text-foreground">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- design standards data ---------- */

// The display tokens carry their own weight and tracking, so nothing here
// needs font-semibold or tracking-tight bolted on. Sizes are fluid: each
// clamps between a mobile floor and a desktop ceiling.
const typeScale = [
  { name: "Display LG", cls: "text-display-lg", use: "Short statements only — 52→136px" },
  { name: "Display", cls: "text-display", use: "Page H1 — 44→88px" },
  { name: "Display SM", cls: "text-display-sm", use: "Section H2 — 36→52px" },
  { name: "H3", cls: "text-xl font-semibold", use: "Card / block titles" },
  { name: "Body", cls: "text-base leading-7", use: "Paragraphs" },
  { name: "Small", cls: "text-sm", use: "Meta, captions" },
  { name: "Readout", cls: "readout", use: "Mono gutter labels — 10px" },
  { name: "Eyebrow", cls: "eyebrow", use: "Mono section labels — 12px" },
];

const brandRamp = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const breakpoints = [
  ["Mobile", "360–639px"],
  ["sm", "640px"],
  ["md", "768px"],
  ["lg", "1024px"],
  ["xl", "1280px"],
  ["Max", "up to 1920px"],
];

const budgets = [
  ["Lighthouse", "≥ 95 all categories"],
  ["LCP", "< 2.5s (mid mobile)"],
  ["CLS", "< 0.1"],
  ["INP", "< 200ms"],
  ["Contrast", "WCAG AA · ≥ 4.5:1"],
  ["Motion", "respects reduced-motion"],
];

const components = [
  "Container",
  "Section",
  "Button (primary/secondary/ghost)",
  "Card",
  "Logo (official SVG, light + dark)",
  "Navbar + NavLink (sweep, aria-current)",
  "MobileNav (accessible panel)",
  "Footer",
  "InputField / TextareaField",
  "Badge",
  "Stat",
  "Reveal (scroll motion)",
];

/* ============================================================ */

export default function BlueprintPage() {
  const all = flattenTree();
  const counts = {
    active: all.filter((n) => n.status === "active").length,
    building: all.filter((n) => n.status === "building").length,
    planned: all.filter((n) => n.status === "planned").length,
  };
  const about = siteTree.find((n) => n.key === "about")!;
  const statusByKey = new Map(all.map((n) => [n.key, n.status]));
  const avgScore = Math.round(
    scorecard.reduce((sum, s) => sum + s.current, 0) / scorecard.length,
  );

  return (
    <>
      {/* ============ COVER ============ */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <Field variant="draft" />
        <Container className="relative py-16">
          <div className="flex items-center justify-between gap-4">
            <Logo href={null} />
            <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted">
              {BLUEPRINT_VERSION} · {LAST_UPDATED}
            </span>
          </div>

          <p className="eyebrow mt-12">Execution Blueprint</p>
          <h1 className="mt-5 max-w-4xl text-display text-foreground">
            One document. Zero ambiguity.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            The single source of truth for building 4TUN Hub. Architecture,
            design, precision, craft, security, SEO — and a testable spec for
            every page. Any engineer can pick up any page and build it right
            without asking a question. Generated from{" "}
            <code className="font-mono text-sm text-accent">src/lib/sitemap.ts</code>{" "}
            and{" "}
            <code className="font-mono text-sm text-accent">src/lib/blueprint.ts</code>.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-5">
            {[
              ["Pages specified", String(pageSpecs.length)],
              ["Active nodes", String(counts.active)],
              ["Building", String(counts.building)],
              ["Planned", String(counts.planned)],
              ["Craft score", `${avgScore}/100`],
            ].map(([label, value]) => (
              <div key={label} className="bg-background px-5 py-4">
                <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                  {value}
                </p>
                <p className="mt-1 text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ BODY with sticky TOC ============ */}
      <Container className="py-14">
        <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <nav className="sticky top-24">
              <p className="eyebrow">Contents</p>
              <ul className="mt-4 space-y-2 border-l border-border">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-muted transition-colors hover:border-brand-500 hover:text-foreground"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 space-y-24">
            {/* 00 HOW TO USE */}
            <section>
              <SectionHeading
                id="how"
                index="00"
                eyebrow="Orientation"
                title="How to use this blueprint"
                intro="Read this first. It tells you where truth lives and how to move without breaking anything."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    t: "Truth lives in data, not pixels",
                    d: "The IA is in sitemap.ts; specs, contracts and scores in blueprint.ts. Edit those and this page, the live nav, sitemap.xml and robots.txt all update together. Nothing is maintained twice.",
                  },
                  {
                    t: "Pick a page, read its spec",
                    d: "Section 06 gives every page an objective, audience, ordered sections, the one CTA, content source, dependencies, and a Definition of Done.",
                  },
                  {
                    t: "Four contracts bind every page",
                    d: "Design standards (01), positioning precision (02), craft rules (03), and the security/SEO contracts (07–08). They are not suggestions; a page that violates one is not done.",
                  },
                  {
                    t: "Done means the checklist passes",
                    d: "A page ships when its Definition of Done is verifiably true in the browser at every breakpoint — and the scorecard (11) is updated honestly.",
                  },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="rounded-2xl border border-border bg-surface p-5"
                  >
                    <h3 className="font-semibold text-foreground">{x.t}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{x.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 01 DESIGN STANDARDS */}
            <section>
              <SectionHeading
                id="standards"
                index="01"
                eyebrow="The contract"
                title="Design standards"
                intro="The fixed system every page inherits. Defined once in src/app/globals.css."
              />

              <div className="mt-8">
                <p className="text-sm font-semibold text-foreground">Brand amber</p>
                <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {brandRamp.map((s) => (
                    <div key={s} className="overflow-hidden rounded-lg border border-border">
                      <div className="h-10" style={{ background: `var(--color-brand-${s})` }} />
                      <p className="bg-background py-1 text-center font-mono text-3xs text-muted">
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold text-foreground">Ink / charcoal</p>
                <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {brandRamp.map((s) => (
                    <div key={s} className="overflow-hidden rounded-lg border border-border">
                      <div className="h-10" style={{ background: `var(--color-ink-${s})` }} />
                      <p className="bg-background py-1 text-center font-mono text-3xs text-muted">
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-foreground">Type scale</p>
                  <ul className="mt-4 space-y-3">
                    {typeScale.map((t) => (
                      <li key={t.name} className="flex items-baseline justify-between gap-4 border-b border-border pb-3 last:border-0">
                        <span className={`${t.cls} text-foreground`}>{t.name}</span>
                        <span className="shrink-0 font-mono text-2xs text-muted">
                          {t.use}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-xs text-muted">
                    Sans: Geist · Mono: Geist Mono (eyebrows, code, data)
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-surface p-6">
                    <p className="text-sm font-semibold text-foreground">
                      Breakpoints · target 360 → 1920px
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {breakpoints.map(([k, v]) => (
                        <div key={k} className="flex justify-between rounded-lg bg-background px-3 py-2">
                          <span className="text-sm text-foreground">{k}</span>
                          <span className="font-mono text-xs text-muted">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-6">
                    <p className="text-sm font-semibold text-foreground">
                      Quality budget (every page)
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {budgets.map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2 rounded-lg bg-background px-3 py-2">
                          <span className="text-sm text-foreground">{k}</span>
                          <span className="font-mono text-2xs text-muted">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-foreground">
                  Component inventory (reuse — don&apos;t reinvent)
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {components.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Logo standards (R4) */}
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-foreground">Logo — sizes & variants</p>
                  <div className="mt-4 flex flex-wrap items-end gap-6">
                    <div className="flex flex-col items-start gap-2">
                      <Logo href={null} size="lg" />
                      <span className="font-mono text-3xs text-muted">full · lg 48px</span>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <Logo href={null} size="sm" />
                      <span className="font-mono text-3xs text-muted">full · sm 28px (floor)</span>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <Logo href={null} variant="mark" size="lg" />
                      <span className="font-mono text-3xs text-muted">mark · roundel</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-foreground">Format policy</p>
                  <ul className="mt-4 space-y-2">
                    {logoFormats.map((f: LogoFormat) => (
                      <li key={f.format} className="flex items-baseline justify-between gap-3 border-b border-border pb-2 last:border-0">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-foreground">{f.format}</span>
                          <span
                            className={
                              f.verdict === "primary"
                                ? "rounded bg-brand-500 px-1.5 py-0.5 text-3xs font-bold uppercase text-ink-900"
                                : f.verdict === "raster-only"
                                  ? "rounded bg-surface-2 px-1.5 py-0.5 text-3xs font-bold uppercase text-foreground"
                                  : "rounded border border-dashed border-hairline px-1.5 py-0.5 text-3xs font-bold uppercase text-muted"
                            }
                          >
                            {f.verdict}
                          </span>
                        </span>
                        <span className="text-right text-xs text-muted">{f.use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <RuleGrid rules={logoRules} />
            </section>

            {/* 02 PRECISION */}
            <section>
              <SectionHeading
                id="precision"
                index="02"
                eyebrow="Geometry"
                title="Precision & positioning"
                intro="The geometry contract. Every dimension on every page obeys these numbers — precision is what separates crafted from assembled."
              />
              <RuleGrid rules={precisionRules} />
            </section>

            {/* 03 CRAFT */}
            <section>
              <SectionHeading
                id="craft"
                index="03"
                eyebrow="Art direction"
                title="Craft — the anti-generic contract"
                intro="The site must read as engineered by hand, never generated. These rules are how."
              />
              <RuleGrid rules={craftRules} />
            </section>

            {/* 04 CONVENTIONS */}
            <section>
              <SectionHeading
                id="conventions"
                index="04"
                eyebrow="How we build"
                title="Conventions & the add-a-page recipe"
                intro="Follow these so the codebase stays legible to the next person."
              />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-foreground">Conventions</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-muted">
                    <li><span className="font-mono text-xs text-accent">app/&lt;route&gt;/page.tsx</span> — one folder per route (App Router)</li>
                    <li><span className="font-mono text-xs text-accent">app/&lt;route&gt;/[slug]/page.tsx</span> — dynamic detail pages</li>
                    <li><span className="font-mono text-xs text-accent">components/ui/</span> — primitives · <span className="font-mono text-xs text-accent">components/</span> — composed blocks</li>
                    <li><span className="font-mono text-xs text-accent">lib/</span> — data & logic (sitemap, blueprint, site constants)</li>
                    <li>Routes <span className="text-foreground">kebab-case</span>; components <span className="text-foreground">PascalCase</span></li>
                    <li>Every page exports <span className="font-mono text-xs text-accent">metadata</span> (title + description)</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-brand-500/40 bg-brand-500/10 p-6">
                  <p className="text-sm font-semibold text-foreground">
                    Recipe: add a new page
                  </p>
                  <ol className="mt-4 space-y-2.5 text-sm text-foreground">
                    {[
                      "Add a node to siteTree in sitemap.ts (status + placement) — nav & sitemap.xml update automatically.",
                      "Add a PageSpec in blueprint.ts (objective → acceptance).",
                      "Create app/<route>/page.tsx using Section + Container.",
                      "Compose only from the component inventory + tokens.",
                      "Export metadata; wire the primary CTA; add JSON-LD if the page type has a schema.",
                      "Verify every Definition-of-Done item in the browser; update the scorecard.",
                    ].map((s, i) => (
                      <li key={s} className="flex gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 font-mono text-2xs font-bold text-ink-900">
                          {i + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* 05 IA */}
            <section>
              <SectionHeading
                id="ia"
                index="05"
                eyebrow="Structure"
                title="Information architecture"
                intro="The whole ecosystem, layered so the header stays focused and the vision stays intact."
              />

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border-2 border-brand-500/40 bg-brand-500/10 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Header (primary)</p>
                    <span className="font-mono text-xs text-muted">{primaryNav.length} + CTA</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {primaryNav.map((n) => (
                      <span key={n.key} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground">
                        <StatusDot status={n.status} />
                        {n.label}
                      </span>
                    ))}
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
                      Contact →
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-foreground">Footer / utility</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {footerNav.map((n) => (
                      <span key={n.key} className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted">
                        <StatusDot status={n.status} />
                        {n.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {siteTree
                  .filter((n) => n.key !== "home" && n.key !== "about")
                  .map((n) => (
                    <NodeCard key={n.key} node={n} />
                  ))}
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-foreground">
                  About → Founder — organization first, founder as proof
                </p>
                <ul className="mt-4 space-y-1">
                  <TreeBranch node={about} />
                </ul>
              </div>
            </section>

            {/* 06 SPECS */}
            <section>
              <SectionHeading
                id="specs"
                index="06"
                eyebrow="The work"
                title="Page specifications"
                intro="Every page as a build contract. Priority, intent, required sections, and a testable Definition of Done."
              />
              <div className="mt-8 space-y-6">
                {pageSpecs.map((spec) => (
                  <SpecCard
                    key={spec.key}
                    spec={spec}
                    status={statusByKey.get(spec.key) ?? "planned"}
                  />
                ))}
              </div>
            </section>

            {/* 07 SECURITY */}
            <section>
              <SectionHeading
                id="security"
                index="07"
                eyebrow="Trust"
                title="Security standards"
                intro="Security is a design feature. Items marked ✓ are already live in the codebase, not aspirations."
              />
              <RuleGrid rules={securityRules} accent />
            </section>

            {/* 08 SEO */}
            <section>
              <SectionHeading
                id="seo"
                index="08"
                eyebrow="Discoverability"
                title="SEO & search architecture"
                intro="The goal is to own engineering queries for Cameroon first, then wider. Rankings are earned by architecture + real content + performance."
              />
              <RuleGrid rules={seoRules} accent />
            </section>

            {/* 09 OPTIMIZATION REVIEW */}
            <section>
              <SectionHeading
                id="review"
                index="09"
                eyebrow="Phase 1.5 · Approved"
                title="Architectural optimization review"
                intro="The prioritized register from the Phase-1.5 review. Foundational items build now; enterprise machinery and RTL are deferred until justified."
              />

              {/* strategic challenges */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {reviewChallenges.map((c, i) => (
                  <div
                    key={c.t}
                    className="rounded-2xl border-l-2 border-brand-500 bg-surface p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-accent">
                        C{i + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{c.t}</h3>
                        <p className="mt-1.5 text-sm leading-6 text-muted">{c.d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* register grouped by priority */}
              {(["Critical", "High", "Medium", "Defer"] as ReviewPriority[]).map(
                (pri) => {
                  const items = optimizationReview.filter((r) => r.priority === pri);
                  if (!items.length) return null;
                  return (
                    <div key={pri} className="mt-10">
                      <p className="eyebrow">
                        {pri} · {items.length}
                      </p>
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        {items.map((rec) => (
                          <RecCard key={rec.id} rec={rec} />
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
            </section>

            {/* 10 ROADMAP */}
            <section>
              <SectionHeading
                id="roadmap"
                index="10"
                eyebrow="Sequence"
                title="Build roadmap"
                intro="The order of operations, so effort compounds instead of doubling back."
              />
              <ol className="mt-8 space-y-3">
                {phases.map((p) => {
                  const dot =
                    p.status === "done"
                      ? "bg-brand-500 text-ink-900"
                      : p.status === "next"
                        ? "bg-ink-100 text-ink-900 ring-4 ring-brand-500/30"
                        : "border border-hairline bg-transparent text-muted";
                  return (
                    <li
                      key={p.id}
                      className="flex gap-4 rounded-2xl border border-border bg-surface p-5"
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold ${dot}`}>
                        {p.status === "done" ? "✓" : p.id}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-foreground">Phase {p.id} — {p.name}</h3>
                          <span className="font-mono text-3xs uppercase tracking-wider text-muted">
                            {p.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted">{p.goal}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {p.items.map((it) => (
                            <span key={it} className="rounded-md bg-background px-2 py-0.5 text-xs text-muted">
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* 11 DECISIONS */}
            <section>
              <SectionHeading
                id="decisions"
                index="11"
                eyebrow="Rationale"
                title="Decisions log"
                intro="What we chose and why. 'Proposed' items await Fortune's confirmation; 'Locked' are settled."
              />
              <div className="mt-8 overflow-hidden rounded-2xl border border-border">
                {decisions.map((d, i) => (
                  <div
                    key={d.decision}
                    className={`flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:gap-5 ${
                      i % 2 ? "bg-surface" : "bg-background"
                    }`}
                  >
                    <span
                      className={`inline-flex h-fit shrink-0 items-center rounded-full px-2.5 py-0.5 text-3xs font-semibold uppercase tracking-wider ${
                        d.status === "locked"
                          ? "bg-brand-500/15 text-accent"
                          : "border border-dashed border-hairline text-muted"
                      }`}
                    >
                      {d.status}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{d.decision}</p>
                      <p className="mt-1 text-sm text-muted">{d.rationale}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 12 SCORECARD */}
            <section>
              <SectionHeading
                id="scorecard"
                index="12"
                eyebrow="Honesty"
                title={`Scorecard — ${avgScore}/100 today`}
                intro="Every aspect rated 0–100, current vs target. No vanity numbers: unbuilt content scores low because it should. Updated at every milestone."
              />
              <div className="mt-8 space-y-3">
                {scorecard.map((s) => (
                  <div
                    key={s.aspect}
                    className="rounded-2xl border border-border bg-surface p-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {s.aspect}
                      </h3>
                      <p className="font-mono text-sm tabular-nums text-foreground">
                        <span className="font-bold text-accent">{s.current}</span>
                        <span className="text-muted"> / target {s.target}</span>
                      </p>
                    </div>
                    {/* Track, fill, and a target tick that has to read
                        AGAINST the track — not share its colour. */}
                    <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
                        style={{ width: `${s.current}%` }}
                      />
                      <div
                        className="absolute inset-y-0 w-0.5 bg-foreground"
                        style={{ left: `${s.target}%` }}
                        title={`Target ${s.target}`}
                      />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">{s.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-2xl border border-dashed border-hairline p-5 text-sm leading-6 text-muted">
                Reading this honestly: the <span className="font-medium text-foreground">system</span> (architecture,
                tokens, contracts, security, SEO plumbing) is elite-ready. The{" "}
                <span className="font-medium text-foreground">substance</span> (real pages, real imagery, motion) is
                the remaining work — which is exactly what Phases 2–4 build. The scorecard exists so progress is
                measured, not felt.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
