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
 * never caught holding an empty frame.
 *
 * Where they come from, in order of how much they are worth:
 *   1. Cohort 0 participants, from mid-November: the strongest, because
 *      they come with a pass rate attached.
 *   2. Members of the Douala City SWUG and the WhatsApp community, on the
 *      group and the sessions.
 *   3. Clients of the engineering work, on a delivered project.
 *
 * How to ask, so the answer is usable: "In two sentences, what changed
 * for you?" A general compliment is worth nothing; a specific before and
 * after is worth everything.
 */
export type Testimonial = {
  /**
   * What the card shows: one sentence, taken whole from the top of what
   * they wrote. Never a sentence stitched together from two places.
   */
  quote: string;
  /** Everything they wrote, kept whole, so nothing is lost to a layout. */
  full?: string;
  /** Full name. An anonymous testimonial is not a testimonial. */
  name: string;
  /** What they do, and where — "3rd-year mechanical, IUC Douala". */
  role: string;
  /** Optional JPEG/PNG/WebP in public/images/people. Fine to omit. */
  photo?: string;
  /** Optional: a profile a reader can check. Proof beats assertion. */
  href?: string;
};

/**
 * Collected 20 September 2026, with each person's permission to print.
 *
 * `quote` is what the card shows: ONE sentence, taken whole from the top
 * of what they wrote. A card is read in about two seconds, and three
 * paragraphs on it are three paragraphs nobody finishes. `full` keeps
 * every word they gave, so shortening the card never loses the statement.
 *
 * ONE edit was made to all three, recorded here rather than hidden: each
 * of them wrote "Fortune Hub" — the name people use for him rather than
 * the organisation's own — and it is printed as "4TUN Hub". Nothing else
 * was touched: no shortening inside a sentence, no smoothing, no
 * reordering. Worth confirming the substitution with each of them.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "4TUN Hub represents the kind of platform Africa needs to strengthen its next generation of engineers, educators, and technology professionals.",
    full: [
      "4TUN Hub represents the kind of platform Africa needs to strengthen its next generation of engineers, educators, and technology professionals. What stands out to me is its focus on connecting knowledge, professional development, and collaboration within a growing African engineering community.",
      "In a world where access to quality technical knowledge and professional networks can significantly shape a person’s trajectory, platforms like 4TUN Hub can help create bridges between talent, opportunity, and innovation. I see great value in building communities that encourage African professionals to learn from one another, develop globally relevant skills, and contribute solutions to the challenges around them.",
      "4TUN Hub is contributing to that vision by creating a space where people can learn, connect, and build.",
    ].join("\n\n"),
    name: "Mikel K. Ngueajio",
    role:
      "LLM evaluation, safety & content-moderation researcher · PhD (ABD), Howard University · Amazon AWS Fellow, Apple AIML Scholar",
    photo: "/images/people/mikel-ngueajio.webp",
  },
  {
    quote:
      "As a mechanical engineering student, being part of 4TUN Hub has given me an environment where I can learn beyond the classroom, connect with other engineers, and better understand what it means to grow as a professional.",
    full: [
      "As a mechanical engineering student, being part of 4TUN Hub has given me an environment where I can learn beyond the classroom, connect with other engineers, and better understand what it means to grow as a professional.",
      "4TUN Hub encourages me to keep improving my technical skills, explore new ideas, and see engineering not only as a degree, but as a tool for creating solutions and opportunities.",
      "I believe communities like 4TUN Hub are important for young African engineers because they give us the opportunity to learn, collaborate, and prepare ourselves for the challenges of the engineering profession.",
    ].join("\n\n"),
    name: "Tanga Jatsa Lewouhdem Françoise Maelle",
    role: "Mechanical engineering student · 4TUN Hub member",
    photo: "/images/people/tanga-jatsa-maelle.webp",
  },
  {
    quote:
      "Being part of 4TUN Hub has given me a valuable space to learn, connect, and grow professionally.",
    full: [
      "Being part of 4TUN Hub has given me a valuable space to learn, connect, and grow professionally. As an educator, I believe that continuous learning and access to the right professional community are essential for making a greater impact. 4TUN Hub brings together knowledge, engineering, education, and opportunities in a way that encourages young African professionals to keep developing themselves.",
      "For me, 4TUN Hub is more than a community; it is a platform that inspires growth, collaboration, and the continuous pursuit of excellence.",
    ].join("\n\n"),
    name: "Tatsinda Mathias Allan",
    role: "Accredited state educator · 4TUN Hub member",
    photo: "/images/people/tatsinda-mathias-allan.webp",
  },
];
