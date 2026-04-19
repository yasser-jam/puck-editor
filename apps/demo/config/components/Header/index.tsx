import React, { CSSProperties } from "react";
import classnames from "classnames";
import { Menu, Filter, ShoppingCart, User } from "lucide-react";

import type { ShellVariant } from "../../theme";

import styles from "./styles.module.css";

export type HeaderDrawerIcon = "menu" | "filter" | "cart" | "user" | "none";

const DRAWER_ICON_MAP: Record<
  HeaderDrawerIcon,
  React.ComponentType<{ size?: number }> | null
> = {
  menu: Menu,
  filter: Filter,
  cart: ShoppingCart,
  user: User,
  none: null,
};

const normalizePath = (pathname: string) =>
  pathname.replace(/\/edit$/, "").replace(/\/$/, "") || "/";

const NavItem = ({
  label,
  href,
  variant,
}: {
  label: string;
  href: string;
  variant: ShellVariant;
}) => {
  const navPath =
    typeof window !== "undefined"
      ? normalizePath(window.location.pathname)
      : "/";

  const target = href.replace(/\/edit$/, "").replace(/\/$/, "") || "/";
  const isActive = navPath === target;

  if (variant === "commerce") {
    return (
      <a
        href={href || "/"}
        className={classnames(
          styles.navLinkCommerce,
          isActive && styles.navLinkCommerceActive
        )}
      >
        {label}
      </a>
    );
  }

  return (
    <a
      href={href || "/"}
      className={classnames(styles.navLink, isActive && styles.navLinkActive)}
    >
      {label}
    </a>
  );
};

// Merchants can rewrite the header nav from Root fields. The shape is the same
// as NavMenu so an AI agent can swap the two without touching this component.
export type HeaderLink = {
  label: string;
  labelAr?: string;
  href: string;
};

// Sensible defaults that match the demo: any new store sees something
// recognisable before the merchant edits the fields.
export const DEFAULT_HEADER_LINKS: HeaderLink[] = [
  { label: "Home", labelAr: "الرئيسية", href: "/" },
  { label: "Shop", labelAr: "المتجر", href: "/products/example-product" },
  { label: "Cart", labelAr: "السلة", href: "/cart" },
  { label: "Themes", labelAr: "القوالب", href: "/themes" },
];

export type HeaderProps = {
  editMode: boolean;
  variant?: ShellVariant;
  siteTitle?: string;
  /** Bilingual — resolved by Header based on `language`. */
  links?: HeaderLink[];
  language?: "ar" | "en";
  /** When false, the entire header band is hidden. */
  visible?: boolean;
  /** Optional brand href; defaults to "/". */
  brandHref?: string;
  /** CSS colour string (any valid CSS colour). Empty falls back to the theme. */
  backgroundColor?: string;
  textColor?: string;
  /**
   * When true, renders a hamburger/menu button on the start-edge of the
   * header. Clicking it toggles the site-wide drawer via its
   * `data-sooq-drawer-toggle` attribute — no JS wiring needed.
   */
  showDrawerButton?: boolean;
  drawerButtonIcon?: HeaderDrawerIcon;
  /** Which drawer name to toggle. Defaults to "site-drawer". */
  drawerName?: string;
};

const pickLabel = (link: HeaderLink, language: "ar" | "en"): string => {
  if (language === "ar" && link.labelAr && link.labelAr.trim()) return link.labelAr;
  return link.label || "";
};

const Header = ({
  editMode,
  variant = "commerce",
  siteTitle = "Meridian",
  links,
  language = "ar",
  visible = true,
  brandHref = "/",
  backgroundColor,
  textColor,
  showDrawerButton = false,
  drawerButtonIcon = "menu",
  drawerName = "site-drawer",
}: HeaderProps) => {
  if (!visible) return null;

  const resolvedLinks =
    Array.isArray(links) && links.length > 0 ? links : DEFAULT_HEADER_LINKS;

  // Inline-colour overrides. We only emit the style entry when a colour is
  // provided so that the themed defaults (CSS variables on :root) still take
  // effect when the merchant leaves the field empty.
  const rootStyle: CSSProperties = {};
  if (backgroundColor) rootStyle.background = backgroundColor;
  if (textColor) rootStyle.color = textColor;

  const DrawerIcon = DRAWER_ICON_MAP[drawerButtonIcon] ?? Menu;
  const drawerButton =
    showDrawerButton && DrawerIcon ? (
      <button
        type="button"
        className={styles.drawerToggle}
        data-sooq-drawer-toggle={drawerName}
        data-sooq-drawer-action="toggle"
        aria-label="Open menu"
      >
        <DrawerIcon size={20} />
      </button>
    ) : null;

  if (variant === "default") {
    return (
      <div className={styles.root} style={rootStyle}>
        <header className={styles.inner}>
          {drawerButton}
          <a href={brandHref || "/"} className={styles.logo}>
            {siteTitle}
          </a>
          <nav className={styles.items}>
            {resolvedLinks.map((l, i) => (
              <NavItem
                key={`${l.href}-${i}`}
                label={pickLabel(l, language)}
                href={l.href}
                variant="default"
              />
            ))}
          </nav>
        </header>
      </div>
    );
  }

  return (
    <div className={styles.rootCommerce} style={rootStyle}>
      <header className={styles.innerCommerce}>
        {drawerButton}
        <a href={brandHref || "/"} className={styles.brand}>
          {siteTitle}
        </a>
        <nav className={styles.navCommerce}>
          {resolvedLinks.map((l, i) => (
            <NavItem
              key={`${l.href}-${i}`}
              label={pickLabel(l, language)}
              href={l.href}
              variant="commerce"
            />
          ))}
        </nav>
      </header>
    </div>
  );
};

export { Header };
