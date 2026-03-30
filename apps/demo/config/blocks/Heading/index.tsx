import React from "react";

import { ComponentConfig } from "@/core/types";
import { Heading as _Heading } from "@/core/components/Heading";
import type { HeadingProps as _HeadingProps } from "@/core/components/Heading";
import { Section } from "../../components/Section";
import { WithLayout, withLayout } from "../../components/Layout";
import { COMPONENT_FONT_OPTIONS, COMPONENT_FONT_CSS } from "../../theme";

export type HeadingProps = WithLayout<{
  align: "left" | "center" | "right";
  text?: string;
  level?: _HeadingProps["rank"];
  size: _HeadingProps["size"];
  fontFamily?: "body" | "option1" | "option2";
}>;

const sizeOptions = [
  { value: "xxxl", label: "XXXL" },
  { value: "xxl", label: "XXL" },
  { value: "xl", label: "XL" },
  { value: "l", label: "L" },
  { value: "m", label: "M" },
  { value: "s", label: "S" },
  { value: "xs", label: "XS" },
];

const levelOptions = [
  { label: "", value: "" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
];

const HeadingInternal: ComponentConfig<HeadingProps> = {
  fields: {
    text: {
      type: "textarea",
      contentEditable: true,
    },
    size: {
      type: "select",
      options: sizeOptions,
    },
    level: {
      type: "select",
      options: levelOptions,
    },
    align: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    fontFamily: {
      type: "select",
      label: "Font Family",
      options: COMPONENT_FONT_OPTIONS,
    },
  },
  defaultProps: {
    align: "left",
    text: "Heading",
    size: "m",
    fontFamily: "body",
    layout: {
      padding: "8px",
    },
  },
  render: ({ align, text, size, level, fontFamily }) => {
    const fontCss = COMPONENT_FONT_CSS[fontFamily ?? "body"] ?? COMPONENT_FONT_CSS.body;
    return (
      <Section>
        <_Heading size={size} rank={level as any}>
          <span
            style={{
              display: "block",
              textAlign: align,
              width: "100%",
              fontFamily: fontCss,
            }}
          >
            {text}
          </span>
        </_Heading>
      </Section>
    );
  },
};

export const Heading = withLayout(HeadingInternal);
