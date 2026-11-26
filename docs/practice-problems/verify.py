"""Verify the practice problems, with the Lab's own engine.

    python docs/practice-problems/verify.py --lab C:\\4TUNHUBLAB.COM

For every problem folder here it checks:

  1. LOAD     the Lab's loader accepts the folder (step lists agree, the
              solution has what the engine needs).
  2. SEEDS    how many valid seeds exist (fewer than 50 and students start
              to share numbers).
  3. INDEPENDENT  every answer is rebuilt by NUMERICAL INTEGRATION over thin
              slices - a different method from the closed formulas in
              solution.py - and must agree to 1e-4 (relative). This is the
              check that a wrong formula cannot pass.
  4. SEPARATION   every predicted mistake lands at least 3 tolerances away
              from the true answer, for EVERY valid seed (Contract 3).
  5. STRINGS  every step, every mistake and every hint has EN and FR text.

It does not replace the one check only SOLIDWORKS can make: model the golden
seed, read the mass properties, compare. See docs/practice-problems.md.
"""

import argparse
import itertools
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PI = 3.141592653589793


# --------------------------------------------------------------------------
# The seed space, enumerated rather than sampled.
# --------------------------------------------------------------------------
def axis_values(spec):
    if "values" in spec:
        return list(spec["values"])
    out, v = [], spec["min"]
    while v <= spec["max"] + 1e-9:
        out.append(v)
        v += spec["step"]
    return out


def seed_space(ch):
    spec = ch.param_spec
    names = list(spec)
    grids = [axis_values(spec[n]) for n in names]
    for combo in itertools.product(*grids):
        yield dict(zip(names, combo))


# --------------------------------------------------------------------------
# Independent answers: numerical integration over thin slices.
# --------------------------------------------------------------------------
def slices(total, dz):
    n = max(1, int(round(total / dz)))
    h = total / n
    return n, h


def indep_p001(p):
    H, hb = p["H"], p["hb"]
    n, h = slices(H + hb, 0.01)
    vol = mom = 0.0
    for i in range(n):
        z = (i + 0.5) * h
        a = p["L"] * p["W"] if z < H else 0.0
        if z >= H:
            a += PI / 4 * p["Db"] ** 2
        a -= PI / 4 * p["dh"] ** 2
        if z < H:
            pass
        vol += a * h
        mom += a * z * h
    # base slices carry the base rectangle; boss slices the boss circle.
    return {"volume": vol, "com_height": mom / vol,
            "mass": vol * p["rho"] * 1e-6}


def indep_p002(p):
    segs = [(p["d1"], p["l1"]), (p["d2"], p["l2"]), (p["d3"], p["l3"])]
    total = sum(l for _, l in segs)
    n, h = slices(total, 0.01)
    vol = mom = 0.0
    for i in range(n):
        x = (i + 0.5) * h
        edge, d = 0.0, None
        for dd, ll in segs:
            edge += ll
            if x < edge:
                d = dd
                break
        a = PI / 4 * (d ** 2 - p["bore"] ** 2)
        vol += a * h
        mom += a * x * h
    return {"volume": vol, "com_x": mom / vol, "mass": vol * p["rho"] * 1e-6}


def indep_p003(p):
    def mass_for(n_holes):
        length = 2 * p["e"] + (n_holes - 1) * p["s"]
        steps, h = slices(length, 0.01)
        centres = [p["e"] + k * p["s"] for k in range(n_holes)]
        r = p["d"] / 2.0
        vol = 0.0
        for i in range(steps):
            x = (i + 0.5) * h
            chord = 0.0
            for c in centres:
                dx = x - c
                if abs(dx) < r:
                    chord += 2.0 * (r * r - dx * dx) ** 0.5
            vol += (p["W"] - chord) * p["t"] * h
        return length, vol * p["rho"] * 1e-6

    length, m0 = mass_for(p["n"])
    _, m1 = mass_for(p["n"] + p["dn"])
    return {"plate_length": length, "mass_original": m0, "mass_changed": m1}



def indep_p005(p):
    """The same job worked entirely in SI: pascals, kg, metres, seconds."""
    E_gpa, rho = {"steel": (210, 7850), "aluminium": (72, 2700),
                  "titanium": (110, 4500), "copper": (120, 8900)}[p["mat"]]
    E_pa = E_gpa * 1e9
    c = (E_pa / rho) ** 0.5                         # m/s
    dt = (p["L"] * 1e-3) / c                        # s
    mass = rho * 4.0 / 3.0 * PI * (p["r"] * 1e-3) ** 3     # kg
    ke_j = 0.5 * mass * p["v"] ** 2                 # J
    return {"E_mpa": E_pa / 1e6,                    # Pa -> MPa
            "rho_tmm3": rho / 1000.0 / 1e9,         # kg/m3 -> t/m3 -> t/mm3
            "wave_speed": c,
            "time_step_us": dt * 1e6,
            "ball_energy": ke_j * 1000.0,           # J -> N.mm
            "n_steps": (p["t_end"] * 1e-3) / dt}



