"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { detent, warn } from "@/lib/sound";

/**
 * "Load the beam" — the hand calculation behind every FEA check, live.
 *
 * A steel cantilever, fixed at the wall, with a point load F at its free
 * end. Euler–Bernoulli beam theory:
 *   deflection  δ(x) = F·x²·(3L − x) / (6·E·I)     δmax = F·L³ / (3·E·I)
 *   moment      M(x) = F·(L − x)                    σmax = M(0)·c / I
 * so stress is greatest at the wall and falls linearly to zero at the tip,
 * which is exactly what the colour along the beam shows.
 *
 * Section 30 × 50 mm (b × h), span 1 m, E = 200 GPa, S235 steel
 * (yield 235 MPa). I = b·h³/12 = 312 500 mm⁴, c = h/2 = 25 mm.
 * These are textbook values, stated on screen, not a claim about a
 * specific project.
 *
 * The range input is the real control (keyboard, screen readers, touch);
 * dragging on the drawing moves the same value. Deflection is drawn ×10
 * and says so. With sound turned on, the load clicks like a ratchet every
 * 250 N and a low tone sounds when the steel would yield.
 */

const L = 1000; // mm
const E = 200_000; // MPa (N/mm²)
const B = 30; // mm
const H = 50; // mm
const I = (B * H ** 3) / 12; // mm⁴
const C = H / 2; // mm
const YIELD = 235; // MPa, S235
const F_MAX = 3000; // N
const SCALE = 10; // drawing exaggeration of deflection

// Drawing geometry (SVG user units).
const X0 = 70;
const LEN = 500;
const Y0 = 120;
const T = 26; // beam thickness on screen
const PX_PER_MM = LEN / L;

export type BeamStrings = {
  load: string;
  deflection: string;
  stress: string;
  safety: string;
  spec: string;
  scale: string;
  hint: string;
  states: { ok: string; low: string; yield: string };
};

