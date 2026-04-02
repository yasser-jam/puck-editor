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

export type FooterProps = {
  children: ReactNode;
  variant?: ShellVariant;
  siteTitle?: string;
};

const Footer = ({
  children,
  variant = "commerce",
  siteTitle = "Meridian",
}: FooterProps) => {
  if (variant === "default") {
    return (
      <FooterVariantContext.Provider value="default">
        <footer className={styles.rootDefault}>
          <h2 className={styles.visuallyHidden}>Footer</h2>
          <div className={styles.innerPadDefault}>
            <Section>
              <div className={styles.gridDefault}>{children}</div>
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
      <footer className={styles.rootCommerce}>
        <div className={styles.innerCommerce}>
          <div className={styles.gridCommerce}>
            <div className={styles.brandCol}>
              <span className={styles.brandName}>{siteTitle}</span>
              <p className={styles.brandTagline}>
                Curated goods — styled with your theme tokens and shell layout from Settings.
              </p>
            </div>
            {children}
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
