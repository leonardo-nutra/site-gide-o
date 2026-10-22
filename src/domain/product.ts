/** Catalog domain: what a product is, independent of where it is stored or shown. */

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  name: string;
  detail: string;
  /** Display price in pt-BR format ("17,90"). Use `parsePrice` for arithmetic. */
  price: string;
  unit: string;
  image: string;
  /**
   * Illustrative "as installed" reference photo — a generic environment
   * shot in a similar tone, not a photo of this exact batch/lot.
   */
  applicationImage: string;
  /** Optional product video URL — empty string when none was uploaded. */
  video: string;
  /** Department id from `categories` in `@/config/site` (e.g. "pisos"). */
  category: string;
  /** Hand-picked offer: shown in the home carousel and tagged OFERTA. */
  featured: boolean;
  specs: ProductSpec[];
};

/** Shown for catalog items that don't have a photo yet. */
export const PLACEHOLDER_IMAGE = "/images/sem-foto.svg";
