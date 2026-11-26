// P001 stepped block, P002 stepped shaft, P003 driven plate: the Lab's
// solution.py and fingerprints.py for each, in millimetres and grams.
import type { Constants, Logic, Params } from "../engine";

type C = { pi: number; kg_m3_to_g_mm3: number };
const num = (p: Params) => p as Record<string, number>;
const cons = (c: Constants) => c as C;

// ---------------------------------------------------------------- P001 --

function blockPieces(p: Record<string, number>, c: C) {
  const base = p.L * p.W * p.H;
  const boss = (c.pi / 4) * p.Db ** 2 * p.hb;
  const hole = (c.pi / 4) * p.dh ** 2 * (p.H + p.hb);
  return { base, boss, hole };
}

export const steppedBlock: Logic = {
  validate: (params) => {
    const p = num(params);
    return p.Db <= p.W - 10 && p.dh <= p.Db - 16;
  },
  solveStep(step, params, constants, prior) {
    const p = num(params);
    const c = cons(constants);
    const { base, boss, hole } = blockPieces(p, c);
    if (step === "volume") return base + boss - hole;
    if (step === "mass") return prior.volume! * p.rho * c.kg_m3_to_g_mm3;
    if (step === "com_height") {
      const moment = (base * p.H) / 2 + boss * (p.H + p.hb / 2) - (hole * (p.H + p.hb)) / 2;
      return moment / (base + boss - hole);
    }
    throw new Error(`unknown step: ${step}`);
  },
  fingerprintIds: {
    volume: ["FP_HOLE_IGNORED", "FP_BOSS_IGNORED", "FP_HOLE_STOPS_AT_BASE", "FP_DIAMETER_AS_RADIUS"],
    mass: ["FP_MASS_IN_KG", "FP_DENSITY_NOT_CONVERTED"],
    com_height: ["FP_COM_AT_MIDHEIGHT"],
  },
  fingerprints(step, params, constants, prior) {
    const p = num(params);
    const c = cons(constants);
    if (step === "volume") {
      const { boss, hole } = blockPieces(p, c);
      return {
        FP_HOLE_IGNORED: prior.volume! + hole,
        FP_BOSS_IGNORED: prior.volume! - boss,
        FP_HOLE_STOPS_AT_BASE: prior.volume! + (c.pi / 4) * p.dh ** 2 * p.hb,
        FP_DIAMETER_AS_RADIUS:
          p.L * p.W * p.H + c.pi * p.Db ** 2 * p.hb - c.pi * p.dh ** 2 * (p.H + p.hb),
      };
    }
    if (step === "mass") {
      return { FP_MASS_IN_KG: prior.mass! / 1000, FP_DENSITY_NOT_CONVERTED: prior.mass! * 1000 };
    }
    return { FP_COM_AT_MIDHEIGHT: (p.H + p.hb) / 2 };
  },
};

// ---------------------------------------------------------------- P002 --

function shaft(p: Record<string, number>, c: C) {
  const k = c.pi / 4;
  const b2 = p.bore ** 2;
  const volumes = [
    k * (p.d1 ** 2 - b2) * p.l1,
    k * (p.d2 ** 2 - b2) * p.l2,
    k * (p.d3 ** 2 - b2) * p.l3,
  ];
  const middles = [p.l1 / 2, p.l1 + p.l2 / 2, p.l1 + p.l2 + p.l3 / 2];
  const total = volumes[0] + volumes[1] + volumes[2];
  const centre =
    (volumes[0] * middles[0] + volumes[1] * middles[1] + volumes[2] * middles[2]) / total;
  return { total, centre };
}

export const steppedShaft: Logic = {
  validate(params, constants) {
    const p = num(params);
    if (!(p.d2 > p.d1 + 10 && p.d2 > p.d3 + 5)) return false;
    const xc = shaft(p, cons(constants)).centre;
    const half = (p.l1 + p.l2 + p.l3) / 2;
    return Math.abs(xc - half) / xc >= 0.04;
  },
  solveStep(step, params, constants, prior) {
    const p = num(params);
    const c = cons(constants);
    if (step === "volume") return shaft(p, c).total;
    if (step === "mass") return prior.volume! * p.rho * c.kg_m3_to_g_mm3;
    if (step === "com_x") return shaft(p, c).centre;
    throw new Error(`unknown step: ${step}`);
  },
  fingerprintIds: {
    volume: ["FP_BORE_IGNORED", "FP_DIAMETER_AS_RADIUS"],
    mass: ["FP_MASS_IN_KG", "FP_DENSITY_NOT_CONVERTED"],
    com_x: ["FP_COM_AT_HALF_LENGTH"],
  },
  fingerprints(step, params, constants, prior) {
    const p = num(params);
    const c = cons(constants);
    const length = p.l1 + p.l2 + p.l3;
    if (step === "volume") {
      return {
        FP_BORE_IGNORED: prior.volume! + (c.pi / 4) * p.bore ** 2 * length,
        FP_DIAMETER_AS_RADIUS:
          c.pi *
          ((p.d1 ** 2 - p.bore ** 2) * p.l1 +
            (p.d2 ** 2 - p.bore ** 2) * p.l2 +
            (p.d3 ** 2 - p.bore ** 2) * p.l3),
      };
    }
    if (step === "mass") {
      return { FP_MASS_IN_KG: prior.mass! / 1000, FP_DENSITY_NOT_CONVERTED: prior.mass! * 1000 };
    }
    return { FP_COM_AT_HALF_LENGTH: length / 2 };
  },
};

// ---------------------------------------------------------------- P003 --

const plateLength = (p: Record<string, number>, n: number) => 2 * p.e + (n - 1) * p.s;
const plateMass = (p: Record<string, number>, c: C, n: number, length: number) =>
  (length * p.W * p.t - n * (c.pi / 4) * p.d ** 2 * p.t) * p.rho * c.kg_m3_to_g_mm3;

export const drivenPlate: Logic = {
  validate: (params) => {
    const p = num(params);
    return p.s >= p.d + 10 && p.e >= p.d && p.d <= p.W - 30;
  },
  solveStep(step, params, constants, prior) {
    const p = num(params);
    const c = cons(constants);
    if (step === "plate_length") return plateLength(p, p.n);
    if (step === "mass_original") return plateMass(p, c, p.n, prior.plate_length!);
    if (step === "mass_changed") return plateMass(p, c, p.n + p.dn, plateLength(p, p.n + p.dn));
    throw new Error(`unknown step: ${step}`);
  },
  fingerprintIds: {
    plate_length: ["FP_N_TIMES_S", "FP_NO_END_INSET"],
    mass_original: [],
    mass_changed: ["FP_LENGTH_NOT_UPDATED", "FP_HOLES_NOT_ADDED"],
  },
  fingerprints(step, params, constants) {
    const p = num(params);
    const c = cons(constants);
    if (step === "plate_length") {
      return { FP_N_TIMES_S: 2 * p.e + p.n * p.s, FP_NO_END_INSET: (p.n - 1) * p.s };
    }
    if (step === "mass_changed") {
      const more = p.n + p.dn;
      return {
        FP_LENGTH_NOT_UPDATED: plateMass(p, c, more, plateLength(p, p.n)),
        FP_HOLES_NOT_ADDED: plateMass(p, c, p.n, plateLength(p, more)),
      };
    }
    return {};
  },
};
