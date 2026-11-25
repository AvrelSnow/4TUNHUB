import type { Logic } from "./engine";
import { bracket } from "./challenges/bracket";
import { drivenPlate, steppedBlock, steppedShaft } from "./challenges/parts";
import { limitsAndFits, positionAtMmc, solverPreflight } from "./challenges/drawing-office";

/** Challenge id → its formulas. Keys match src/content/practice.json. */
export const LOGIC: Record<string, Logic> = {
  "001-bracket": bracket,
  "p001-stepped-block": steppedBlock,
  "p002-stepped-shaft": steppedShaft,
  "p003-driven-plate": drivenPlate,
  "p004-limits-and-fits": limitsAndFits,
  "p005-solver-preflight": solverPreflight,
  "p006-position-at-mmc": positionAtMmc,
};
