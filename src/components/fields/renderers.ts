/**
 * ============================================================
 * FIELDS — the backgrounds.
 * ============================================================
 * No patterns. No lattice. Every background is a real engineering
 * phenomenon being simulated, chosen so that each page runs the
 * physics of what that page is actually about:
 *
 *   flow       fluid velocity field           home
 *   stress     load paths through a truss     services · store · simulation work
 *   wave       interference of emitters       research · human factors
 *   draft      a drawing constructing itself  academy · about · resources
 *   signal     oscilloscope traces            products · electronics work
 *   growth     branching biomass              sustainability work
 *   kinematic  linkages turning, tracing      projects · mechanical work
 *   network    a graph finding its edges      community · contact
 *
 * All eight share one canvas engine (see Field.tsx) and one colour
 * ramp, so the site reads as one instrument with different
 * measurements on it rather than eight unrelated toys.
 *
 * Every renderer keeps stroke alpha low: text sits on top of these,
 * and contrast is measured before anything ships.
 */

export type FieldVariant =
  | "flow"
  | "stress"
  | "wave"
  | "draft"
  | "signal"
  | "growth"
  | "kinematic"
  | "network";

type Ctx = CanvasRenderingContext2D;
type State = Record<string, unknown>;

export type Renderer = {
  init(w: number, h: number): State;
  step(ctx: Ctx, s: State, w: number, h: number, f: number): void;
  /** Trail persistence. 0 clears each frame; >0 fades the previous frame. */
  fade: number;
  /** Frames pre-run to build a still composition under reduced motion. */
  still: number;
};

/* --- shared -------------------------------------------------- */

/** The flow ramp, as RGB. Kept in sync with globals.css. */
const RAMP: readonly [number, number, number][] = [
  [27, 59, 216],
  [0, 183, 255],
  [47, 224, 138],
  [255, 210, 63],
  [255, 75, 46],
];

