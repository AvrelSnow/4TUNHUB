"""P003 - a plate whose length is DRIVEN by an equation. No imports.

A plate W wide and t thick carries a row of n round holes, diameter d, on
its centre line, spaced s apart. The first and last holes sit e from the
plate's ends. The length is not typed in: it is the equation

    L = 2*e + (n - 1)*s

so changing n changes L. Then n goes up by dn and the part rebuilds.

    V(n) = L(n)*W*t - n * pi/4 * d^2 * t
"""

STEP_IDS = ("plate_length", "mass_original", "mass_changed")

DEPENDS_ON = {
    "plate_length": (),
    "mass_original": ("plate_length",),
    "mass_changed": (),
}


def _length(e, s, n):
    return 2.0 * e + (n - 1) * s


def _mass(p, c, n, length):
    holes = n * c["pi"] / 4.0 * p["d"] ** 2 * p["t"]
    volume = length * p["W"] * p["t"] - holes
    return volume * p["rho"] * c["kg_m3_to_g_mm3"]


def solve_step(step_id, params, constants, prior):
    p = params
    if step_id == "plate_length":
        return _length(p["e"], p["s"], p["n"])
    if step_id == "mass_original":
        return _mass(p, constants, p["n"], prior["plate_length"])
    if step_id == "mass_changed":
        n2 = p["n"] + p["dn"]
        return _mass(p, constants, n2, _length(p["e"], p["s"], n2))
    raise KeyError("unknown step: %s" % step_id)


def solve(params, constants):
    answers = {}
    for step_id in STEP_IDS:
        answers[step_id] = solve_step(step_id, params, constants, answers)
    return answers


def derived_params(params, constants):
    return dict(params)


def validate(params, constants):
    """Holes must clear each other and the plate's edges."""
    return (params["s"] >= params["d"] + 10
            and params["e"] >= params["d"]
            and params["d"] <= params["W"] - 30)
