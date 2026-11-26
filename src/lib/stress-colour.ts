/**
 * Stress colour on the classic von Mises contour scale an FEA plot uses:
 * blue (no stress) → cyan → green → yellow → red (the limit). Only
 * neighbouring stops are mixed, which keeps the ramp clean. `r` is the share
 * of the limit, from 0 to 1.
 */
const SCALE = [0, 1, 2, 3, 4].map((i) => `var(--color-fea-${i})`);

export function stressColour(r: number): string {
  const p = Math.max(0, Math.min(1, r)) * 4;
  const k = Math.min(3, Math.floor(p));
  const f = Math.round((p - k) * 100);
  return `color-mix(in srgb, ${SCALE[k + 1]} ${f}%, ${SCALE[k]})`;
}