/** Sample the ramp at 0..1. Colour always encodes a measured quantity. */
export function ramp(t: number, a: number): string {
  const x = Math.max(0, Math.min(0.9999, t)) * (RAMP.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const p = RAMP[i];
  const q = RAMP[i + 1] ?? p;
  return `rgba(${Math.round(p[0] + (q[0] - p[0]) * f)},${Math.round(
    p[1] + (q[1] - p[1]) * f,
  )},${Math.round(p[2] + (q[2] - p[2]) * f)},${a})`;
}

/**
 * The neutral every field strokes its unmeasured geometry with — guide
 * lines, construction edges, the parts of a drawing that are not carrying
 * a value. It has to change with the ground: #a8b0b8 is a pale grey that
 * reads on the night surface and vanishes on the day sheet.
 *
 * A canvas cannot resolve `var()`, so the value is pushed in from
 * Field.tsx, which reads `--field-neutral` off <html> and calls this on
 * mount and on every theme change. The default is the night value, so a
 * renderer that somehow runs before the push still draws correctly on the
 * ground the site falls back to.
 */
let NEUTRAL: readonly [number, number, number] = [168, 176, 184];

export function setFieldNeutral(rgb: readonly [number, number, number]) {
  NEUTRAL = rgb;
}

/** The neutral at a given alpha. Never a measured quantity — that is `ramp`. */
function neutral(a: number): string {
  return `rgba(${NEUTRAL[0]},${NEUTRAL[1]},${NEUTRAL[2]},${a})`;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;

/** Domain-warped trig noise — organic enough to read as a field. */
function noiseAngle(x: number, y: number, t: number) {
  return (
    Math.sin(x * 0.0021 + t * 0.00021) * 1.7 +
    Math.cos(y * 0.0017 - t * 0.00017) * 1.7 +
    Math.sin((x + y) * 0.0012 + t * 0.00013) * 1.1
  );
}

const count = (w: number, h: number, per: number, lo: number, hi: number) =>
  Math.round(Math.max(lo, Math.min(hi, (w * h) / per)));

/* --- 1 · FLOW — fluid velocity field -------------------------- */

type P = { x: number; y: number; px: number; py: number; life: number };

const flow: Renderer = {
  fade: 0.03,
  still: 220,
  init(w, h) {
    const n = count(w, h, 7000, 34, 180);
    return {
      ps: Array.from({ length: n }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return { x, y, px: x, py: y, life: Math.random() * 260 };
      }),
    };
  },
  step(ctx, s, w, h, f) {
    ctx.lineWidth = 1.1;
    ctx.lineCap = "round";
    for (const p of s.ps as P[]) {
      p.px = p.x;
      p.py = p.y;
      const a = noiseAngle(p.x, p.y, f * 16);
      const v = 0.55 + (Math.sin(a * 1.6) + 1) * 0.5;
      p.x += Math.cos(a) * v;
      p.y += Math.sin(a) * v;
      p.life -= 1;
      if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.px = p.x;
        p.py = p.y;
        p.life = 180 + Math.random() * 220;
        continue;
      }
      ctx.strokeStyle = ramp((v - 0.55) / 1.0, 0.46);
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  },
};

/* --- 2 · STRESS — load paths through a truss ------------------ */

type Node = { x: number; y: number };
type Edge = { a: number; b: number; mx: number; my: number };

const stress: Renderer = {
  fade: 0,
  still: 1,
  init(w, h) {
    const n = count(w, h, 17000, 18, 60);
    const nodes: Node[] = Array.from({ length: n }, () => ({
      x: rand(0, w),
      y: rand(0, h),
    }));
    // Connect near neighbours into a truss. Geometry is fixed; only the
    // load travelling through it animates, so this stays cheap.
    const reach = Math.min(w, h) * 0.34;
    const edges: Edge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.hypot(dx, dy) < reach) {
          edges.push({
            a: i,
            b: j,
            mx: (nodes[i].x + nodes[j].x) / 2,
            my: (nodes[i].y + nodes[j].y) / 2,
          });
        }
      }
    }
    return { nodes, edges: edges.slice(0, 380) };
  },
  step(ctx, s, w, h, f) {
    const nodes = s.nodes as Node[];
    const edges = s.edges as Edge[];
    // The load wanders; members light up as it passes through them.
    const lx = w * (0.5 + 0.42 * Math.sin(f * 0.0055));
    const ly = h * (0.5 + 0.34 * Math.cos(f * 0.0041));
    const span = Math.min(w, h) * 0.5;
    ctx.lineCap = "round";
    for (const e of edges) {
      const d = Math.hypot(e.mx - lx, e.my - ly) / span;
      const load = Math.exp(-d * d * 2.2);
      if (load < 0.03) continue;
      ctx.lineWidth = 0.7 + load * 2.1;
      ctx.strokeStyle = ramp(load, 0.1 + load * 0.62);
      ctx.beginPath();
      ctx.moveTo(nodes[e.a].x, nodes[e.a].y);
      ctx.lineTo(nodes[e.b].x, nodes[e.b].y);
      ctx.stroke();
    }
    for (const nd of nodes) {
      const load = Math.exp(-Math.pow(Math.hypot(nd.x - lx, nd.y - ly) / span, 2) * 2.2);
      ctx.fillStyle = ramp(load, 0.16 + load * 0.6);
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, 1.5 + load * 2.2, 0, TAU);
      ctx.fill();
    }
  },
};

/* --- 3 · WAVE — interference of emitters ---------------------- */

type Emitter = { x: number; y: number; speed: number; phase: number };

