import React, { ReactNode, useEffect } from "react";
import { useAppStore } from "@/core/store";
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
} from "../../theme";

interface ThemeInjectorProps {
  children: ReactNode;
  document?: Document;
}

/**
 * Renders inside `overrides.iframe` — injects CSS custom-property theme tokens
 * (fonts AND colors) plus Google Fonts link tags directly into the preview
 * iframe's <head>. Runs reactively whenever theme settings change.
 */
export function ThemeInjector({ children, document: iframeDoc }: ThemeInjectorProps) {
  const rootProps = useAppStore(
    (s) => s.state.data.root.props as Partial<FullThemeProps> | undefined
  );

  // ── Font values ──
  const bodyFont = (rootProps?.bodyFont ?? DEFAULT_THEME.bodyFont) as string;
  const fontOption1 = (rootProps?.fontOption1 ?? DEFAULT_THEME.fontOption1) as string;
  const fontOption2 = (rootProps?.fontOption2 ?? DEFAULT_THEME.fontOption2) as string;

  const bodyFontCss = getFontCssValue(bodyFont);
  const font1Css = getFontCssValue(fontOption1);
  const font2Css = getFontCssValue(fontOption2);
  const googleFontsUrl = getGoogleFontsUrl([bodyFont, fontOption1, fontOption2]);

  // ── Color values ──
  const colors: ColorTheme = {
    primary: rootProps?.primary ?? DEFAULT_COLORS.primary,
    surface: rootProps?.surface ?? DEFAULT_COLORS.surface,
    success: rootProps?.success ?? DEFAULT_COLORS.success,
    warning: rootProps?.warning ?? DEFAULT_COLORS.warning,
    error:   rootProps?.error   ?? DEFAULT_COLORS.error,
    dark:    rootProps?.dark    ?? DEFAULT_COLORS.dark,
    text:    rootProps?.text    ?? DEFAULT_COLORS.text,
    neutral: rootProps?.neutral ?? DEFAULT_COLORS.neutral,
  };

  useEffect(() => {
    const doc = iframeDoc ?? (typeof document !== "undefined" ? document : null);
    if (!doc) return;

    // ── Inject / update theme CSS custom properties ──
    let styleEl = doc.getElementById("puck-theme-vars") as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.id = "puck-theme-vars";
      doc.head.appendChild(styleEl);
    }

    const colorVarLines = COLOR_KEYS.map(
      ({ key }) => `        ${colorVar(key)}: ${colors[key]};`
    ).join("\n");

    styleEl.textContent = `
      :root {
        /* ── Fonts ── */
        --theme-body-font: ${bodyFontCss};
        --theme-font-1: ${font1Css};
        --theme-font-2: ${font2Css};

        /* ── Colors ── */
${colorVarLines}
      }
      body {
        font-family: var(--theme-body-font);
        color: var(--theme-color-text);
      }
    `;

    // ── Inject / update Google Fonts link ──
    let linkEl = doc.getElementById("puck-theme-fonts") as HTMLLinkElement | null;
    if (googleFontsUrl) {
      if (!linkEl) {
        const pre1 = doc.createElement("link");
        pre1.id = "puck-theme-fonts-preconnect-1";
        pre1.rel = "preconnect";
        pre1.href = "https://fonts.googleapis.com";
        doc.head.appendChild(pre1);

        const pre2 = doc.createElement("link");
        pre2.id = "puck-theme-fonts-preconnect-2";
        pre2.rel = "preconnect";
        pre2.href = "https://fonts.gstatic.com";
        (pre2 as any).crossOrigin = "anonymous";
        doc.head.appendChild(pre2);

        linkEl = doc.createElement("link");
        linkEl.id = "puck-theme-fonts";
        linkEl.rel = "stylesheet";
        doc.head.appendChild(linkEl);
      }
      if (linkEl.href !== googleFontsUrl) {
        linkEl.href = googleFontsUrl;
      }
    } else {
      doc.getElementById("puck-theme-fonts")?.remove();
      doc.getElementById("puck-theme-fonts-preconnect-1")?.remove();
      doc.getElementById("puck-theme-fonts-preconnect-2")?.remove();
    }
  }, [
    iframeDoc,
    bodyFontCss,
    font1Css,
    font2Css,
    googleFontsUrl,
    // spread colors into deps
    colors.primary,
    colors.surface,
    colors.success,
    colors.warning,
    colors.error,
    colors.dark,
    colors.text,
    colors.neutral,
  ]);

  return <>{children}</>;
}
