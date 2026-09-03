"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * ============================================================
 * FLOW FIELD — the living background.
 * ============================================================
 * Particles advect through a vector field and leave fading streaks,
 * coloured on the flow ramp by local speed. It is the site's own
 * subject matter running live: the hero image is a CFD pressure map,
 * and this is the same idea in motion. Art-direction §"motion" — the
 * animation demonstrates what the company does rather than decorating
 * the page, and colour still stands in for a measured quantity.
 *
 * Hand-rolled on 2D canvas, no dependency: a particle library would
 * cost more than the entire remaining client-JS budget. One canvas
 * beats hundreds of animated DOM nodes.
 *
 * Restraint is enforced in code, not by good intentions:
 *  - reduced motion renders a single still frame and stops
 *  - pauses entirely when scrolled offscreen or the tab is hidden
 *  - device pixel ratio capped at 2, particle count scaled to area
 *  - strokes stay at low alpha so body text keeps its contrast
 */

/** The flow ramp, as RGB. Kept in sync with globals.css. */
const RAMP: readonly [number, number, number][] = [
  [27, 59, 216], // flow-1  deep blue
  [0, 183, 255], // flow-2  cyan
  [47, 224, 138], // flow-3  green
  [255, 210, 63], // flow-4  amber
  [255, 75, 46], // flow-5  red
];

function rampColor(t: number): [number, number, number] {
  const x = Math.max(0, Math.min(0.9999, t)) * (RAMP.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = RAMP[i];
  const b = RAMP[i + 1] ?? a;
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

type Particle = { x: number; y: number; px: number; py: number; life: number };

/**
 * Domain-warped trig noise. Cheap enough to run per particle per frame,
 * and organic enough to read as flow rather than as a pattern — which a
 * single sine wave would.
 */
function angleAt(x: number, y: number, t: number): number {
  const a = Math.sin(x * 0.0021 + t * 0.00021) * 1.7;
  const b = Math.cos(y * 0.0017 - t * 0.00017) * 1.7;
  const c = Math.sin((x + y) * 0.0012 + t * 0.00013) * 1.1;
  return a + b + c;
}

export function FlowField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let t = 0;

    const seed = () => {
      // ~1 particle per 9000 device-independent px, clamped. A phone gets
      // a handful; a large display gets a field.
      const target = Math.round(
        Math.max(28, Math.min(150, (width * height) / 9000)),
      );
      particles = Array.from({ length: target }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return { x, y, px: x, py: y, life: Math.random() * 260 };
      });
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      seed();
    };

    const step = () => {
      // Fade the previous frame toward the ground instead of clearing, so
      // each particle leaves a trail that decays.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.03)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      ctx.lineWidth = 1.1;
      ctx.lineCap = "round";

      for (const p of particles) {
        p.px = p.x;
        p.py = p.y;

        const ang = angleAt(p.x, p.y, t);
        const speed = 0.55 + (Math.sin(ang * 1.6) + 1) * 0.5;
        p.x += Math.cos(ang) * speed;
        p.y += Math.sin(ang) * speed;
        p.life -= 1;

        const off = p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20;
        if (off || p.life <= 0) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.px = p.x;
          p.py = p.y;
          p.life = 180 + Math.random() * 220;
          continue; // don't draw the teleport
        }

        // Colour by local speed: the ramp still stands in for a measured
        // quantity, exactly as the pressure map does.
        const [r, g, b] = rampColor((speed - 0.55) / 1.0);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.34)`;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      t += 16;
    };

    const loop = () => {
      if (!running) return;
      step();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();

    if (reduced) {
      // A still composition rather than an empty box: run the simulation
      // forward a bounded number of steps, then stop for good.
      for (let i = 0; i < 220; i++) step();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) for (let i = 0; i < 220; i++) step();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("flow-field pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
