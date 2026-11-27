"""P006 - the predicted mistakes. No imports.

A mistake that lands on the true answer for some seeds (no bonus when the
hole is exactly at MMC, say) returns None there: it cannot be told from a
right answer.
"""

CATALOGUE = {
    "FP_MMC_IS_LARGEST": "took the hole's largest size as its maximum material condition",
    "FP_VC_PIN_FORMULA": "added the tolerance to the hole's MMC (the pin formula)",
    "FP_VC_FROM_LMC": "started the virtual condition from the hole's largest size",
    "FP_BONUS_FROM_LMC": "measured the bonus down from the largest size",
    "FP_BONUS_FULL_RANGE": "gave the whole size range as bonus, whatever the hole measures",
    "FP_NO_BONUS": "used the tolerance alone, ignoring the MMC modifier",
    "FP_ZONE_FULL_RANGE": "added the whole size range to the tolerance",
    "FP_RADIUS_NOT_DIAMETER": "gave the offset as a radius where a diameter was asked",
    "FP_OFFSETS_ADDED": "added the two offsets instead of combining them",
    "FP_VERDICT_NO_BONUS": "judged the position against the tolerance alone",
    "FP_VERDICT_NO_SIZE_CHECK": "judged the position without checking the size limits",
}

FINGERPRINT_IDS = {
    "mmc": ("FP_MMC_IS_LARGEST",),
    "virtual_condition": ("FP_VC_PIN_FORMULA", "FP_VC_FROM_LMC"),
    "bonus": ("FP_BONUS_FROM_LMC", "FP_BONUS_FULL_RANGE"),
    "allowed_zone": ("FP_NO_BONUS", "FP_ZONE_FULL_RANGE"),
    "position_error": ("FP_RADIUS_NOT_DIAMETER", "FP_OFFSETS_ADDED"),
    "verdict": ("FP_VERDICT_NO_BONUS", "FP_VERDICT_NO_SIZE_CHECK"),
}


def _far(candidate, truth, width):
    return candidate if abs(candidate - truth) >= 3.0 * width else None


def fingerprints(step_id, params, constants, prior):
    k = constants["um_to_mm"]
    Dmin = params["Dmin_um"] * k
    Dmax = (params["Dmin_um"] + params["W_um"]) * k
    W = params["W_um"] * k
    T = params["T_um"] * k
    d = (params["Dmin_um"] + params["W_um"] * params["f_q"] // constants["quarters"]) * k
    dx, dy = params["dx_um"] * k, params["dy_um"] * k
    band = 0.0005
    if step_id == "mmc":
        return {"FP_MMC_IS_LARGEST": _far(Dmax, prior["mmc"], band)}
    if step_id == "virtual_condition":
        return {"FP_VC_PIN_FORMULA": _far(Dmin + T, prior["virtual_condition"], band),
                "FP_VC_FROM_LMC": _far(Dmax - T, prior["virtual_condition"], band)}
    if step_id == "bonus":
        return {"FP_BONUS_FROM_LMC": _far(Dmax - d, prior["bonus"], band),
                "FP_BONUS_FULL_RANGE": _far(W, prior["bonus"], band)}
    if step_id == "allowed_zone":
        return {"FP_NO_BONUS": _far(T, prior["allowed_zone"], band),
                "FP_ZONE_FULL_RANGE": _far(T + W, prior["allowed_zone"], band)}
    if step_id == "position_error":
        return {"FP_RADIUS_NOT_DIAMETER": _far((dx * dx + dy * dy) ** 0.5, prior["position_error"], 0.001),
                "FP_OFFSETS_ADDED": _far(dx + dy, prior["position_error"], 0.001)}
    if step_id == "verdict":
        error = prior["position_error"]
        no_bonus = 1.0 if error <= T else 2.0
        size_ok = Dmin - 1e-9 <= d <= Dmax + 1e-9
        return {
            "FP_VERDICT_NO_BONUS": no_bonus if (size_ok and no_bonus != prior["verdict"]) else None,
            "FP_VERDICT_NO_SIZE_CHECK": (
                (1.0 if error <= T + (d - Dmin) else 2.0) if (not size_ok) else None),
        }
    raise KeyError("unknown step: %s" % step_id)
