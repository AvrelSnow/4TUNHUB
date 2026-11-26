# The free route: how someone moves through the 4TUNHub Academy

> **Removed 2026-11-25.** Fortune did not like the route page; it was taken out before reaching production. Kept as a record.

Draft 1, 2026-11-24, written with `engineering-course-engine`. **On paper only:
no page, no code.** Avrel validates every decision below before anything is
built. Where something is an estimate or a guess, it says so.

Companion records: the taught CSWA course is designed in
`D:\teaching CAE\courses\cswa-4-weeks\` (this route does not repeat it, and
borrows its readiness bar). The working list of free resources is
`docs/free-resources.md`; the practice problems are `docs/practice-problems.md`.

## 0. Assumptions (change one, and the route must be re-checked)

1. **The learner** arrives at `4tunhub.com/academy` with no account: an
   engineering student or junior technician in Cameroon or francophone Africa,
   on a phone or a shared laptop, time-poor, often on a slow line.
2. **Free and self-paced.** No live coaching in this route. The taught offer is
   the cohort, which sits at the end, not inside.
3. **Real-only.** A stage lists only what exists today. What does not exist is
   marked *coming*, with no link, and never counted in a time total.
4. **No account on the Academy site.** Progress on the site lives on the
   learner's device. The Lab will have accounts; the Academy does not duplicate
   them.
5. **Language.** The route is in English here. The site shows it in French too;
   the lessons and videos themselves are in English, and the page says so.

## 1. What the route is for

**Two goals bring people here**, and they are different:

| | Track A: Simulation | Track B: SolidWorks and the CSWA |
|---|---|---|
| Who | people who found the channel and want to run an LS-DYNA model correctly | people who want the SOLIDWORKS CSWA certificate |
| End state | builds, runs and checks a simple explicit or quasi-static model, and can say whether the result is believable | models parts from a drawing and reports mass and centre of mass correctly, ready to practise the exam |
| Evidence | a hand check of the units, then reading results against it | the Lab's graded practice problems, answered correctly on a fresh seed |

**A shared foundation comes first for both**: Engineering Thinking. Its stance
("physics first, software second") is the channel's own, and a learner who can
turn a load into a force and check a stress is better at both tracks.

**What the free route does not promise.** It does not make anyone *ready to
book the CSWA*. The taught course's bar is 190/240 on a full 180-minute timed
mock, and no free timed mock exists. The free route's honest end state is
*ready to practise for the exam*, and the cohort is where the mock lives.

## 2. The map

```
                        ┌───────────────────────────────────────────┐
                        │  FOUNDATION · Engineering Thinking (open) │
                        │  cards 1 to 4: 11 lessons, 71 min         │
                        └───────────────┬───────────────────────────┘
                                        │ gate F: the cards' own checks
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
   TRACK A · SIMULATION                          TRACK B · SOLIDWORKS / CSWA
   A1 Set up        3 videos, 28 min             B1 Get the software (free student offer)
   A2 Ball-plate    8 videos, 82+ min            B2 The basics            ← the weak link
   ── gate A: P005 hand check (coming)           B3 Know the exam         (3 resources)
   A3 Bracket       2 videos, 15+ min            ── gate B: P001 to P003 (coming)
   (A4 Apply: does not exist)                    B4 Practise              (Lab, coming)
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        ▼
                        LEARN WITH SOMEONE CHECKING: the cohort
                        (no date named, by decision)

   Side branch, optional for both: TOLERANCES
   one French PDF (80 pp.), P004 limits and fits, P006 position at MMC (coming)
