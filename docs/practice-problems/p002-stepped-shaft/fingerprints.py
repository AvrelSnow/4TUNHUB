"""P002 - the predicted mistakes. No imports. Checked over the whole seed
space by docs/practice-problems/verify.py."""

CATALOGUE = {
    "FP_BORE_IGNORED": "did not subtract the bore",
    "FP_DIAMETER_AS_RADIUS": "used a diameter where the circle formula wants a radius",
    "FP_MASS_IN_KG": "gave the mass in kg where grams were asked",
    "FP_DENSITY_NOT_CONVERTED": "used the density in kg/m3 without converting the volume",
    "FP_COM_AT_HALF_LENGTH": "gave half the shaft's length, not the centre of mass",
}

FINGERPRINT_IDS = {
    "volume": ("FP_BORE_IGNORED", "FP_DIAMETER_AS_RADIUS"),
    "mass": ("FP_MASS_IN_KG", "FP_DENSITY_NOT_CONVERTED"),
    "com_x": ("FP_COM_AT_HALF_LENGTH",),
}


def fingerprints(step_id, params, constants, prior):
    pi = constants["pi"]
    p = params
    if step_id == "volume":
        bore_v = pi / 4.0 * p["bore"] ** 2 * (p["l1"] + p["l2"] + p["l3"])
        return {
            "FP_BORE_IGNORED": prior["volume"] + bore_v,
            "FP_DIAMETER_AS_RADIUS": pi * ((p["d1"] ** 2 - p["bore"] ** 2) * p["l1"]
                                           + (p["d2"] ** 2 - p["bore"] ** 2) * p["l2"]
                                           + (p["d3"] ** 2 - p["bore"] ** 2) * p["l3"]),
        }
    if step_id == "mass":
        return {
            "FP_MASS_IN_KG": prior["mass"] / 1000.0,
            "FP_DENSITY_NOT_CONVERTED": prior["mass"] * 1000.0,
        }
    if step_id == "com_x":
        return {"FP_COM_AT_HALF_LENGTH": (p["l1"] + p["l2"] + p["l3"]) / 2.0}
    raise KeyError("unknown step: %s" % step_id)
