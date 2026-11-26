"""Export the 4TUNHUB Lab's challenges and learn units into the site.

The seven challenges (the wall bracket and P001-P006) are data in the Lab
repository. This script writes what the browser needs to show them:

    python scripts/export-lab-challenges.py --lab C:\\4TUNHUBLAB.COM

    src/content/practice.json   steps, parameter spaces, EN + FR strings,
                                briefs (HTML with {{placeholders}}) and
                                drawings (SVG with {{placeholders}})
    src/content/warmup.json     the bracket's learn units, in the same
                                markup as the guided path's lessons

The formulas are NOT exported: they are rewritten in src/lib/practice/ and
held to the Lab's Python by scripts/lab-parity.py + check-lab-parity.mjs.

The bracket's brief is edited here, because the Lab's text promises an
upload, a checker queue and a tutor that this site does not have. Every
edit asserts that it found its target, so a change in the Lab stops the
export instead of shipping a false promise.
"""

import argparse
import html
import json
import re
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parents[1]
LANGS = ("en", "fr")
BRACKET = "001-bracket"


def need(text, pattern, repl, what, flags=re.S):
    new, n = re.subn(pattern, lambda m: repl, text, count=1, flags=flags)
    if not n:
        sys.exit("export: could not find %s - the Lab's text changed" % what)
    return new


def words(phrase):
    """A phrase as a pattern that ignores where the Markdown wraps."""
    return r"\s+".join(re.escape(w) for w in phrase.split())


# What replaces the Lab's promises in the bracket brief, by language.
BRIEF_EDITS = {
    "en": {
        "yours": "> **These numbers are yours.** Ask for new numbers and this sheet changes with them.",
        "hand_in": "> **You answer eight questions** under this sheet. Modelling the part is\n> good practice; checking an uploaded file is not available here yet.",
        "geometry": ("This is the most common way to fail the geometry check",
                     "This is the most common way to get the part wrong"),
        "chain": [
            ("The Lab and your report call them steps 1 to 8.", "The answer boxes call them steps 1 to 8."),
            ("on the Lab's map", "on the path"),
        ],
        "part_head": "## 8 · The part (optional here)",
        "part_intro": "To finish the job, model the bracket in any CAD program. Checking your file is\nnot available here yet: your eight answers are what is checked.",
        "units_note": r"A part modelled in inches measures.*?round trip\.",
        "units_new": "A part modelled in inches measures about twenty-five times too small.",
        "after": "**After you send it.**",
        "learn": "*Learn it: Card 5, From numbers to a part.*",
    },
    "fr": {
        "yours": "> **Ces valeurs sont les vôtres.** Demandez de nouvelles valeurs et cette\n> feuille change avec elles.",
        "hand_in": "> **Vous répondez à huit questions** sous cette feuille. Modéliser la pièce\n> est un bon exercice ; la vérification d'un fichier envoyé n'est pas encore\n> disponible ici.",
        "geometry": ("C'est la façon la plus courante d'échouer au contrôle géométrique",
                     "C'est la façon la plus courante de rater la pièce"),
        "chain": [
            ("Le Lab et votre rapport les appellent étapes 1 à 8.", "Les cases de réponse les appellent étapes 1 à 8."),
            ("sur la carte du Lab", "sur le parcours"),
            # False once values print with a French comma.
            ("Les nombres de cette feuille utilisent le point décimal. ", ""),
            ("les pages « Apprendre » de votre dossier couvrent", "les questions d'échauffement de la page Pratique couvrent"),
        ],
        "part_head": "## 8 · La pièce (facultatif ici)",
        "part_intro": "Pour terminer le travail, modélisez la console dans n'importe quel logiciel de\nCAO. La vérification de votre fichier n'est pas encore disponible ici : ce sont\nvos huit réponses qui sont vérifiées.",
        "units_note": r"Une pièce modélisée en pouces mesure.*?perdu\.",
        "units_new": "Une pièce modélisée en pouces mesure environ vingt-cinq fois trop petit.",
        "after": "**Après l'envoi.**",
        "learn": "*Pour apprendre : carte 5, Des nombres à la pièce.*",
    },
}


