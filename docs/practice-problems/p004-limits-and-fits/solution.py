"""P004 - limits and fits, ISO 286, hole basis. No imports.

A hole class (always H7 here) and a shaft class, written "H7/g6", on a
nominal size D. Each class gives an upper and a lower deviation in
micrometres, found from the size range D falls in.

    hole_max = D + ES        hole_min = D + EI  (= D, the H hole)
    shaft_max = D + es       shaft_min = D + ei

    max_clearance = hole_max - shaft_min
    min_clearance = hole_min - shaft_max      (negative = interference)

    fit type:  1 clearance   if min_clearance >= 0
               3 interference if max_clearance <= 0
               2 transition   otherwise

Clearances are kept signed. Everything is computed in whole micrometres and
divided by 1000 last, so no float drift reaches a tolerance band.
"""

STEP_IDS = ("hole_max", "shaft_max", "shaft_min",
            "max_clearance", "min_clearance", "fit_type")

DEPENDS_ON = {
    "hole_max": (),
    "shaft_max": (),
    "shaft_min": (),
    "max_clearance": ("hole_max", "shaft_min"),
    "min_clearance": ("shaft_max",),
    "fit_type": ("max_clearance", "min_clearance"),
}


def range_index(D, ranges):
    for i, (over, upto) in enumerate(ranges):
        if over < D <= upto:
            return i
    raise ValueError("no size range for %r" % (D,))


def deviations(params, constants):
    """((ES, EI), (es, ei)) in micrometres."""
    hole_class, shaft_class = params["fit"].split("/")
    i = range_index(params["D"], constants["ranges"])
    table = constants["deviations"]
    return tuple(table[hole_class][i]), tuple(table[shaft_class][i])


def _um(D, dev, c):
    return round(D + dev * c["um_to_mm"], 6)


def solve_step(step_id, params, constants, prior):
    D = params["D"]
    (ES, EI), (es, ei) = deviations(params, constants)
    k = constants["um_to_mm"]
    if step_id == "hole_max":
        return _um(D, ES, constants)
    if step_id == "shaft_max":
        return _um(D, es, constants)
    if step_id == "shaft_min":
        return _um(D, ei, constants)
    if step_id == "max_clearance":
        return round((ES - ei) * k, 6)
    if step_id == "min_clearance":
        return round((EI - es) * k, 6)
    if step_id == "fit_type":
        if prior["min_clearance"] >= 0:
            return 1.0
        if prior["max_clearance"] <= 0:
            return 3.0
        return 2.0
    raise KeyError("unknown step: %s" % step_id)


def solve(params, constants):
    answers = {}
    for step_id in STEP_IDS:
        answers[step_id] = solve_step(step_id, params, constants, answers)
    return answers


def derived_params(params, constants):
    return dict(params)


def validate(params, constants):
    """Every whole size from 4 to 80 mm and every fit on the list is valid."""
    try:
        deviations(params, constants)
    except (ValueError, KeyError):
        return False
    return True
