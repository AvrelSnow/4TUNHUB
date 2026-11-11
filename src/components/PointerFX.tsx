"use client";

import { useEffect } from "react";

/**
 * One listener for the whole page's pointer interactions, instead of a
 * client component per card (docs/visual-experience.md, "Motion").
 *
 *  - `.spotlight` elements get --mx/--my, the pointer position in %, so
 *    their glow follows the cursor.
 *  - `[data-magnetic]` elements get --tx/--ty, a pull of at most 6px
 *    toward the pointer, and spring back on leave.
 *
 * Fine pointers only (a mouse or trackpad); touch screens keep the
 * resting state. Nothing runs under reduced motion. Writes are batched
 * into one animation frame, and only CSS variables change, so layout is
 * never touched.
 */
export function PointerFX() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    let magnet: HTMLElement | null = null;

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      const spot = target?.closest<HTMLElement>(".spotlight");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        spot.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      }

      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && magnet !== m) release(magnet);
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        m.style.setProperty("--tx", `${(dx * 6).toFixed(2)}px`);
        m.style.setProperty("--ty", `${(dy * 4).toFixed(2)}px`);
      }
    };

    const release = (el: HTMLElement) => {
      el.style.removeProperty("--tx");
      el.style.removeProperty("--ty");
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (magnet) release(magnet);
      magnet = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
