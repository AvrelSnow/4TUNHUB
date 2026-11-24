"""P001 - stepped block. The answer chain, as pure functions. No imports.

A rectangular base L x W x H. A round boss, diameter Db and height hb, sits
on the centre of its top face. One round hole, diameter dh, goes through
boss and base together, on the same axis. Origin: the base's bottom face.

    V  = L*W*H + pi/4*Db^2*hb - pi/4*dh^2*(H+hb)
    m  = V * rho
    zc = (V_base*H/2 + V_boss*(H+hb/2) - V_hole*(H+hb)/2) / V
"""

STEP_IDS = ("volume", "mass", "com_height")

DEPENDS_ON = {
    "volume": (),
    "mass": ("volume",),
    "com_height": (),
}


def _pieces(p, c):
    pi = c["pi"]
    base = p["L"] * p["W"] * p["H"]
    boss = pi / 4.0 * p["Db"] ** 2 * p["hb"]
    hole = pi / 4.0 * p["dh"] ** 2 * (p["H"] + p["hb"])
    return base, boss, hole


def solve_step(step_id, params, constants, prior):
    base, boss, hole = _pieces(params, constants)
    if step_id == "volume":
        return base + boss - hole
    if step_id == "mass":
        return prior["volume"] * params["rho"] * constants["kg_m3_to_g_mm3"]
    if step_id == "com_height":
        H, hb = params["H"], params["hb"]
        moment = base * H / 2.0 + boss * (H + hb / 2.0) - hole * (H + hb) / 2.0
        return moment / (base + boss - hole)
    raise KeyError("unknown step: %s" % step_id)


def solve(params, constants):
    answers = {}
    for step_id in STEP_IDS:
        answers[step_id] = solve_step(step_id, params, constants, answers)
    return answers


def derived_params(params, constants):
    return dict(params)


def validate(params, constants):
    """The boss must fit on the base, and the hole must leave a wall."""
    return (params["Db"] <= params["W"] - 10
            and params["dh"] <= params["Db"] - 16)
