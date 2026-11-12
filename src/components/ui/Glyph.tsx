/**
 * Line icons for menus and the footer: 20px grid, 1.6 stroke, round caps,
 * drawn in `currentColor` so they take the hue of whatever holds them.
 * Kept to the handful the site needs; no icon library ships.
 */
export type GlyphName =
  | "gear"
  | "leaf"
  | "cap"
  | "play"
  | "letter"
  | "building"
  | "person"
  | "train"
  | "mail"
  | "linkedin"
  | "youtube"
  | "whatsapp"
  | "medium"
  | "cube";

const paths: Record<GlyphName, React.ReactNode> = {
  gear: (
    <>
      <circle cx="10" cy="10" r="2.6" />
      <path d="M10 2.5v2.2M10 15.3v2.2M2.5 10h2.2M15.3 10h2.2M4.7 4.7l1.6 1.6M13.7 13.7l1.6 1.6M4.7 15.3l1.6-1.6M13.7 6.3l1.6-1.6" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 16c0-7 4.5-11 12-12-.5 7.5-4.5 12-11 12" />
      <path d="M4 16l6.5-6.5" />
    </>
  ),
  cap: (
    <>
      <path d="m2.5 8 7.5-3.5L17.5 8 10 11.5z" />
      <path d="M5.5 9.5v3.6c1.2 1.1 2.7 1.7 4.5 1.7s3.3-.6 4.5-1.7V9.5M17.5 8v4" />
    </>
  ),
  play: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" rx="3" />
      <path d="m8.5 7.8 3.6 2.2-3.6 2.2z" fill="currentColor" />
    </>
  ),
  letter: (
    <>
      <path d="M5 2.5h7l3 3v12H5z" />
      <path d="M12 2.5v3h3M7.5 9h5M7.5 12h5M7.5 15h3" />
    </>
  ),
  building: (
    <>
      <path d="M3.5 17.5V6l6.5-3.5L16.5 6v11.5" />
      <path d="M2.5 17.5h15M7.5 17.5v-4h5v4M7 8.5h1.5M11.5 8.5H13" />
    </>
  ),
  person: (
    <>
      <circle cx="10" cy="6.5" r="3" />
      <path d="M4 17c.7-3.2 3.1-5 6-5s5.3 1.8 6 5" />
    </>
  ),
  train: (
    <>
      <rect x="4.5" y="2.5" width="11" height="11" rx="3" />
      <path d="M4.5 9h11M7.5 16.5 6 18M12.5 16.5 14 18M7.2 11.3h.1M12.7 11.3h.1" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" rx="2.5" />
      <path d="m3 5.5 7 5.5 7-5.5" />
    </>
  ),
  linkedin: (
    <>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3" />
      <path d="M6.5 9v5M6.5 6.3v.1M9.5 14V9M9.5 11.2c0-1.4.9-2.2 2.1-2.2s1.9.8 1.9 2.2V14" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.8 6.3c.1-1.2 1-2 2.2-2.1C6.5 4 8.2 4 10 4s3.5 0 5 .2c1.2.1 2.1.9 2.2 2.1.2 1.2.2 2.4.2 3.7s0 2.5-.2 3.7c-.1 1.2-1 2-2.2 2.1-1.5.2-3.2.2-5 .2s-3.5 0-5-.2c-1.2-.1-2.1-.9-2.2-2.1C2.6 12.5 2.6 11.3 2.6 10s0-2.5.2-3.7z" />
      <path d="m8.5 7.6 4 2.4-4 2.4z" fill="currentColor" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.3 16.7 4.4 13A7 7 0 1 1 7 15.6z" />
      <path d="M7.6 7.4c.2-.5.6-.5.8-.5h.4l.9 1.9-.6.8c.5 1 1.3 1.8 2.3 2.3l.8-.6 1.9.9v.4c0 .3-.1.6-.5.8-.6.3-1.4.4-2.6-.2a7 7 0 0 1-3.3-3.3c-.4-1.1-.3-2-.1-2.5z" />
    </>
  ),
  medium: (
    <>
      <circle cx="6.5" cy="10" r="4" />
      <ellipse cx="13.3" cy="10" rx="1.9" ry="3.8" />
      <path d="M17.3 6.4v7.2" />
    </>
  ),
  cube: (
    <>
      <path d="m10 2.5 6.5 3.7v7.6L10 17.5l-6.5-3.7V6.2z" />
      <path d="m3.5 6.2 6.5 3.7 6.5-3.7M10 9.9v7.6" />
    </>
  ),
};

export function Glyph({ name, className = "h-5 w-5" }: { name: GlyphName; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
