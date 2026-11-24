"""P003 - the predicted mistakes. No imports. Checked over the whole seed
space by docs/practice-problems/verify.py."""

CATALOGUE = {
    "FP_N_TIMES_S": "counted n gaps between n holes, not n - 1",
    "FP_NO_END_INSET": "left the two end insets out of the length",
    "FP_LENGTH_NOT_UPDATED": "added the holes but kept the old plate length",
    "FP_HOLES_NOT_ADDED": "lengthened the plate but kept the old number of holes",
}

FINGERPRINT_IDS = {
    "plate_length": ("FP_N_TIMES_S", "FP_NO_END_INSET"),
    "mass_original": (),
    "mass_changed": ("FP_LENGTH_NOT_UPDATED", "FP_HOLES_NOT_ADDED"),
}


def _mass(p, c, n, length):
    holes = n * c["pi"] / 4.0 * p["d"] ** 2 * p["t"]
    return (length * p["W"] * p["t"] - holes) * p["rho"] * c["kg_m3_to_g_mm3"]


def fingerprints(step_id, params, constants, prior):
    p = params
    if step_id == "plate_length":
        return {
            "FP_N_TIMES_S": 2.0 * p["e"] + p["n"] * p["s"],
            "FP_NO_END_INSET": (p["n"] - 1) * p["s"],
        }
    if step_id == "mass_original":
        return {}
    if step_id == "mass_changed":
        n2 = p["n"] + p["dn"]
        new_len = 2.0 * p["e"] + (n2 - 1) * p["s"]
        old_len = 2.0 * p["e"] + (p["n"] - 1) * p["s"]
        return {
            "FP_LENGTH_NOT_UPDATED": _mass(p, constants, n2, old_len),
            "FP_HOLES_NOT_ADDED": _mass(p, constants, p["n"], new_len),
        }
    raise KeyError("unknown step: %s" % step_id)
