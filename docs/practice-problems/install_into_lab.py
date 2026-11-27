"""Copy the practice problems into the Lab, and run the Lab's own tests.

    python docs/practice-problems/install_into_lab.py --lab C:\\4TUNHUBLAB.COM

By default it copies every problem marked "ready" in STATUS below: all six,
since P001-P003 were checked against SOLIDWORKS itself (sw_golden.py) and
P004-P006 are verified by tables, formulas and geometry. A problem marked
"held" is skipped unless --include-unverified is given.

It refuses to overwrite a folder that already exists in the Lab, and it never
runs git: put the Lab on a branch yourself first, and commit yourself after.
Nothing is pushed or published by this script.

    --dry-run     show what would be copied, change nothing
    --no-tests    copy, but do not run the Lab's test suite afterwards
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

# folder -> why it may or may not ship to students
STATUS = {
    "p001-stepped-block": ("ready", "golden seed rebuilt in SOLIDWORKS 2023 via its API: volume and centre of mass match"),
    "p002-stepped-shaft": ("ready", "golden seed rebuilt in SOLIDWORKS 2023 via its API: volume and centre of mass match"),
    "p003-driven-plate": ("ready", "both plates rebuilt in SOLIDWORKS 2023 via its API: lengths and volumes match"),
    "p004-limits-and-fits": ("ready", "ISO 286 tables x2 sources, formulas, worked examples"),
    "p005-solver-preflight": ("ready", "recomputed in plain SI, an independent unit system"),
    "p006-position-at-mmc": ("ready", "functional-gauge geometry and two sources' worked examples"),
}


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--lab", required=True, help="the 4TUNHUB Lab repository")
    ap.add_argument("--include-unverified", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-tests", action="store_true")
    args = ap.parse_args(argv)

    lab = Path(args.lab).resolve()
    target = lab / "challenges"
    if not (target.is_dir() and (lab / "checker" / "4tunlab").is_dir()):
        print("not a Lab repository: %s" % lab)
        return 2

    folders = sorted(p for p in HERE.iterdir() if (p / "challenge.yaml").is_file())
    unknown = [p.name for p in folders if p.name not in STATUS]
    if unknown:
        print("folders with no status in this script: %s" % ", ".join(unknown))
        return 2

    copied = []
    for p in folders:
        state, why = STATUS[p.name]
        if state == "held" and not args.include_unverified:
            print("HELD     %-24s %s" % (p.name, why))
            continue
        dest = target / p.name
        if dest.exists():
            print("EXISTS   %-24s not overwritten" % p.name)
            continue
        print("%-8s %-24s %s" % ("COPY" if not args.dry_run else "WOULD", p.name, why))
        if not args.dry_run:
            shutil.copytree(p, dest, ignore=shutil.ignore_patterns("__pycache__"))
            copied.append(p.name)

    if args.dry_run or args.no_tests or not copied:
        print("\nnothing else done." if not copied else "\ncopied; tests skipped.")
        return 0

    print("\nrunning the Lab's own suite (about two minutes)...")
    result = subprocess.run(
        [sys.executable, "-m", "unittest", "discover", "-s", "checker/tests", "-t", "checker"],
        cwd=str(lab), capture_output=True, text=True)
    tail = [l for l in (result.stdout + result.stderr).splitlines()
            if l.startswith(("FAIL:", "ERROR:", "Ran ", "FAILED", "OK"))]
    print("\n".join(tail))
    print("\nKnown failure on a clean Lab, unrelated: test_034_doctor ... test_healthy.")
    print("Next, by hand: review `git status` in the Lab, commit on your branch.")
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
