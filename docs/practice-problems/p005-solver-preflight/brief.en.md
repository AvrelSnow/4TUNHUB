# P005 - Before you press run

**{{student_name}} · Version {{challenge_version}} · Run {{run_no}}**

You are about to run an explicit LS-DYNA job: a **{{mat}}** ball of radius
**{{r}} mm** hits a plate of the same metal at **{{v}} m/s**. The smallest
element is **{{L}} mm** long, and the run is set to end at **{{t_end}} ms**.

The material is **{{mat}}**: Young's modulus **{{E_GPa}} GPa**, density
**{{rho_kgm3}} kg/m3**.

LS-DYNA has no units. You will use the system **mm, tonne, second**, in which
forces are in N, stresses in MPa and energy in N.mm (1 tonne = 1000 kg). Do
these hand checks before you open the solver. Type plain numbers; scientific
notation such as 7.85e-9 is fine.

1. The modulus for the material card, in **MPa**.
2. The density for the material card, in **tonne/mm3**.
3. The speed of a stress wave in the metal, c = sqrt(E / density), as a number
   in **m/s**.
4. The stable time step, element length / c, as a number in **microseconds**
   (ignore the safety factor the solver applies).
5. The ball's kinetic energy at impact, in **N.mm**.
6. How many time steps the run needs to reach its end time.
