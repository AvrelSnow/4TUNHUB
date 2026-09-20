/**
 * Testimonials — what other people say about 4TUN Hub, in their words.
 *
 * REAL-ONLY, and the rule is not negotiable (craft contract §1, and the
 * locked trust decision in blueprint.ts): every quote here must be
 * something a named person actually said, with their permission to print
 * it. No composites, no "representative" quotes, no tidying a sentence
 * into something they did not say. A fabricated testimonial is the one
 * mistake a visitor can never forgive, and the one an engineer from the
 * same city will spot first.
 *
 * The section renders NOTHING while this list is empty, so the site is
 * never caught holding an empty frame. Add entries as they arrive.
 *
 * Where they come from, in order of how much they are worth:
 *   1. Cohort 0 participants, from mid-November: the strongest, because
 *      they come with a pass rate attached.
 *   2. Members of the Douala City SWUG and the WhatsApp community, on the
 *      group and the sessions. Available today — ask three people.
 *   3. Clients of the engineering work, on a delivered project.
 *
 * How to ask, so the answer is usable: "In two sentences, what changed
 * for you?" A general compliment is worth nothing; a specific before and
 * after is worth everything.
 */
export type Testimonial = {
  /** Their words, unedited beyond trimming. Two or three sentences. */
  quote: string;
  /** Full name. An anonymous testimonial is not a testimonial. */
  name: string;
  /** What they do, and where — "3rd-year mechanical, IUC Douala". */
  role: string;
  /** Optional JPEG/PNG/WebP in public/images/people. Fine to omit. */
  photo?: string;
  /** Optional: a profile a reader can check. Proof beats assertion. */
  href?: string;
};

export const testimonials: Testimonial[] = [];
