import React from "react";
import { ComponentConfig } from "@/core/types";
import { WithLayout, withLayout } from "../../components/Layout";
import { COMPONENT_FONT_CSS, COMPONENT_FONT_OPTIONS } from "../../theme";
import {
  MODE_OPTIONS,
  TEXT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  resolveFontSize,
  resolveFontWeight,
  resolveLineHeight,
} from "../../content/typography-fields";

export type ContentParagraphProps = WithLayout<{
  text: string;
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
  maxWidth: string;
}>;

const ContentParagraphInner: ComponentConfig<ContentParagraphProps> = {
  label: "Paragraph",
  fields: {
    text: { type: "textarea", contentEditable: true, label: "Text" },
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
    fontSizeMode: { type: "radio", label: "Font size", options: [...MODE_OPTIONS] },
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
    maxWidth: { type: "text", label: "Max width (CSS)" },
  },
  defaultProps: {
    text: "Paragraph text",
    textAlign: "left",
    fontFamily: "body",
    fontSizeMode: "theme",
    fontSizeTheme: "md",
    fontSizeFixed: "1rem",
    fontWeightMode: "theme",
    fontWeightTheme: "normal",
    fontWeightFixed: "400",
    lineHeightMode: "theme",
    lineHeightTheme: "normal",
    lineHeightFixed: "1.6",
    fontStyle: "normal",
    textTransform: "none",
    maxWidth: "none",
  },
  render: (props) => {
    const {
      text,
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
      maxWidth,
    } = props;
    const fontCss = COMPONENT_FONT_CSS[fontFamily] ?? COMPONENT_FONT_CSS.body;
    const fs = resolveFontSize(fontSizeMode, fontSizeTheme, fontSizeFixed);
    const fw = resolveFontWeight(fontWeightMode, fontWeightTheme, fontWeightFixed);
    const lh = resolveLineHeight(lineHeightMode, lineHeightTheme, lineHeightFixed);
    return (
      <p
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
          maxWidth: maxWidth === "none" || !maxWidth ? undefined : maxWidth,
          color: "inherit",
        }}
      >
        {text}
      </p>
    );
  },
};

export const ContentParagraph = withLayout(ContentParagraphInner);
