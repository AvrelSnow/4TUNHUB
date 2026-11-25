"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { readNumber } from "@/lib/path-progress";
import {
  CLEARED,
  drawParams,
  fill,
  gradeStep,
  plainPower,
  stepKey,
  type Step,
} from "@/lib/practice/engine";
import { LOGIC } from "@/lib/practice/logic";
import { freshRun, readPractice, updateEntry, usePractice, type Run } from "@/lib/practice/progress";
import type { ChallengeView } from "@/lib/practice/data";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * One challenge: the learner's own sheet, then an answer box per step.
 *
 * The Lab's rules, kept: each step has its own attempts; the same answer
 * sent again costs nothing, and so does one that cannot be read; a wrong
 * answer gets a diagnosis when the mistake is a known one, then a hint that
 * deepens; spent attempts mean new numbers, without limit.
 */

type T = Dictionary["practice"]["run"] & { check: Dictionary["path"]["check"] };

const fmt = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] != null ? String(vars[k]) : m));

const UNIT: Record<string, string> = { "N.mm": "N·mm", mm3: "mm³", "-": "" };

export function ChallengeRunner({ challenge, lang, t }: { challenge: ChallengeView; lang: string; t: T }) {
  const { id, version, steps, constants } = challenge;
  const entry = usePractice()[id];
  const run = entry?.run?.version === version ? entry.run : undefined;

  // Numbers are drawn in the browser, once, the first time the page opens.
  useEffect(() => {
    if (readPractice()[id]?.run?.version !== version) {
      updateEntry(id, (e) => ({ ...e, run: freshRun(version) }));
    }
  }, [id, version, run]);

  const logic = LOGIC[id];
  const params = useMemo(
    () => (run ? drawParams(challenge.params, run.seed, logic, constants) : null),
    // The seed is the only thing that changes the numbers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [run?.seed],
  );

  const sheet = useMemo(() => {
    if (!params) return null;
    const values = { ...constants, ...params };
    const html = fill(challenge.brief, values, lang).replace(
      /<img data-drawing="([^"]+)"/g,
      (_, src: string) =>
        `<img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(fill(challenge.drawings[src], values, lang))}"`,
    );
    return { __html: html };
  }, [params, challenge, constants, lang]);

  if (!run || !params || !sheet) {
    return (
      <p className="readout mt-8" role="status">
        {t.preparing}
        <noscript> {t.needsScript}</noscript>
      </p>
    );
  }

  const cleared = steps.filter((s) => run.results[s.id] && CLEARED.includes(run.results[s.id].status)).length;

  const newNumbers = () => {
    if (Object.keys(run.used).length > 0 && !window.confirm(t.confirmNew)) return;
    updateEntry(id, (e) => ({ ...e, run: freshRun(version) }));
  };

  const submit = (step: Step, value: number, text: string) => {
    const given = { ...run.answers, [step.id]: value };
    const key = stepKey(step, steps, value, given);
    const again = run.keys.includes(key);
    const used = (run.used[step.id] ?? 0) + (again ? 0 : 1);
    const verdict = gradeStep(step, steps, logic, params, constants, value, given);
    let hint: string | null = null;
    if (verdict.status === "wrong") {
      for (let rung = Math.min(used, challenge.attempts); rung > 0 && !hint; rung--) {
        hint = challenge.strings.hint[`${step.id}.h${rung}`] ? `${step.id}.h${rung}` : null;
      }
    }
    const next: Run = {
      ...run,
      text: { ...run.text, [step.id]: text },
      answers: given,
      results: { ...run.results, [step.id]: { ...verdict, hint } },
      used: { ...run.used, [step.id]: used },
      keys: again ? run.keys : [...run.keys, key],
    };
    const all = steps.every((s) => next.results[s.id] && CLEARED.includes(next.results[s.id].status));
    updateEntry(id, (e) => ({ ...e, run: next, ...(all ? { cleared: true as const } : {}) }));
  };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button as="a" href="#answers" variant="secondary">
          {t.toAnswers}
        </Button>
        <Button type="button" variant="ghost" onClick={newNumbers}>
          {t.newNumbers}
        </Button>
      </div>

      <div className="sheet mt-6" dangerouslySetInnerHTML={sheet} />

      <section id="answers" className="mt-10 scroll-mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-headline text-foreground">{t.answers}</h2>
          <p className="readout">{fmt(t.cleared, { n: cleared, t: steps.length })}</p>
        </div>
        <p className="mt-2 text-sm text-muted">{fmt(t.rules, { n: challenge.attempts })}</p>

        <ol className="mt-5 grid gap-4">
          {steps.map((step) => (
            <StepBox
              // New numbers, new boxes.
              key={`${run.seed}:${step.id}`}
              step={step}
              challenge={challenge}
              run={run}
              lang={lang}
              t={t}
              onSubmit={submit}
              onNewNumbers={newNumbers}
            />
          ))}
        </ol>

        {cleared === steps.length && (
          <div role="status" className="mt-6 rounded-3xl bg-surface p-7 text-center shadow-e2">
            <p className="text-headline text-foreground">{t.allClear}</p>
            <p className="mt-2 text-muted">{t.allClearBody}</p>
            <div className="mt-5">
              <Button type="button" onClick={newNumbers}>
                {t.newNumbers}
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function StepBox({
  step,
  challenge,
  run,
  lang,
  t,
  onSubmit,
  onNewNumbers,
}: {
  step: Step;
  challenge: ChallengeView;
  run: Run;
  lang: string;
  t: T;
  onSubmit: (step: Step, value: number, text: string) => void;
  onNewNumbers: () => void;
}) {
  const [text, setText] = useState(run.text[step.id] ?? "");
  const [unread, setUnread] = useState("");
  const result = run.results[step.id];
  const used = run.used[step.id] ?? 0;
  const left = Math.max(0, challenge.attempts - used);
  const right = result?.status === "correct";
  const passed = !!result && CLEARED.includes(result.status);
  const spent = left === 0 && !passed;
  const inputId = `answer-${step.id}`;

  const check = (event: React.FormEvent) => {
    event.preventDefault();
    const raw = plainPower(text.trim());
    // A unit typed after the number: the box already names the unit.
    if (/[a-zA-Zµ·]/.test(raw.replace(/e[-+−]?\d+$/i, ""))) return setUnread(t.check.numberOnly);
    const read = readNumber(raw, lang);
    if ("error" in read) return setUnread(t.check[read.error]);
    setUnread("");
    onSubmit(step, read.value, text);
  };

  return (
    <li
      className={cn(
        "rounded-2xl border bg-surface-2 p-5",
        passed ? "border-success" : "border-border",
      )}
    >
      <form onSubmit={check} noValidate>
        <label htmlFor={inputId} className="block font-semibold text-foreground">
          {challenge.strings.step[step.id]}
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-hairline bg-background px-3">
            <input
              id={inputId}
              // Scientific notation and minus signs need the full keyboard on a phone.
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              value={text}
              readOnly={right || spent}
              onChange={(e) => {
                setText(e.target.value);
                setUnread("");
              }}
              className="h-11 w-full min-w-0 bg-transparent text-base tabular-nums text-foreground outline-offset-4"
            />
            <span className="readout whitespace-nowrap">{UNIT[step.unit] ?? step.unit}</span>
          </span>
          <Button type="submit" disabled={right || spent || !text.trim()}>
            {t.checkButton}
          </Button>
        </div>
      </form>

      <div aria-live="polite" className="mt-3 text-sm">
        {unread ? (
          <p className="text-muted">{unread}</p>
        ) : (
          result && (
            <>
              <p className={cn("font-semibold", passed ? "text-success" : "text-danger")}>
                {passed ? "✓ " : ""}
                {challenge.status[result.status]}
              </p>
              {result.status === "wrong" && (
                <>
                  <p className="mt-1 text-foreground">
                    {result.diagnosis ? challenge.strings.diagnosis[result.diagnosis] : challenge.noDiagnosis}
                  </p>
                  {result.hint && (
                    <p className="mt-2 rounded-xl bg-surface px-3 py-2 text-muted">
                      <strong className="font-semibold text-foreground">{t.hint}</strong>{" "}
                      {challenge.strings.hint[result.hint]}
                    </p>
                  )}
                </>
              )}
            </>
          )
        )}
        {!right && used > 0 && !spent && <p className="readout mt-2">{fmt(t.left, { n: left })}</p>}
        {spent && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-muted">{t.spent}</p>
            <Button type="button" size="sm" variant="secondary" onClick={onNewNumbers}>
              {t.newNumbers}
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