const wave: Renderer = {
  fade: 0,
  still: 1,
  init(w, h) {
    return {
      es: Array.from({ length: 3 }, () => ({
        x: rand(w * 0.15, w * 0.85),
        y: rand(h * 0.15, h * 0.85),
        speed: rand(0.22, 0.4),
        phase: rand(0, 300),
      })),
    };
  },
  step(ctx, s, w, h, f) {
    const max = Math.hypot(w, h) * 0.75;
    const spacing = 46;
    // Additive compositing is what makes the crests actually interfere
    // where the rings overlap, rather than merely cross.
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1.2;
    for (const e of s.es as Emitter[]) {
      const travelled = (f + e.phase) * e.speed;
      for (let k = 0; k < 12; k++) {
        const r = (travelled + k * spacing) % max;
        if (r < 6) continue;
        const decay = 1 - r / max;
        ctx.strokeStyle = ramp(1 - decay, 0.2 * decay * decay);
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, TAU);
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = "source-over";
  },
};

/* --- 4 · DRAFT — a drawing constructing itself ---------------- */

type Prim = {
  kind: 0 | 1 | 2; // line | arc | dimension tick
  x: number;
  y: number;
  x2: number;
  y2: number;
  r: number;
  a0: number;
  a1: number;
  p: number; // draw progress
  hold: number;
  accent: boolean;
};

function makePrim(w: number, h: number): Prim {
  const kind = (Math.random() < 0.52 ? 0 : Math.random() < 0.72 ? 1 : 2) as 0 | 1 | 2;
  const x = rand(w * 0.05, w * 0.95);
  const y = rand(h * 0.05, h * 0.95);
  // Dimensions need room: too short and the two end ticks collide into
  // a rung. Give them a floor well above the tick size.
  const len = rand(kind === 2 ? 110 : 60, Math.max(150, Math.min(w, h) * 0.42));
  const ang = Math.round(rand(0, 8)) * (Math.PI / 4); // drafting angles only
  return {
    kind,
    x,
    y,
    x2: x + Math.cos(ang) * len,
    y2: y + Math.sin(ang) * len,
    r: rand(24, 90),
    a0: rand(0, TAU),
    a1: rand(0, TAU) + rand(0.6, 2.4),
    p: 0,
    hold: rand(70, 190),
    accent: Math.random() < 0.16,
  };
}

const draft: Renderer = {
  fade: 0.012,
  still: 260,
  init(w, h) {
    const n = count(w, h, 26000, 10, 32);
    return { ps: Array.from({ length: n }, () => makePrim(w, h)) };
  },
  step(ctx, s, w, h) {
    ctx.lineCap = "round";
    ctx.lineWidth = 1.15;
    const list = s.ps as Prim[];
    for (let i = 0; i < list.length; i++) {
      const d = list[i];
      if (d.p < 1) d.p = Math.min(1, d.p + 0.014);
      else if (d.hold > 0) d.hold -= 1;
      else {
        list[i] = makePrim(w, h);
        continue;
      }
      // Quiet by default with the occasional accent — a drawing, not a
      // light show. Amber marks the member currently being drawn.
      ctx.strokeStyle = d.accent ? ramp(0.72, 0.62) : neutral(0.42);
      ctx.beginPath();
      if (d.kind === 1) {
        ctx.arc(d.x, d.y, d.r, d.a0, d.a0 + (d.a1 - d.a0) * d.p);
      } else if (d.kind === 2) {
        // Dimension: witness line with end ticks.
        const ex = d.x + (d.x2 - d.x) * d.p;
        const ey = d.y + (d.y2 - d.y) * d.p;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(ex, ey);
        const nx = -(d.y2 - d.y);
        const ny = d.x2 - d.x;
        const nl = Math.hypot(nx, ny) || 1;
        ctx.moveTo(d.x - (nx / nl) * 4, d.y - (ny / nl) * 4);
        ctx.lineTo(d.x + (nx / nl) * 4, d.y + (ny / nl) * 4);
        ctx.moveTo(ex - (nx / nl) * 4, ey - (ny / nl) * 4);
        ctx.lineTo(ex + (nx / nl) * 4, ey + (ny / nl) * 4);
      } else {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + (d.x2 - d.x) * d.p, d.y + (d.y2 - d.y) * d.p);
      }
      ctx.stroke();
    }
  },
};

/* --- 5 · SIGNAL — oscilloscope traces ------------------------- */

type Trace = { y: number; amp: number; f1: number; f2: number; hue: number };

