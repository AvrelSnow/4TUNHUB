// P004 limits and fits, P005 the solver hand check, P006 position at MMC:
// the Lab's solution.py and fingerprints.py for each.
import type { Constants, Logic, Params } from "../engine";

const round6 = (x: number) => Math.round(x * 1e6) / 1e6;

// ---------------------------------------------------------------- P004 --

type FitC = {
  um_to_mm: number;
  ranges: [number, number][];
  deviations: Record<string, [number, number][]>;
};

function deviations(params: Params, c: FitC) {
  const D = params.D as number;
  const [hole, shaftClass] = (params.fit as string).split("/");
  const i = c.ranges.findIndex(([over, upto]) => over < D && D <= upto);
  const H = c.deviations[hole]?.[i];
  const S = c.deviations[shaftClass]?.[i];
  if (!H || !S) return null;
  return { D, ES: H[0], EI: H[1], es: S[0], ei: S[1], h6: c.deviations.h6[i][1] };
}

export const limitsAndFits: Logic = {
  validate: (params, constants) => deviations(params, constants as FitC) !== null,
  solveStep(step, params, constants, prior) {
    const c = constants as FitC;
    const { D, ES, EI, es, ei } = deviations(params, c)!;
    const k = c.um_to_mm;
    switch (step) {
      case "hole_max":
        return round6(D + ES * k);
      case "shaft_max":
        return round6(D + es * k);
      case "shaft_min":
        return round6(D + ei * k);
      case "max_clearance":
        return round6((ES - ei) * k);
      case "min_clearance":
        return round6((EI - es) * k);
      case "fit_type":
        if (prior.min_clearance! >= 0) return 1;
        return prior.max_clearance! <= 0 ? 3 : 2;
      default:
        throw new Error(`unknown step: ${step}`);
    }
  },
  fingerprintIds: {
    hole_max: ["FP_HOLE_WITHOUT_TOLERANCE", "FP_HOLE_WITH_SHAFT_GRADE"],
    shaft_max: ["FP_SHAFT_DEVIATION_SIGN"],
    shaft_min: ["FP_SHAFT_WITH_HOLE_GRADE"],
    max_clearance: ["FP_LIMITS_NOT_CROSSED"],
    min_clearance: ["FP_MAX_GIVEN_AS_MIN"],
    fit_type: ["FP_TRANSITION_MISSED"],
  },
  fingerprints(step, params, constants, prior) {
    const c = constants as FitC;
    const k = c.um_to_mm;
    const { D, ES, EI, es, h6 } = deviations(params, c)!;
    // A mistake that lands on the truth gets no diagnosis.
    const far = (x: number, truth: number) => (Math.abs(x - truth) >= 0.0015 ? x : null);
    const at = (id: string) => prior[id] as number;
    switch (step) {
      case "hole_max":
        return {
          FP_HOLE_WITHOUT_TOLERANCE: far(D, at(step)),
          FP_HOLE_WITH_SHAFT_GRADE: far(round6(D - h6 * k), at(step)),
        };
      case "shaft_max":
        return { FP_SHAFT_DEVIATION_SIGN: far(round6(D - es * k), at(step)) };
      case "shaft_min":
        return { FP_SHAFT_WITH_HOLE_GRADE: far(round6(D + (es - (ES - EI)) * k), at(step)) };
      case "max_clearance":
        return { FP_LIMITS_NOT_CROSSED: far(round6((ES - es) * k), at(step)) };
      case "min_clearance":
        return { FP_MAX_GIVEN_AS_MIN: far(at("max_clearance"), at(step)) };
      case "fit_type": {
        const guess = at("min_clearance") >= 0 ? 1 : 3;
        return { FP_TRANSITION_MISSED: guess !== at("fit_type") ? guess : null };
      }
      default:
        throw new Error(`unknown step: ${step}`);
    }
  },
};

// ---------------------------------------------------------------- P005 --

type SolverC = { pi: number; materials: Record<string, [number, number]> };

