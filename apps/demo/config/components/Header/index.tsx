import classnames from "classnames";

import type { ShellVariant } from "../../theme";

import styles from "./styles.module.css";

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
}: HeaderProps) => {
  if (!visible) return null;

  const resolvedLinks =
    Array.isArray(links) && links.length > 0 ? links : DEFAULT_HEADER_LINKS;

  if (variant === "default") {
    return (
      <div className={styles.root}>
        <header className={styles.inner}>
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
    <div className={styles.rootCommerce}>
      <header className={styles.innerCommerce}>
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
