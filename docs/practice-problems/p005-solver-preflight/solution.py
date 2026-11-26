"""P005 - the hand check before an explicit LS-DYNA run. No imports.

Unit system: mm, tonne (1000 kg), second. Then force is N, stress is MPa,
energy is N.mm, and a density in kg/m3 is multiplied by 1e-12 to become
tonne/mm3.

    E [MPa]            = E [GPa] * 1000
    rho [t/mm3]        = rho [kg/m3] * 1e-12
    c [mm/s]           = sqrt(E / rho)         then / 1000 -> m/s
    dt [us]            = L / c                 (the stable step, before the
                                                solver's own safety factor)
    m [t]              = rho * 4/3 pi r^3
    KE [N.mm]          = 1/2 m v^2             v in mm/s
    steps              = t_end / dt
"""

STEP_IDS = ("E_mpa", "rho_tmm3", "wave_speed", "time_step_us",
            "ball_energy", "n_steps")

DEPENDS_ON = {
    "E_mpa": (),
    "rho_tmm3": (),
    "wave_speed": ("E_mpa", "rho_tmm3"),
    "time_step_us": ("wave_speed",),
    "ball_energy": ("rho_tmm3",),
    "n_steps": ("time_step_us",),
}


def derived_params(params, constants):
    """The material's numbers, so the brief can print them."""
    E_gpa, rho = constants["materials"][params["mat"]]
    out = dict(params)
    out["E_GPa"] = E_gpa
    out["rho_kgm3"] = rho
    return out


def solve_step(step_id, params, constants, prior):
    p = derived_params(params, constants)
    if step_id == "E_mpa":
        return p["E_GPa"] * 1000.0
    if step_id == "rho_tmm3":
        return p["rho_kgm3"] * 1e-12
    if step_id == "wave_speed":
        return (prior["E_mpa"] / prior["rho_tmm3"]) ** 0.5 / 1000.0
    if step_id == "time_step_us":
        return p["L"] / (prior["wave_speed"] * 1000.0) * 1e6
    if step_id == "ball_energy":
        mass_t = prior["rho_tmm3"] * 4.0 / 3.0 * constants["pi"] * p["r"] ** 3
        return 0.5 * mass_t * (p["v"] * 1000.0) ** 2
    if step_id == "n_steps":
        return p["t_end"] * 1000.0 / prior["time_step_us"]
    raise KeyError("unknown step: %s" % step_id)


def solve(params, constants):
    answers = {}
    for step_id in STEP_IDS:
        answers[step_id] = solve_step(step_id, params, constants, answers)
    return answers


def validate(params, constants):
    """Always a sensible job: every material, size and speed on the lists."""
    return params["mat"] in constants["materials"]