```

## 3. Competencies (what the learner can do, observably)

**Foundation** (from the path's own "you will be able to", open cards only):
- F1 Turn a hanging load into a force and a bending moment.
- F2 Check a stress against an allowable stress with a safety factor.
- F3 Choose a section and a plate thickness that can actually be bought.
- F4 Check a deflection (sag) against a limit, so "strong" is not mistaken for "stiff".

*Not yet testable here:* reading a dimensioned drawing and its datums, and
modelling the part and sending a STEP file. Those belong to card 5 and the
boss, which need the Lab's checker and are closed.

**Track A**
- A-1 Install LS-PrePost and get past the first crashes.
- A-2 Build the ball-plate model: mesh, boundary conditions, contact, material and parts, solver set-up.
- A-3 Read stress, displacement and energy, and judge whether the result is believable.
- A-4 Edit a keyword deck by hand without breaking it, and know which file to open.
- A-5 **Check the unit system by hand before pressing run** (P005).
- A-6 Apply a static load to an explicit solver by ramping it (the bracket).

**Track B**
- B-1 Get SOLIDWORKS running legally and free (the student offer).
- B-2 Sketch and extrude/revolve a part from a drawing, with the right origin.
- B-3 Report volume, mass and centre of mass for a part (P001, P002).
- B-4 Drive a dimension with a global variable or an equation, and rebuild (P003).
- B-5 Say what the exam asks and how it is structured.

## 4. The stages, and what each is made of today

Time is shown twice: **content time** is measured from the real material;
**working time** is the learner's time, an *estimate* (see §6).

| Stage | Made of (real, today) | Content time | Working time (est.) | Needs first |
|---|---|---|---|---|
| **F · Foundation** | Engineering Thinking cards 1 to 4 (open) | 71 min | about 1.5 h | school maths, a calculator |
| **A1 · Set up** | 3 episodes: install, troubleshooting, "LS-PrePost for beginners" | 28 min | about 1 h (install included) | F |
| **A2 · Ball-plate** | 8 episodes, mesh to keyword editing and file formats | 82 min + 1 episode with no length | about 3.5 h | A1 |
| **Gate A** | P005 "Before you press run": hand check in mm-tonne-second | n/a | about 30 min (est.) | A2 |
| **A3 · Bracket** | 2 episodes (ramped load; mesh, material, supports) | 15 min + 1 with no length | about 1.5 h | Gate A |
| **B1 · Get SOLIDWORKS** | the "Get SOLIDWORKS free" band on the Resources page | n/a | about 30 min (install) | none |
| **B2 · The basics** | SOLIDWORKS' own *Getting Started* tutorials: Introduction (1 h), Lesson 1 Parts (30 min), Lesson 2 Assemblies (45 min), Lesson 3 Drawings (15 min). Open page, no account, English only | 2 h 30 (SOLIDWORKS' own estimate) | about 3 h (est.) | B1 |
| **B3 · Know the exam** | the SWUG "Mastering CSWA" session; the official CSWA guide (French); SOLIDWORKS' own practice problems | not measured | about 2 h (est.) | B2 |
| **Gate B** | P001 to P003 on a fresh seed, with the walk-through as the "stuck?" rung | n/a | n/a | B3 |
| **B4 · Practise** | P001 to P003 in the Lab: **not live** | n/a | n/a | B3 |
| **Tolerances** | `eduscol` GPS PDF (80 pages, French); P004, P006 | PDF only | open-ended | F |
| **Cohort** | the CSWA cohort | n/a | n/a | gate B passed |

**Totals, honestly.** Track A today: about 8 h of working time (F 1.5, A1 1,
A2 3.5, gate 0.5, A3 1.5), a little more once two episodes have a length. At
3 h a week that is **about 3 weeks**. Track B today: B1 0.5 h + B2 about 3 h + B3 about 2 h = **about 5.5 h** before
the practice problems, which are not live yet (B4, gate B), so the track still
cannot be totalled to its end.

## 5. The gates (a stage is passed by doing, not by watching)

| Gate | Where | The evidence | Pass | If failed |
|---|---|---|---|---|
| **F** | end of Foundation | the cards' own checks, answered by the learner | all four cards' checks right; progress is kept on the device | the card's lessons say which step went wrong; repeat the card |
| **A** | A2 to A3 | P005 on a fresh seed: six numbers (modulus, density, wave speed, time step, ball energy, steps) | all six within tolerance, at most 3 attempts per step (the Lab's setting) | the Lab names the unit slip made (twelve are recognised); re-attempt on a new seed |
| **B** | B3 to cohort | P001, P002, P003 each correct on a fresh seed | all three, without opening the walk-through video first | the walk-through is the "stuck?" rung; re-attempt on a new seed |

Until the Lab opens, gates A and B are *coming*. The route says so rather than
substituting a quiz that tests recall.

## 6. How the time was estimated, and what would change it

- Content time is read from the library (`lsdyna.ts`) and the path data
  (`engineering-thinking.json`); two episodes have no length yet.
- **Working time = content time × 2 to 3 for follow-along videos** (the learner
  pauses, builds the model and breaks it), and about ×1.2 for the path's
  lessons, which are already interactive. **That multiplier is my assumption,
  not a measurement.** The first ten learners are the measurement.
- A schedule with dates is deliberately absent. The only honest unit is
  hours; dates would be invented, and the next cohort is not named in public.
  A rhythm such as "3 h a week" is a suggestion, not a promise.

## 7. What the learner sees (the dashboard, specified, not built)

| Shown | Source | Can the site know it? |
|---|---|---|
| Foundation: lessons done out of 11, minutes left, next lesson | the path's progress store, on the device | **yes, automatically** |
| Videos watched | nothing: a video player cannot report that it was understood | **only if the learner ticks it**; label it as their own mark |
| Gate A and B results | the Lab's grader, which needs an account | **no**: the Academy does not hold Lab results |
| Stages not yet built | none | shown greyed, with "coming", no link, no time counted |

Consequences: the first dashboard is honest but thin. It shows the route, the
Foundation progress, and the learner's own ticks. The richer one (gate results,
time spent) belongs to the Lab, where accounts exist. It appears only after the
first lesson is done; before that the visitor sees the route itself.

## 8. Design review (what attacking the first draft found, and what changed)

1. **The path was counted wrong.** The first reading was 13 lessons, 83 minutes.
   Card 5, the warm-up beam and the wall bracket are *closed* (they need the
   Lab's checker). Open: 11 lessons, 71 minutes. Corrected throughout.
2. **Track B had a hole at the bottom.** The free route had nothing structured
   to teach SOLIDWORKS basics: MySolidWorks, Hawk Ridge and the French playlists
   were removed from the list on purpose. The taught course makes basics a
   mandatory Week 0 plus an entry diagnostic for this reason. **Repaired
   2026-11-24 (Avrel chose option a):** B2 now links SOLIDWORKS' own Getting
   Started tutorials, read that day (open, no account; four lessons, 2 h 30).
   They also ship in the software (`swtutorial.chm` is in the 2023 install on
   this machine). *Still open:* they are English only; the page is the 2024
   edition (the 2026 address does not exist); they teach the interface, parts,
   assemblies and drawings but not mass properties or the exam, which is what
   B3 and the practice problems are for; and there is no entry check like the
   cohort's diagnostic, so a learner can enter B3 without having done B2.
3. **The dashboard cannot be what was imagined.** Only the path's progress can
   be tracked by the site; videos and Lab results cannot. §7 now says so.
4. **Not every practice problem belongs on the CSWA path.** P005 is a
   simulation problem; P004 and P006 are drawing and tolerance arithmetic that
   the CSWA does not test heavily. They are placed on Track A and the Tolerances
   branch, not forced into Track B.
5. **Video time is not learning time.** Using content time as the schedule would
   have undersold the route by half or more. Working time is now shown, with its
   assumption.
6. **Track A has no "apply" stage.** After the bracket, a learner has watched and
   followed but never built a model on their own. No free problem of that kind
   exists. It is shown as missing (A4), not hidden.
7. **Over-claiming.** "Ready for the CSWA" would be false: the readiness bar needs
   a timed mock. The end state was rewritten to "ready to practise".
8. **A dependency was guessed.** Whether Engineering Thinking's first two lessons
   ("kilogram", "units") cover mass and units as CSWA answers need them has not
   been read; they are suggested for Track B, to be confirmed.

## 9. Decisions for Avrel

1. ~~**Track B's missing basics (finding 2).**~~ **Decided 2026-11-24: (a), link
   SOLIDWORKS' own tutorials.** Done on the Free places page. Option (b), our own
   short "first part" lesson in the Engineering Thinking format, stays open for
   later, aimed at what the tutorials do not teach (mass properties, an origin
   that changes the answer).
2. **Order inside Track A.** I placed P005 between ball-plate and bracket,
   because the bracket is where units and the ramped load bite. Is that where you
   would put "before you press run"?
3. **Is "A4 Apply" worth building?** A Lab challenge where the learner builds a
   small model alone, graded on a result number, would close the track.
4. **Does the wall bracket in Engineering Thinking's boss match the channel's
   bracket series?** If so, the two tracks meet at the same part, and that is
   worth saying on the route.
5. **Names.** "Track A / Track B" are working labels; the public names are for
   you to choose, in both languages.

## 10. What happens next

**Built 2026-11-24:** the Route page at `/academy/route` (English and French),
from this document, with the order of §4 and the dashboard of §7. Its data is
`src/lib/route.ts`, built from the path's open lessons, the library's episodes
and the Free places list, so it cannot drift: a removed resource fails the
build. The learner's ticks are kept on the device (`4tun.route`, listed in the
privacy note). Decisions 2 to 5 of §9 were not answered, so the page uses my
defaults: P005 between ball-plate and bracket, no "Apply" stage shown, no
claim about the wall bracket, and plain public names ("Track A / Track B" with
what each is about).

**Still to do:**

1. Avrel answers §9 decisions 2 to 5; the page changes to match.
2. The delivery log starts with the first learners: real working times replace
   §6's multiplier, and any gate most learners fail is a finding about the
   route, not only about them.
3. The Lab's practice problems, when live, turn the "coming" items into links.

**Original plan, for the record:** validate §9, then build the page from this
document.

## Sources

Real data read on 2026-11-24: `src/content/engineering-thinking.json` (cards,
minutes, open/closed), `src/lib/lsdyna.ts` (episodes and lengths),
`src/lib/free-resources.ts`, `docs/practice-problems.md`,
`docs/practice-problems/p005-solver-preflight/challenge.yaml` (attempts, steps),
and the existing CSWA course record (`cswa-4-weeks`: readiness bar and
points economy). Not opened today: SOLIDWORKS' built-in tutorials, the official
sample exam, video speech, and the Engineering Thinking lesson text.