def bracket_brief(md, lang):
    e = BRIEF_EDITS[lang]
    md = need(md, r"> \*\*(These numbers are yours|Ces valeurs sont les vôtres)\.\*\*.*?(?=\n\n)", e["yours"], "the 'yours' note")
    md = need(md, r"> \*\*(You hand in two things|Vous rendez deux choses)\.\*\*.*?(?=\n\n---)", e["hand_in"], "the hand-in note")
    md = need(md, words(e["geometry"][0]), e["geometry"][1], "the geometry sentence")
    for old, new in e["chain"]:
        md = need(md, words(old.strip()) + (r"\s*" if old.endswith(" ") else ""), new, repr(old))
    start = md.find("\n## 8 ·")
    end = md.find(e["after"])
    if start < 0 or end < start:
        sys.exit("export: section 8 of the bracket brief moved")
    part = md[start:end]
    part = need(part, r"## 8 ·[^\n]*\n\n.*?(?=\n\n)", e["part_head"] + "\n\n" + e["part_intro"], "section 8's opening")
    part = need(part, e["units_note"], e["units_new"], "the units sentence")
    return md[:start] + part.rstrip() + "\n\n" + e["learn"] + "\n"


def clean_svg(text, page_mod):
    """A drawing that renders as an <img>: no dark ink (the site has one,
    white, theme) and no line naming a student."""
    text = page_mod.inline_svg(text)
    text = re.sub(r"@media\s*\(prefers-color-scheme:\s*dark\)\s*\{(?:[^{}]*\{[^{}]*\})*\s*\}", "", text)
    text = re.sub(r"<text[^>]*>[^<]*\{\{student_name\}\}[^<]*</text>", "", text)
    if "student_name" in text or "prefers-color-scheme" in text:
        sys.exit("export: a drawing still names a student or has dark ink")
    return text


def challenge_entry(folder, lab, page_mod):
    spec = yaml.safe_load((folder / "challenge.yaml").read_text(encoding="utf-8"))
    strings = yaml.safe_load((folder / "strings.yaml").read_text(encoding="utf-8"))
    briefs, drawings = {}, {}
    for lang in LANGS:
        md = (folder / ("brief.%s.md" % lang)).read_text(encoding="utf-8").replace("\r\n", "\n")
        md = need(md, r"^\*\*\{\{student_name\}\}[^\n]*\n", "", "the name line of %s" % folder.name, re.M)
        # The page prints its own title.
        md = need(md, r"^# [^\n]*\n", "", "the title of %s" % folder.name, re.M)
        if folder.name == BRACKET:
            md = bracket_brief(md, lang)
        pictures, found = {}, {}
        for alt, src in re.findall(r"!\[([^\]]*)\]\(([^)]+)\)", md):
            file = folder / src
            localised = file.with_name(file.stem + "." + lang + file.suffix)
            found[src] = clean_svg((localised if localised.is_file() else file).read_text(encoding="utf-8"), page_mod)
            marker = '<img data-drawing="%s" alt="%s">' % (src, html.escape(alt))
            pictures[src] = {"svg": marker, "pan": src.startswith("drawing")}
        briefs[lang] = page_mod.markdown_to_html(md, pictures, lang)
        drawings[lang] = found
    return {
        "id": spec["id"],
        "version": str(spec["version"]),
        "title": spec["title"],
        "constants": spec["constants"],
        "params": spec["params"],
        "attempts": int(spec["attempts"]["per_step"]),
        "steps": [{"id": s["id"], "unit": s.get("unit", ""), "signed": bool(s.get("signed")),
                   "tolerance": s["tolerance"]} for s in spec["steps"]],
        "strings": {k: strings[k] for k in ("step", "diagnosis", "hint")},
        "brief": briefs,
        "drawings": drawings,
    }


# ------------------------------------------------------------- warm-up --

CHECK_HEADING = {"en": "### Check yourself", "fr": "### Vérifiez-vous"}
WORDS = {
    "en": {"label": "Check yourself", "answer": "Your answer", "check": "Check"},
    "fr": {"label": "Vérifiez-vous", "answer": "Votre réponse", "check": "Vérifier"},
}
UNIT_TEXT = {"N.mm": "N·mm", "mm3": "mm³", "-": ""}
UPLOAD_NOTE = {
    "en": "<p><em>Uploading a file to be checked is not available here yet.</em></p>",
    "fr": "<p><em>L'envoi d'un fichier à vérifier n'est pas encore disponible ici.</em></p>",
}


def band(value, tolerance):
    kind = tolerance.get("type", "rel")
    slack = 0.0 if kind == "exact" else float(tolerance["value"])
    if kind == "rel":
        slack *= abs(value)
    return value - slack, value + slack


