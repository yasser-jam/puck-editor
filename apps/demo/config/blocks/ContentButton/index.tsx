import React from "react";
import { ComponentConfig } from "@/core/types";
import { WithLayout, withLayout } from "../../components/Layout";
import {
  ColorKey,
  colorVar,
  buttonSizeVars,
  ButtonSizeStep,
  COLOR_KEYS,
} from "../../theme";
import { MODE_OPTIONS, RADIUS_OPTIONS, resolveRadius } from "../../content/typography-fields";

const COLOR_SELECT = COLOR_KEYS.map(({ key, label }) => ({ label, value: key }));

export type ContentButtonProps = WithLayout<{
  label: string;
  href: string;
  radiusMode: "theme" | "fixed";
  radiusTheme: "none" | "sm" | "md" | "lg" | "xl" | "full";
  radiusFixed: string;
  bgMode: "theme" | "fixed";
  bgTheme: ColorKey;
  bgFixed: string;
  fgMode: "theme" | "fixed";
  fgTheme: ColorKey;
  fgFixed: string;
  sizeMode: "theme" | "fixed";
  sizeTheme: ButtonSizeStep;
  fixedHeight: string;
  fixedPadX: string;
  fixedPadY: string;
  fixedFontSize: string;
}>;

const ContentButtonInner: ComponentConfig<ContentButtonProps> = {
  label: "Button",
  fields: {
    label: { type: "text", contentEditable: true },
    href: { type: "text", label: "Link URL" },
    radiusMode: { type: "radio", label: "Border radius", options: [...MODE_OPTIONS] },
    radiusTheme: { type: "select", options: RADIUS_OPTIONS },
    radiusFixed: { type: "text", label: "Radius (fixed)" },
    bgMode: { type: "radio", label: "Background", options: [...MODE_OPTIONS] },
    bgTheme: { type: "select", options: COLOR_SELECT },
    bgFixed: { type: "text", label: "Background (fixed hex)" },
    fgMode: { type: "radio", label: "Text color", options: [...MODE_OPTIONS] },
    fgTheme: { type: "select", options: COLOR_SELECT },
    fgFixed: { type: "text", label: "Text color (fixed hex)" },
    sizeMode: { type: "radio", label: "Size", options: [...MODE_OPTIONS] },
    sizeTheme: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    fixedHeight: { type: "text", label: "Height (fixed)" },
    fixedPadX: { type: "text", label: "Padding X (fixed)" },
    fixedPadY: { type: "text", label: "Padding Y (fixed)" },
    fixedFontSize: { type: "text", label: "Font size (fixed)" },
  },
  defaultProps: {
    label: "Button",
    href: "#",
    radiusMode: "theme",
    radiusTheme: "md",
    radiusFixed: "8px",
    bgMode: "theme",
    bgTheme: "primary",
    bgFixed: "#2563eb",
    fgMode: "theme",
    fgTheme: "surface",
    fgFixed: "#ffffff",
    sizeMode: "theme",
    sizeTheme: "md",
    fixedHeight: "40px",
    fixedPadX: "16px",
    fixedPadY: "8px",
    fixedFontSize: "1rem",
  },
  render: ({
    label,
    href,
    radiusMode,
    radiusTheme,
    radiusFixed,
    bgMode,
    bgTheme,
    bgFixed,
    fgMode,
    fgTheme,
    fgFixed,
    sizeMode,
    sizeTheme,
    fixedHeight,
    fixedPadX,
    fixedPadY,
    fixedFontSize,
    puck,
  }) => {
    const r = resolveRadius(radiusMode, radiusTheme, radiusFixed);
    const bg =
      bgMode === "theme" ? `var(${colorVar(bgTheme)})` : bgFixed;
    const fg =
      fgMode === "theme" ? `var(${colorVar(fgTheme)})` : fgFixed;
    const size =
      sizeMode === "theme"
        ? buttonSizeVars(sizeTheme)
        : {
            height: fixedHeight,
            paddingLeft: fixedPadX,
            paddingRight: fixedPadX,
            paddingTop: fixedPadY,
            paddingBottom: fixedPadY,
            fontSize: fixedFontSize,
          };
    return (
      <a
        href={puck.isEditing ? "#" : href}
        onClick={puck.isEditing ? (e) => e.preventDefault() : undefined}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: r,
          background: bg,
          color: fg,
          textDecoration: "none",
          fontWeight: 600,
          boxSizing: "border-box",
          minHeight: size.height,
          paddingLeft: size.paddingLeft,
          paddingRight: size.paddingRight,
          paddingTop: size.paddingTop,
          paddingBottom: size.paddingBottom,
          fontSize: size.fontSize,
          border: "none",
          cursor: puck.isEditing ? "default" : "pointer",
        }}
      >
        {label}
      </a>
    );
  },
};

export const ContentButton = withLayout(ContentButtonInner);
