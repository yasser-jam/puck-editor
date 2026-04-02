/** Serialized on button props as `buttonAction` (e.g. in page JSON). */

export const BUTTON_ACTIONS = [
  "link",
  "login",
  "logout",
  "addToCart",
  "addToWishlist",
] as const;

export type ButtonAction = (typeof BUTTON_ACTIONS)[number];

export const BUTTON_ACTION_OPTIONS: { label: string; value: ButtonAction }[] = [
  { label: "Link (set URL below)", value: "link" },
  { label: "Login", value: "login" },
  { label: "Logout", value: "logout" },
  { label: "Add to cart", value: "addToCart" },
  { label: "Add to wishlist", value: "addToWishlist" },
];

/** Human-readable name for demos / alerts. */
export function buttonActionLabel(action: ButtonAction): string {
  const map: Record<ButtonAction, string> = {
    link: "Link",
    login: "Login",
    logout: "Logout",
    addToCart: "Add to cart",
    addToWishlist: "Add to wishlist",
  };
  return map[action];
}
