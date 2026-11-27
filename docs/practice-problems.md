# The 4TUNHub practice-problem database: format and three pilots

Status 2026-11-23: **format specified, six pilot problems drafted and
verified by code.** P001-P003 (CSWA mass-property topics) were checked against
SOLIDWORKS itself on 2026-11-23 (see "Golden seeds, checked in SOLIDWORKS" below). **P004 (limits and fits) needs none**:
it has no CAD in it, and is verified against published ISO 286 tables and the
ISO 286-1 formulas (below). **P005 (the hand check before you press run) and P006
(position at MMC) need none either**: they are arithmetic, checked by a second
method and by published worked examples. None is in the Lab repo yet; nothing is published.
Files are in `docs/practice-problems/`.

## What a practice problem is

A **mini challenge in the Lab's own format**. The Lab (`C:\4TUNHUBLAB.COM`)
already has what we need: a seeded challenge whose numbers differ per
student, an answer chain graded within a tolerance band, a library of
predicted mistakes ("fingerprints") that produce a diagnosis, and a hint
ladder that never gives the answer. The Lab's own second-challenge test
fixture (`002-shaft`, five files) is the template. A practice problem is
the same five files:

| File | What it holds |
|---|---|
| `challenge.yaml` | Data only: id, version, constants, seeded parameters, the graded steps with their tolerance, attempts. |
| `solution.py` | The answer chain as pure functions, no imports. |
| `fingerprints.py` | The predicted mistakes, as formulas of the student's own numbers. |
| `strings.yaml` | EN + FR: each step's title, each mistake's diagnosis, a hint ladder per step. |
| `brief.en.md`, `brief.fr.md` | What the student is asked to model, with their own numbers filled in. |

**Why seeded numbers matter for CSWA practice.** Every learner gets
different dimensions, so an answer cannot be copied from a friend or a
forum, and the answer is a number SOLIDWORKS itself shows (volume, mass,
centre of mass). The learner models the part, reads the mass properties and
types the numbers. The grader checks them and, on a known slip, says which
operation went wrong.

## Where it lives, and a consequence

- **Authored and graded in the Lab** (`lab.4tunhub.com`), because personal
  numbers need a seed and a grader on a server, and an account to remember
  the run.
- **The Academy links to it.** The Academy's Engineering Thinking path is a
  static export that compares a typed number to a band in the browser. That
  works for one fixed problem; it cannot work for seeded ones, because the
  answer would have to ship to the browser. So the Academy gets a page that
  explains the set and opens the Lab, not a copy of the grader.

## The rules (these are what keep it trustworthy)

1. **Original problems only.** We read how SOLIDWORKS structures its public
   practice problems, and write our own. Theirs are theirs. The real CSWA exam
   is covered by SOLIDWORKS' certification agreement: we model topics from the
   public outline (sketching, basic features, mass properties, assemblies,
   reference geometry), never reproduce exam questions.
2. **Every answer is checked two ways.** By code, by a method different from
   the formula (see `verify.py`), and by SOLIDWORKS, by Avrel, on a fixed
   "golden" seed (table below). A wrong key does more harm than no database.
3. **Every predicted mistake must sit at least 3 tolerances from the truth,
   for every seed.** Otherwise a correct answer could be diagnosed as a
   mistake, or the reverse. `verify.py` asserts it over the whole seed space.
   It already caught two flaws in the first draft: a 0.3% band that was too
   wide (now 0.1%), and a shaft shape where "half the length" was the correct
   answer (now excluded by `validate`).