def warmup(challenge, learn, page_mod, lang):
    w = WORDS[lang]
    md = learn.render(lang, answers=True)
    sections = re.split(r"(?m)^## ", md)
    reveals = {m.group(1): m.group(2).strip()
               for m in re.finditer(r"(?m)^\| (\d\.\d) \| (.*?) \|\s*$", md)}
    prefix = {"en": "Unit ", "fr": "Unité "}[lang]
    bracket = next((s for s in sections if s.lower().startswith(
        {"en": "the practice bracket", "fr": "la console d'entraînement"}[lang])), None)
    unit_sections = [s for s in sections if s.startswith(prefix)]
    if bracket is None or len(unit_sections) != len(learn.units):
        sys.exit("export: the learn page's headings changed (%s)" % lang)

    def block(text):
        text = re.sub(r"(?m)^---\s*$", "", text).strip()
        return page_mod.markdown_to_html(text, None, lang)

    def step(body):
        return '<section class="prose step">%s</section>' % body

    out = []
    for number, (unit, section) in enumerate(zip(learn.units, unit_sections), 1):
        title, rest = section.split("\n", 1)
        teaching, asked = rest.split(CHECK_HEADING[lang])
        parts = [step(block("## " + bracket)), step(block(teaching))]
        if unit["id"] == "model":
            parts.insert(0, step(UPLOAD_NOTE[lang]))
        items = re.split(r"(?m)^\d+\.\s+", re.sub(r"(?m)^---\s*$", "", asked).strip())[1:]
        qids = [q for q in learn.question_ids if learn.questions[q]["unit"] == unit["id"]]
        if len(items) != len(qids):
            sys.exit("export: unit %s has %d questions on the page, %d in learn.yaml"
                     % (unit["id"], len(items), len(qids)))
        for i, (qid, item) in enumerate(zip(qids, items), 1):
            q = learn.questions[qid]
            cid = "learn_" + qid
            prompt = " ".join(item.split())
            reveal = page_mod._inline(reveals["%d.%d" % (number, i)])
            if "choice" in q:
                bits = re.split(r"\(([abc])\)\s*", prompt)
                prompt, options = bits[0], dict(zip(bits[1::2], bits[2::2]))
                if sorted(options) != sorted(q["choice"]):
                    sys.exit("export: could not read the options of %s (%s)" % (qid, lang))
                attrs = 'data-answer="%s"' % q["answer"]
                control = '<div class="options" role="radiogroup">%s</div>' % "".join(
                    '<label class="option"><input type="radio" name="%s" value="%s">'
                    '<span class="option-key">%s</span><span>%s</span></label>'
                    % (cid, k, k, page_mod._inline(options[k].strip())) for k in q["choice"])
            else:
                target = learn.graded_step(qid)
                lo, hi = band(float(learn.answers[qid]), target.tolerance)
                attrs = 'data-lo="%r" data-hi="%r"' % (lo, hi)
                control = ('<div class="answer-row"><input class="answer" inputmode="decimal" '
                           'autocomplete="off" aria-label="%s"><span class="answer-unit">%s</span></div>'
                           % (w["answer"], UNIT_TEXT.get(target.unit, target.unit)))
            parts.append(
                '<section class="part step"><div class="check" data-check="%s" %s>'
                '<p class="check-label"><span>%s</span></p>'
                '<div class="check-prompt"><p>%s</p></div>%s'
                '<div class="check-actions"><button type="button" class="pill check-go">%s</button></div>'
                '<p class="feedback" role="status" aria-live="polite"></p>'
                '<div class="reveal" hidden><p>%s</p></div></div></section>'
                % (cid, attrs, w["label"], page_mod._inline(prompt), control, w["check"], reveal))
        out.append({"id": "warmup-" + unit["id"],
                    "title": title.split("·", 1)[1].strip(),
                    "minutes": 5, "steps": parts})
    return out


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--lab", required=True, help="the 4TUNHUB Lab repository")
    lab = Path(ap.parse_args(argv).lab).resolve()
    sys.path.insert(0, str(lab / "checker"))
    mod = lambda name: __import__("4tunlab." + name, fromlist=[name])
    page_mod, challenge_mod, learn_mod, verdict = (
        mod("page"), mod("challenge"), mod("learn"), mod("verdict"))

    folders = sorted(f for f in (lab / "challenges").iterdir() if (f / "challenge.yaml").is_file())
    practice = {
        "source": "4TUNHUB Lab, challenges/",
        "status": verdict.STATUS_TEXT,
        "noDiagnosis": verdict.NO_DIAGNOSIS,
        "challenges": {f.name: challenge_entry(f, lab, page_mod) for f in folders},
    }
    for f in folders:
        if practice["challenges"][f.name]["id"] != f.name:
            sys.exit("export: %s declares another id" % f.name)
    bracket = challenge_mod.load(lab / "challenges" / BRACKET)
    learn = learn_mod.load(bracket)
    warm = {lang: warmup(bracket, learn, page_mod, lang) for lang in LANGS}

    for name, data in (("practice.json", practice), ("warmup.json", warm)):
        out = HERE / "src" / "content" / name
        out.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n",
                       encoding="utf-8", newline="\n")
        print(out.relative_to(HERE))
    print("%d challenges, %d warm-up questions" % (len(folders), len(learn.question_ids)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
