import { LINKEDIN_URL, MEDIUM_URL } from "./site";

/**
 * ============================================================
 * BLOG / WRITING — real-only, same contract as trust.ts.
 * ============================================================
 * Structural facts only (slug, date, source, tags). Every word of
 * prose lives in the dictionaries so EN/FR parity stays enforced by
 * the type system.
 *
 * `posts` is EMPTY on purpose. Nothing is invented here: an article
 * appears when a real one exists, exactly as the store lists nothing
 * until something is genuinely for sale. The empty state is honest and
 * still useful — it sends readers to the places the writing already
 * lives.
 *
 * A post can be native or syndicated. When a piece was first published
 * on Medium or in The REM, `canonical` points at the original so we
 * never compete with it in search — a self-inflicted duplicate-content
 * problem is the classic way a new blog damages an existing audience.
 */

export type PostSource = "native" | "medium" | "rem";

export type Post = {
  slug: string;
  /** ISO date, used for sorting and for the article schema. */
  date: string;
  source: PostSource;
  /** Original URL when first published elsewhere. Required unless native. */
  canonical?: string;
  readingMinutes: number;
  tags: string[];
  /** Hidden from the index and from the sitemap while true. */
  draft?: boolean;
};

/** Real articles only. Empty renders the hub below instead. */
export const posts: Post[] = [];

export const publishedPosts = (): Post[] =>
  posts.filter((p) => !p.draft).sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug && !p.draft);

/**
 * Where the writing lives today. These are real, active surfaces — the
 * same URLs the founder page links — not placeholders.
 */
export type Publication = {
  key: "rem" | "medium";
  href: string;
  /** Verified figure, or undefined. Never estimate an audience. */
  readers?: string;
};

export const publications: Publication[] = [
  { key: "rem", href: LINKEDIN_URL, readers: "3,200+" },
  { key: "medium", href: MEDIUM_URL },
];