def indep_p006(p):
    """The same part by GEOMETRY, not by the tolerance formulas: a functional
    gauge. The gauge is a pin of the virtual-condition diameter placed at the
    true position; the part passes if the pin fits inside the actual hole,
    whose axis is offset by (dx, dy). The position error is found by
    bisection on the radius of the circle that holds the axis. All in um."""
    Dmin, W, T = p["Dmin_um"], p["W_um"], p["T_um"]
    d = Dmin + W * p["f_q"] // 4
    vc = Dmin - T
    # bisection: smallest radius r with dx^2 + dy^2 <= r^2
    lo, hi = 0.0, 1000.0
    for _ in range(80):
        mid = (lo + hi) / 2.0
        if p["dx_um"] ** 2 + p["dy_um"] ** 2 <= mid * mid:
            hi = mid
        else:
            lo = mid
    error = 2.0 * hi
    # the pin (radius vc/2) at the origin fits in the hole (radius d/2, centre at
    # the offset) when distance + vc/2 <= d/2
    dist = (p["dx_um"] ** 2 + p["dy_um"] ** 2) ** 0.5
    fits = dist + vc / 2.0 <= d / 2.0
    size_ok = Dmin <= d <= Dmin + W
    verdict = 3.0 if not size_ok else (1.0 if fits else 2.0)
    return {"position_error": error / 1000.0, "verdict": verdict,
            "allowed_zone": (d - vc) / 1000.0}   # largest 2e the pin allows


INDEPENDENT = {
    "p001-stepped-block": indep_p001,
    "p002-stepped-shaft": indep_p002,
    "p003-driven-plate": indep_p003,
    "p005-solver-preflight": indep_p005,
    "p006-position-at-mmc": indep_p006,
}

# Slice integration on a rectangle-and-circle section is exact to a few
# parts in 1e-5; the hole/chord sum in P003 is the roughest, so 3e-4.
AGREE = {"p001-stepped-block": 1e-4, "p002-stepped-shaft": 1e-4,
         "p003-driven-plate": 3e-4, "p005-solver-preflight": 1e-9,
         "p006-position-at-mmc": 1e-5}   # answers are rounded to a nanometre



