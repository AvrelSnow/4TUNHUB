"""P006 - position tolerance at MMC for a hole. No imports.

Whole micrometres inside, millimetres out.

    MMC             = Dmin                       (a hole: the SMALLEST size)
    virtual cond.   = Dmin - T
    bonus           = d - Dmin                   (departure from MMC)
    allowed zone    = T + bonus                  (a diameter)
    position error  = 2 * sqrt(dx^2 + dy^2)      (a diameter)
    verdict         = 3 reject (size)     if d < Dmin or d > Dmax
                      1 accept            if position error <= allowed zone
                      2 reject (position) otherwise
"""

STEP_IDS = ("mmc", "virtual_condition", "bonus", "allowed_zone",
            "position_error", "verdict")

DEPENDS_ON = {
    "mmc": (),
    "virtual_condition": ("mmc",),
    "bonus": ("mmc",),
    "allowed_zone": ("bonus",),
    "position_error": (),
    "verdict": ("allowed_zone", "position_error"),
}


def core(Dmin_um, Dmax_um, T_um, d_um, dx_um, dy_um):
    """The whole chain in micrometres, from the six numbers. Used by the
    steps and by the worked examples in verify.py."""
    error = 2.0 * (dx_um * dx_um + dy_um * dy_um) ** 0.5
    bonus = d_um - Dmin_um
    allowed = T_um + bonus
    if d_um < Dmin_um or d_um > Dmax_um:
        verdict = 3.0
    elif error <= allowed:
        verdict = 1.0
    else:
        verdict = 2.0
    return {"mmc": Dmin_um, "virtual_condition": Dmin_um - T_um, "bonus": bonus,
            "allowed_zone": allowed, "position_error": error, "verdict": verdict}


def derived_params(params, constants):
    """The sizes in millimetres, so the brief can print them."""
    p = dict(params)
    d_um = p["Dmin_um"] + p["W_um"] * p["f_q"] // constants["quarters"]
    k = constants["um_to_mm"]
    p["Dmax_um"] = p["Dmin_um"] + p["W_um"]
    p["d_um"] = d_um
    p["D_min"] = round(p["Dmin_um"] * k, 3)
    p["D_max"] = round(p["Dmax_um"] * k, 3)
    p["T"] = round(p["T_um"] * k, 3)
    p["d"] = round(d_um * k, 3)
    p["dx"] = round(p["dx_um"] * k, 3)
    p["dy"] = round(p["dy_um"] * k, 3)
    return p


def _chain(params):
    return core(params["Dmin_um"], params["Dmax_um"], params["T_um"],
                params["d_um"], params["dx_um"], params["dy_um"])


def solve_step(step_id, params, constants, prior):
    p = derived_params(params, constants)
    k = constants["um_to_mm"]
    out = _chain(p)
    if step_id == "verdict":
        return out["verdict"]
    return round(out[step_id] * k, 6)


def solve(params, constants):
    answers = {}
    for step_id in STEP_IDS:
        answers[step_id] = solve_step(step_id, params, constants, answers)
    return answers


def validate(params, constants):
    """When the size is inside its limits, the position must clear the
    allowed zone by 10 micrometres or more either way: a verdict that turns
    on the third decimal is a coin flip for a student who rounds."""
    p = derived_params(params, constants)
    out = _chain(p)
    if out["verdict"] == 3.0:
        return True
    return abs(out["position_error"] - out["allowed_zone"]) >= 10.0
