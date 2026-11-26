"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { stressColour } from "@/lib/stress-colour";
import type { Constants, Params } from "@/lib/practice/engine";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * The load test: the learner's own bracket takes its own load, with the
 * thickness the learner chose. Beam theory, bending only:
 *
 *   M(x) = W·(L − x)        σ(x, y) = M(x)·|y| / I       I = t·b³ / 12
 *   δ(x) = W·x²·(3L − x) / (6·E·I)
 *
 * Colour is each cell's bending stress against the allowable stress. The sag
 * is drawn enlarged, and the drawing says by how much. A thickness that fails
 * is shown failing: a step can be cleared by correct method on an earlier
 * slip, and the physics does not forgive that.
 */

const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] != null ? String(vars[k]) : m));

// Drawing geometry (SVG user units).
const X0 = 40; // the column face and the bolts' centre
const X1 = 470; // the load hole
const END = 500; // the plate's free end
const TOP = 40;
const DEPTH = 63;
const COLS = 30;
const ROWS = 7;

type BracketParams = { m: number; b: number; L: number; n: number };
type BracketConstants = { g: number; E: number; Re: number; deflection_denominator: number };

export function LoadTest({
  params,
  constants,
  thickness,
  lang,
  t,
}: {
  params: Params;
  constants: Constants;
  /** The learner's answer to the last step. */
  thickness: number;
  lang: string;
  t: Dictionary["practice"]["load"];
}) {
  const [take, setTake] = useState(0);
  const { m, b, L, n } = params as BracketParams;
  const c = constants as BracketConstants;
  const t_ = Math.abs(thickness);

  const W = m * c.g;
  const I = (t_ * b ** 3) / 12;
  const allowed = c.Re / n;
  const stress = (W * L * (b / 2)) / I;
  const limit = L / c.deflection_denominator;
  const sag = (W * L ** 3) / (3 * c.E * I);
  const strong = stress <= allowed;
  const stiff = sag <= limit;
  const holds = strong && stiff;

  const perMm = (X1 - X0) / L;
  // Screen units per mm of sag: the limit stays visible, a failure stays on the page.
  const down = 60 / Math.max(sag, limit * 1.5);
  const times = Math.round(down / perMm);
  const sagAt = (x: number) =>
    x <= L
      ? (W * x ** 2 * (3 * L - x)) / (6 * c.E * I)
      : sag + ((W * L ** 2) / (2 * c.E * I)) * (x - L);

  const number = (x: number, digits: number) =>
    new Intl.NumberFormat(lang, { maximumFractionDigits: digits }).format(x);
  const width = (END - X0) / COLS;
  const summary = fmt(t.summary, {
    m: number(m, 0),
    t: number(t_, 1),
    s: number(stress, 1),
    sa: number(allowed, 1),
    d: number(sag, 2),
    dl: number(limit, 2),
  });

  return (
    <section aria-labelledby="load-test" className="mt-6 rounded-3xl bg-ink-900 p-5 text-white sm:p-7">
      <p className="text-sm font-semibold text-brand-500">{t.eyebrow}</p>
      <h3 id="load-test" className="mt-1 text-headline">
        {fmt(holds ? t.holds : t.fails, { t: number(t_, 1) })}
      </h3>

      {/* A new key plays it again. */}
      <div key={take}>
        <svg viewBox="0 0 520 210" role="img" aria-label={summary} className="mt-4 h-auto w-full">
          <rect x={X0 - 22} y={TOP - 24} width={22} height={DEPTH + 80} rx={2} className="fill-white/25" />
          {Array.from({ length: COLS }, (_, i) => {
            const x = (i + 0.5) * width;
            const mm = x / perMm;
            const here = mm < L ? (W * (L - mm) * (b / 2)) / I : 0;
            return (
              <g
                key={i}
                className="loadtest-col"
                style={{ "--sag": `${(sagAt(mm) * down).toFixed(2)}px` } as React.CSSProperties}
              >
                {Array.from({ length: ROWS }, (_, r) => {
                  // 0 on the neutral axis, 1 at the top and bottom edges.
                  const edge = Math.abs((r / (ROWS - 1)) * 2 - 1);
                  return (
                    <rect
                      key={r}
                      x={X0 + i * width}
                      y={TOP + (r * DEPTH) / ROWS}
                      width={width + 0.6}
                      height={DEPTH / ROWS + 0.6}
                      style={{ fill: stressColour((here * edge) / allowed) }}
                    />
                  );
                })}
              </g>
            );
          })}
          <g className="loadtest-col" style={{ "--sag": `${(sag * down).toFixed(2)}px` } as React.CSSProperties}>
            <circle cx={X1} cy={TOP + DEPTH / 2} r={7} className="fill-ink-900 stroke-white" strokeWidth={1.5} />
            <path
              d={`M${X1} ${TOP + DEPTH / 2}V${TOP + DEPTH + 34}M${X1 - 8} ${TOP + DEPTH + 24}L${X1} ${TOP + DEPTH + 36}L${X1 + 8} ${TOP + DEPTH + 24}`}
              fill="none"
              className="stroke-brand-500"
              strokeWidth={3}
            />
          </g>
          {/* How far the load hole may drop. */}
          <path
            d={`M${X1 - 90} ${TOP + DEPTH / 2 + limit * down}H${END + 14}`}
            className="stroke-white"
            strokeDasharray="6 5"
            strokeWidth={1.5}
          />
        </svg>

        <div aria-hidden="true" className="mt-1 flex items-center gap-2 text-2xs text-white/70">
          <span>0</span>
          <span
            className="h-2 flex-1 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${[0, 0.25, 0.5, 0.75, 1].map(stressColour).join(", ")})`,
            }}
          />
          <span>{fmt(t.scaleTop, { s: number(allowed, 1) })}</span>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          {[
            { label: t.stress, value: fmt(t.of, { a: number(stress, 1), b: number(allowed, 1), u: "MPa" }), ok: strong },
            { label: t.sag, value: fmt(t.of, { a: number(sag, 2), b: number(limit, 2), u: "mm" }), ok: stiff },
          ].map((row) => (
            <div key={row.label} className="rounded-2xl bg-white/10 p-4">
              <dt className="text-white/70">{row.label}</dt>
              <dd className="font-semibold tabular-nums">
                {row.value} · {row.ok ? `✓ ${t.within}` : `✕ ${t.over}`}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex min-h-14 flex-wrap items-center justify-between gap-4">
          {holds ? (
            <p className="loadtest-stamp rounded-md border-4 border-double border-brand-500 px-4 py-1 text-lg font-extrabold text-brand-500">
              {t.stamp}
            </p>
          ) : (
            <p className="max-w-sm text-sm text-white/80">{t.failBody}</p>
          )}
          <Button type="button" variant="raised" size="sm" onClick={() => setTake((x) => x + 1)}>
            {t.replay}
          </Button>
        </div>
      </div>

      <p className="mt-4 text-2xs text-white/60">
        {fmt(t.scaleNote, { k: number(times, 0) })} {t.theory}
      </p>
    </section>
  );
}