# --------------------------------------------------------------------------
# P004 has no geometry to integrate. Its independent check is the ISO 286-1
# FORMULAS: every tabulated deviation must be reproducible from them within
# the table's own rounding (1 micrometre), and three worked examples from a
# third published source must come out exactly.
# --------------------------------------------------------------------------
def extra_p004(ch):
    c = ch.constants
    ranges, dev = c["ranges"], c["deviations"]
    problems = []
    for i, (a, b) in enumerate(ranges):
        d = (a * b) ** 0.5                       # geometric mean of the range
        unit = 0.45 * d ** (1.0 / 3.0) + 0.001 * d
        it6, it7 = 10 * unit, 16 * unit
        ES, EI = dev["H7"][i]
        want = {
            "IT7 = 16 i": (ES - EI, it7),
            "IT6 = 10 i (h6)": (dev["h6"][i][0] - dev["h6"][i][1], it6),
            "g es = -2.5 D^0.34": (dev["g6"][i][0], -2.5 * d ** 0.34),
            "f es = -5.5 D^0.41": (dev["f7"][i][0], -5.5 * d ** 0.41),
            "k ei = 0.6 D^(1/3)": (dev["k6"][i][1], 0.6 * d ** (1.0 / 3.0)),
            "m ei = IT7 - IT6": (dev["m6"][i][1], it7 - it6),
            "n ei = 5 D^0.34": (dev["n6"][i][1], 5 * d ** 0.34),
        }
        for label, (table, formula) in want.items():
            if abs(table - formula) > 1.0:
                problems.append("%s-%s %s: table %s, formula %.2f" % (a, b, label, table, formula))
        # widths: every shaft class has the width its grade says
        for cls, grade in (("g6", it6), ("h6", it6), ("k6", it6), ("m6", it6),
                           ("n6", it6), ("p6", it6), ("f7", it7)):
            width = dev[cls][i][0] - dev[cls][i][1]
            if abs(width - grade) > 1.0:
                problems.append("%s-%s %s width %s vs grade %.2f" % (a, b, cls, width, grade))
        # p: ei = IT7 + (0 to 5)
        if not (0 <= dev["p6"][i][1] - (ES - EI) <= 5):
            problems.append("%s-%s p6 ei outside IT7 + (0..5)" % (a, b))
    # worked examples, a third source: 25 H7/g6 and 10 H7/g6
    cases = [
        ({"D": 25, "fit": "H7/g6"},
         {"hole_max": 25.021, "shaft_max": 24.993, "shaft_min": 24.980,
          "max_clearance": 0.041, "min_clearance": 0.007, "fit_type": 1.0}),
        ({"D": 10, "fit": "H7/g6"},
         {"hole_max": 10.015, "shaft_max": 9.995, "shaft_min": 9.986,
          "max_clearance": 0.029, "min_clearance": 0.005, "fit_type": 1.0}),
        ({"D": 25, "fit": "H7/p6"}, {"min_clearance": -0.035, "max_clearance": -0.001, "fit_type": 3.0}),
        ({"D": 25, "fit": "H7/k6"}, {"fit_type": 2.0}),
        ({"D": 25, "fit": "H7/h6"}, {"min_clearance": 0.0, "fit_type": 1.0}),
        # sizes ON a range edge belong to the range below ("up to and including")
        ({"D": 6, "fit": "H7/g6"}, {"hole_max": 6.012, "shaft_max": 5.996, "shaft_min": 5.988}),
        ({"D": 10, "fit": "H7/g6"}, {"hole_max": 10.015}),
        ({"D": 18, "fit": "H7/g6"}, {"hole_max": 18.018, "shaft_max": 17.994, "shaft_min": 17.983}),
        ({"D": 30, "fit": "H7/g6"}, {"hole_max": 30.021, "shaft_max": 29.993, "shaft_min": 29.980}),
        ({"D": 50, "fit": "H7/g6"}, {"hole_max": 50.025, "shaft_max": 49.991, "shaft_min": 49.975}),
        ({"D": 80, "fit": "H7/g6"}, {"hole_max": 80.030, "shaft_max": 79.990, "shaft_min": 79.971}),
        ({"D": 51, "fit": "H7/g6"}, {"hole_max": 51.030, "shaft_max": 50.990, "shaft_min": 50.971}),
    ]
    for params, expect in cases:
        got = ch.solution.solve(params, c)
        for k, v in expect.items():
            if abs(got[k] - v) > 1e-9:
                problems.append("%s %s %s: got %s, want %s" % (params["D"], params["fit"], k, got[k], v))
    return problems



def extra_p006(ch):
    """Worked examples printed in two independent sources, run through the
    same chain (units are thousandths of the source's unit, so whole numbers)."""
    core = ch.solution.core
    problems = []

    def check(label, got, want):
        if abs(got - want) > 1e-9:
            problems.append("%s: got %s, want %s" % (label, got, want))

    # Source 1: hole 0.250 +0.005/-0.000, position 0.010 at MMC (thousandths).
    for d, allowed in ((252, 12), (255, 15), (250, 10)):
        check("allowed at %s" % d, core(250, 255, 10, d, 0, 0)["allowed_zone"], allowed)
    check("virtual condition 0.250-0.010", core(250, 255, 10, 252, 0, 0)["virtual_condition"], 240)
    # "a hole measured at 0.253 with position 0.012 conforms": error 12 = 2*sqrt(6^2+0)
    r = core(250, 255, 10, 253, 6, 0)
    check("0.253 / 0.012 allowed", r["allowed_zone"], 13)
    check("0.253 / 0.012 error", r["position_error"], 12)
    check("0.253 / 0.012 verdict (accept)", r["verdict"], 1.0)
    # the same hole judged against the bare tolerance would be rejected: 12 > 10
    if not r["position_error"] > 10:
        problems.append("source example should exceed the bare tolerance")
    # Source 2: hole 8.00 to 8.20, produced 8.12: bonus 0.12 (hundredths of mm -> um)
    check("8.12 hole bonus", core(8000, 8200, 1000, 8120, 0, 0)["bonus"], 120)
    # A hole outside its limits is rejected for size whatever its position.
    check("oversize hole", core(250, 255, 10, 256, 0, 0)["verdict"], 3.0)
    check("undersize hole", core(250, 255, 10, 249, 0, 0)["verdict"], 3.0)
    return problems


EXTRA = {"p004-limits-and-fits": extra_p004, "p006-position-at-mmc": extra_p006}

