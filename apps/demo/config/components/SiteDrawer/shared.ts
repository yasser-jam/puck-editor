import type { LinkValue } from "../../fields/LinkField";

export type SiteDrawerLink = {
  label: string;
  labelAr?: string;
  link?: LinkValue;
  href?: string;
};

export type SiteDrawerSide = "left" | "right";
export type SiteDrawerAnimation = "slide" | "fade" | "scale" | "none";
export type SiteDrawerIcon =
  | "menu"
  | "filter"
  | "cart"
  | "user"
  | "panel"
  | "none";
export type SiteDrawerTrigger = "floating" | "auto" | "external" | "none";

export const DEFAULT_DRAWER_LINKS: SiteDrawerLink[] = [
  {
    label: "Home",
    labelAr: "الرئيسية",
    link: { kind: "page", pageId: "/" },
  },
  {
    label: "Shop",
    labelAr: "المتجر",
    link: { kind: "page", pageId: "/products/example-product" },
  },
  {
    label: "Cart",
    labelAr: "السلة",
    link: { kind: "page", pageId: "/cart" },
  },
];
