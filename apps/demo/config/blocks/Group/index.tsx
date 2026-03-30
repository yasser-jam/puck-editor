import React from "react";
import { ComponentConfig, Slot } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import { WithLayout, withLayout } from "../../components/Layout";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Group", styles);

// ─── Types ─────────────────────────────────────────────────────────────────

export type GroupProps = WithLayout<{
  direction: "row" | "column";
  gap: number;
  alignItems: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  justifyContent:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  wrap: "wrap" | "nowrap";
  /** Accepts all blocks, including nested Groups. Section is excluded
   *  because sections are page-level containers only. */
  content: Slot;
}>;

// ─── Config ────────────────────────────────────────────────────────────────

const GroupInternal: ComponentConfig<GroupProps> = {
  label: "Group",

  fields: {
    direction: {
      type: "radio",
      label: "Direction",
      options: [
        { label: "Horizontal", value: "row" },
        { label: "Vertical", value: "column" },
      ],
    },
    gap: {
      type: "number",
      label: "Gap (px)",
      min: 0,
      max: 120,
    },
    alignItems: {
      type: "select",
      label: "Align Items",
      options: [
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
        { label: "Stretch", value: "stretch" },
        { label: "Baseline", value: "baseline" },
      ],
    },
    justifyContent: {
      type: "select",
      label: "Justify Content",
      options: [
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Around", value: "space-around" },
        { label: "Space Evenly", value: "space-evenly" },
      ],
    },
    wrap: {
      type: "radio",
      label: "Wrap",
      options: [
        { label: "Wrap", value: "wrap" },
        { label: "No Wrap", value: "nowrap" },
      ],
    },
    content: {
      type: "slot",
      disallow: ["Section"],
    },
  },

  defaultProps: {
    direction: "row",
    gap: 16,
    alignItems: "stretch",
    justifyContent: "flex-start",
    wrap: "nowrap",
    content: [],
  },

  /**
   * Pass the flex styles directly to the slot wrapper so the slot
   * element itself IS the flex container — children become flex items.
   * This is the same pattern used by the Flex block.
   */
  render: ({
    direction,
    gap,
    alignItems,
    justifyContent,
    wrap,
    content: Content,
  }) => (
    <Content
      className={getClassName()}
      style={{
        display: "flex",
        flexDirection: direction,
        gap,
        alignItems,
        justifyContent,
        flexWrap: wrap,
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    />
  ),
};

export const Group = withLayout(GroupInternal);
