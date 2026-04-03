import React from "react";
import { ComponentConfig } from "@/core/types";
import { WithLayout, withLayout } from "../../components/Layout";
import { COMPONENT_FONT_CSS, COMPONENT_FONT_OPTIONS, ColorKey } from "../../theme";
import {
  contentColorFields,
  resolveContentColor,
} from "../../content/color-fields";
import {
  MODE_OPTIONS,
  TEXT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  resolveFontSize,
  resolveFontWeight,
  resolveLineHeight,
} from "../../content/typography-fields";

export type ContentHeadingProps = WithLayout<{
  text: string;
  level: "1" | "2" | "3" | "4" | "5" | "6";
  textAlign: "left" | "center" | "right" | "justify";
  fontFamily: "body" | "option1" | "option2";
  fontSizeMode: "theme" | "fixed";
  fontSizeTheme: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  fontSizeFixed: string;
  fontWeightMode: "theme" | "fixed";
  fontWeightTheme: "normal" | "medium" | "semibold" | "bold";
  fontWeightFixed: string;
  lineHeightMode: "theme" | "fixed";
  lineHeightTheme: "tight" | "normal" | "relaxed";
  lineHeightFixed: string;
  fontStyle: "normal" | "italic";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  colorMode: "theme" | "fixed";
  colorTheme: ColorKey;
  colorFixed: string;
}>;

const Tag = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const ContentHeadingInner: ComponentConfig<ContentHeadingProps> = {
  label: "Heading",
  fields: {
    text: { type: "textarea", contentEditable: true, label: "Text" },
    level: {
      type: "select",
      label: "Level",
      options: [
        { label: "H1", value: "1" },
        { label: "H2", value: "2" },
        { label: "H3", value: "3" },
        { label: "H4", value: "4" },
        { label: "H5", value: "5" },
        { label: "H6", value: "6" },
      ],
    },
    textAlign: {
      type: "radio",
      label: "Text align",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
        { label: "Justify", value: "justify" },
      ],
    },
    fontFamily: {
      type: "select",
      label: "Font family",
      options: COMPONENT_FONT_OPTIONS,
    },
    fontSizeMode: {
      type: "radio",
      label: "Font size",
      options: [...MODE_OPTIONS],
    },
    fontSizeTheme: { type: "select", options: TEXT_SIZE_OPTIONS },
    fontSizeFixed: { type: "text", label: "Font size (fixed)" },
    fontWeightMode: { type: "radio", label: "Font weight", options: [...MODE_OPTIONS] },
    fontWeightTheme: { type: "select", options: FONT_WEIGHT_OPTIONS },
    fontWeightFixed: { type: "text", label: "Font weight (fixed)" },
    lineHeightMode: { type: "radio", label: "Line height", options: [...MODE_OPTIONS] },
    lineHeightTheme: { type: "select", options: LINE_HEIGHT_OPTIONS },
    lineHeightFixed: { type: "text", label: "Line height (fixed)" },
    fontStyle: {
      type: "radio",
      options: [
        { label: "Normal", value: "normal" },
        { label: "Italic", value: "italic" },
      ],
    },
    textTransform: {
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "Uppercase", value: "uppercase" },
        { label: "Lowercase", value: "lowercase" },
        { label: "Capitalize", value: "capitalize" },
      ],
    },
    ...contentColorFields,
  },
  defaultProps: {
    text: "Heading",
    level: "2",
    textAlign: "left",
    fontFamily: "body",
    fontSizeMode: "theme",
    fontSizeTheme: "lg",
    fontSizeFixed: "1.5rem",
    fontWeightMode: "theme",
    fontWeightTheme: "semibold",
    fontWeightFixed: "600",
    lineHeightMode: "theme",
    lineHeightTheme: "normal",
    lineHeightFixed: "1.4",
    fontStyle: "normal",
    textTransform: "none",
    colorMode: "theme",
    colorTheme: "text",
    colorFixed: "#0f172a",
  },
  render: (props) => {
    const {
      text,
      level,
      textAlign,
      fontFamily,
      fontSizeMode,
      fontSizeTheme,
      fontSizeFixed,
      fontWeightMode,
      fontWeightTheme,
      fontWeightFixed,
      lineHeightMode,
      lineHeightTheme,
      lineHeightFixed,
      fontStyle,
      textTransform,
      colorMode,
      colorTheme,
      colorFixed,
    } = props;
    const H = Tag[Math.min(Math.max(parseInt(level, 10) || 2, 1), 6) - 1];
    const fontCss = COMPONENT_FONT_CSS[fontFamily] ?? COMPONENT_FONT_CSS.body;
    const fs = resolveFontSize(fontSizeMode, fontSizeTheme, fontSizeFixed);
    const fw = resolveFontWeight(fontWeightMode, fontWeightTheme, fontWeightFixed);
    const lh = resolveLineHeight(lineHeightMode, lineHeightTheme, lineHeightFixed);
    const color = resolveContentColor(colorMode, colorTheme, colorFixed);
    return (
      <H
        style={{
          fontFamily: fontCss,
          fontSize: fs,
          fontWeight: fw as any,
          lineHeight: lh,
          fontStyle,
          textTransform,
          textAlign,
          margin: 0,
          width: "100%",
          color,
        }}
      >
        {text}
      </H>
    );
  },
};

export const ContentHeading = withLayout(ContentHeadingInner);
