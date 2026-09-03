/**
 * COMMUNITY — the live spaces where 4TUN Hub's community gathers.
 * Structure only; all copy lives in the dictionaries (bilingual).
 * REAL-ONLY: every channel points to a space that exists today.
 */

import { WHATSAPP_COMMUNITY_URL, MEDIUM_URL, LINKEDIN_URL } from "@/lib/site";

export type CommunityChannel = {
  key: string;
  href: string;
  /** Rendered with the amber "Live now" badge. */
  live?: boolean;
};

export const communityChannels: CommunityChannel[] = [
  { key: "whatsapp", href: WHATSAPP_COMMUNITY_URL, live: true },
  { key: "rem", href: MEDIUM_URL },
  { key: "linkedin", href: LINKEDIN_URL },
];
