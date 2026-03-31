import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { ComponentConfig } from "@/core/types";
import { WithLayout, withLayout } from "../../components/Layout";
import { colorVar, ColorKey, COLOR_KEYS } from "../../theme";

const COLOR_SELECT = COLOR_KEYS.map(({ key, label }) => ({ label, value: key }));

const icons = Object.keys(dynamicIconImports).reduce<
  Record<string, ReactElement>
>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);
  return { ...acc, [iconName]: <El /> };
}, {});

const iconOptions = Object.keys(dynamicIconImports).map((iconName) => ({
  label: iconName,
  value: iconName,
}));

export type ContentIconProps = WithLayout<{
  icon: string;
  size: number;
  colorMode: "theme" | "fixed";
  colorTheme: ColorKey;
  colorFixed: string;
}>;

const ContentIconInner: ComponentConfig<ContentIconProps> = {
  label: "Icon",
  fields: {
    icon: { type: "select", label: "Icon", options: iconOptions },
    size: { type: "number", label: "Size (px)", min: 8, max: 128 },
    colorMode: {
      type: "radio",
      label: "Color",
      options: [
        { label: "Theme", value: "theme" },
        { label: "Fixed", value: "fixed" },
      ],
    },
    colorTheme: { type: "select", options: COLOR_SELECT },
    colorFixed: { type: "text", label: "Color (hex)" },
  },
  defaultProps: {
    icon: "Star",
    size: 24,
    colorMode: "theme",
    colorTheme: "primary",
    colorFixed: "#2563eb",
  },
  render: ({ icon, size, colorMode, colorTheme, colorFixed }) => {
    const color =
      colorMode === "theme" ? `var(${colorVar(colorTheme)})` : colorFixed;
    const I = icons[icon] ?? icons["Circle"];
    return (
      <span
        style={{
          display: "inline-flex",
          color,
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {React.isValidElement(I) &&
          React.cloneElement(I, { size, color: "currentColor" } as any)}
      </span>
    );
  },
};

export const ContentIcon = withLayout(ContentIconInner);
