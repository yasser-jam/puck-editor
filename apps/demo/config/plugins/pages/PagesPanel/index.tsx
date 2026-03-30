import React, { useMemo } from "react";
import { Home, ShoppingCart, Package } from "lucide-react";
import { getClassNameFactory } from "@/core/lib";
import { PAGES, PageDefinition, getEditPath, matchCurrentPage } from "../../../pages";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("PagesPanel", styles);

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP = {
  Home: Home,
  ShoppingCart: ShoppingCart,
  Package: Package,
};

// ─── Page item ────────────────────────────────────────────────────────────────

function PageItem({
  page,
  isActive,
}: {
  page: PageDefinition;
  isActive: boolean;
}) {
  const IconComponent = ICON_MAP[page.iconName];
  const editPath = getEditPath(page) + "/edit";

  return (
    <a
      href={editPath}
      className={`${getClassName("item")} ${isActive ? getClassName("item--active") : ""}`}
    >
      <div className={getClassName("iconWrap")}>
        <IconComponent size={16} />
      </div>

      <div className={getClassName("text")}>
        <div className={getClassName("label")}>{page.label}</div>
        <div className={getClassName("path")}>
          {page.dynamic ? page.path : page.path}
        </div>
      </div>

      {page.dynamic && (
        <span className={getClassName("dynamicBadge")}>dynamic</span>
      )}

      {isActive && <div className={getClassName("activeDot")} />}
    </a>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function PagesPanel() {
  const currentPage = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return matchCurrentPage(window.location.pathname);
  }, []);

  return (
    <div className={getClassName()}>
      <div className={getClassName("header")}>Pages</div>

      <div className={getClassName("list")}>
        {PAGES.map((page) => (
          <PageItem
            key={page.path}
            page={page}
            isActive={currentPage?.path === page.path}
          />
        ))}
      </div>

      <p className={getClassName("hint")}>
        Click a page to switch the editor to that page. Each page has its own
        independent content.
      </p>
    </div>
  );
}
