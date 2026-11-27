"""Check the practice-problem answer keys against SOLIDWORKS itself.

Builds the golden-seed parts of P001, P002 and P003 in SOLIDWORKS through its
API, reads the real volume and centre of mass, and compares them with the keys
in docs/practice-problems.md. Needs SOLIDWORKS (2023 tested: API revision
31.2.1), Windows and pywin32.

    python docs/practice-problems/sw_golden.py            # all three
    python docs/practice-problems/sw_golden.py p002       # one

SOLIDWORKS opens (visible) and the parts it builds are closed again without
saving. Sketch snapping and automatic relations are turned off for the
sketches: with them on, SOLIDWORKS moved one vertex of the P002 profile and
reported a different volume. The API works in metres; the printout is mm / g.

Known limit: SOLIDWORKS's own mass was not read with a steel density (the
assignment did not take effect through the API), so mass is checked as
volume x density by arithmetic, not by SOLIDWORKS. Volume and centre of mass,
which carry the geometry, are SOLIDWORKS's own.
"""
import math
import sys

import pythoncom
import win32com.client as wc
from win32com.client import VARIANT

sys.stdout.reconfigure(encoding='utf-8')
MM = 1e-3
TEMPLATE = r"C:\ProgramData\SolidWorks\SOLIDWORKS 2023\templates\Part.PRTDOT"
NOTHING = VARIANT(pythoncom.VT_DISPATCH, None)
MATERIAL = ("SOLIDWORKS Materials", "Plain Carbon Steel")      # 7800 kg/m3 in the library

made = []   # titles of the documents this script created


def connect():
    sw = wc.Dispatch("SldWorks.Application")
    sw.Visible = True
    return sw


def new_part(sw):
    doc = sw.NewDocument(TEMPLATE, 0, 0, 0)
    if doc is None:
        raise RuntimeError("NewDocument failed")
    made.append(doc.GetTitle)
    return doc


def select(doc, name, typ, x=0, y=0, z=0, append=False, mark=0):
    ok = doc.Extension.SelectByID2(name, typ, x, y, z, append, mark, NOTHING, 0)
    if not ok:
        raise RuntimeError("could not select %s %s at (%s,%s,%s)" % (typ, name, x, y, z))


def extrude(doc, depth_m, through_all=False, cut=False):
    fm = doc.FeatureManager
    end = 1 if through_all else 0
    if cut:
        f = fm.FeatureCut4(True, False, False, end, 0, depth_m, 0, False, False, False, False,
                           0, 0, False, False, False, False, False, True, True, False, False,
                           False, 0, 0, False, False)
    else:
        f = fm.FeatureExtrusion3(True, False, False, end, 0, depth_m, 0, False, False, False, False,
                                 0, 0, False, False, False, False, True, True, True, 0, 0, False)
    if f is None:
        raise RuntimeError("extrude/cut returned None")
    return f


def set_material(doc):
    try:
        cfg = doc.ConfigurationManager.ActiveConfiguration.Name
        doc.SetMaterialPropertyName2(cfg, MATERIAL[0], MATERIAL[1])
        doc.SetMaterialPropertyName2("", MATERIAL[0], MATERIAL[1])     # the first call alone was not enough
        doc.ForceRebuild3(False)
    except Exception as e:                       # a missing database is not fatal
        print("   (material not set: %s)" % e)


def props(doc):
    mp_first = _read(doc)
    if mp_first["density_kgm3"] is not None and abs(mp_first["density_kgm3"] - 7800.0) < 1.0:
        return mp_first
    # the working order found by experiment: read once, set the steel again, read again
    set_material(doc)
    return _read(doc)


def _read(doc):
    import time
    doc.ForceRebuild3(False)
    time.sleep(1.5)                                # let the material assignment settle
    _ = doc.Extension.CreateMassProperty           # a first, throw-away read
    time.sleep(0.5)
    mp = doc.Extension.CreateMassProperty          # a property get in this binding
    mp.UseSystemUnits = True
    vol = mp.Volume
    return {"volume_mm3": vol * 1e9,
            "mass_g": mp.Mass * 1000.0,
            "density_kgm3": mp.Mass / vol if vol else None,
            "com_mm": tuple(c * 1000.0 for c in mp.CenterOfMass)}


def sketch_on(doc, plane_or_face):
    kind, *rest = plane_or_face
    if kind == "plane":
        select(doc, rest[0], "PLANE")
    else:
        select(doc, "", "FACE", *rest)
    sm = doc.SketchManager
    sm.InsertSketch(True)
    # no snapping and no automatic relations: the points are exactly the ones given
    sm.AutoInference = False
    sm.AddToDB = True


def close_sketch(doc):
    doc.SketchManager.AddToDB = False
    doc.SketchManager.AutoInference = True
    doc.SketchManager.InsertSketch(True)


# ------------------------------------------------------------------------ P001
def p001(sw, L=90, W=70, H=20, Db=40, hb=10, dh=10):
    doc = new_part(sw)
    sm = doc.SketchManager
    sketch_on(doc, ("plane", "Top Plane"))
    sm.CreateCenterRectangle(0, 0, 0, L / 2 * MM, W / 2 * MM, 0)
    close_sketch(doc)
    select(doc, "Sketch1", "SKETCH")
    extrude(doc, H * MM)
    sketch_on(doc, ("face", 0, H * MM, 0))
    sm.CreateCircleByRadius(0, 0, 0, Db / 2 * MM)
    close_sketch(doc)
    select(doc, "Sketch2", "SKETCH")
    extrude(doc, hb * MM)
    sketch_on(doc, ("face", 0, (H + hb) * MM, 0))
    sm.CreateCircleByRadius(0, 0, 0, dh / 2 * MM)
    close_sketch(doc)
    select(doc, "Sketch3", "SKETCH")
    extrude(doc, 0, through_all=True, cut=True)
    set_material(doc)
    doc.ForceRebuild3(False)
    return doc, props(doc)


