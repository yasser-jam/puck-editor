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

export type HeaderProps = {
  editMode: boolean;
  variant?: ShellVariant;
  siteTitle?: string;
};

const Header = ({
  editMode,
  variant = "commerce",
  siteTitle = "Meridian",
}: HeaderProps) => {
  const base = "";

  const paths = {
    home: `${base}/`,
    shop: `${base}/products/example-product`,
    cart: `${base}/cart`,
    themes: `${base}/themes`,
  };

  if (variant === "default") {
    return (
      <div className={styles.root}>
        <header className={styles.inner}>
          <div className={styles.logo}>{siteTitle}</div>
          <nav className={styles.items}>
            <NavItem label="Home" href={paths.home} variant="default" />
            <NavItem label="Pricing" href={`${base}/pricing`} variant="default" />
            <NavItem label="About" href={`${base}/about`} variant="default" />
          </nav>
        </header>
      </div>
    );
  }

  return (
    <div className={styles.rootCommerce}>
      <header className={styles.innerCommerce}>
        <a href={paths.home} className={styles.brand}>
          {siteTitle}
        </a>
        <nav className={styles.navCommerce}>
          <NavItem label="Home" href={paths.home} variant="commerce" />
          <NavItem label="Shop" href={paths.shop} variant="commerce" />
          <NavItem label="Cart" href={paths.cart} variant="commerce" />
          <NavItem label="Themes" href={paths.themes} variant="commerce" />
        </nav>
      </header>
    </div>
  );
};

export { Header };