def tol_width(tolerance, expected):
    if tolerance["type"] == "abs":
        return float(tolerance["value"])
    if tolerance["type"] == "rel":
        return float(tolerance["value"]) * abs(expected)
    return 0.0


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--lab", required=True)
    ap.add_argument("--sample", type=int, default=40,
                    help="seeds to integrate numerically per problem")
    args = ap.parse_args(argv)

    sys.path.insert(0, str(Path(args.lab) / "checker"))
    challenge_mod = __import__("4tunlab.challenge", fromlist=["challenge"])

    failures = 0
    for folder in sorted(p for p in HERE.iterdir() if p.is_dir()
                         and (p / "challenge.yaml").is_file()):
        ch = challenge_mod.load(folder)
        pid = ch.id
        consts = ch.constants
        steps = {s.id: s for s in ch.steps}
        print("\n== %s v%s" % (pid, ch.version))
        print("LOAD        ok  steps: %s" % ", ".join(steps))

        valid = [p for p in seed_space(ch)
                 if ch.solution.validate(ch.solution.derived_params(p, consts), consts)]
        raw = sum(1 for _ in seed_space(ch))
        flag = "ok" if len(valid) >= 50 else "TOO FEW"
        if flag != "ok":
            failures += 1
        print("SEEDS       %s  %d valid of %d grid points" % (flag, len(valid), raw))

        # 3 - an independent answer, by a different method.
        if pid in INDEPENDENT:
            pick = valid[:: max(1, len(valid) // args.sample)]
            worst = 0.0
            for p in pick:
                truth = ch.solution.solve(ch.solution.derived_params(p, consts), consts)
                other = INDEPENDENT[pid](p)
                for k, v in other.items():
                    worst = max(worst, abs(v - truth[k]) / max(abs(truth[k]), 1e-3))
            ok = worst <= AGREE[pid]
            failures += 0 if ok else 1
            print("INDEPENDENT %s  %d seeds, worst disagreement %.2e (limit %.0e)"
                  % ("ok" if ok else "FAIL", len(pick), worst, AGREE[pid]))
        if pid in EXTRA:
            problems = EXTRA[pid](ch)
            failures += 1 if problems else 0
            print("FORMULAS    %s  formulas and worked examples from published sources%s"
                  % ("ok" if not problems else "FAIL", "" if not problems else ": " + "; ".join(problems[:6])))

        # 4 - every mistake far outside the band, for every valid seed.
        min_ratio = {}
        bad = 0
        for p in valid:
            q = ch.solution.derived_params(p, consts)
            truth = ch.solution.solve(q, consts)
            for sid in ch.solution.STEP_IDS:
                width = tol_width(steps[sid].tolerance, truth[sid])
                fps = ch._mistakes.fingerprints(sid, q, consts, truth)
                for fid, val in fps.items():
                    if val is None:
                        continue
                    ratio = abs(val - truth[sid]) / width if width else 1e9
                    key = (sid, fid)
                    min_ratio[key] = min(min_ratio.get(key, 1e18), ratio)
                    if ratio < 3.0:
                        bad += 1
        failures += 1 if bad else 0
        print("SEPARATION  %s  %d (seed, mistake) pairs inside 3 tolerances"
              % ("ok" if not bad else "FAIL", bad))
        for (sid, fid), r in sorted(min_ratio.items()):
            print("              %-26s on %-14s nearest %.1f tolerances out"
                  % (fid, sid, r))

        # 5 - strings, both languages.
        s = ch._strings
        missing = []
        for fid in ch._mistakes.CATALOGUE:
            for lang in ("en", "fr"):
                if not (s.get("diagnosis", {}).get(fid, {}) or {}).get(lang):
                    missing.append("diagnosis.%s.%s" % (fid, lang))
        for sid in steps:
            for lang in ("en", "fr"):
                if not (s.get("step", {}).get(sid, {}) or {}).get(lang):
                    missing.append("step.%s.%s" % (sid, lang))
            if not any(k.startswith(sid + ".h") for k in s.get("hint", {})):
                missing.append("hint.%s.*" % sid)
        for k, v in s.get("hint", {}).items():
            for lang in ("en", "fr"):
                if not (v or {}).get(lang):
                    missing.append("hint.%s.%s" % (k, lang))
        failures += 1 if missing else 0
        print("STRINGS     %s  %s" % ("ok" if not missing else "FAIL",
                                       ", ".join(missing) or "EN + FR complete"))

    print("\n%s" % ("ALL CHECKS PASSED" if not failures else "%d CHECK(S) FAILED" % failures))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
