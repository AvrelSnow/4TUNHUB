"""P001 - the predicted mistakes, as formulas. No imports.

Each one names an OPERATION the student did, never a misconception. Each
must land outside the tolerance band for every seed: docs/practice-problems/
verify.py asserts it over the whole seed space.

Rejected on purpose: "centroid of base and boss, hole forgotten" - the hole
is small and near the centroid, so it moves the answer less than a few
tolerances. It is absent for the same reason as in Challenge 001.
"""

CATALOGUE = {
    "FP_HOLE_IGNORED": "did not subtract the hole",
    "FP_BOSS_IGNORED": "left the boss out",
    "FP_HOLE_STOPS_AT_BASE": "cut the hole through the base only, not the boss",
    "FP_DIAMETER_AS_RADIUS": "used a diameter where the circle formula wants a radius",
    "FP_MASS_IN_KG": "gave the mass in kg where grams were asked",
    "FP_DENSITY_NOT_CONVERTED": "used the density in kg/m3 without converting the volume",
    "FP_COM_AT_MIDHEIGHT": "gave the middle of the bounding box, not the centre of mass",
}

FINGERPRINT_IDS = {
    "volume": ("FP_HOLE_IGNORED", "FP_BOSS_IGNORED", "FP_HOLE_STOPS_AT_BASE",
               "FP_DIAMETER_AS_RADIUS"),
    "mass": ("FP_MASS_IN_KG", "FP_DENSITY_NOT_CONVERTED"),
    "com_height": ("FP_COM_AT_MIDHEIGHT",),
}


def fingerprints(step_id, params, constants, prior):
    pi = constants["pi"]
    p = params
    if step_id == "volume":
        hole = pi / 4.0 * p["dh"] ** 2 * (p["H"] + p["hb"])
        boss = pi / 4.0 * p["Db"] ** 2 * p["hb"]
        return {
            "FP_HOLE_IGNORED": prior["volume"] + hole,
            "FP_BOSS_IGNORED": prior["volume"] - boss,
            "FP_HOLE_STOPS_AT_BASE": prior["volume"] + pi / 4.0 * p["dh"] ** 2 * p["hb"],
            "FP_DIAMETER_AS_RADIUS": (p["L"] * p["W"] * p["H"]
                                      + pi * p["Db"] ** 2 * p["hb"]
                                      - pi * p["dh"] ** 2 * (p["H"] + p["hb"])),
        }
    if step_id == "mass":
        return {
            "FP_MASS_IN_KG": prior["mass"] / 1000.0,
            "FP_DENSITY_NOT_CONVERTED": prior["mass"] * 1000.0,
        }
    if step_id == "com_height":
        return {"FP_COM_AT_MIDHEIGHT": (p["H"] + p["hb"]) / 2.0}
    raise KeyError("unknown step: %s" % step_id)
