"""Export a 4TUNHUB Lab path into the Academy, as one JSON file.

The Lab (C:\\4TUNHUBLAB.COM, github AvrelSnow) holds the lessons as data
and renders them with its own engine: every number is the challenge's own,
filled in by its solution, and every practice check carries the band of
answers the grader would accept. This script runs that engine once and
writes what it produces, so the Academy needs no Python, no server and no
copy of the physics. The browser only compares a typed number to a band.

    python scripts/export-lab-path.py --lab C:\\4TUNHUBLAB.COM

Writes src/content/engineering-thinking.json. Re-run it whenever a lesson
changes in the Lab; never edit the JSON by hand.

The five cards are exported as open. The checkpoint (never built in the
Lab) and the final challenge (shown by export-lab-challenges.py, in
Practice) carry no lessons. Card 5 teaches the STEP file the Lab's checker
reads; the Academy has no checker, so the sentences promising one are
replaced.
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
OUT = HERE / "src" / "content" / "engineering-thinking.json"

# Cards that need the Lab's checker or grader stay in the Lab for now.
LAB_ONLY = {"checkpoint", "boss"}

# The lessons were written for the Lab. These few phrases name it as the
# place the student is; in the Academy that place is the path.
WORDING = [
    ("this Lab", "this path"),
    ("This Lab", "This path"),
    ("The Lab accepts your answer", "The final challenge accepts your answer"),
    # Nothing here reads an uploaded file.
    ("Model the part and send a STEP file a checker accepts", "Model the part and export it as a STEP file"),
    ("export a STEP file the checker reads", "export it as a STEP file"),
    ("From CAD to a file the checker reads", "From CAD to a STEP file"),
]

# Card 5 promises an upload the Academy does not have: these paragraphs are
# replaced in the rendered lesson, and the export stops if one has moved.
NO_UPLOAD = "<p><em>Uploading a file to be checked is not available here yet.</em></p>"
PROMISES = {
    "export": [
        (r"<p><strong>What happens after you send it\.</strong>.*?</p>", NO_UPLOAD),
        (r"\s*The proof is the part itself: send it with the challenge\.", ""),
    ],
}

# Said at the top of each Card 5 lesson: they describe that checker.
CHECKER_NOTE = ("<p><em>This lesson describes an automatic file checker. "
                "It is not available here yet.</em></p>")

# A lesson step: a <section> whose class list includes `step`. Steps never
# nest a <section>, so the first closing tag ends one.
STEP = re.compile(r'<section class="[^"]*\bstep\b[^"]*"[^>]*>.*?</section>', re.S)


def reword(text):
    for old, new in WORDING:
        text = text.replace(old, new)
    return text


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--lab", required=True, help="the 4TUNHUB Lab repository")
    ap.add_argument("--path", default="branch-1")
    args = ap.parse_args(argv)

    lab = Path(args.lab).resolve()
    sys.path.insert(0, str(lab / "checker"))
    path_mod = __import__("4tunlab.path", fromlist=["path"])

    p = path_mod.load(lab / "paths" / args.path)
    problems = p.problems()
    if problems:
        for line in problems:
            print("error: " + line, file=sys.stderr)
        return 1

    r = path_mod.Renderer(p, "en", site=True)
    t = path_mod._t

    lessons = {}
    cards = []
    number = 0
    for n in p.nodes:
        if n["kind"] == "card":
            number += 1
        open_ = n["id"] not in LAB_ONLY
        entry = {
            "id": n["id"],
            "kind": n["kind"],
            "number": number if n["kind"] == "card" else None,
            "title": reword(t(n["title"], "en")),
            "need": list(t(n["need"], "en")),
            "able": [reword(x) for x in t(n["able"], "en")],
            "requires": list(n.get("requires", ())),
            "open": open_,
            "lessons": [],
        }
        for lid in n.get("lessons", ()):
            data = p.lesson(lid, "en")
            if data is None:
                continue
            entry["lessons"].append({
                "id": lid,
                "title": reword(data["title"]),
                "minutes": int(data.get("minutes", 5)),
            })
            if not open_:
                continue
            page = r.lesson(lid)
            for pattern, new in PROMISES.get(lid, ()):
                page, n_found = re.subn(pattern, new, page, count=1, flags=re.S)
                if not n_found:
                    print("error: lesson %s: %r has moved" % (lid, pattern), file=sys.stderr)
                    return 1
            steps = [reword(s) for s in STEP.findall(page)]
            if not steps:
                print("error: lesson %s rendered no steps" % lid, file=sys.stderr)
                return 1
            if n["id"] == "card-5":
                steps[0] = steps[0].replace(">", ">" + CHECKER_NOTE, 1)
            lessons[lid] = {
                "title": reword(data["title"]),
                "minutes": int(data.get("minutes", 5)),
                "card": n["id"],
                "steps": steps,
            }
        cards.append(entry)

    out = {
        "source": "4TUNHUB Lab, paths/%s v%s" % (args.path, p.version),
        "title": t(p.spec["title"], "en"),
        "tagline": t(p.spec["tagline"], "en"),
        "need": list(t(p.spec["need"], "en")),
        "able": [reword(x) for x in t(p.spec["able"], "en")],
        "cards": cards,
        "lessons": lessons,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n",
                   encoding="utf-8", newline="\n")
    print("%s: %d cards, %d lessons" % (OUT.relative_to(HERE), len(cards),
                                        len(lessons)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