export function BeamLab({ t, locale }: { t: BeamStrings; locale: string }) {
  const [force, setForceRaw] = useState(1200);

  // Sound (opt-in, src/lib/sound.ts): a detent each 250 N, pitched by the
  // load, and a warning the moment the steel would yield.
  const lastStep = useRef(Math.floor(1200 / 250));
  const setForce = useCallback((f: number) => {
    const step = Math.floor(f / 250);
    if (step !== lastStep.current) {
      const crossedYield = (f * L * C) / I >= YIELD && (lastStep.current * 250 * L * C) / I < YIELD;
      lastStep.current = step;
      if (crossedYield) warn();
      else detent(f / F_MAX);
    }
    setForceRaw(f);
  }, []);
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const fmt = useMemo(
    () => ({
      kn: new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      one: new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      int: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    }),
    [locale],
  );

  const sigma = (force * L * C) / I; // MPa at the wall
  const dMax = (force * L ** 3) / (3 * E * I); // mm at the tip
  const fos = sigma > 0 ? YIELD / sigma : Infinity;
  const ratio = Math.min(sigma / YIELD, 1);
  const state = fos < 1 ? "yield" : fos < 1.5 ? "low" : "ok";

  // Deformed outline: centreline y(x) sampled along the span.
  const outline = useMemo(() => {
    const n = 48;
    const top: string[] = [];
    const bottom: string[] = [];
    for (let i = 0; i <= n; i++) {
      const xmm = (i / n) * L;
      const d = (force * xmm ** 2 * (3 * L - xmm)) / (6 * E * I);
      const x = X0 + xmm * PX_PER_MM;
      const y = Y0 + d * PX_PER_MM * SCALE;
      top.push(`${x.toFixed(1)},${(y - T / 2).toFixed(1)}`);
      bottom.unshift(`${x.toFixed(1)},${(y + T / 2).toFixed(1)}`);
    }
    return [...top, ...bottom].join(" ");
  }, [force]);

  const tipY = Y0 + dMax * PX_PER_MM * SCALE;
  const arrowLen = 24 + (force / F_MAX) * 70;

  // Stress colour: the four pillar hues as a stress scale, cool to hot,
  // the way an FEA plot reads (indigo → green → amber → laterite). Each
  // stop along the beam is coloured by the LOCAL stress ratio, which falls
  // linearly from the wall to zero at the tip, so the hot zone visibly
  // grows from the wall as the load rises. Mixing only neighbouring hues
  // avoids the muddy grey of mixing indigo straight into amber.
  const SCALE_HUES = ["var(--color-indigo)", "var(--color-green)", "var(--color-brand-500)", "var(--color-laterite)"];
  const colourAt = (r: number) => {
    const p = Math.max(0, Math.min(1, r)) * 3;
    const k = Math.min(2, Math.floor(p));
    const f = Math.round((p - k) * 100);
    return `color-mix(in oklab, ${SCALE_HUES[k + 1]} ${f}%, ${SCALE_HUES[k]})`;
  };
  const stops = Array.from({ length: 9 }, (_, j) => {
    const x = j / 8;
    return { offset: x, colour: colourAt(ratio * (1 - x)) };
  });

  const fromPointer = useCallback((clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const y = ((clientY - r.top) / r.height) * 240; // viewBox height
    const f = Math.round(((y - Y0) / 80) * F_MAX / 50) * 50;
    setForce(Math.max(0, Math.min(F_MAX, f)));
  }, [setForce]);

  const stateText = t.states[state];
  const stateTone =
    state === "yield" ? "text-laterite" : state === "low" ? "text-amber" : "text-green";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center">
      <figure className="spotlight hue-indigo overflow-hidden rounded-3xl bg-surface-2 p-4 shadow-e1 sm:p-6">
        <svg
          ref={svgRef}
          viewBox="0 0 640 240"
          className="w-full touch-none select-none"
          role="img"
          aria-labelledby={`${id}-cap`}
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as Element).setPointerCapture?.(e.pointerId);
            fromPointer(e.clientY);
          }}
          onPointerMove={(e) => dragging.current && fromPointer(e.clientY)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <defs>
            <linearGradient id={`${id}-stress`} x1="0" x2="1" y1="0" y2="0">
              {stops.map((st) => (
                <stop key={st.offset} offset={st.offset} style={{ stopColor: st.colour }} />
              ))}
            </linearGradient>
            <pattern id={`${id}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* The wall: a fixed support, hatched as on a drawing. */}
          <g className="text-subtle">
            <rect x={X0 - 22} y={Y0 - 70} width="22" height="140" fill={`url(#${id}-hatch)`} />
            <line x1={X0} y1={Y0 - 70} x2={X0} y2={Y0 + 70} stroke="currentColor" strokeWidth="2" />
          </g>

          {/* Undeformed position, dashed, for reference. */}
          <rect
            x={X0}
            y={Y0 - T / 2}
            width={LEN}
            height={T}
            rx="3"
            fill="none"
            className="text-hairline"
            stroke="currentColor"
            strokeDasharray="5 5"
          />

          {/* The deformed beam, coloured by bending stress. */}
          <polygon
            points={outline}
            fill={`url(#${id}-stress)`}
            className="transition-[fill] duration-300"
          />

          {/* The load. */}
          <g className="text-foreground">
            <line
              x1={X0 + LEN}
              y1={tipY - T / 2 - arrowLen}
              x2={X0 + LEN}
              y2={tipY - T / 2 - 6}
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d={`M ${X0 + LEN - 7} ${tipY - T / 2 - 14} L ${X0 + LEN} ${tipY - T / 2 - 3} L ${X0 + LEN + 7} ${tipY - T / 2 - 14} Z`}
              fill="currentColor"
            />
            <text
              x={X0 + LEN - 12}
              y={tipY - T / 2 - arrowLen + 12}
              textAnchor="end"
              className="fill-current text-sm font-semibold"
            >
              F = {fmt.kn.format(force / 1000)} kN
            </text>
          </g>

          {/* Tip deflection dimension. */}
          {dMax > 0.5 && (
            <g className="text-muted">
              <line x1={X0 + LEN + 30} y1={Y0} x2={X0 + LEN + 30} y2={tipY} stroke="currentColor" strokeWidth="1" />
              <line x1={X0 + LEN + 24} y1={Y0} x2={X0 + LEN + 36} y2={Y0} stroke="currentColor" strokeWidth="1" />
              <line x1={X0 + LEN + 24} y1={tipY} x2={X0 + LEN + 36} y2={tipY} stroke="currentColor" strokeWidth="1" />
            </g>
          )}

          <text x={X0} y="228" className="fill-current text-2xs text-muted">
            {t.scale}
          </text>
        </svg>
        <figcaption id={`${id}-cap`} className="mt-3 text-2xs text-muted">
          {t.spec}
        </figcaption>
      </figure>

      <div>
        <label htmlFor={`${id}-f`} className="flex items-baseline justify-between gap-4">
          <span className="font-semibold text-foreground">{t.load}</span>
          <span className="figure text-headline text-foreground">
            {fmt.kn.format(force / 1000)} kN
          </span>
        </label>
        <input
          id={`${id}-f`}
          type="range"
          min={0}
          max={F_MAX}
          step={50}
          value={force}
          onChange={(e) => setForce(Number(e.target.value))}
          className="beam-range mt-4 w-full"
          aria-describedby={`${id}-state`}
        />
        <p className="mt-2 text-2xs text-muted">{t.hint}</p>

        <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
          <div>
            <dt className="text-2xs font-medium text-muted">{t.deflection}</dt>
            <dd className="figure mt-1 text-xl font-semibold text-foreground">
              {fmt.one.format(dMax)} <span className="text-sm font-medium text-muted">mm</span>
            </dd>
          </div>
          <div>
            <dt className="text-2xs font-medium text-muted">{t.stress}</dt>
            <dd className="figure mt-1 text-xl font-semibold text-foreground">
              {fmt.int.format(sigma)} <span className="text-sm font-medium text-muted">MPa</span>
            </dd>
          </div>
          <div>
            <dt className="text-2xs font-medium text-muted">{t.safety}</dt>
            <dd className="figure mt-1 text-xl font-semibold text-foreground">
              {Number.isFinite(fos) ? fmt.one.format(fos) : "∞"}
            </dd>
          </div>
        </dl>

        <p id={`${id}-state`} aria-live="polite" className={`mt-6 font-semibold ${stateTone}`}>
          {stateText}
        </p>
      </div>
    </div>
  );
}