const material = (params: Params, c: SolverC) => {
  const [E, rho] = c.materials[params.mat as string];
  return { E, rho };
};

export const solverPreflight: Logic = {
  validate: (params, constants) => (params.mat as string) in (constants as SolverC).materials,
  derive: (params, constants) => {
    const { E, rho } = material(params, constants as SolverC);
    return { ...params, E_GPa: E, rho_kgm3: rho };
  },
  solveStep(step, params, constants, prior) {
    const c = constants as SolverC;
    const p = params as Record<string, number>;
    const { E, rho } = material(params, c);
    const at = (id: string) => prior[id] as number;
    switch (step) {
      case "E_mpa":
        return E * 1000;
      case "rho_tmm3":
        return rho * 1e-12;
      case "wave_speed":
        return (at("E_mpa") / at("rho_tmm3")) ** 0.5 / 1000;
      case "time_step_us":
        return (p.L / (at("wave_speed") * 1000)) * 1e6;
      case "ball_energy": {
        const mass = ((at("rho_tmm3") * 4) / 3) * c.pi * p.r ** 3;
        return 0.5 * mass * (p.v * 1000) ** 2;
      }
      case "n_steps":
        return (p.t_end * 1000) / at("time_step_us");
      default:
        throw new Error(`unknown step: ${step}`);
    }
  },
  fingerprintIds: {
    E_mpa: ["FP_E_NOT_CONVERTED", "FP_E_IN_PA"],
    rho_tmm3: ["FP_RHO_NOT_CONVERTED", "FP_RHO_TONNE_PER_M3"],
    wave_speed: ["FP_SPEED_IN_MM_S", "FP_SPEED_MIXED_UNITS"],
    time_step_us: ["FP_STEP_IN_MS", "FP_STEP_LENGTH_UNIT"],
    ball_energy: ["FP_ENERGY_IN_J", "FP_ENERGY_NO_HALF", "FP_DIAMETER_AS_RADIUS"],
    n_steps: ["FP_STEPS_TIME_UNITS"],
  },
  fingerprints(step, params, constants, prior) {
    const { E, rho } = material(params, constants as SolverC);
    const x = prior[step] as number;
    switch (step) {
      case "E_mpa":
        return { FP_E_NOT_CONVERTED: E, FP_E_IN_PA: E * 1e9 };
      case "rho_tmm3":
        return { FP_RHO_NOT_CONVERTED: rho, FP_RHO_TONNE_PER_M3: rho / 1000 };
      case "wave_speed":
        return { FP_SPEED_IN_MM_S: x * 1000, FP_SPEED_MIXED_UNITS: ((E * 1000) / rho) ** 0.5 };
      case "time_step_us":
        return { FP_STEP_IN_MS: x / 1000, FP_STEP_LENGTH_UNIT: x * 1000 };
      case "ball_energy":
        return { FP_ENERGY_IN_J: x / 1000, FP_ENERGY_NO_HALF: x * 2, FP_DIAMETER_AS_RADIUS: x * 8 };
      case "n_steps":
        return { FP_STEPS_TIME_UNITS: x / 1000 };
      default:
        throw new Error(`unknown step: ${step}`);
    }
  },
};

// ---------------------------------------------------------------- P006 --

type MmcC = { um_to_mm: number; quarters: number };

/** The sizes in millimetres, and the chain in whole micrometres. */
function mmcValues(params: Params, c: MmcC) {
  const p = params as Record<string, number>;
  const Dmax = p.Dmin_um + p.W_um;
  const d = p.Dmin_um + Math.floor((p.W_um * p.f_q) / c.quarters);
  const error = 2 * (p.dx_um * p.dx_um + p.dy_um * p.dy_um) ** 0.5;
  const bonus = d - p.Dmin_um;
  const allowed = p.T_um + bonus;
  const verdict = d < p.Dmin_um || d > Dmax ? 3 : error <= allowed ? 1 : 2;
  const chain: Record<string, number> = {
    mmc: p.Dmin_um,
    virtual_condition: p.Dmin_um - p.T_um,
    bonus,
    allowed_zone: allowed,
    position_error: error,
    verdict,
  };
  return { p, Dmax, d, error, allowed, verdict, chain };
}

