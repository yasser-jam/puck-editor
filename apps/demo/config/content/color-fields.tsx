import React from "react";
import type { CustomField } from "@/core/types";
import { colorVar, ColorKey, COLOR_KEYS } from "../theme";

export const COLOR_SELECT_OPTIONS = COLOR_KEYS.map(({ key, label }) => ({
  label,
  value: key,
}));

export const colorModeField = {
  type: "radio" as const,
  label: "Color",
  options: [
    { label: "Theme", value: "theme" },
    { label: "Fixed", value: "fixed" },
  ],
};

export const colorThemeField = {
  type: "select" as const,
  label: "Theme color",
  options: COLOR_SELECT_OPTIONS,
};

const colorFixedCustom: CustomField<string> = {
  type: "custom",
  label: "Color (fixed)",
  render: ({ value, onChange }) => {
    const v = typeof value === "string" ? value : "";
    const validHex = /^#[0-9A-Fa-f]{6}$/.test(v);
    return (
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          width: "100%",
        }}
      >
        <input
          type="color"
          aria-label="Pick color"
          value={validHex ? v : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 36,
            height: 28,
            padding: 0,
            border: "none",
            cursor: "pointer",
            background: "transparent",
          }}
        />
        <input
          type="text"
          value={v}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          spellCheck={false}
          maxLength={7}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </div>
    );
  },
};

/** Theme vs fixed color — use in block `fields` alongside matching props */
export const contentColorFields = {
  colorMode: colorModeField,
  colorTheme: colorThemeField,
  colorFixed: colorFixedCustom,
};

export function resolveContentColor(
  mode: "theme" | "fixed" | undefined,
  theme: ColorKey | undefined,
  fixed: string | undefined
): string {
  const m = mode ?? "theme";
  if (m === "theme") {
    return `var(${colorVar((theme ?? "text") as ColorKey)})`;
  }
  return fixed ?? "#0f172a";
}
