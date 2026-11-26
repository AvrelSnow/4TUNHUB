"""P005 - the predicted mistakes. No imports.

Every one is a unit slip: a factor of 2, 8, 1000 or a billion, and so far
outside the 0.2% band for every seed. The check is verify.py's separation
test; nothing here is a table of numbers.
"""

CATALOGUE = {
    "FP_E_NOT_CONVERTED": "gave the modulus in GPa where MPa was asked",
    "FP_E_IN_PA": "gave the modulus in pascals where MPa was asked",
    "FP_RHO_NOT_CONVERTED": "left the density in kg/m3",
    "FP_RHO_TONNE_PER_M3": "gave tonne/m3 where tonne/mm3 was asked",
    "FP_SPEED_IN_MM_S": "gave the wave speed in mm/s where m/s was asked",
    "FP_SPEED_MIXED_UNITS": "divided a modulus in MPa by a density in kg/m3",
    "FP_STEP_IN_MS": "gave the time step in milliseconds where microseconds were asked",
    "FP_STEP_LENGTH_UNIT": "divided a length in mm by a speed in m/s",
    "FP_ENERGY_IN_J": "gave the energy in joules where N.mm was asked",
    "FP_ENERGY_NO_HALF": "left out the half in the kinetic energy",
    "FP_DIAMETER_AS_RADIUS": "used the diameter where the volume formula wants the radius",
    "FP_STEPS_TIME_UNITS": "divided milliseconds by microseconds",
}

FINGERPRINT_IDS = {
    "E_mpa": ("FP_E_NOT_CONVERTED", "FP_E_IN_PA"),
    "rho_tmm3": ("FP_RHO_NOT_CONVERTED", "FP_RHO_TONNE_PER_M3"),
    "wave_speed": ("FP_SPEED_IN_MM_S", "FP_SPEED_MIXED_UNITS"),
    "time_step_us": ("FP_STEP_IN_MS", "FP_STEP_LENGTH_UNIT"),
    "ball_energy": ("FP_ENERGY_IN_J", "FP_ENERGY_NO_HALF", "FP_DIAMETER_AS_RADIUS"),
    "n_steps": ("FP_STEPS_TIME_UNITS",),
}


def fingerprints(step_id, params, constants, prior):
    E_gpa, rho = constants["materials"][params["mat"]]
    if step_id == "E_mpa":
        return {"FP_E_NOT_CONVERTED": float(E_gpa), "FP_E_IN_PA": E_gpa * 1e9}
    if step_id == "rho_tmm3":
        return {"FP_RHO_NOT_CONVERTED": float(rho), "FP_RHO_TONNE_PER_M3": rho / 1000.0}
    if step_id == "wave_speed":
        return {
            "FP_SPEED_IN_MM_S": prior["wave_speed"] * 1000.0,
            "FP_SPEED_MIXED_UNITS": (E_gpa * 1000.0 / rho) ** 0.5,
        }
    if step_id == "time_step_us":
        return {
            "FP_STEP_IN_MS": prior["time_step_us"] / 1000.0,
            "FP_STEP_LENGTH_UNIT": prior["time_step_us"] * 1000.0,
        }
    if step_id == "ball_energy":
        return {
            "FP_ENERGY_IN_J": prior["ball_energy"] / 1000.0,
            "FP_ENERGY_NO_HALF": prior["ball_energy"] * 2.0,
            "FP_DIAMETER_AS_RADIUS": prior["ball_energy"] * 8.0,
        }
    if step_id == "n_steps":
        return {"FP_STEPS_TIME_UNITS": prior["n_steps"] / 1000.0}
    raise KeyError("unknown step: %s" % step_id)