const signal: Renderer = {
  fade: 0,
  still: 1,
  init(w, h) {
    const n = h > 420 ? 3 : 2;
    return {
      sweep: 0,
      ts: Array.from({ length: n }, (_, i) => ({
        y: (h * (i + 1)) / (n + 1),
        amp: rand(h * 0.05, h * 0.11),
        f1: rand(0.004, 0.011),
        f2: rand(0.017, 0.032),
        hue: i / Math.max(1, n - 1),
      })),
    };
  },
  step(ctx, s, w, h, f) {
    const traces = s.ts as Trace[];
    // Redraw the whole trace each frame: it is only a few hundred
    // line segments and it keeps the sweep perfectly clean.
    ctx.lineWidth = 1.2;
    ctx.lineCap = "round";
    const head = (f * 3.2) % (w + 120);
    for (const tr of traces) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y =
          tr.y +
          Math.sin(x * tr.f1 + f * 0.02) * tr.amp +
          Math.sin(x * tr.f2 - f * 0.031) * tr.amp * 0.36;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ramp(tr.hue, 0.3);
      ctx.stroke();

      // The sweep head: a bright, short leading segment.
      ctx.beginPath();
      for (let x = Math.max(0, head - 90); x <= Math.min(w, head); x += 3) {
        const y =
          tr.y +
          Math.sin(x * tr.f1 + f * 0.02) * tr.amp +
          Math.sin(x * tr.f2 - f * 0.031) * tr.amp * 0.36;
        if (x === Math.max(0, head - 90)) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ramp(tr.hue, 0.75);
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.lineWidth = 1.2;
    }
  },
};

/* --- 6 · GROWTH — branching biomass --------------------------- */

type Tip = { x: number; y: number; a: number; len: number; gen: number; alive: boolean };

const growth: Renderer = {
  fade: 0.006,
  still: 300,
  init(w, h) {
    const seeds = count(w, h, 52000, 4, 12);
    return {
      tips: Array.from({ length: seeds }, () => ({
        x: rand(0, w),
        y: h + 4,
        a: -Math.PI / 2 + rand(-0.24, 0.24),
        len: 0,
        gen: 0,
        alive: true,
      })),
      h,
    };
  },
  step(ctx, s, w, h) {
    const tips = s.tips as Tip[];
    ctx.lineCap = "round";
    for (const t of tips) {
      if (!t.alive) continue;
      const px = t.x;
      const py = t.y;
      t.a += rand(-0.11, 0.11);
      const step = 2.2 - t.gen * 0.24;
      t.x += Math.cos(t.a) * step;
      t.y += Math.sin(t.a) * step;
      t.len += step;

      // Height on the canvas is the measured quantity: deep blue at the
      // root, warm at the canopy.
      const up = 1 - t.y / h;
      ctx.lineWidth = Math.max(0.5, 2.3 - t.gen * 0.5);
      ctx.strokeStyle = ramp(0.15 + up * 0.62, 0.5);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();

      if (t.y < -10 || t.x < -30 || t.x > w + 30 || t.len > h * 0.62) t.alive = false;
      else if (t.gen < 3 && t.len > 42 && Math.random() < 0.022) {
        const spread = rand(0.4, 0.8);
        tips.push({
          x: t.x,
          y: t.y,
          a: t.a + spread,
          len: 0,
          gen: t.gen + 1,
          alive: true,
        });
        t.a -= spread * 0.6;
        t.len = 0;
        t.gen += 1;
      }
    }
    // Reseed from the ground when the canopy has died back.
    if (tips.filter((t) => t.alive).length < 3) {
      tips.length = 0;
      for (let i = 0; i < 5; i++) {
        tips.push({
          x: rand(0, w),
          y: h + 4,
          a: -Math.PI / 2 + rand(-0.24, 0.24),
          len: 0,
          gen: 0,
          alive: true,
        });
      }
    }
  },
};

/* --- 7 · KINEMATIC — linkages turning, tracing ---------------- */

type Mech = {
  cx: number;
  cy: number;
  crank: number;
  rod: number;
  speed: number;
  phase: number;
  trail: number[];
};

