"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up figure — a gauge settling on its reading.
 *
 * Values arrive pre-formatted from the dictionaries ("319B", "560+", "6+",
 * "2"), so the leading number is animated and everything around it is
 * preserved verbatim. Never reformat a translated string.
 *
 * Same contract as Reveal (art-direction §"motion"): the server renders
 * the FINAL value, so it is correct without JS, correct for search
 * engines, and never blank. The animation only starts if the figure is
 * genuinely below the fold and motion is allowed — a number already on
 * screen at first paint is simply the number.
 *
 * `tabular-nums` on the caller keeps every digit the same width, so the
 * figure cannot reflow the layout while it counts.
 */
const DURATION = 1500;

/** easeOutQuart — matches --ease-out-quart in the token set. */
const ease = (x: number) => 1 - Math.pow(1 - x, 4);

export function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = /^(\d[\d.,]*)(.*)$/.exec(value);
    if (!match) return; // no leading number — nothing to count

    const [, numeric, suffix] = match;
    const target = Number(numeric.replace(/,/g, ""));
    if (!Number.isFinite(target) || target <= 0) return;

    const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen at first paint → it is just the number.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    let raf = 0;
    let startedAt = 0;

    const frame = (now: number) => {
      if (!startedAt) startedAt = now;
      const p = Math.min(1, (now - startedAt) / DURATION);
      const current = target * ease(p);
      setDisplay(`${current.toFixed(decimals)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(frame);
      else setDisplay(value);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setDisplay(`${(0).toFixed(decimals)}${suffix}`);
        raf = requestAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
