"""Ask the Lab's own engine what it would say, for many sets of numbers.

    python scripts/lab-parity.py --lab C:\\4TUNHUBLAB.COM --out cases.json
    node scripts/check-lab-parity.mjs cases.json

For every challenge: random parameter sets (valid and not), the answer chain,
and graded submissions - right answers, each known mistake, answers that
follow from an earlier slip, and noise - judged by 4tunlab.grade. The Node
script replays them through src/lib/practice/ and reports any difference.
"""

import argparse
import json
import random
import sys
from pathlib import Path

DRAWS = 3000   # raw draws per challenge, for validate()
RUNS = 600     # valid parameter sets graded per challenge


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--lab", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args(argv)
    lab = Path(args.lab).resolve()
    sys.path.insert(0, str(lab / "checker"))
    mod = lambda name: __import__("4tunlab." + name, fromlist=[name])
    challenge_mod, grade_mod, seed_mod = mod("challenge"), mod("grade"), mod("seed")

    rng = random.Random(20261125)
    out = {}
    for folder in sorted((lab / "challenges").iterdir()):
        if not (folder / "challenge.yaml").is_file():
            continue
        ch = challenge_mod.load(folder)
        draws = []
        for _ in range(DRAWS):
            raw = {k: seed_mod._draw_one(ch.param_spec[k], rng) for k in sorted(ch.param_spec)}
            draws.append([raw, bool(ch.validate(raw))])

        runs = []
        for n in range(RUNS):
            run = ch.new_run("parity-%d" % n)
            correct = run.answers
            cases = []

            def judge(step, submitted):
                verdict = grade_mod.grade(ch, run, submitted)
                check = next(c for c in verdict["checks"] if c["id"] == step.id)
                cases.append({"step": step.id, "value": submitted[step.id], "given": submitted,
                              "status": check["status"], "diagnosis": check["diagnosis"]})

            for i, step in enumerate(ch.steps):
                truth = correct[step.id]
                prints = ch.fingerprints(step.id, run.params, correct)
                tries = [truth, -truth, truth * rng.uniform(0.2, 3), 0.0]
                tries += [v for v in prints.values() if v is not None]
                for value in tries:
                    judge(step, {step.id: value})
                if i == 0:
                    continue
                # An earlier slip, followed through correctly.
                slipped = {}
                for earlier in ch.steps[:i]:
                    slipped[earlier.id] = correct[earlier.id] * rng.choice([1.0, 1.5, 2.0])
                prior = dict(correct)
                prior.update({k: abs(v) for k, v in slipped.items()})
                try:
                    followed = ch.solve_step(step.id, run.params, prior)
                except (KeyError, TypeError, ZeroDivisionError, ValueError):
                    followed = None
                for value in (followed, truth):
                    if value is not None:
                        judge(step, dict(slipped, **{step.id: value}))
            runs.append({"params": run.params, "answers": correct, "cases": cases})
        out[ch.id] = {"draws": draws, "runs": runs}
        print("%s: %d draws, %d runs, %d graded answers"
              % (ch.id, len(draws), len(runs), sum(len(r["cases"]) for r in runs)))

    Path(args.out).write_text(json.dumps(out), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
