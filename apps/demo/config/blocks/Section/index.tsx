import React from "react";
import { ComponentConfig, Slot } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import { spacingOptions } from "../../options";
import { WithLayout, withLayout } from "../../components/Layout";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Section", styles);

// ─── Preset colours ────────────────────────────────────────────────────────
export const backgroundOptions = [
  { label: "White", value: "#ffffff" },
  { label: "Off-white", value: "#f8f9fa" },
  { label: "Light grey", value: "#f0f2f5" },
  { label: "Neutral grey", value: "#e5e7eb" },
  { label: "Soft blue", value: "#eff6ff" },
  { label: "Soft green", value: "#f0fdf4" },
  { label: "Soft yellow", value: "#fefce8" },
  { label: "Dark navy", value: "#0f172a" },
  { label: "Dark grey", value: "#1f2937" },
  { label: "Black", value: "#000000" },
  { label: "Transparent", value: "transparent" },
];

const maxWidthOptions = [
  { label: "Full width", value: "100%" },
  { label: "Wide (1536px)", value: "1536px" },
  { label: "Standard (1280px)", value: "1280px" },
  { label: "Medium (1024px)", value: "1024px" },
  { label: "Narrow (768px)", value: "768px" },
];

const columnOptions = [1, 2, 3, 4, 5, 6].map((n) => ({
  label: n === 1 ? "1 (full width)" : String(n),
  value: String(n),
}));

// ─── Types ─────────────────────────────────────────────────────────────────

export type SectionProps = WithLayout<{
  /**
   * When false the section is hidden in the published renderer (web + mobile).
   * In the editor it stays visible but dimmed so merchants can still edit it.
   * This flag is persisted in `store_config.json` under the section's props —
   * AI agents can flip it programmatically to A/B-test sections without
   * mutating the section's inner content.
   */
  visible: boolean;
  paddingTop: string;
  paddingBottom: string;
  paddingHorizontal: string;
  backgroundColor: string;
  /** Controls inherited text/heading colour inside dark sections */
  theme: "dark" | "light";
  maxWidth: string;
  /** CSS grid column count for the content slot */
  columns?: number | string;
  /** Gap between grid cells */
  gridGap?: string;
  content: Slot;
}>;

// ─── Component config ──────────────────────────────────────────────────────

const SectionInner: ComponentConfig<SectionProps> = {
  label: "Section",

  fields: {
    // ── Visibility ───────────────────────────────────────────────────────
    visible: {
      type: "radio",
      label: "Visibility",
      options: [
        { label: "Visible", value: true },
        { label: "Hidden", value: false },
      ],
    },

    // ── Spacing ──────────────────────────────────────────────────────────
    paddingTop: {
      type: "select",
      label: "Padding Top",
      options: [{ label: "0px", value: "0px" }, ...spacingOptions],
    },
    paddingBottom: {
      type: "select",
      label: "Padding Bottom",
      options: [{ label: "0px", value: "0px" }, ...spacingOptions],
    },
    paddingHorizontal: {
      type: "select",
      label: "Padding Horizontal",
      options: [{ label: "0px", value: "0px" }, ...spacingOptions],
    },

    // ── Appearance ───────────────────────────────────────────────────────
    backgroundColor: {
      type: "select",
      label: "Background Colour",
      options: backgroundOptions,
    },
    theme: {
      type: "radio",
      label: "Text Colour",
      options: [
        { label: "Dark", value: "dark" },
        { label: "Light (white)", value: "light" },
      ],
    },

    // ── Container ────────────────────────────────────────────────────────
    maxWidth: {
      type: "select",
      label: "Max Width",
      options: maxWidthOptions,
    },

    columns: {
      type: "select",
      label: "Grid columns",
      options: columnOptions,
    },
    gridGap: {
      type: "select",
      label: "Grid gap",
      options: [{ label: "0px", value: "0px" }, ...spacingOptions],
    },

    // ── Content slot ─────────────────────────────────────────────────────
    content: {
      type: "slot",
      disallow: ["Section"], // no nested sections
    },
  },

  defaultProps: {
    visible: true,
    paddingTop: "80px",
    paddingBottom: "80px",
    paddingHorizontal: "24px",
    backgroundColor: "#ffffff",
    theme: "dark",
    maxWidth: "1280px",
    columns: 1,
    gridGap: "24px",
    content: [],
  },

  render: ({
    visible,
    paddingTop,
    paddingBottom,
    paddingHorizontal,
    backgroundColor,
    theme,
    maxWidth,
    columns,
    gridGap,
    content: Content,
    puck,
  }) => {
    const cols = Math.max(
      1,
      Math.min(6, Number(columns ?? 1) || 1)
    );
    const gap = gridGap ?? "24px";

    // Backward-compat: sections saved before the `visible` prop existed
    // (i.e. `visible === undefined`) default to visible.
    const isHidden = visible === false;

    // Published renderer (web + mobile) strips hidden sections entirely.
    // The editor keeps them interactive but visually demotes them so
    // merchants can still select and re-enable them from the fields panel.
    if (isHidden && !puck.isEditing) {
      return null;
    }

    return (
      <section
        className={getClassName({ hidden: isHidden })}
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
          color: theme === "light" ? "#ffffff" : "inherit",
          opacity: isHidden ? 0.35 : undefined,
          position: "relative",
        }}
      >
        {isHidden && puck.isEditing && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 8,
              insetInlineStart: 8,
              padding: "2px 8px",
              background: "#111827",
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              borderRadius: 4,
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            Hidden
          </div>
        )}
        <div
          className={getClassName("inner")}
          style={{
            maxWidth,
            paddingLeft: paddingHorizontal,
            paddingRight: paddingHorizontal,
            width: "100%",
          }}
        >
          <Content
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap,
              alignContent: "start",
              width: "100%",
            }}
          />
        </div>
      </section>
    );
  },
};

export const Section = withLayout(SectionInner);
