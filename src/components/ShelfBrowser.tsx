"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Zoomable } from "@/components/Zoomable";
import { cn } from "@/lib/cn";
import { SHELF_KINDS, SHELF_LANGS, SHELF_PRICES, SHELF_SUBJECTS, type ShelfSubject } from "@/lib/shelf-filters";
import type { ShelfItem } from "@/lib/shelf";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/** A shelf item with its words already in the reader's language. */
export type ShelfCard = Omit<ShelfItem, "hook" | "about" | "internal" | "product"> & {
  hook: string;
  about: string;
  external: boolean;
  /** Present only for something we sell and can take payment for. */
  sale?: { price: string; payHref: string };
};

const FILTERS = [
  { key: "kind", options: SHELF_KINDS },
  { key: "subject", options: SHELF_SUBJECTS },
  { key: "lang", options: SHELF_LANGS },
  { key: "price", options: SHELF_PRICES },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];
type Selected = Record<FilterKey, string>;

const NONE: Selected = { kind: "", subject: "", lang: "", price: "" };

/** Our own covers: a colour per subject, no publisher's artwork. */
const SPINE: Record<ShelfSubject, string> = {
  mechanical: "bg-primary",
  electronics: "bg-dot-blue",
  maths: "bg-dot-violet",
  programming: "bg-dot-green",
  design: "bg-dot-red",
};

/** Lower case without accents, so "resistance" finds "Résistance". */
const plain = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function ShelfBrowser({
  cards,
  labels,
  waitlistHref,
}: {
  cards: ShelfCard[];
  labels: Dictionary["shelf"];
  waitlistHref: string;
}) {
  const [selected, setSelected] = useState<Selected>(NONE);
  const [query, setQuery] = useState("");

  const words = plain(query).split(/\s+/).filter(Boolean);
  const visible = cards.filter((card) => {
    if (FILTERS.some(({ key }) => selected[key] && card[key] !== selected[key])) return false;
    const text = plain(
      `${card.title} ${card.by} ${card.hook} ${card.about} ${labels.filters.subject.options[card.subject]}`,
    );
    return words.every((w) => text.includes(w));
  });
  const filtered = words.length > 0 || Object.values(selected).some(Boolean);

  const reset = () => {
    setSelected(NONE);
    setQuery("");
  };

  return (
    <div>
      <label className="block">
        <span className="sr-only">{labels.searchLabel}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="h-12 w-full rounded-full border border-hairline bg-surface-2 px-6 text-base text-foreground placeholder:text-muted"
        />
      </label>

      <div className="mt-6 space-y-3">
        {FILTERS.map(({ key, options }) => {
          const copy = labels.filters[key];
          const names = copy.options as Record<string, string>;
          return (
            <div key={key} role="group" aria-label={copy.label} className="flex flex-wrap items-center gap-2">
              <span className="w-full text-2xs font-semibold text-muted sm:w-24">{copy.label}</span>
              {["", ...options].map((value) => {
                const on = selected[key] === value;
                return (
                  <button
                    key={value || "all"}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelected((s) => ({ ...s, [key]: value }))}
                    className={cn(
                      "h-9 rounded-full px-4 text-sm font-medium transition-colors duration-200",
                      on ? "bg-secondary text-secondary-foreground" : "bg-surface text-muted hover:text-foreground",
                    )}
                  >
                    {value ? names[value] : labels.all}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="readout">
          {visible.length} / {cards.length} {labels.results}
        </p>
        {filtered && (
          <Button variant="ghost" size="sm" onClick={reset}>
            {labels.reset}
          </Button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-surface p-8 text-center sm:p-12">
          {/* Nothing of ours is on sale yet: say that, rather than "no result". */}
          {selected.price === "paid" ? (
            <>
              <p className="text-headline text-foreground">{labels.noPaid}</p>
              <div className="mt-6">
                <Button as="a" href={waitlistHref}>
                  {labels.joinList}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-headline text-foreground">{labels.empty}</p>
          )}
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((card) => (
            <li key={card.url} className="flex flex-col overflow-hidden rounded-3xl bg-surface">
              {card.preview ? (
                <Zoomable
                  src={card.preview}
                  alt={`${labels.preview} · ${card.title}`}
                  label={`${labels.enlarge} · ${card.title}`}
                  closeLabel={labels.close}
                  className="aspect-video"
                />
              ) : (
                <div aria-hidden="true" className="relative flex aspect-video items-end bg-secondary p-5 pl-8">
                  <span className={cn("absolute inset-y-0 left-0 w-3", SPINE[card.subject])} />
                  <span className="line-clamp-3 text-lg leading-snug font-bold tracking-tight text-secondary-foreground">
                    {card.title}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="amber">{card.sale ? card.sale.price : labels.filters.price.options[card.price]}</Badge>
                  <Badge variant="outline">{labels.filters.kind.one[card.kind]}</Badge>
                  <Badge variant="outline">{labels.filters.lang.options[card.lang]}</Badge>
                </div>
                <h3 className="mt-4 text-lg leading-snug font-semibold tracking-tight text-foreground">{card.title}</h3>
                <p className="mt-1 text-2xs font-semibold tracking-wide text-accent">{card.by}</p>
                <p className="mt-3 text-sm leading-6 font-semibold text-foreground">{card.hook}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{card.about}</p>
                <div className="mt-auto pt-6">
                  {card.sale ? (
                    <Button as="a" href={card.sale.payHref} target="_blank" rel="noopener noreferrer">
                      {labels.buy}
                    </Button>
                  ) : (
                    <ArrowLink href={card.url} external={card.external}>
                      {card.external ? labels.readFree : labels.start}
                    </ArrowLink>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
