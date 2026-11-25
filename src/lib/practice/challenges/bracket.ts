// The wall bracket: challenges/001-bracket/solution.py and fingerprints.py
// in the Lab. A flat plate on edge, cantilevered: depth b is the beam's
// depth, thickness t its breadth.
import type { Chain, Logic } from "../engine";

type C = {
  g: number;
  Re: number;
  E: number;
  rho: number;
  deflection_denominator: number;
  stock: number[];
  d_bolt: number;
  min_pitch_factor: number;
  self_weight_max_share: number;
  decision_margin: number;
};
type P = { m: number; b: number; L: number; n: number; p_h: number };

const inertia = (t: number, b: number) => (t * b ** 3) / 12;
const deflection = (W: number, L: number, E: number, I: number) => (W * L ** 3) / (3 * E * I);
const stockAtLeast = (t: number, stock: number[]) => stock.find((s) => s >= t) ?? null;
const stockBelow = (t: number, stock: number[]) => stock.filter((s) => s < t).pop() ?? null;

export const bracket: Logic = {
  derive: (params) => ({ ...params, p_v: (params.b as number) - 34 }),

  validate(params, constants) {
    const p = params as P;
    const c = constants as C;
    if (p.L < 10 * p.b) return false;
    if (p.b - 34 < c.min_pitch_factor * c.d_bolt) return false;
    const W = p.m * c.g;
    const tReq = (6 * ((W * p.L) / (c.Re / p.n))) / p.b ** 2;
    if (!(tReq >= 6 && tReq <= 15)) return false;
    const limit = p.L / c.deflection_denominator;
    for (const s of c.stock) {
      if (s < tReq) continue;
      const d = deflection(W, p.L, c.E, inertia(s, p.b));
      if (Math.abs(d / limit - 1) < c.decision_margin) return false;
      if (d <= limit) {
        const selfWeight = (c.rho * 1e-9 * p.b * s * p.L) / (2 * p.m);
        return selfWeight <= c.self_weight_max_share;
      }
    }
    return false;
  },

  solveStep(step, params, constants, prior: Chain) {
    const p = params as P;
    const c = constants as C;
    const at = (id: string) => prior[id] as number;
    switch (step) {
      case "load_force":
        return p.m * c.g;
      case "root_moment":
        return at("load_force") * p.L;
      case "allowable_stress":
        return c.Re / p.n;
      case "section_modulus_req":
        return at("root_moment") / at("allowable_stress");
      case "thickness_req":
        return (6 * at("section_modulus_req")) / p.b ** 2;
      case "thickness_stock":
        return stockAtLeast(at("thickness_req"), c.stock);
      case "tip_deflection":
        if (prior.thickness_stock === null) return null;
        return deflection(at("load_force"), p.L, c.E, inertia(at("thickness_stock"), p.b));
      case "thickness_final": {
        const limit = p.L / c.deflection_denominator;
        return (
          c.stock.find(
            (s) =>
              s >= at("thickness_req") &&
              deflection(at("load_force"), p.L, c.E, inertia(s, p.b)) <= limit,
          ) ?? null
        );
      }
      default:
        throw new Error(`unknown step: ${step}`);
    }
  },

  fingerprintIds: {
    load_force: ["FP_MASS_AS_FORCE", "FP_SF_APPLIED_TO_LOAD"],
    root_moment: ["FP_HALF_LENGTH", "FP_SIMPLY_SUPPORTED", "FP_UDL_CANTILEVER"],
    allowable_stress: ["FP_SF_MULTIPLIED", "FP_SF_IGNORED"],
    section_modulus_req: ["FP_Z_MULTIPLIED", "FP_Z_INVERTED"],
    thickness_req: ["FP_WRONG_AXIS", "FP_NO_FACTOR_6", "FP_USED_I_AS_Z"],
    thickness_stock: ["FP_ROUNDED_DOWN"],
    tip_deflection: ["FP_DEFL_SIMPLY_SUPPORTED", "FP_DEFL_UDL", "FP_DEFL_NO_3", "FP_I_WRONG_AXIS"],
    thickness_final: ["FP_IGNORED_DEFLECTION", "FP_ROUNDED_DOWN"],
  },

  fingerprints(step, params, constants, prior) {
    const p = params as P;
    const c = constants as C;
    const at = (id: string) => prior[id] as number;
    const { L, b, n } = p;
    switch (step) {
      case "load_force":
        return { FP_MASS_AS_FORCE: p.m, FP_SF_APPLIED_TO_LOAD: p.m * c.g * n };
      case "root_moment": {
        const W = at("load_force");
        return {
          FP_HALF_LENGTH: (W * L) / 2,
          FP_SIMPLY_SUPPORTED: (W * L) / 4,
          FP_UDL_CANTILEVER: (W * L ** 2) / 2,
        };
      }
      case "allowable_stress":
        return { FP_SF_MULTIPLIED: c.Re * n, FP_SF_IGNORED: c.Re };
      case "section_modulus_req": {
        const M = at("root_moment");
        const sigma = at("allowable_stress");
        return { FP_Z_MULTIPLIED: M * sigma, FP_Z_INVERTED: sigma / M };
      }
      case "thickness_req": {
        const Z = at("section_modulus_req");
        return {
          FP_WRONG_AXIS: ((6 * Z) / b) ** 0.5,
          FP_NO_FACTOR_6: Z / b ** 2,
          FP_USED_I_AS_Z: (12 * Z) / b ** 3,
        };
      }
      case "thickness_stock":
        return { FP_ROUNDED_DOWN: stockBelow(at("thickness_req"), c.stock) };
      case "tip_deflection": {
        const W = at("load_force");
        if (prior.thickness_stock === null) return {};
        const t = at("thickness_stock");
        const I = (t * b ** 3) / 12;
        return {
          FP_DEFL_SIMPLY_SUPPORTED: (W * L ** 3) / (48 * c.E * I),
          FP_DEFL_UDL: (W * L ** 3) / (8 * c.E * I),
          FP_DEFL_NO_3: (W * L ** 3) / (c.E * I),
          FP_I_WRONG_AXIS: (W * L ** 3) / (3 * c.E * ((b * t ** 3) / 12)),
        };
      }
      case "thickness_final": {
        const strength = prior.thickness_stock;
        const final = prior.thickness_final;
        const ignored = final !== null && strength !== null && strength !== final ? strength : null;
        let down = final !== null ? stockBelow(final, c.stock) : null;
        if (ignored !== null && down === ignored) down = null;
        return { FP_IGNORED_DEFLECTION: ignored, FP_ROUNDED_DOWN: down };
      }
      default:
        throw new Error(`unknown step: ${step}`);
    }
  },
};
