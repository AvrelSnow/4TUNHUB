# Sessions hosted in public: how the cards are made

Written 2026-11-24. The Academy page shows each session the Douala City SWUG
ran, hosted by Donfack Fortune, as a card with a picture, the speaker and the
date. A session with a recording opens a pop-up that plays it on 4TUNHub, with
what it covers and its chapters. Since 2026-11-25 a session without one is not
shown there. Only the Academy page has the cards: the founder page keeps its own
"Talks & conferences" list, by decision.

## Where the data is

`src/lib/talks.ts`. Each `Talk` may have `speaker`, `date` and a `recording`
(`videoId`, `length`, `poster`, `learn`, `chapters`). The card is
`src/components/SessionCard.tsx`; it reuses `VideoPlayer`, so the player loads
from YouTube's no-cookie domain only when a session is opened.

## What was checked (2026-11-24)

| Session | Date | Speaker | Recording |
|---|---|---|---|
| Mastering CSWA | 16 Sep 2025 | Yusuf Hossam | none on the group's channel |
| CSWP Mechanical Design | 4 Oct 2025 | Prasad Adiga | none |
| CSWP Sheet Metal | 30 Oct 2025 | Ali Haider | `ea48vDC7egc`, 1:05:56 |
| CSWE | 31 Jan 2026 | Yusuf Hossam | `tuub0Tcbv7I`, 2:09:19 |
| Topology optimisation (co-host Mansoura SWUG) | not stated | Ahmed Mohamed M. Saeed | `T_9mtjD07RU`, 1:16:29 |
| Assembly modelling | 5 Mar 2026 | Muhammad Huzaifa Aftab | `U0bChpkaVnI`, 1:15:26 |
| Essentials and best practices | 8 Apr 2026 | Zyad Eldmaty | `rkupNZhloCo`, 35:23 |

Dates and speakers come from the SWUGN event pages and from each recording's
description. The channel is `@TheDoualaCitySWUG`: five videos, all five used.
All five allow embedding (oEmbed answered 200). Playback inside the pop-up was
not seen in the in-app browser, which showed the player area blank.

## Rules

- A date, speaker, chapter or "what it covers" line is taken from a page or a
  description, never written by us.
- The poster is our own copy of the thumbnail (`public/images/sessions/`): the
  CSP allows no image from elsewhere.
- A session with no recording gets no card. If one is published, add
  `recording` and a poster.
- The recordings have auto-generated English captions (four of five). A full
  transcript was not added: it is long and auto-generated. The outline and
  chapters are what "read it here" means for now.
- Not yet answered: the "hosted" label. The recordings and event pages name
  Donfack Fortune as host and someone else as speaker; the cards say both.