export const positionAtMmc: Logic = {
  validate(params, constants) {
    const { verdict, error, allowed } = mmcValues(params, constants as MmcC);
    return verdict === 3 || Math.abs(error - allowed) >= 10;
  },
  derive(params, constants) {
    const c = constants as MmcC;
    const { p, Dmax, d } = mmcValues(params, c);
    const mm = (um: number) => Math.round(um * c.um_to_mm * 1000) / 1000;
    return {
      ...params,
      Dmax_um: Dmax,
      d_um: d,
      D_min: mm(p.Dmin_um),
      D_max: mm(Dmax),
      T: mm(p.T_um),
      d: mm(d),
      dx: mm(p.dx_um),
      dy: mm(p.dy_um),
    };
  },
  solveStep(step, params, constants) {
    const c = constants as MmcC;
    const { chain } = mmcValues(params, c);
    if (!(step in chain)) throw new Error(`unknown step: ${step}`);
    return step === "verdict" ? chain.verdict : round6(chain[step] * c.um_to_mm);
  },
  fingerprintIds: {
    mmc: ["FP_MMC_IS_LARGEST"],
    virtual_condition: ["FP_VC_PIN_FORMULA", "FP_VC_FROM_LMC"],
    bonus: ["FP_BONUS_FROM_LMC", "FP_BONUS_FULL_RANGE"],
    allowed_zone: ["FP_NO_BONUS", "FP_ZONE_FULL_RANGE"],
    position_error: ["FP_RADIUS_NOT_DIAMETER", "FP_OFFSETS_ADDED"],
    verdict: ["FP_VERDICT_NO_BONUS", "FP_VERDICT_NO_SIZE_CHECK"],
  },
  fingerprints(step, params, constants: Constants, prior) {
    const c = constants as MmcC;
    const k = c.um_to_mm;
    const { p, Dmax, d: dUm } = mmcValues(params, c);
    const Dmin = p.Dmin_um * k;
    const top = Dmax * k;
    const W = p.W_um * k;
    const T = p.T_um * k;
    const d = dUm * k;
    const dx = p.dx_um * k;
    const dy = p.dy_um * k;
    const far = (x: number, width: number) =>
      Math.abs(x - (prior[step] as number)) >= 3 * width ? x : null;
    const band = 0.0005;
    switch (step) {
      case "mmc":
        return { FP_MMC_IS_LARGEST: far(top, band) };
      case "virtual_condition":
        return { FP_VC_PIN_FORMULA: far(Dmin + T, band), FP_VC_FROM_LMC: far(top - T, band) };
      case "bonus":
        return { FP_BONUS_FROM_LMC: far(top - d, band), FP_BONUS_FULL_RANGE: far(W, band) };
      case "allowed_zone":
        return { FP_NO_BONUS: far(T, band), FP_ZONE_FULL_RANGE: far(T + W, band) };
      case "position_error":
        return {
          FP_RADIUS_NOT_DIAMETER: far((dx * dx + dy * dy) ** 0.5, 0.001),
          FP_OFFSETS_ADDED: far(dx + dy, 0.001),
        };
      case "verdict": {
        const error = prior.position_error as number;
        const noBonus = error <= T ? 1 : 2;
        const sizeOk = d >= Dmin - 1e-9 && d <= top + 1e-9;
        return {
          FP_VERDICT_NO_BONUS: sizeOk && noBonus !== prior.verdict ? noBonus : null,
          FP_VERDICT_NO_SIZE_CHECK: !sizeOk ? (error <= T + (d - Dmin) ? 1 : 2) : null,
        };
      }
      default:
        throw new Error(`unknown step: ${step}`);
    }
  },
};