4. **Diagnoses name an operation, never a misconception.** "Your volume still
   contains the hole" is checkable; "you don't understand subtraction" is a
   guess (the Lab's Contract 5).
5. **No answer in the hints.** Three rungs at most, each narrower than the
   last; the last still does not state the number.
6. **Drawings, not part files.** Students get dimensions and a feature order,
   not a `.sldprt`: part files are tied to one SOLIDWORKS version, and handing
   over the model removes the exercise.
7. **Tolerance policy.** Volume and mass 0.1% (SOLIDWORKS shows many digits, so
   a careful learner is far inside it; a hand calculation with pi = 3.1 is not,
   deliberately). Centre of mass 1%. A discrete choice is exact.

## The three pilots

| ID | Topic | Steps | Mistakes it recognises |
|---|---|---|---|
| `p001-stepped-block` | Extrude, cut, mass properties | volume, mass, height of the centre of mass | hole ignored; boss left out; hole stops at the base; diameter used as radius; mass in kg; density not converted; mid-height as centre of mass |
| `p002-stepped-shaft` | Revolve, mass properties | volume, mass, centre of mass along the axis | bore ignored; diameter as radius; mass in kg; density not converted; half the length as centre of mass |
| `p003-driven-plate` | Global variables and equations, design intent | plate length, mass as drawn, mass after changing n | n gaps for n holes; end insets forgotten; holes added but length not updated; length updated but holes not added |

| `p004-limits-and-fits` | ISO 286 limits and fits, hole basis (the arithmetic half of GD&T) | hole upper limit, shaft upper and lower limits, maximum and minimum clearance, kind of fit | no tolerance on the hole; hole graded as a shaft; shaft deviation sign; hole's width used for the shaft; limits not crossed; maximum given as minimum; transition judged from the minimum alone |

| `p005-solver-preflight` | The hand check before an explicit LS-DYNA run, in mm - tonne - second | modulus in MPa, density in tonne/mm3, stress-wave speed, stable time step, ball's impact energy, number of steps | twelve unit slips: GPa left as is, pascals, density unconverted or in tonne/m3, speed in mm/s, mixed units, step in ms, energy in J, missing half, diameter as radius, ms divided by microseconds |

| `p006-position-at-mmc` | Position tolerance at MMC for a hole: the geometric half of GD&T that is pure arithmetic | MMC size, virtual condition, bonus, allowed position zone, position error, verdict (accept, reject for position, reject for size) | MMC taken as the largest size; the pin formula for a hole; bonus measured the wrong way or as the whole size range; zone without bonus; offset as a radius or added as a sum; verdict without the bonus or without checking size first |

Seed space: 3,645, 4,134, 3,888, 539, 768 and 17,195 valid seeds. (P004 first had
63: it now takes any whole size from 4 to 80 mm, edges included, on the same
verified deviation rows, and the verifier checks sizes on every range edge.)

### P004, what makes it independent of SOLIDWORKS

- Every deviation (8 classes x 6 size ranges) was read from two independent
  published ISO 286-2 tables that agree on every entry, then **rebuilt from the
  ISO 286-1 formulas** (`i = 0.45 D^(1/3) + 0.001 D`, IT6 = 10i, IT7 = 16i,
  `es(g) = -2.5 D^0.34`, `es(f) = -5.5 D^0.41`, `ei(k) = 0.6 D^(1/3)`,
  `ei(m) = IT7 - IT6`, `ei(n) = 5 D^0.34`, `ei(p) = IT7 + 0..5`) within the
  table's own rounding of 1 micrometre.
- Five worked examples from a third source (25 H7/g6, 10 H7/g6, and the type
  of H7/p6, H7/k6, H7/h6 at 25 mm) come out exactly.
- Sizes on a range edge (6, 10, 18, 30, 50, 80 mm) belong to the range below
  ("up to and including"); the verifier asserts the limits at each edge.
- Answers are in millimetres to three decimals: the Lab's unit table has no
  micrometre unit, and a half-micrometre band matches the tables' precision.
- The brief carries the table, so a learner needs no outside document.
- A mistake that coincides with the truth for some fits (a sign slip on a
  shaft whose upper deviation is zero) returns "no diagnosis" instead of a
  wrong one.
- Not yet covered: the geometric half of GD&T (feature control frames, datum
  reading). That is not pure arithmetic and needs a design decision first.

## Verified so far (by code, `python docs/practice-problems/verify.py --lab C:\4TUNHUBLAB.COM`)

- The Lab's loader accepts all three folders.
- Every answer matches a numerical integration over thin slices (a different
  method from the formula): worst disagreement 1e-13, 3e-13 and 7e-7.
- Every predicted mistake lies at least 3.6 tolerances away on every valid seed
  (the closest is "hole stops at the base").
- Every step, mistake and hint has English and French text.
- End to end through the Lab's own CLI: a brief renders with the student's
  numbers (EN and FR); a correct volume and centre of mass pass; a mass given
  in kg is diagnosed ("check the unit your mass is in…"), two attempts left,
  no answer revealed. For P004: a 65 mm H7/p6 run accepted a negative
  (interference) clearance, and diagnosed a sign slip on the shaft limit and a
  maximum clearance given as the minimum.

## Golden seeds, checked in SOLIDWORKS (2026-11-23)

Rebuilt in **SOLIDWORKS 2023 SP2.1** through its API (`sw_golden.py`, re-runnable)
and read with SOLIDWORKS's own mass-property engine. **8 of 8 comparisons match.**

| Problem | Numbers | Key | SOLIDWORKS |
|---|---|---|---|
| P001 | block 90 x 70 x 20, boss diameter 40 x 10, hole diameter 10 through both, origin on the bottom face | volume 136 210.176 mm3; centre of mass height 11.297 mm | 136 210.176 mm3; 11.297 mm |
| P002 | d1 25 x 50, d2 45 x 40, d3 30 x 40, bore 10, origin on the left end face | volume 106 225.102 mm3; centre of mass 70.730 mm from the left end | 106 225.102 mm3; 70.730 mm |
| P003, n = 5 | e 20, s 25, W 60, t 8, d 10 | length 140.00 mm; volume 64 058.407 mm3 (mass at 7850: 502.858 g) | 140 mm; 64 058.407 mm3 |
| P003, n = 7 | the same, n changed by 2 | length 190.00 mm; volume 86 801.770 mm3 (mass at 7850: 681.394 g) | 190 mm; 86 801.770 mm3 |

What this does and does not show:

- It confirms the geometry the keys rest on: volumes and centres of mass are
  SOLIDWORKS's own numbers, to the printed precision.
- A first run of P002 disagreed (97 585.7 mm3). The cause was SOLIDWORKS's sketch
  snapping moving one vertex of the profile from diameter 30 to 25 (the missing
  volume was exactly the difference), not the key. With snapping off it matches.
  Worth knowing for learners: a CSWA sketch is only as good as its constraints.
- SOLIDWORKS's own **mass** was not read with a steel density: the material
  assignment did not take effect through the API, so SOLIDWORKS reported its
  default. Mass is therefore volume x density by arithmetic here, not a
  SOLIDWORKS output.
- P003's plate for n = 7 was built directly; the equation-driven rebuild
  (`L = 2e + (n-1)s`, changing n in the Global Variables) was not exercised.
  The geometry it must produce is what was verified. Worth one manual try.

## Next

1. ~~Avrel models the three golden seeds~~ Done by API on 2026-11-23: see above.
2. ~~Dimensioned drawing per seed~~ Done for P001-P003 (2026-11-24): `drawing.svg` +
   `drawing.fr.svg` templates beside each brief, filled with the student's numbers by
   the Lab's own renderer (valid XML, name escaped, EN + FR). Schematic, not to scale;
   P003's drawing does not dimension the length because that is the answer. P004-P006
   are arithmetic and need none.
3. Copy the ready folders into the Lab's `challenges/` on a branch (done by
   `docs/practice-problems/install_into_lab.py`, tested on a scratch copy: it
   copies only P004-P006, refuses to overwrite, runs the Lab's suite and no git
   command), then publish the set at the Lab.
