# P005 - Avant de lancer le calcul

**{{student_name}} · Version {{challenge_version}} · Essai {{run_no}}**

Vous allez lancer un calcul LS-DYNA explicite : une bille en **{{mat}}** de
rayon **{{r}} mm** frappe une plaque du même métal à **{{v}} m/s**. Le plus
petit élément mesure **{{L}} mm**, et le calcul s'arrête à **{{t_end}} ms**.

Le matériau est le **{{mat}}** : module d'Young **{{E_GPa}} GPa**, masse
volumique **{{rho_kgm3}} kg/m3**.

LS-DYNA n'a pas d'unités. Vous utiliserez le système **mm, tonne, seconde**,
où les forces sont en N, les contraintes en MPa et l'énergie en N.mm
(1 tonne = 1000 kg). Faites ces vérifications à la main avant d'ouvrir le
solveur. Tapez des nombres simples ; la notation scientifique comme 7.85e-9
convient.

1. Le module pour la carte matériau, en **MPa**.
2. La masse volumique pour la carte matériau, en **tonne/mm3**.
3. La vitesse d'une onde de contrainte dans le métal, c = racine(E / masse
   volumique), comme un nombre en **m/s**.
4. Le pas de temps stable, longueur d'élément / c, comme un nombre en
   **microsecondes** (ignorez le coefficient de sécurité du solveur).
5. L'énergie cinétique de la bille à l'impact, en **N.mm**.
6. Le nombre de pas de temps nécessaires pour atteindre l'instant final.
