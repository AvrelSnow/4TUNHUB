"""
Freeze Mona Sans into the two static fonts the link-preview cards use.

next/og (Satori) reads TTF/OTF/WOFF only and draws a variable font at its
default instance, so it cannot use the site's variable WOFF2 directly. This
cuts two fixed instances from the same file the site ships
(@fontsource-variable/mona-sans, latin, width + weight axes):

  mona-sans-display.ttf   wght 800, wdth 116  — the claim, set wide like the site's headlines
  mona-sans-semibold.ttf  wght 600, wdth 100  — eyebrow, sub line, foot

Run after upgrading the font package; commit the output.

  pip install fonttools brotli
  python scripts/make-og-fonts.py
"""
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-normal.woff2"
OUT = ROOT / "src/assets/fonts"

INSTANCES = {
    "mona-sans-display.ttf": {"wght": 800, "wdth": 116},
    "mona-sans-semibold.ttf": {"wght": 600, "wdth": 100},
}

OUT.mkdir(parents=True, exist_ok=True)
for name, axes in INSTANCES.items():
    font = TTFont(SRC)
    static = instantiateVariableFont(font, axes, updateFontNames=False)
    static.flavor = None  # plain TTF: Satori does not read WOFF2
    static.save(OUT / name)
    print(f"{name}: {axes} -> {(OUT / name).stat().st_size // 1024} KB")
