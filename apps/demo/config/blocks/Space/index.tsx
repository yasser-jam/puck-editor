import React from "react";

import { ComponentConfig } from "@/core";
import { spacingOptions } from "../../options";
import { getClassNameFactory } from "@/core/lib";
import { WithLayout, withLayout } from "../../components/Layout";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Space", styles);

export type SpaceProps = WithLayout<{
  direction?: "" | "vertical" | "horizontal";
  size: string;
}>;

const SpaceInner: ComponentConfig<SpaceProps> = {
  label: "Spacer",
  fields: {
    size: {
      type: "select",
      options: spacingOptions,
    },
    direction: {
      type: "radio",
      options: [
        { value: "vertical", label: "Vertical" },
        { value: "horizontal", label: "Horizontal" },
        { value: "", label: "Both" },
      ],
    },
  },
  defaultProps: {
    direction: "",
    size: "24px",
  },
  inline: true,
  render: ({ direction, size }) => {
    return (
      <div
        className={getClassName(direction ? { [direction]: direction } : {})}
        style={{ "--size": size } as React.CSSProperties}
      />
    );
  },
};

export const Space = withLayout(SpaceInner);
