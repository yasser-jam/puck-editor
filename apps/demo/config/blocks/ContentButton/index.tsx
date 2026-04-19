import React, { CSSProperties, MouseEvent } from "react";
import { ComponentConfig, Fields } from "@/core/types";
import { WithLayout, withLayout } from "../../components/Layout";
import {
  ColorKey,
  colorVar,
  buttonSizeVars,
  ButtonSizeStep,
  COLOR_KEYS,
} from "../../theme";
import { MODE_OPTIONS, RADIUS_OPTIONS, resolveRadius } from "../../content/typography-fields";
import {
  type ButtonAction,
  BUTTON_ACTION_OPTIONS,
  buttonActionLabel,
} from "../../content/button-actions";
import {
  linkField,
  resolveHrefLegacy,
  resolveLinkTarget,
  resolveLinkRel,
  EMPTY_LINK,
  type LinkValue,
} from "../../fields/LinkField";

const COLOR_SELECT = COLOR_KEYS.map(({ key, label }) => ({ label, value: key }));

export type ContentButtonProps = WithLayout<{
  label: string;
  /** Stored in page JSON — `link` uses the navigation target; other values are functional jobs. */
  buttonAction: ButtonAction;
  /** Structured navigation target (None / Page / External URL / Anchor). */
  link: LinkValue;
  /** @deprecated use `link`. Kept for backward compatibility with old JSON. */
  href?: string;
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
    buttonAction: {
      type: "select",
      label: "Action",
      options: BUTTON_ACTION_OPTIONS,
    },
    link: linkField({ label: "Destination" }),
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
    buttonAction: "link",
    link: EMPTY_LINK,
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
    buttonAction,
    link,
    href: legacyHref,
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
    const action = buttonAction ?? "link";
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

    const sharedStyle: CSSProperties = {
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
      fontFamily: "inherit",
    };

    const onFunctionalClick = (e: MouseEvent) => {
      e.preventDefault();
      if (puck.isEditing) return;
      window.alert(
        `Button action: ${action} — ${buttonActionLabel(action)}`
      );
    };

    if (action !== "link") {
      return (
        <button type="button" onClick={onFunctionalClick} style={sharedStyle}>
          {label}
        </button>
      );
    }

    const resolvedHref = resolveHrefLegacy(link, legacyHref) ?? "#";
    const target = resolveLinkTarget(link);
    const rel = resolveLinkRel(link);

    return (
      <a
        href={puck.isEditing ? "#" : resolvedHref}
        target={puck.isEditing ? undefined : target}
        rel={puck.isEditing ? undefined : rel}
        onClick={puck.isEditing ? (e) => e.preventDefault() : undefined}
        style={sharedStyle}
      >
        {label}
      </a>
    );
  },
};

const WithLayoutButton = withLayout(ContentButtonInner);

function omitHrefField(
  fields: Record<string, unknown>,
  data: { props?: { buttonAction?: ButtonAction } }
): Fields<ContentButtonProps> {
  const action = data.props?.buttonAction ?? "link";
  if (action === "link") return fields as Fields<ContentButtonProps>;
  // Hide the link field when the button runs an in-app action (cart, checkout…).
  const { link: _omit, ...rest } = fields;
  return rest as Fields<ContentButtonProps>;
}

export const ContentButton: typeof WithLayoutButton = {
  ...WithLayoutButton,
  resolveFields: (data, params) => {
    const resolver = (
      WithLayoutButton as { resolveFields?: (typeof WithLayoutButton)["resolveFields"] }
    ).resolveFields;
    const base = resolver?.(data, params);
    if (base != null && typeof (base as Promise<unknown>).then === "function") {
      return (base as Promise<Record<string, unknown>>).then((f) =>
        omitHrefField(f, data)
      );
    }
    if (base == null) {
      return ContentButtonInner.fields as Fields<ContentButtonProps>;
    }
    return omitHrefField(base as Record<string, unknown>, data);
  },
};
