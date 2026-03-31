// ─── Page registry ────────────────────────────────────────────────────────────
// Single source of truth for all pages in the site.
// The Pages plugin reads this list; initial-data.ts provides the starter JSON
// for each path.

export type PageDefinition = {
  /** URL path, e.g. "/" or "/cart" */
  path: string;
  /** Human-readable name shown in the pages panel */
  label: string;
  /** Short description shown below the label */
  description: string;
  /** Lucide icon name (used by the plugin UI) */
  iconName: "Home" | "ShoppingCart" | "Package" | "Palette";
  /**
   * true = the path contains a dynamic segment (e.g. :product-slug).
   * The editor will load a representative example URL (examplePath).
   */
  dynamic?: boolean;
  /** The concrete path used for editing when dynamic = true */
  examplePath?: string;
};

export const PAGES: PageDefinition[] = [
  {
    path: "/",
    label: "Home",
    description: "Main landing page",
    iconName: "Home",
  },
  {
    path: "/themes",
    label: "Theme gallery",
    description: "Browse and edit theme presets",
    iconName: "Palette",
  },
  {
    path: "/products/:product-slug",
    label: "Product Details",
    description: "Individual product page",
    iconName: "Package",
    dynamic: true,
    examplePath: "/products/example-product",
  },
  {
    path: "/cart",
    label: "Cart",
    description: "Shopping cart & checkout",
    iconName: "ShoppingCart",
  },
];

/** Returns the path used for the editor URL (substitutes dynamic segments) */
export function getEditPath(page: PageDefinition): string {
  return page.examplePath ?? page.path;
}

/** Derives the current page (if any) from a browser pathname like "/cart/edit" */
export function matchCurrentPage(pathname: string): PageDefinition | undefined {
  // Strip trailing "/edit"
  const current = pathname.replace(/\/edit$/, "") || "/";
  return PAGES.find(
    (p) => (p.examplePath ?? p.path) === current
  );
}
