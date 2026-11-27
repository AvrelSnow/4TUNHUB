# Practice problems for the 4TUNHub Lab

Six mini challenges in the Lab's own format (five files each: `challenge.yaml`,
`solution.py`, `fingerprints.py`, `strings.yaml`, `brief.en.md` / `brief.fr.md`).
The design, the rules and the evidence are in [../practice-problems.md](../practice-problems.md).

| Folder | Topic | Ready for students? |
|---|---|---|
| `p001-stepped-block` | extrude + cut, mass properties | Ready (golden seed rebuilt in SOLIDWORKS: volume and centre of mass match) |
| `p002-stepped-shaft` | revolve, mass properties | Ready (same) |
| `p003-driven-plate` | equations and design intent | Ready (both plates rebuilt in SOLIDWORKS) |
| `p004-limits-and-fits` | ISO 286 limits and fits | Ready (two published tables, formulas, worked examples) |
| `p005-solver-preflight` | the unit hand check before an LS-DYNA run | Ready (recomputed in plain SI) |
| `p006-position-at-mmc` | position tolerance at MMC | Ready (functional-gauge geometry, two sources' examples) |

## Check them

```bash
python docs/practice-problems/verify.py --lab C:\4TUNHUBLAB.COM
```

Loads each problem with the Lab's own loader, rebuilds every answer by a second
method, runs every seed against every predicted mistake (each must be 3
tolerances or more from the truth) and checks the English and French text.

## Check the answer keys against SOLIDWORKS itself

```bash
python docs/practice-problems/sw_golden.py
```

Needs SOLIDWORKS and pywin32. Builds the P001, P002 and P003 golden seeds through
the SOLIDWORKS API and compares the real volume and centre of mass with the keys.
Last run 2026-11-23, SOLIDWORKS 2023 SP2.1: 8 of 8 comparisons match.

## Put them in the Lab

On a branch of the Lab you created yourself:

```bash
python docs/practice-problems/install_into_lab.py --lab C:\4TUNHUBLAB.COM --dry-run
python docs/practice-problems/install_into_lab.py --lab C:\4TUNHUBLAB.COM
```

Copies the ready problems (all six), never overwrites, runs the Lab's test suite, and
runs no git command. A clean Lab already has one unrelated failure
(`test_034_doctor ... test_healthy`).
