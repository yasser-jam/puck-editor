"use client";

import React, { ReactNode, createContext, useContext } from "react";
import { Section } from "../Section";
import type { ShellVariant } from "../../theme";

import styles from "./styles.module.css";

const FooterVariantContext = createContext<ShellVariant>("commerce");

const FooterLink = ({ children, href }: { children: string; href: string }) => {
  const variant = useContext(FooterVariantContext);
  return (
    <li className={styles.listItem}>
      <a
        href={href}
        className={variant === "commerce" ? styles.linkCommerce : styles.linkDefault}
      >
        {children}
      </a>
    </li>
  );
};

const FooterList = ({ children, title }: { children: ReactNode; title: string }) => {
  const variant = useContext(FooterVariantContext);
  return (
    <div>
      <h3
        className={
          variant === "commerce" ? styles.listTitleCommerce : styles.listTitleDefault
        }
      >
        {title}
      </h3>
      <ul className={styles.list}>{children}</ul>
    </div>
  );
};

export type FooterLinkData = {
  label: string;
  labelAr?: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  titleAr?: string;
  links: FooterLinkData[];
};

export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Shop",
    titleAr: "المتجر",
    links: [
      { label: "Home", labelAr: "الرئيسية", href: "/" },
      { label: "Products", labelAr: "المنتجات", href: "/products/example-product" },
      { label: "Cart", labelAr: "السلة", href: "/cart" },
    ],
  },
  {
    title: "Explore",
    titleAr: "استكشف",
    links: [
      { label: "Themes", labelAr: "القوالب", href: "/themes" },
      { label: "Pricing", labelAr: "الأسعار", href: "/pricing" },
      { label: "About", labelAr: "من نحن", href: "/about" },
    ],
  },
  {
    title: "Support",
    titleAr: "الدعم",
    links: [
      { label: "Shipping", labelAr: "الشحن", href: "#" },
      { label: "Returns", labelAr: "الإرجاع", href: "#" },
      { label: "Contact", labelAr: "اتصل بنا", href: "#" },
    ],
  },
];

export type FooterProps = {
  children?: ReactNode;
  variant?: ShellVariant;
  siteTitle?: string;
  columns?: FooterColumn[];
  language?: "ar" | "en";
  visible?: boolean;
  tagline?: string;
  taglineAr?: string;
  /** Any valid CSS colour. Empty falls back to the theme. */
  backgroundColor?: string;
  textColor?: string;
};

const pickText = (
  en: string | undefined,
  ar: string | undefined,
  language: "ar" | "en"
): string => {
  if (language === "ar" && ar && ar.trim()) return ar;
  return en || "";
};

const Footer = ({
  children,
  variant = "commerce",
  siteTitle = "Meridian",
  columns,
  language = "ar",
  visible = true,
  tagline,
  taglineAr,
  backgroundColor,
  textColor,
}: FooterProps) => {
  if (!visible) return null;

  // Inline colour overrides. Only emit entries when the merchant provided a
  // value, so the themed defaults still apply when the fields are empty.
  const rootStyle: React.CSSProperties = {};
  if (backgroundColor) rootStyle.background = backgroundColor;
  if (textColor) rootStyle.color = textColor;

  const resolvedColumns =
    children == null
      ? Array.isArray(columns) && columns.length > 0
        ? columns
        : DEFAULT_FOOTER_COLUMNS
      : null;

  const renderedChildren =
    children ??
    (resolvedColumns
      ? resolvedColumns.map((col, ci) => (
          <FooterList
            key={`${col.title}-${ci}`}
            title={pickText(col.title, col.titleAr, language) || col.title}
          >
            {col.links.map((lnk, li) => (
              <FooterLink key={`${lnk.href}-${li}`} href={lnk.href}>
                {pickText(lnk.label, lnk.labelAr, language) || lnk.label}
              </FooterLink>
            ))}
          </FooterList>
        ))
      : null);

  const resolvedTagline =
    pickText(tagline, taglineAr, language) ||
    (language === "ar"
      ? "سلع مختارة بعناية — منسّقة وفق القوالب والإعدادات."
      : "Curated goods — styled with your theme tokens and shell layout from Settings.");
  if (variant === "default") {
    return (
      <FooterVariantContext.Provider value="default">
        <footer className={styles.rootDefault} style={rootStyle}>
          <h2 className={styles.visuallyHidden}>Footer</h2>
          <div className={styles.innerPadDefault}>
            <Section>
              <div className={styles.gridDefault}>{renderedChildren}</div>
            </Section>
          </div>
          <div className={styles.bottomBarDefault}>
            Made with{" "}
            <a
              href="https://github.com/puckeditor/puck"
              target="_blank"
              rel="noreferrer"
              className={styles.bottomLinkDefault}
            >
              Puck
            </a>
          </div>
        </footer>
      </FooterVariantContext.Provider>
    );
  }

  return (
    <FooterVariantContext.Provider value="commerce">
      <footer className={styles.rootCommerce} style={rootStyle}>
        <div className={styles.innerCommerce}>
          <div className={styles.gridCommerce}>
            <div className={styles.brandCol}>
              <span className={styles.brandName}>{siteTitle}</span>
              <p className={styles.brandTagline}>{resolvedTagline}</p>
            </div>
            {renderedChildren}
          </div>
        </div>
        <div className={styles.bottomBarCommerce}>
          <span>
            © {new Date().getFullYear()} {siteTitle}
          </span>
          <span className={styles.bottomSep}>·</span>
          <a href="#" className={styles.bottomLinkCommerce}>
            Privacy
          </a>
          <a href="#" className={styles.bottomLinkCommerce}>
            Terms
          </a>
        </div>
      </footer>
    </FooterVariantContext.Provider>
  );
};

Footer.List = FooterList;
Footer.Link = FooterLink;

export { Footer };
