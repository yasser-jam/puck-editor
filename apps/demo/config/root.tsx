import React, { CSSProperties } from "react";
import { DefaultRootRenderProps, RootConfig } from "@/core";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import {
  getFontCssValue,
  getGoogleFontsUrl,
  ThemeProps,
  DEFAULT_THEME,
  COLOR_KEYS,
  ColorTheme,
  DEFAULT_COLORS,
  FullThemeProps,
  colorVar,
  DEFAULT_BADGE,
  DEFAULT_SHELL,
  DEFAULT_SCALES,
  computeBadgeThemeVars,
  computeScaleThemeVars,
  getThemeRootClassNames,
  type BadgeShape,
  type BadgeStyle,
  type ShellVariant,
} from "./theme";

// ─── Types ───────────────────────────────────────────────────────────────────

export type RootProps = DefaultRootRenderProps<
  Partial<FullThemeProps> & {
    title?: string;
    /** When true, the HTML block appears in the Content palette (Settings → Editor). */
    enableHtmlRichTextBlock?: boolean;
  }
>;

// ─── Root config ─────────────────────────────────────────────────────────────

export const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  defaultProps: {
    title: "My Page",
    enableHtmlRichTextBlock: false,
    ...DEFAULT_THEME,
    ...DEFAULT_COLORS,
    ...DEFAULT_BADGE,
    ...DEFAULT_SHELL,
    ...DEFAULT_SCALES,
  },

  render: (props) => {
    const p = props as any;
    const {
      bodyFont = DEFAULT_THEME.bodyFont,
      fontOption1 = DEFAULT_THEME.fontOption1,
      fontOption2 = DEFAULT_THEME.fontOption2,
      badgeShape = DEFAULT_BADGE.badgeShape,
      badgeStyle = DEFAULT_BADGE.badgeStyle,
      headerVariant = DEFAULT_SHELL.headerVariant,
      footerVariant = DEFAULT_SHELL.footerVariant,
      title: siteTitle = "Meridian",
      puck: { isEditing, renderDropZone: DropZone },
    } = p;

    const colors: ColorTheme = {} as ColorTheme;
    COLOR_KEYS.forEach(({ key }) => {
      colors[key] = (p[key] as string) ?? DEFAULT_COLORS[key];
    });

    const bf = (bodyFont as string) ?? DEFAULT_THEME.bodyFont;
    const f1 = (fontOption1 as string) ?? DEFAULT_THEME.fontOption1;
    const f2 = (fontOption2 as string) ?? DEFAULT_THEME.fontOption2;

    const bodyFontCss = getFontCssValue(bf);
    const font1Css = getFontCssValue(f1);
    const font2Css = getFontCssValue(f2);
    const googleFontsUrl = getGoogleFontsUrl([bf, f1, f2]);

    const shape = badgeShape as BadgeShape;
    const bStyle = badgeStyle as BadgeStyle;
    const badgeVars = computeBadgeThemeVars(
      shape,
      bStyle,
      colors.error,
      colors.success,
      colors.neutral
    );

    const scaleVars = computeScaleThemeVars(p as Partial<typeof DEFAULT_SCALES>);

    const themeVars: Record<string, string> = {
      "--theme-body-font": bodyFontCss,
      "--theme-font-1": font1Css,
      "--theme-font-2": font2Css,
      fontFamily: "var(--theme-body-font)",
      color: "var(--theme-color-text)",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      ...badgeVars,
      ...scaleVars,
    };
    COLOR_KEYS.forEach(({ key }) => {
      themeVars[colorVar(key)] = colors[key];
    });

    const rootClass = getThemeRootClassNames(bStyle, shape);

    const hv = headerVariant as ShellVariant;
    const fv = footerVariant as ShellVariant;

    return (
      <>
        {!isEditing && googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontsUrl} />
          </>
        )}

        <div className={rootClass} style={themeVars as CSSProperties}>
          <Header editMode={isEditing} variant={hv} siteTitle={siteTitle} />
          <DropZone
            zone="default-zone"
            allow={["Section"]}
            style={{ flexGrow: 1 }}
          />

          <Footer variant={fv} siteTitle={siteTitle}>
            <Footer.List title="Shop">
              <Footer.Link href="/">Home</Footer.Link>
              <Footer.Link href="/products/example-product">Products</Footer.Link>
              <Footer.Link href="/cart">Cart</Footer.Link>
            </Footer.List>
            <Footer.List title="Explore">
              <Footer.Link href="/themes">Themes</Footer.Link>
              <Footer.Link href="/pricing">Pricing</Footer.Link>
              <Footer.Link href="/about">About</Footer.Link>
            </Footer.List>
            <Footer.List title="Support">
              <Footer.Link href="#">Shipping</Footer.Link>
              <Footer.Link href="#">Returns</Footer.Link>
              <Footer.Link href="#">Contact</Footer.Link>
            </Footer.List>
          </Footer>
        </div>
      </>
    );
  },
};

export default Root;
