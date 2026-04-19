import React, { CSSProperties } from "react";
import { DefaultRootRenderProps, RootConfig } from "@/core";
import {
  Header,
  DEFAULT_HEADER_LINKS,
  type HeaderLink,
} from "./components/Header";
import {
  Footer,
  DEFAULT_FOOTER_COLUMNS,
  type FooterColumn,
} from "./components/Footer";
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
  DEFAULT_BREAKPOINTS,
  buildResponsiveLayoutCss,
  normalizeBreakpoints,
  computeBadgeThemeVars,
  computeScaleThemeVars,
  getThemeRootClassNames,
  type BadgeShape,
  type BadgeStyle,
  type ShellVariant,
} from "./theme";

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Locale & writing direction.
 * SOOQ defaults to Arabic-first / RTL per SRS DSN-001 (Arabic default).
 */
export type LocaleProps = {
  /** Page direction. Defaults to "rtl" (Arabic-first). DSN-001. */
  direction?: "rtl" | "ltr";
  /** Page language code (BCP-47). Defaults to "ar" (Arabic). */
  language?: "ar" | "en";
  /** Display currency. Defaults to SYP (Syrian Pound). DSN-010 / CUR module. */
  currency?: "SYP" | "USD" | "EUR";
};

export type RootProps = DefaultRootRenderProps<
  Partial<FullThemeProps> &
    LocaleProps & {
      title?: string;
      /** When true, the HTML block appears in the Content palette (Settings → Editor). */
      enableHtmlRichTextBlock?: boolean;

      // ─── Shell: site header ─────────────────────────────────────────────────
      /** When false, the site-wide header band is hidden on every page. */
      headerVisible?: boolean;
      /** Where clicking the brand/logo takes the customer. Defaults to "/". */
      headerBrandHref?: string;
      /** Editable header nav items (bilingual). Shared across all pages. */
      headerLinks?: HeaderLink[];

      // ─── Shell: site footer ─────────────────────────────────────────────────
      /** When false, the site-wide footer band is hidden on every page. */
      footerVisible?: boolean;
      /** Short tagline beside the brand in the footer. */
      footerTagline?: string;
      /** Arabic tagline (falls back to EN when empty). */
      footerTaglineAr?: string;
      /** Editable footer link columns (bilingual). */
      footerColumns?: FooterColumn[];
    }
>;

// ─── Root config ─────────────────────────────────────────────────────────────

