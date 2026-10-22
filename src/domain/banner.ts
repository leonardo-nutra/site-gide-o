/** Home page banner slots. */
export type BannerPlacement = "hero" | "secondary" | "offers" | "duo";

export type Banner = {
  id: string;
  title: string;
  image: string;
  link: string;
};
