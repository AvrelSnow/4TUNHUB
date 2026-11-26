"""P002 - stepped shaft. Three cylinders in line, revolved about one axis,
with a bore through the whole length. Origin: the left end face; x along the
axis. No imports.

    V  = pi/4 * sum((d_i^2 - bore^2) * l_i)
    xc = sum(V_i * x_i) / V      x_i = middle of segment i
"""

STEP_IDS = ("volume", "mass", "com_x")

DEPENDS_ON = {"volume": (), "mass": ("volume",), "com_x": ()}


def _segments(p, c):
    k = c["pi"] / 4.0
    b2 = p["bore"] ** 2
    v1 = k * (p["d1"] ** 2 - b2) * p["l1"]
    v2 = k * (p["d2"] ** 2 - b2) * p["l2"]
    v3 = k * (p["d3"] ** 2 - b2) * p["l3"]
    x1 = p["l1"] / 2.0
    x2 = p["l1"] + p["l2"] / 2.0
    x3 = p["l1"] + p["l2"] + p["l3"] / 2.0
    return (v1, v2, v3), (x1, x2, x3)


def solve_step(step_id, params, constants, prior):
    vols, xs = _segments(params, constants)
    total = vols[0] + vols[1] + vols[2]
    if step_id == "volume":
        return total
    if step_id == "mass":
        return prior["volume"] * params["rho"] * constants["kg_m3_to_g_mm3"]
    if step_id == "com_x":
        return (vols[0] * xs[0] + vols[1] * xs[1] + vols[2] * xs[2]) / total
    raise KeyError("unknown step: %s" % step_id)


def solve(params, constants):
    answers = {}
    for step_id in STEP_IDS:
        answers[step_id] = solve_step(step_id, params, constants, answers)
    return answers


def derived_params(params, constants):
    return dict(params)


def validate(params, constants):
    """A step in diameter on each side of the thick middle section, and a
    centre of mass at least 4% of its own distance away from mid-length:
    on a near-symmetric shaft "half the length" IS the right answer, and a
    mistake that coincides with the truth cannot be told apart from it."""
    if not (params["d2"] > params["d1"] + 10 and params["d2"] > params["d3"] + 5):
        return False
    xc = solve(params, constants)["com_x"]
    half = (params["l1"] + params["l2"] + params["l3"]) / 2.0
    return abs(xc - half) / xc >= 0.04
