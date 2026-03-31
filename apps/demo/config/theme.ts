// ─── Font registry ────────────────────────────────────────────────────────────
// Each entry maps a stored key to a CSS font-family value and an optional
// Google Fonts query string so the editor can load web fonts on demand.

export type FontEntry = {
  label: string;
  value: string;
  cssValue: string;
  /** Google Fonts "family" query param, e.g. "Inter:wght@300;400;500;600;700" */
  googleFont?: string;
};

export const FONT_OPTIONS: FontEntry[] = [
  {
    label: "System Default",
    value: "system",
    cssValue:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    label: "Inter",
    value: "inter",
    cssValue: "'Inter', sans-serif",
    googleFont: "Inter:wght@300;400;500;600;700",
  },
  {
    label: "Roboto",
    value: "roboto",
    cssValue: "'Roboto', sans-serif",
    googleFont: "Roboto:wght@300;400;500;700",
  },
  {
    label: "Open Sans",
    value: "open-sans",
    cssValue: "'Open Sans', sans-serif",
    googleFont: "Open+Sans:wght@300;400;500;600;700",
  },
  {
    label: "Lato",
    value: "lato",
    cssValue: "'Lato', sans-serif",
    googleFont: "Lato:wght@300;400;700",
  },
  {
    label: "Poppins",
    value: "poppins",
    cssValue: "'Poppins', sans-serif",
    googleFont: "Poppins:wght@300;400;500;600;700",
  },
  {
    label: "Montserrat",
    value: "montserrat",
    cssValue: "'Montserrat', sans-serif",
    googleFont: "Montserrat:wght@300;400;500;600;700",
  },
  {
    label: "Raleway",
    value: "raleway",
    cssValue: "'Raleway', sans-serif",
    googleFont: "Raleway:wght@300;400;500;600;700",
  },
  {
    label: "Nunito",
    value: "nunito",
    cssValue: "'Nunito', sans-serif",
    googleFont: "Nunito:wght@300;400;500;600;700",
  },
  {
    label: "DM Sans",
    value: "dm-sans",
    cssValue: "'DM Sans', sans-serif",
    googleFont: "DM+Sans:wght@300;400;500;600;700",
  },
  {
    label: "Playfair Display",
    value: "playfair-display",
    cssValue: "'Playfair Display', Georgia, serif",
    googleFont: "Playfair+Display:ital,wght@0,400;0,600;0,700;1,400",
  },
  {
    label: "Merriweather",
    value: "merriweather",
    cssValue: "'Merriweather', Georgia, serif",
    googleFont: "Merriweather:wght@300;400;700",
  },
  {
    label: "Lora",
    value: "lora",
    cssValue: "'Lora', Georgia, serif",
    googleFont: "Lora:ital,wght@0,400;0,600;0,700;1,400",
  },
  {
    label: "Space Grotesk",
    value: "space-grotesk",
    cssValue: "'Space Grotesk', sans-serif",
    googleFont: "Space+Grotesk:wght@300;400;500;600;700",
  },
  {
    label: "Geist",
    value: "geist",
    cssValue: "'Geist', sans-serif",
    googleFont: "Geist:wght@300;400;500;600;700",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get the CSS font-family value for a stored font key */
export function getFontCssValue(fontKey: string): string {
  return FONT_OPTIONS.find((f) => f.value === fontKey)?.cssValue ?? FONT_OPTIONS[0].cssValue;
}

/**
 * Build a Google Fonts URL that loads all requested font keys in one request.
 * Returns null when all selected fonts are system fonts.
 */
export function getGoogleFontsUrl(fontKeys: string[]): string | null {
  const families = [...new Set(fontKeys)]
    .filter((k) => k && k !== "system")
    .map((k) => FONT_OPTIONS.find((f) => f.value === k)?.googleFont)
    .filter(Boolean) as string[];

  if (families.length === 0) return null;

  return `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
}

// ─── Theme types ──────────────────────────────────────────────────────────────

export type ThemeProps = {
  /** Font used for all body/paragraph text (applied to the page root) */
  bodyFont: string;
  /** Named font slot #1 — components can select "Primary Font" */
  fontOption1: string;
  /** Named font slot #2 — components can select "Secondary Font" */
  fontOption2: string;
};

export const DEFAULT_THEME: ThemeProps = {
  bodyFont: "system",
  fontOption1: "system",
  fontOption2: "system",
};

// ─── Component font-family field ─────────────────────────────────────────────
// Components (Heading, Text, ProductCard) reference theme CSS vars rather than
// hard-coding specific fonts so changes in Settings update the whole page.

export const COMPONENT_FONT_OPTIONS = [
  { label: "Body Font (Default)", value: "body" },
  { label: "Primary Font", value: "option1" },
  { label: "Secondary Font", value: "option2" },
];

export const COMPONENT_FONT_CSS: Record<string, string> = {
  body: "var(--theme-body-font)",
  option1: "var(--theme-font-1)",
  option2: "var(--theme-font-2)",
};

// ─── Color theme ──────────────────────────────────────────────────────────────

export type ColorKey =
  | "primary"
  | "surface"
  | "success"
  | "warning"
  | "error"
  | "dark"
  | "text"
  | "neutral";

export type ColorTheme = Record<ColorKey, string>;

export const COLOR_KEYS: { key: ColorKey; label: string; description: string }[] = [
  { key: "primary",  label: "Primary",  description: "Brand / action color" },
  { key: "surface",  label: "Surface",  description: "Card & panel backgrounds" },
  { key: "success",  label: "Success",  description: "Positive feedback" },
  { key: "warning",  label: "Warning",  description: "Caution / alerts" },
  { key: "error",    label: "Error",    description: "Destructive / danger" },
  { key: "dark",     label: "Dark",     description: "Dark backgrounds" },
  { key: "text",     label: "Text",     description: "Default body text" },
  { key: "neutral",  label: "Neutral",  description: "Borders, dividers, muted" },
];

export const DEFAULT_COLORS: ColorTheme = {
  primary: "#2563eb",
  surface: "#f8fafc",
  success: "#16a34a",
  warning: "#d97706",
  error: "#dc2626",
  dark: "#0f172a",
  text: "#0f172a",
  neutral: "#64748b",
};

/** CSS custom property name for a given color key */
export function colorVar(key: ColorKey): string {
  return `--theme-color-${key}`;
}

// ─── Badge + shell (header/footer) ───────────────────────────────────────────

export type BadgeShape = "pill" | "rounded" | "square";
export type BadgeStyle = "solid" | "outline" | "soft";

export type BadgeThemeProps = {
  badgeShape: BadgeShape;
  badgeStyle: BadgeStyle;
};

export const DEFAULT_BADGE: BadgeThemeProps = {
  badgeShape: "rounded",
  badgeStyle: "solid",
};

export type ShellVariant = "default" | "commerce";

export type ShellThemeProps = {
  headerVariant: ShellVariant;
  footerVariant: ShellVariant;
};

export const DEFAULT_SHELL: ShellThemeProps = {
  headerVariant: "commerce",
  footerVariant: "commerce",
};

/** CSS vars for product badges (discount / stock), driven by Settings */
export function computeBadgeThemeVars(
  shape: BadgeShape,
  style: BadgeStyle,
  errorHex: string,
  successHex: string,
  neutralHex: string
): Record<string, string> {
  const radius =
    shape === "pill" ? "9999px" : shape === "square" ? "2px" : "8px";

  const padX = shape === "pill" ? "12px" : "10px";
  const padY = "4px";

  const solid = (bg: string, fg: string, border: string) => ({
    bg,
    fg,
    border,
  });

  const forTone = (main: string, _muted: string) => {
    if (style === "outline") {
      return solid("transparent", main, `1px solid ${main}`);
    }
    if (style === "soft") {
      return solid(
        `color-mix(in srgb, ${main} 20%, white)`,
        main,
        "none"
      );
    }
    return solid(main, "#ffffff", "none");
  };

  const d = forTone(errorHex, errorHex);
  const s = forTone(successHex, successHex);
  const o = forTone(neutralHex, neutralHex);

  return {
    "--theme-badge-radius": radius,
    "--theme-badge-padding-x": padX,
    "--theme-badge-padding-y": padY,
    "--theme-badge-font-size": "11px",
    "--theme-badge-font-weight": "600",
    "--theme-badge-discount-bg": d.bg,
    "--theme-badge-discount-fg": d.fg,
    "--theme-badge-discount-border": d.border,
    "--theme-badge-stock-bg": s.bg,
    "--theme-badge-stock-fg": s.fg,
    "--theme-badge-stock-border": s.border,
    "--theme-badge-out-bg": o.bg,
    "--theme-badge-out-fg": o.fg,
    "--theme-badge-out-border": o.border,
  };
}

export function getThemeRootClassNames(
  badgeStyle: BadgeStyle,
  badgeShape: BadgeShape
): string {
  return ["theme-root", `theme-badge-style-${badgeStyle}`, `theme-badge-shape-${badgeShape}`].join(
    " "
  );
}

// ─── Combined theme shape ─────────────────────────────────────────────────────
// A single root.props object carries fonts, colours, badge + shell options.

export type FullThemeProps = ThemeProps &
  Partial<ColorTheme> &
  Partial<BadgeThemeProps> &
  Partial<ShellThemeProps>;