4. An Academy page that presents the set and opens the Lab.
5. The "stuck? watch the walk-through" rung, once the video is watched and
   timestamped; our own solution videos later.
6. Grow from 3 to 10 only after a few learners have used the three.

## Open questions for Avrel

- Which learners get the first run: the next cohort, or the open Lab?
- Is a free Lab account required, or can the first problems be tried signed out?
- Should the problems use a fixed material list (steel, aluminium) with real
  names and densities, as the CSWA does, or a bare density as drafted?


### P005, in brief

LS-DYNA has no units; the engineer owns the unit system. P005 is the check done
by hand before the run, on the numbers the deck will hold, in the system
mm - tonne - second (N, MPa, N.mm). It follows Episode 13's lesson ("E = 72
instead of 72e9 makes aluminium a billion times too soft") and does not depend
on any one model: a ball of a seeded metal (steel, aluminium at 72 GPa as in
the bracket series, titanium, copper), a seeded radius, speed, element size and
end time.

- **Independent check:** every answer is recomputed in plain SI (pascals, kg,
  metres, seconds) by a separate function in `verify.py`; the two agree to
  4e-16 on every sampled seed. Because the check lives in a different unit
  system, it catches exactly the slip the problem teaches.
- **Mistakes:** twelve, all factors of 2, 8, 1000 or a power of ten, so at least
  499 tolerances from the truth for every seed.