export const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  // Only surface fields that truly belong to the *whole site*. Theme/colours/
  // fonts are still edited in the Settings panel; the fields below are what a
  // merchant (or AI agent) needs to customise the site shell — brand, nav,
  // footer — which used to be hardcoded in Header/Footer.
  fields: {
    title: {
      type: "text",
      label: "Site title (shown in header & footer)",
    },
    headerVisible: {
      type: "radio",
      label: "Show site header",
      options: [
        { label: "Yes", value: true },
        { label: "No (hide)", value: false },
      ],
    },
    headerBrandHref: {
      type: "text",
      label: "Brand link (where the logo navigates)",
      placeholder: "/",
    },
    headerLinks: {
      type: "array",
      label: "Header navigation",
      arrayFields: {
        label: { type: "text", label: "Label (English)" },
        labelAr: { type: "text", label: "Label (Arabic)" },
        href: { type: "text", label: "URL or page path" },
      },
      defaultItemProps: {
        label: "New link",
        labelAr: "عنصر",
        href: "/",
      },
      getItemSummary: (item: any) =>
        (item?.label as string) || (item?.href as string) || "Link",
    } as any,
    footerVisible: {
      type: "radio",
      label: "Show site footer",
      options: [
        { label: "Yes", value: true },
        { label: "No (hide)", value: false },
      ],
    },
    footerTagline: {
      type: "textarea",
      label: "Footer tagline (English)",
    },
    footerTaglineAr: {
      type: "textarea",
      label: "Footer tagline (Arabic)",
    },
    footerColumns: {
      type: "array",
      label: "Footer link columns",
      arrayFields: {
        title: { type: "text", label: "Column title (English)" },
        titleAr: { type: "text", label: "Column title (Arabic)" },
        links: {
          type: "array",
          label: "Links",
          arrayFields: {
            label: { type: "text", label: "Label (English)" },
            labelAr: { type: "text", label: "Label (Arabic)" },
            href: { type: "text", label: "URL or page path" },
          },
          defaultItemProps: {
            label: "New link",
            labelAr: "عنصر",
            href: "#",
          },
          getItemSummary: (item: any) =>
            (item?.label as string) || (item?.href as string) || "Link",
        },
      },
      defaultItemProps: {
        title: "New column",
        titleAr: "عمود جديد",
        links: [{ label: "Link", labelAr: "رابط", href: "#" }],
      },
      getItemSummary: (item: any) =>
        (item?.title as string) || "Column",
    } as any,
  } as any,
  defaultProps: {
    title: "متجري على SOOQ",
    enableHtmlRichTextBlock: false,
    direction: "rtl",
    language: "ar",
    currency: "SYP",
    headerVisible: true,
    headerBrandHref: "/",
    headerLinks: DEFAULT_HEADER_LINKS,
    footerVisible: true,
    footerTagline: "",
    footerTaglineAr: "",
    footerColumns: DEFAULT_FOOTER_COLUMNS,
    ...DEFAULT_THEME,
    ...DEFAULT_COLORS,
    ...DEFAULT_BADGE,
    ...DEFAULT_SHELL,
    ...DEFAULT_SCALES,
    ...DEFAULT_BREAKPOINTS,
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
      title: siteTitle = "متجر SOOQ",
      direction = "rtl",
      language = "ar",
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

    const bp = normalizeBreakpoints({
      breakpointMobileMax: p.breakpointMobileMax as number | undefined,
      breakpointTabletMax: p.breakpointTabletMax as number | undefined,
    });
    const responsiveLayoutCss = buildResponsiveLayoutCss(bp);

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

    // Shell values — read from p rather than destructuring earlier so that
    // undefined/empty persisted data still falls back to the defaults.
    const headerVisible = (p.headerVisible ?? true) as boolean;
    const headerBrandHref = (p.headerBrandHref ?? "/") as string;
    const headerLinks =
      Array.isArray(p.headerLinks) && p.headerLinks.length > 0
        ? (p.headerLinks as HeaderLink[])
        : DEFAULT_HEADER_LINKS;

    const footerVisible = (p.footerVisible ?? true) as boolean;
    const footerTagline = (p.footerTagline ?? "") as string;
    const footerTaglineAr = (p.footerTaglineAr ?? "") as string;
    const footerColumns =
      Array.isArray(p.footerColumns) && p.footerColumns.length > 0
        ? (p.footerColumns as FooterColumn[])
        : DEFAULT_FOOTER_COLUMNS;

    return (
      <>
        <style
          id="puck-responsive-layout"
          dangerouslySetInnerHTML={{ __html: responsiveLayoutCss }}
        />
        {!isEditing && googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontsUrl} />
          </>
        )}

        <div
          className={rootClass}
          style={themeVars as CSSProperties}
          dir={direction}
          lang={language}
        >
          <Header
            editMode={isEditing}
            variant={hv}
            siteTitle={siteTitle}
            links={headerLinks}
            language={language as "ar" | "en"}
            visible={headerVisible}
            brandHref={headerBrandHref}
          />
          <DropZone
            zone="default-zone"
            allow={["Section"]}
            style={{ flexGrow: 1 }}
          />

          <Footer
            variant={fv}
            siteTitle={siteTitle}
            columns={footerColumns}
            language={language as "ar" | "en"}
            visible={footerVisible}
            tagline={footerTagline}
            taglineAr={footerTaglineAr}
          />
        </div>
      </>
    );
  },
};

export default Root;
