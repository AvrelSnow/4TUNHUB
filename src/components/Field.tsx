"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { FieldVariant } from "./fields/renderers";

export type { FieldVariant };

/**
 * ============================================================
 * FIELD — the animated background, one engine for every page.
 * ============================================================
 * The variant decides which engineering phenomenon runs; see
 * fields/renderers.ts for what each one is and where it belongs.
 * This file owns everything they share: the canvas, the device
 * pixel ratio, resize, and the discipline.
 *
 * The simulations are imported DYNAMICALLY. A background must never
 * be on the critical path — the code arrives after first paint, so
 * the headline and the copy render on an empty canvas and the field
 * fills in behind them. On a slow connection the page is readable
 * long before the physics shows up, which is the whole point.
 *
 * Restraint is enforced in code, not by good intentions:
 *  - reduced motion pre-runs the simulation and renders a still frame
 *  - the loop stops outright when scrolled offscreen or the tab hides
 *  - DPR is capped at 2 and every renderer scales its work to area
 *  - the `.field-scrim` ships with the field, so copy over it is
 *    protected by construction; contrast is measured against real canvas
 *    pixels before shipping
 */
export function Field({
  variant,
  className,
}: {
  variant: FieldVariant;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let cancelled = false;
    let teardown: (() => void) | null = null;

    void import("./fields/renderers").then(({ renderers, setFieldNeutral }) => {
      if (cancelled) return;
      const r = renderers[variant];
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /**
       * The ground can change under a running simulation — at 06:00 or
       * 18:00, or the moment someone presses the theme control. A canvas
       * cannot resolve `var()`, so the neutral is read off <html> here and
       * pushed into the renderer module; a repaint alone would keep drawing
       * the old ground's grey on the new one.
       */
      const syncNeutral = () => {
        const raw = getComputedStyle(document.documentElement)
          .getPropertyValue("--field-neutral")
          .trim();
        const parts = raw.split(/[\s,]+/).map(Number);
        if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
          setFieldNeutral([parts[0], parts[1], parts[2]]);
        }
      };
      syncNeutral();

      let w = 0;
      let h = 0;
      let state = r.init(1, 1);
      let raf = 0;
      let running = false;
      let onScreen = true;
      let frame = 0;

      const paint = () => {
        if (r.fade > 0) {
          // Trail: fade the previous frame toward transparent rather than
          // clearing, so strokes decay instead of blinking out.
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillStyle = `rgba(0,0,0,${r.fade})`;
          ctx.fillRect(0, 0, w, h);
          ctx.globalCompositeOperation = "source-over";
        } else {
          ctx.clearRect(0, 0, w, h);
        }
        r.step(ctx, state, w, h, frame);
        frame += 1;
      };

      const resize = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const rect = canvas.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        if (w === 0 || h === 0) return;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        frame = 0;
        state = r.init(w, h);
        if (reduced) for (let i = 0; i < r.still; i++) paint();
      };

      const loop = () => {
        if (!running) return;
        paint();
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

      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen && !document.hidden) start();
          else stop();
        },
        { threshold: 0 },
      );
      io.observe(canvas);

      const onVisibility = () => {
        if (document.hidden) stop();
        else if (onScreen) start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      // Watch the ground. `resize` re-reads the neutral and re-inits, which
      // also clears the trail buffer — under reduced motion that matters,
      // because the still frame is composed once and would otherwise keep
      // the old ground's strokes baked into it forever.
      const themeWatch = new MutationObserver(() => {
        syncNeutral();
        resize();
      });
      themeWatch.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      teardown = () => {
        stop();
        ro.disconnect();
        io.disconnect();
        themeWatch.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [variant]);

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden="true"
        className={cn("field pointer-events-none absolute inset-0 h-full w-full", className)}
      />
      {/* The scrim ships WITH the field, never separately. Anything that
          renders a Field is contrast-safe by construction. */}
      <div aria-hidden="true" className="field-scrim" />
    </>
  );
}