- **Engine notes:** scientific notation (8.9e-9) is accepted by the Lab's number
  reader; there is no time or speed unit, so those answers are plain numbers
  labelled in the brief.
- **Why not the ball-plate deck itself:** see the finding below.

### A finding about the published ball-plate deck (not changed)

`public/library/ls-dyna/ball-plate-impact.k`, read as plain text:

- Plate: shell, steel values (7850 kg/m3, E = 2.09e11 Pa, yield 5e8), thickness
  0.005. Nodes span x and y from -10 to 10 at z = 0.
- Ball: solid, density 2850, E = 7.2e10 Pa: **aluminium-like values**, while the
  series page says "a steel ball". Radius about 3.9, centre at z = 5. Initial
  velocity -10 in z. Termination 10.0.
- The material cards are in SI (Pa, kg/m3). If lengths are metres, the plate is
  20 m wide with a 5 mm thickness and a ball 7.8 m across. If lengths are
  millimetres, the cards are not consistent with them. Either the model is a
  deliberate demonstration or a unit mismatch: it needs Avrel's answer before a
  graded hand check is built on it.


### The Lab's own test suite, with the five problems added

On a scratch copy of the Lab (the real repo was not touched): **716 tests, 36
skipped, 1 failure, before and after adding the five problems.** The one failure,
`test_034_doctor ... test_healthy` (a deployment-gate check that expects every
level to be PASS and gets WARN), fails identically on the untouched Lab, so it
is pre-existing and unrelated to challenges. Honest scope of this result: the
suite proves the engine still works with the new folders present; it does not
exercise the new problems, which only the Lab's loader and `verify.py` do.
Run the suite again, on the real repo, after the folders are copied in.


### P006, position at MMC

Definitions confirmed in two independent published sources (a calibration
laboratory's explainer using ASME Y14.5 numbers, and a GD&T engineering article
quoting the same rules): a hole's MMC is its **smallest** size; its virtual
condition is **MMC minus the position tolerance** (the gauge pin diameter);
the bonus is **actual size minus MMC**; the allowed zone is tolerance plus
bonus; the position error is the **diameter** of the circle around the true
position that holds the axis, `2 * sqrt(dx^2 + dy^2)`. ISO 2692 states the same
idea as the "maximum material requirement".

- **Independent check:** the verdict and the allowed zone are rebuilt by
  GEOMETRY, as a functional gauge: a pin of the virtual-condition diameter at the
  true position must fit in the actual hole, whose axis is offset. That is not
  the tolerance formula; it agrees on every sampled seed (to a nanometre, the
  rounding of the answers).
- **Worked examples from the sources, exact:** hole 0.250 +0.005/-0.000 with a
  position of 0.010 at MMC gives a virtual condition of 0.240 and an allowed zone
  of 0.012 at 0.252 and 0.015 at 0.255; a hole measured 0.253 with a position of
  0.012 conforms (allowed 0.013); a hole 8.00 to 8.20 produced at 8.12 earns a
  bonus of 0.12. Oversize and undersize holes are rejected for size.
- **Seeds:** sizes and offsets are whole micrometres inside the engine. A seed is
  kept only if the position error clears the allowed zone by 10 micrometres
  either way when the size is in limits, so no verdict turns on a rounding.
- **End to end through the Lab's grader:** a 12 to 12.3 mm hole, 0.2 at MMC,
  measured 12.3 with offsets 0.05 and 0.05: a pin-formula virtual condition, a
  zone without bonus and a radius-as-diameter error were each diagnosed, and the
  right MMC, bonus and verdict passed.
- **Scope:** feature control frames as pictures, datum reference frames and
  form tolerances are not covered; they need drawings, which the Lab's
  drawing generator can supply later.

The Lab's own suite, re-run with all six problems present on the scratch copy:
716 tests, 36 skipped, the same single pre-existing failure.