# ------------------------------------------------------------------------ P002
def p002(sw, d1=25, l1=50, d2=45, l2=40, d3=30, l3=40, bore=10):
    doc = new_part(sw)
    sm = doc.SketchManager
    total = l1 + l2 + l3
    sketch_on(doc, ("plane", "Front Plane"))
    sm.CreateCenterLine(0, 0, 0, total * MM, 0, 0)            # Line1: the axis
    pts = [(0, bore / 2), (0, d1 / 2), (l1, d1 / 2), (l1, d2 / 2), (l1 + l2, d2 / 2),
           (l1 + l2, d3 / 2), (total, d3 / 2), (total, bore / 2), (0, bore / 2)]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        sm.CreateLine(x0 * MM, y0 * MM, 0, x1 * MM, y1 * MM, 0)
    close_sketch(doc)
    select(doc, "Sketch1", "SKETCH")
    select(doc, "Line1@Sketch1", "EXTSKETCHSEGMENT", 0, 0, 0, True, 4)
    f = doc.FeatureManager.FeatureRevolve2(True, True, False, False, False, False, 0, 0,
                                           2 * math.pi, 0, False, False, 0, 0, 0, 0, 0, True, True, True)
    if f is None:
        raise RuntimeError("revolve returned None")
    set_material(doc)
    doc.ForceRebuild3(False)
    return doc, props(doc)


# ------------------------------------------------------------------------ P003
def p003(sw, e=20, s=25, n=5, W=60, t=8, d=10):
    doc = new_part(sw)
    sm = doc.SketchManager
    L = 2 * e + (n - 1) * s
    sketch_on(doc, ("plane", "Top Plane"))
    sm.CreateCornerRectangle(0, -W / 2 * MM, 0, L * MM, W / 2 * MM, 0)
    close_sketch(doc)
    select(doc, "Sketch1", "SKETCH")
    extrude(doc, t * MM)
    sketch_on(doc, ("face", 5 * MM, t * MM, 20 * MM))          # a point on the top face, clear of the holes
    for k in range(n):
        sm.CreateCircleByRadius((e + k * s) * MM, 0, 0, d / 2 * MM)
    close_sketch(doc)
    select(doc, "Sketch2", "SKETCH")
    extrude(doc, 0, through_all=True, cut=True)
    set_material(doc)
    doc.ForceRebuild3(False)
    return doc, props(doc), L


def show(label, r, key):
    print("\n%s" % label)
    print("   SOLIDWORKS: volume %.3f mm3 | mass %.3f g | density %.0f kg/m3 | centre of mass (x,y,z) mm = (%.3f, %.3f, %.3f)"
          % (r["volume_mm3"], r["mass_g"], r["density_kgm3"], *r["com_mm"]))
    print("   key       : %s" % key)


RHO = 7800.0                      # the library steel, kg/m3; our formulas at the same density
CASES = []                        # (label, solidworks value, key value, tolerance)


def check(label, got, want, tol):
    ok = abs(got - want) <= tol
    CASES.append(ok)
    print("   %-34s SOLIDWORKS %12.4f   key %12.4f   %s" % (label, got, want, "MATCH" if ok else "*** DIFFERS ***"))


if __name__ == "__main__":
    sw = connect()
    which = sys.argv[1:] or ["p001", "p002", "p003"]
    try:
        if "p001" in which:
            doc, r = p001(sw)
            print("\nP001  stepped block 90x70x20, boss 40x10, hole 10   (SW reported density %.0f: material not applied, mass = volume x density by arithmetic)" % r["density_kgm3"])
            check("volume (mm3)", r["volume_mm3"], 136210.176, 0.01)
            check("centre of mass height (mm)", r["com_mm"][1], 11.297, 0.001)
        if "p002" in which:
            doc, r = p002(sw)
            print("\nP002  stepped shaft 25x50, 45x40, 30x40, bore 10    (SW reported density %.0f: material not applied, mass = volume x density by arithmetic)" % r["density_kgm3"])
            check("volume (mm3)", r["volume_mm3"], 106225.102, 0.01)
            check("centre of mass along axis (mm)", r["com_mm"][0], 70.730, 0.001)
        if "p003" in which:
            for n, length, mass7850 in ((5, 140.0, 502.858), (7, 190.0, 681.394)):
                doc, r, L = p003(sw, n=n)
                print("\nP003  plate with n = %d holes (length %s)            (SW reported density %.0f: material not applied, mass = volume x density by arithmetic)" % (n, L, r["density_kgm3"]))
                check("plate length (mm)", float(L), length, 1e-9)
                check("mass = SW volume x 7850 (g)", r["volume_mm3"] * 7850e-6, mass7850, 0.001)
        print("\n%s: %d of %d comparisons match" % ("ALL MATCH" if all(CASES) else "MISMATCH", sum(CASES), len(CASES)))
    finally:
        for title in made:
            try:
                sw.CloseDoc(title)
            except Exception:
                pass
