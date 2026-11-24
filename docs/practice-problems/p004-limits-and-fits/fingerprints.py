"""P004 - the predicted mistakes. No imports.

A mistake that lands on the true answer (the sign slip on a shaft whose
upper deviation is zero, say) cannot be told from a right answer. Such a
case returns None: "no diagnosis" is honest, a wrong diagnosis of a right
answer is not.
"""

CATALOGUE = {
    "FP_HOLE_WITHOUT_TOLERANCE": "gave the nominal size as the hole's upper limit",
    "FP_HOLE_WITH_SHAFT_GRADE": "used the shaft's tolerance grade for the hole",
    "FP_SHAFT_DEVIATION_SIGN": "added the shaft's deviation with the wrong sign",
    "FP_SHAFT_WITH_HOLE_GRADE": "used the hole's tolerance width for the shaft",
    "FP_LIMITS_NOT_CROSSED": "subtracted the two upper limits instead of crossing them",
    "FP_MAX_GIVEN_AS_MIN": "gave the maximum clearance where the minimum was asked",
    "FP_TRANSITION_MISSED": "judged the fit from the minimum clearance alone",
}

FINGERPRINT_IDS = {
    "hole_max": ("FP_HOLE_WITHOUT_TOLERANCE", "FP_HOLE_WITH_SHAFT_GRADE"),
    "shaft_max": ("FP_SHAFT_DEVIATION_SIGN",),
    "shaft_min": ("FP_SHAFT_WITH_HOLE_GRADE",),
    "max_clearance": ("FP_LIMITS_NOT_CROSSED",),
    "min_clearance": ("FP_MAX_GIVEN_AS_MIN",),
    "fit_type": ("FP_TRANSITION_MISSED",),
}

# Three tolerances (the step band is 0.0005 mm): closer than this, a mistake
# and the truth are the same answer.
FAR_ENOUGH = 0.0015


def _far(candidate, truth):
    return candidate if abs(candidate - truth) >= FAR_ENOUGH else None


def _devs(params, constants):
    hole_class, shaft_class = params["fit"].split("/")
    for i, (over, upto) in enumerate(constants["ranges"]):
        if over < params["D"] <= upto:
            t = constants["deviations"]
            return t[hole_class][i], t[shaft_class][i], t["h6"][i]
    raise ValueError(params["D"])


def fingerprints(step_id, params, constants, prior):
    k = constants["um_to_mm"]
    D = params["D"]
    (ES, EI), (es, ei), (_h_es, h6_ei) = _devs(params, constants)
    hole_width = ES - EI
    shaft_width = es - ei
    if step_id == "hole_max":
        return {
            "FP_HOLE_WITHOUT_TOLERANCE": _far(float(D), prior["hole_max"]),
            # IT6 is the width of h6 at this size
            "FP_HOLE_WITH_SHAFT_GRADE": _far(round(D - h6_ei * k, 6), prior["hole_max"]),
        }
    if step_id == "shaft_max":
        return {"FP_SHAFT_DEVIATION_SIGN": _far(round(D - es * k, 6), prior["shaft_max"])}
    if step_id == "shaft_min":
        return {"FP_SHAFT_WITH_HOLE_GRADE":
                _far(round(D + (es - hole_width) * k, 6), prior["shaft_min"])}
    if step_id == "max_clearance":
        return {"FP_LIMITS_NOT_CROSSED":
                _far(round((ES - es) * k, 6), prior["max_clearance"])}
    if step_id == "min_clearance":
        return {"FP_MAX_GIVEN_AS_MIN":
                _far(prior["max_clearance"], prior["min_clearance"])}
    if step_id == "fit_type":
        # judged from the minimum clearance only: never sees a transition
        guess = 1.0 if prior["min_clearance"] >= 0 else 3.0
        return {"FP_TRANSITION_MISSED": guess if guess != prior["fit_type"] else None}
    raise KeyError("unknown step: %s" % step_id)
