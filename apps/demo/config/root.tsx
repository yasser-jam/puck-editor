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
} from "./theme";

// ─── Types ───────────────────────────────────────────────────────────────────

export type RootProps = DefaultRootRenderProps<Partial<FullThemeProps> & { title?: string }>;

// ─── Root config ─────────────────────────────────────────────────────────────

export const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  defaultProps: {
    title: "My Page",
    ...DEFAULT_THEME,
    ...DEFAULT_COLORS,
  },

  render: (props) => {
    const {
      bodyFont = DEFAULT_THEME.bodyFont,
      fontOption1 = DEFAULT_THEME.fontOption1,
      fontOption2 = DEFAULT_THEME.fontOption2,
      puck: { isEditing, renderDropZone: DropZone },
    } = props as any;

    // Resolve color values (fall back to defaults for older saved data)
    const colors: ColorTheme = {} as ColorTheme;
    COLOR_KEYS.forEach(({ key }) => {
      colors[key] = ((props as any)[key] as string) ?? DEFAULT_COLORS[key];
    });

    const bf = (bodyFont as string) ?? DEFAULT_THEME.bodyFont;
    const f1 = (fontOption1 as string) ?? DEFAULT_THEME.fontOption1;
    const f2 = (fontOption2 as string) ?? DEFAULT_THEME.fontOption2;

    const bodyFontCss = getFontCssValue(bf);
    const font1Css = getFontCssValue(f1);
    const font2Css = getFontCssValue(f2);
    const googleFontsUrl = getGoogleFontsUrl([bf, f1, f2]);

    // Build CSS custom-property style object
    const themeVars: Record<string, string> = {
      "--theme-body-font": bodyFontCss,
      "--theme-font-1": font1Css,
      "--theme-font-2": font2Css,
      fontFamily: "var(--theme-body-font)",
      color: "var(--theme-color-text)",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    };
    COLOR_KEYS.forEach(({ key }) => {
      themeVars[colorVar(key)] = colors[key];
    });

    return (
      <>
        {/* Load Google Fonts for the published / server-rendered view.
            In editor mode the ThemeInjector (overrides.iframe) handles this. */}
        {!isEditing && googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontsUrl} />
          </>
        )}

        <div style={themeVars as CSSProperties}>
          <Header editMode={isEditing} />
          <DropZone
            zone="default-zone"
            allow={["Section"]}
            style={{ flexGrow: 1 }}
          />

          <Footer>
            <Footer.List title="Section">
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
            </Footer.List>
            <Footer.List title="Section">
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
            </Footer.List>
            <Footer.List title="Section">
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
            </Footer.List>
            <Footer.List title="Section">
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
              <Footer.Link href="#">Label</Footer.Link>
            </Footer.List>
          </Footer>
        </div>
      </>
    );
  },
};

export default Root;
