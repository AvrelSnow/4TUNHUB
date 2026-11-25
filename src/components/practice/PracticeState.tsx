"use client";

import { Badge } from "@/components/ui/Badge";
import { usePractice } from "@/lib/practice/progress";
import { useProgress } from "@/lib/path-progress";
import { CLEARED } from "@/lib/practice/engine";

/** Where this device stands on one challenge, or one warm-up unit. */

const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] != null ? String(vars[k]) : m));

type Words = { new: string; cleared: string; progress: string };

export function ChallengeState({ id, steps, t }: { id: string; steps: string[]; t: Words }) {
  const entry = usePractice()[id];
  if (entry?.cleared) return <Badge variant="outline">✓ {t.cleared}</Badge>;
  const results = entry?.run?.results ?? {};
  const done = steps.filter((s) => results[s] && CLEARED.includes(results[s].status)).length;
  if (!Object.keys(results).length) return <Badge variant="amber">{t.new}</Badge>;
  return <Badge>{fmt(t.progress, { n: done, t: steps.length })}</Badge>;
}

export function UnitState({ id, t }: { id: string; t: Words }) {
  const { seen, parts } = useProgress();
  if (seen[id]) return <Badge variant="outline">✓ {t.cleared}</Badge>;
  return (parts[id] ?? 0) > 1 ? null : <Badge variant="amber">{t.new}</Badge>;
}