const kinematic: Renderer = {
  fade: 0,
  still: 1,
  init(w, h) {
    const n = count(w, h, 95000, 2, 7);
    return {
      ms: Array.from({ length: n }, () => {
        const crank = rand(26, 54);
        return {
          cx: rand(w * 0.12, w * 0.88),
          cy: rand(h * 0.15, h * 0.85),
          crank,
          rod: crank * rand(2.1, 3.1),
          speed: rand(0.008, 0.017) * (Math.random() < 0.5 ? -1 : 1),
          phase: rand(0, TAU),
          trail: [],
        };
      }),
    };
  },
  step(ctx, s, w, h, f) {
    ctx.lineCap = "round";
    for (const m of s.ms as Mech[]) {
      const th = m.phase + f * m.speed;
      // Crank–slider: the crank pin, then the rod out to a slider on the
      // horizontal through the centre.
      const px = m.cx + Math.cos(th) * m.crank;
      const py = m.cy + Math.sin(th) * m.crank;
      const dy = py - m.cy;
      const sx = m.cx + Math.sqrt(Math.max(0, m.rod * m.rod - dy * dy));
      // Coupler midpoint is what draws the curve.
      const kx = (px + sx) / 2;
      const ky = (py + m.cy) / 2;
      m.trail.push(kx, ky);
      if (m.trail.length > 460) m.trail.splice(0, 2);

      ctx.strokeStyle = ramp(0.28, 0.26);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < m.trail.length; i += 2) {
        if (i === 0) ctx.moveTo(m.trail[i], m.trail[i + 1]);
        else ctx.lineTo(m.trail[i], m.trail[i + 1]);
      }
      ctx.stroke();

      ctx.strokeStyle = ramp(0.78, 0.6);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(m.cx, m.cy);
      ctx.lineTo(px, py);
      ctx.lineTo(sx, m.cy);
      ctx.stroke();

      ctx.strokeStyle = neutral(0.3);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(m.cx, m.cy, m.crank, 0, TAU);
      ctx.stroke();

      for (const [jx, jy, r] of [
        [m.cx, m.cy, 2.6],
        [px, py, 2.2],
        [sx, m.cy, 2.2],
      ] as const) {
        ctx.fillStyle = ramp(0.82, 0.8);
        ctx.beginPath();
        ctx.arc(jx, jy, r, 0, TAU);
        ctx.fill();
      }
    }
  },
};

/* --- 8 · NETWORK — a graph finding its edges ------------------ */

type Vtx = { x: number; y: number; vx: number; vy: number };

const network: Renderer = {
  fade: 0,
  still: 1,
  init(w, h) {
    const n = count(w, h, 15000, 16, 54);
    return {
      vs: Array.from({ length: n }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.16, 0.16),
        vy: rand(-0.16, 0.16),
      })),
    };
  },
  step(ctx, s, w, h, f) {
    const vs = s.vs as Vtx[];
    const reach = Math.min(w, h) * 0.26;
    for (const v of vs) {
      v.x += v.vx;
      v.y += v.vy;
      if (v.x < 0 || v.x > w) v.vx *= -1;
      if (v.y < 0 || v.y > h) v.vy *= -1;
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < vs.length; i++) {
      for (let j = i + 1; j < vs.length; j++) {
        const d = Math.hypot(vs[i].x - vs[j].x, vs[i].y - vs[j].y);
        if (d > reach) continue;
        const near = 1 - d / reach;
        ctx.strokeStyle = ramp(0.3 + near * 0.35, near * 0.4);
        ctx.beginPath();
        ctx.moveTo(vs[i].x, vs[i].y);
        ctx.lineTo(vs[j].x, vs[j].y);
        ctx.stroke();
      }
    }
    for (let i = 0; i < vs.length; i++) {
      // A slow breathing pulse so the graph reads as populated, not static.
      const pulse = 0.5 + 0.5 * Math.sin(f * 0.02 + i);
      ctx.fillStyle = ramp(0.55, 0.34 + pulse * 0.45);
      ctx.beginPath();
      ctx.arc(vs[i].x, vs[i].y, 1.6 + pulse * 1.1, 0, TAU);
      ctx.fill();
    }
  },
};

export const renderers: Record<FieldVariant, Renderer> = {
  flow,
  stress,
  wave,
  draft,
  signal,
  growth,
  kinematic,
  network,
};
