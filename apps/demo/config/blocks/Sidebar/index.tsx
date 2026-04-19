import React from "react";
import { ComponentConfig, Slot } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import { WithLayout, withLayout } from "../../components/Layout";
import {
  bilingualTextField,
  pickLang,
  type BilingualString,
} from "../../fields/BilingualText";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Sidebar", styles);

/**
 * DSN-004g — Sidebar
 *
 * Generic vertical container used alongside a main content slot (typically
 * inside a two-column Section). Slot-based so any block — NavMenu, filters,
 * testimonials, promotional banners — can drop inside.
 *
 * The container only describes layout/chrome; it does NOT assume what it
 * contains. This keeps AI agents free to rewire children without touching
 * the wrapper.
 *
 * JSON shape (abbreviated):
 *   {
 *     type: "Sidebar",
 *     props: {
 *       title: { ar, en },
 *       width: "narrow" | "medium" | "wide",
 *       stickyTop: "0px",
 *       borderStyle: "none" | "card" | "bordered" | "divider",
 *       backgroundColor: "surface" | "muted" | "transparent",
 *       showOnMobile: "collapse" | "hidden" | "always",
 *       items: Slot[],
 *     }
 *   }
 */
export type SidebarProps = WithLayout<{
  title: BilingualString;
  showTitle: boolean;
  width: "narrow" | "medium" | "wide";
  /** Distance from the viewport top when `sticky` is on. Empty = not sticky. */
  stickyTop: string;
  borderStyle: "none" | "bordered" | "card" | "divider";
  backgroundColor: "transparent" | "surface" | "muted";
  /** How the sidebar behaves below the 640px breakpoint. */
  showOnMobile: "collapse" | "hidden" | "always";
  items: Slot;
}>;

const WIDTH_PX: Record<SidebarProps["width"], string> = {
  narrow: "220px",
  medium: "280px",
  wide: "340px",
};

const BG_VAR: Record<SidebarProps["backgroundColor"], string | undefined> = {
  transparent: undefined,
  surface: "var(--theme-color-surface, #ffffff)",
  muted: "var(--theme-color-muted, #f9fafb)",
};

const SidebarInternal: ComponentConfig<SidebarProps> = {
  label: "Sidebar",
  fields: {
    title: bilingualTextField({ label: "Title" }),
    showTitle: {
      type: "radio",
      label: "Show title",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    width: {
      type: "radio",
      label: "Width",
      options: [
        { label: "Narrow", value: "narrow" },
        { label: "Medium", value: "medium" },
        { label: "Wide", value: "wide" },
      ],
    },
    stickyTop: {
      type: "text",
      label: "Sticky top offset (empty = not sticky)",
      placeholder: "e.g. 16px",
    },
    borderStyle: {
      type: "select",
      label: "Border",
      options: [
        { label: "None", value: "none" },
        { label: "Bordered", value: "bordered" },
        { label: "Card (border + shadow)", value: "card" },
        { label: "Divider (trailing edge only)", value: "divider" },
      ],
    },
    backgroundColor: {
      type: "select",
      label: "Background",
      options: [
        { label: "Transparent", value: "transparent" },
        { label: "Surface", value: "surface" },
        { label: "Muted", value: "muted" },
      ],
    },
    showOnMobile: {
      type: "select",
      label: "Mobile behaviour",
      options: [
        { label: "Collapse to horizontal strip", value: "collapse" },
        { label: "Hide on mobile", value: "hidden" },
        { label: "Always show (stacked)", value: "always" },
      ],
    },
    items: { type: "slot" },
  },
  defaultProps: {
    title: { ar: "القائمة الجانبية", en: "Sidebar" },
    showTitle: true,
    width: "medium",
    stickyTop: "16px",
    borderStyle: "card",
    backgroundColor: "surface",
    showOnMobile: "collapse",
    layout: {
      // The sidebar is a column, not a full-width band.
      grow: false,
    },
    items: [],
  },
  render: ({
    title,
    showTitle,
    width,
    stickyTop,
    borderStyle,
    backgroundColor,
    showOnMobile,
    items: Items,
  }) => {
    const resolvedTitle = pickLang(title);
    const isSticky = (stickyTop ?? "").trim().length > 0;
    const collapseAttr =
      showOnMobile === "hidden"
        ? "hidden"
        : showOnMobile === "collapse"
        ? "true"
        : "false";

    const modifierClass =
      borderStyle === "bordered"
        ? getClassName("bordered")
        : borderStyle === "card"
        ? getClassName("card")
        : borderStyle === "divider"
        ? getClassName("divider")
        : "";

    return (
      <aside
        className={`${getClassName()} ${modifierClass}`.trim()}
        data-collapse-on-mobile={collapseAttr}
        style={{
          width: WIDTH_PX[width],
          minWidth: WIDTH_PX[width],
          maxWidth: "100%",
          background: BG_VAR[backgroundColor],
          position: isSticky ? "sticky" : undefined,
          top: isSticky ? stickyTop : undefined,
          alignSelf: isSticky ? "flex-start" : undefined,
        }}
      >
        {showTitle && resolvedTitle && (
          <div className={getClassName("header")}>
            <h3 className={getClassName("title")}>{resolvedTitle}</h3>
          </div>
        )}

        <Items className={getClassName("body")} />
      </aside>
    );
  },
};

export const Sidebar = withLayout(SidebarInternal);
