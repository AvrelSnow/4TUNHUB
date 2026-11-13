"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { readNumber, readProgress, updateProgress, useProgress } from "@/lib/path-progress";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * A Lab lesson, one part at a time — the Lab's lesson.js, rebuilt for the
 * Academy. It compares and it shows; it never computes. Each check in the
 * markup carries the band the grader would accept (data-lo / data-hi) or
 * the right choice (data-answer); this only reads what the student typed
 * and says whether it falls inside.
 *
 * The parts are the Lab's own markup, rendered once by React and then
 * left alone, so the checks can be marked passed in the DOM without React
 * ever redrawing over them. Progress lives in a dock under the thumb: the
 * card's lessons as segments, the part, the time left, one button.
 */

type Words = Dictionary["path"]["lesson"] & { check: Dictionary["path"]["check"] };

const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] != null ? String(vars[k]) : m));

export function LessonRunner({
  id,
  steps,
  minutes,
  cardLessons,
  index,
  nextHref,
  pathHref,
  lang,
  t,
}: {
  id: string;
  steps: string[];
  minutes: number;
  /** Every lesson of this card, in order: the dock's segments. */
  cardLessons: string[];
  index: number;
  /** The next lesson, in this card or the next one. */
  nextHref?: string;
  pathHref: string;
  lang: string;
  t: Words;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(1);
  const [ready, setReady] = useState(false);
  // `#all` opens every part at once, for reading a lesson whole or
  // reviewing it: that is not finishing it, so nothing is recorded.
  const [review, setReview] = useState(false);
  // Checks answered or shown, by id: a part with an open check holds the
  // dock until it is one or the other.
  const [settled, setSettled] = useState<Record<string, true>>({});
  const settle = useCallback((cid: string) => setSettled((s) => ({ ...s, [cid]: true })), []);
  const progress = useProgress();

  // Which checks each part holds, read from the Lab's markup.
  const partChecks = useMemo(
    () => steps.map((html) => Array.from(html.matchAll(/data-check="([^"]+)"/g), (m) => m[1])),
    [steps],
  );
  const allChecks = partChecks.flat();
  // Made once: React 19 rewrites innerHTML whenever it is handed a new
  // object, which would wipe every stamp and typed answer on each render.
  const markup = useMemo(() => steps.map((html) => ({ __html: html })), [steps]);

  // Where this learner got to, once the page is in the browser.
  useEffect(() => {
    const p = readProgress();
    const all = window.location.hash === "#all";
    const start = p.seen[id] || all ? steps.length : Math.max(1, p.parts[id] ?? 1);
    /* eslint-disable react-hooks/set-state-in-effect -- device storage is only readable after hydration */
    setShown(Math.min(start, steps.length));
    setReview(all);
    setSettled({ ...p.passed });
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [id, steps.length]);

  const done = shown >= steps.length;

  useEffect(() => {
    if (!ready || review) return;
    updateProgress((p) => ({
      ...p,
      parts: { ...p.parts, [id]: shown },
      seen: done ? { ...p.seen, [id]: true } : p.seen,
    }));
  }, [id, shown, done, ready, review]);

  // ------------------------------------------------------------ checks --
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const w = t.check;

    const feedback = (box: HTMLElement, kind: "" | "miss" | "right", text: string) => {
      const fb = box.querySelector<HTMLElement>(".feedback");
      if (!fb) return;
      fb.textContent = text;
      fb.className = "feedback" + (kind ? ` is-${kind}` : "");
    };
    const reveal = (box: HTMLElement) => {
      box.querySelector<HTMLElement>(".reveal")?.removeAttribute("hidden");
      box.querySelector(".show-work")?.remove();
      box.classList.add("is-revealed");
      settle(box.dataset.check ?? "");
    };
    const stamp = (box: HTMLElement, quiet: boolean) => {
      if (box.querySelector(".stamp")) return;
      const s = document.createElement("div");
      s.className = "stamp" + (quiet ? " is-quiet" : "");
      s.setAttribute("aria-hidden", "true");
      s.textContent = w.stamp;
      box.appendChild(s);
    };
    /** `quiet`: restoring a check passed on an earlier visit. */
    const pass = (box: HTMLElement, quiet: boolean) => {
      const cid = box.dataset.check ?? "";
      feedback(box, "right", w.right);
      box.classList.add("is-right");
      box.querySelector<HTMLInputElement>(".answer")?.setAttribute("readonly", "readonly");
      box.querySelectorAll<HTMLInputElement>("input[type=radio]").forEach((r) => (r.disabled = true));
      const go = box.querySelector<HTMLButtonElement>(".check-go");
      if (go) go.disabled = true;
      if (!box.classList.contains("is-revealed")) {
        updateProgress((p) => ({ ...p, passed: { ...p.passed, [cid]: true } }));
      }
      box.querySelector<HTMLElement>(".reveal")?.removeAttribute("hidden");
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      stamp(box, quiet || reduced);
      if (!quiet) settle(cid);
    };
    const miss = (box: HTMLElement) => {
      const n = (Number(box.dataset.misses) || 0) + 1;
      box.dataset.misses = String(n);
      feedback(box, "miss", w.notYet);
      box.classList.remove("shake");
      void box.offsetWidth;
      box.classList.add("shake");
      if (n >= 2 && !box.querySelector(".show-work") && !box.classList.contains("is-revealed")) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pill pill-ghost show-work";
        btn.textContent = w.show;
        box.querySelector(".check-actions")?.appendChild(btn);
      }
    };
    const run = (box: HTMLElement) => {
      if (box.classList.contains("is-right")) return;
      const answer = box.dataset.answer;
      if (answer !== undefined) {
        const picked = box.querySelector<HTMLInputElement>("input[type=radio]:checked");
        if (!picked) return feedback(box, "", w.choose);
        return picked.value === answer ? pass(box, false) : miss(box);
      }
      const raw = (box.querySelector<HTMLInputElement>(".answer")?.value ?? "").trim();
      // A unit typed after the number: the box already names the unit.
      if (/[a-zA-Zµ·]/.test(raw.replace(/e[-+]?\d+$/i, ""))) return feedback(box, "", w.numberOnly);
      const read = readNumber(raw, lang);
      if ("error" in read) return feedback(box, "", w[read.error]);
      const v = Math.abs(read.value); // a sign is a convention
      const lo = Number(box.dataset.lo);
      const hi = Number(box.dataset.hi);
      const eps = 1e-9 * Math.max(1, Math.abs(hi));
      return v >= lo - eps && v <= hi + eps ? pass(box, false) : miss(box);
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const box = target.closest<HTMLElement>(".check");
      if (box && target.closest(".check-go")) return run(box);
      if (box && target.closest(".show-work")) return reveal(box);
      // The living formula: tap a symbol, it lights in the drawing.
      const sym = target.closest<HTMLButtonElement>(".sym");
      const formula = sym?.closest<HTMLElement>(".formula");
      if (sym && formula) {
        const name = sym.dataset.sym ?? "";
        const on = !sym.classList.contains("lit");
        formula.querySelectorAll(".lit").forEach((x) => x.classList.remove("lit"));
        formula.querySelectorAll(".sym").forEach((x) => x.setAttribute("aria-pressed", "false"));
        if (!on) return;
        formula.querySelectorAll(`[data-sym="${CSS.escape(name)}"]`).forEach((x) => x.classList.add("lit"));
        sym.setAttribute("aria-pressed", "true");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      const input = (e.target as HTMLElement).closest(".answer");
      const box = input?.closest<HTMLElement>(".check");
      if (box && e.key === "Enter") {
        e.preventDefault();
        run(box);
      }
    };
    const onInput = (e: Event) => {
      const box = (e.target as HTMLElement).closest<HTMLElement>(".check");
      if (box && !box.classList.contains("is-right")) feedback(box, "", "");
    };

    el.addEventListener("click", onClick);
    el.addEventListener("keydown", onKey);
    el.addEventListener("input", onInput);
    el.addEventListener("change", onInput);

    // Checks passed on an earlier visit open already stamped, quietly.
    const passed = readProgress().passed;
    el.querySelectorAll<HTMLElement>(".check").forEach((box) => {
      if (passed[box.dataset.check ?? ""]) pass(box, true);
    });
    el.querySelectorAll(".sym").forEach((s) => s.setAttribute("aria-pressed", "false"));

    return () => {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("input", onInput);
      el.removeEventListener("change", onInput);
    };
  }, [lang, settle, t.check]);

  // -------------------------------------------------------------- dock --
  const waiting = !done && (partChecks[shown - 1] ?? []).some((cid) => !settled[cid]);
  const inTolerance = allChecks.filter((cid) => progress.passed[cid]).length;

  const left = minutes * (steps.length - shown) / steps.length;
  const status = done
    ? ""
    : waiting
      ? t.answerFirst
      : left < 1
        ? t.underMinute
        : fmt(t.minLeft, { m: Math.ceil(left) });

  const advance = () => {
    const next = Math.min(shown + 1, steps.length);
    setShown(next);
    requestAnimationFrame(() => {
      const target =
        next >= steps.length
          ? document.getElementById(`end-${id}`)
          : root.current?.querySelector<HTMLElement>(`[data-part="${next - 1}"]`);
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  };

  return (
    <>
      <div ref={root} className="lab">
        {markup.map((html, i) => (
          <div key={i} data-part={i} hidden={i >= shown} dangerouslySetInnerHTML={html} />
        ))}
      </div>

      {done && (
        <section
          id={`end-${id}`}
          className="mt-8 scroll-mt-24 rounded-3xl bg-surface p-8 text-center shadow-e2 sm:p-10"
        >
          <span
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success"
          >
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M7.5 12.5l3 3 6-6.5" />
            </svg>
          </span>
          <h2 className="mt-4 text-headline text-foreground">{index + 1 === cardLessons.length ? t.cardDone : t.done}</h2>
          {allChecks.length > 0 && (
            <p className="mt-2 font-medium text-muted">{fmt(t.endSum, { n: inTolerance, t: allChecks.length })}</p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {nextHref && (
              <Button as="a" href={nextHref} size="lg">
                {t.next}
              </Button>
            )}
            <Button as="a" href={pathHref} size="lg" variant="secondary">
              {t.toPath}
            </Button>
          </div>
        </section>
      )}

      {/* Room for the dock, so the last part is never under it. */}
      <div aria-hidden="true" className="h-32" />

      <div
        role="region"
        aria-label={t.back}
        className="glass fixed inset-x-0 bottom-0 z-30 border-t border-border pb-[env(safe-area-inset-bottom)]"
      >
        <Container className="max-w-3xl py-3">
          <div aria-hidden="true" className="mb-2.5 flex gap-1.5">
            {cardLessons.map((lid, i) => {
              const pct = i === index ? Math.round((100 * shown) / steps.length) : progress.seen[lid] ? 100 : 0;
              return (
                <span key={lid} className="lab-dock-seg">
                  <i style={{ width: `${pct}%` }} />
                </span>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-3">
            <p aria-live="polite" className="min-w-0 text-sm text-muted">
              {done ? (
                <strong className="font-semibold text-foreground">{t.done}</strong>
              ) : (
                <>
                  <strong className="font-semibold text-foreground">
                    {fmt(t.part, { n: shown, t: steps.length })}
                  </strong>
                  {status && ` · ${status}`}
                </>
              )}
            </p>
            {done ? (
              <Button as="a" href={nextHref ?? pathHref} size="md" className="min-w-32 shrink-0 bg-success text-white hover:bg-success">
                {nextHref ? t.next : t.toPath}
              </Button>
            ) : (
              <Button type="button" size="md" onClick={advance} disabled={waiting} className="min-w-32 shrink-0">
                {t.continue}
              </Button>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
