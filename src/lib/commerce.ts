/**
 * ============================================================
 * COMMERCE — a cross-cutting CAPABILITY, not a "Store" page.
 * (Locked decision, blueprint §10.)
 * ============================================================
 * Any item in any pillar can carry a Purchasable record: a paid
 * e-book lives in Resources, a paid course in Academy, a product
 * licence in Products — each sold in context. A future /store is
 * just an auto-generated view over `catalog` — zero redesign.
 *
 * Payments (when live) go through a hosted provider; card data
 * never touches our servers (security contract §7).
 */

export type Pillar =
  | "academy"
  | "resources"
  | "products"
  | "research"
  | "services";

export type PurchasableKind =
  | "course"
  | "workshop"
  | "ebook"
  | "template"
  | "license"
  | "publication";

export type Purchasable = {
  /** Stable unique id, kebab-case, e.g. "solidworks-foundations-course". */
  sku: string;
  title: string;
  /** The pillar this item belongs to — where it is sold, in context. */
  pillar: Pillar;
  kind: PurchasableKind;
  price: {
    amount: number;
    /** XAF first (Cameroon), USD for international digital goods. */
    currency: "XAF" | "USD";
  };
  /** e.g. "PDF", "video course", "on-site workshop". */
  format?: string;
  status: "draft" | "waitlist" | "available";
  /** Where the item lives on the site. */
  href: string;
  /**
   * The provider-hosted page where the buyer pays (Fapshi first; see
   * docs/security/09-payment-readiness.md). Every payee is listed here and
   * nowhere else, so a review sees them all at once. Read it through
   * `paymentUrl()`, which refuses anything off the allow-list below.
   */
  payment?: string;
};

/**
 * Hosts a "Pay" link may point at. A link to anywhere else is treated as
 * missing: someone who slips a personal number or a look-alike page into
 * the catalogue still cannot route a buyer's money to it.
 */
const PAYMENT_HOSTS = ["fapshi.com"];

export function paymentUrl(item: Purchasable): string | null {
  if (!item.payment) return null;
  let url: URL;
  try {
    url = new URL(item.payment);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  const allowed = PAYMENT_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  return url.protocol === "https:" && allowed ? url.href : null;
}

/**
 * The catalog. Empty by design until the first real item ships —
 * placeholder products never go on sale (craft contract §6).
 * The moment one item lands here, it is sellable in its pillar.
 */
export const catalog: Purchasable[] = [];

/** The future /store page is exactly this view — nothing more. */
export function storefront(): Purchasable[] {
  return catalog.filter((p) => p.status !== "draft");
}
