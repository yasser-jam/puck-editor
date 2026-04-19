import React, { CSSProperties } from "react";
import {
  Layout,
  Navigation,
  PanelRight,
  Palette,
  Type,
  SlidersHorizontal,
  Eye,
  Link as LinkIcon,
} from "lucide-react";
import { DefaultRootRenderProps, RootConfig } from "@/core";
import { colorField } from "./fields/ColorField";
import { sectionHeader } from "./fields/SectionHeader";
import {
  Header,
  DEFAULT_HEADER_LINKS,
  type HeaderLink,
  type HeaderDrawerIcon,
} from "./components/Header";
import {
  Footer,
  DEFAULT_FOOTER_COLUMNS,
  type FooterColumn,
} from "./components/Footer";
import {
  SiteDrawer,
  DEFAULT_DRAWER_LINKS,
  type SiteDrawerLink,
  type SiteDrawerSide,
  type SiteDrawerAnimation,
  type SiteDrawerIcon,
  type SiteDrawerTrigger,
} from "./components/SiteDrawer";
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
      /** Optional header colour overrides. Empty = theme defaults. */
      headerBackgroundColor?: string;
      headerTextColor?: string;
      /** Show a hamburger-style button on the header that toggles the drawer. */
      headerShowDrawerButton?: boolean;
      headerDrawerButtonIcon?: HeaderDrawerIcon;

      // ─── Shell: site footer ─────────────────────────────────────────────────
      /** When false, the site-wide footer band is hidden on every page. */
      footerVisible?: boolean;
      /** Short tagline beside the brand in the footer. */
      footerTagline?: string;
      /** Arabic tagline (falls back to EN when empty). */
      footerTaglineAr?: string;
      /** Editable footer link columns (bilingual). */
      footerColumns?: FooterColumn[];
      /** Optional footer colour overrides. Empty = theme defaults. */
      footerBackgroundColor?: string;
      footerTextColor?: string;

      // ─── Shell: site drawer (side panel) ────────────────────────────────────
      /** Master switch for the site-wide drawer. */
      drawerEnabled?: boolean;
      drawerSide?: SiteDrawerSide;
      /** Panel width in pixels (min 200). */
      drawerWidthPx?: number;
      drawerAnimation?: SiteDrawerAnimation;
      drawerAnimationDurationMs?: number;
      /** How the drawer opens on the live site. */
      drawerTrigger?: SiteDrawerTrigger;
      drawerTriggerLabel?: string;
      drawerTriggerLabelAr?: string;
      drawerTriggerIcon?: SiteDrawerIcon;
      drawerTitle?: string;
      drawerTitleAr?: string;
      drawerShowTitle?: boolean;
      drawerLinks?: SiteDrawerLink[];
      drawerBackgroundColor?: string;
      drawerTextColor?: string;
      drawerAccentColor?: string;
      drawerTriggerBackgroundColor?: string;
      drawerTriggerTextColor?: string;
      drawerOverlay?: boolean;
      drawerOverlayOpacityPercent?: number;
      drawerCloseOnOverlayClick?: boolean;
      drawerCloseOnEsc?: boolean;
      drawerShowCloseButton?: boolean;
      drawerStartOpen?: boolean;
      drawerShowOnMobile?: boolean;
      drawerShowOnDesktop?: boolean;
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
    // ══ Site ══════════════════════════════════════════════════════════════
    __siteHeader: sectionHeader({
      title: "Site",
      description: "Core identity shown in the header, footer and drawer.",
      icon: <Type size={14} />,
      accent: "slate",
    }),
    title: {
      type: "text",
      label: "Site title",
    },

    // ══ Header ════════════════════════════════════════════════════════════
    __headerSetupHeader: sectionHeader({
      title: "Header — Setup",
      description: "Show or hide the header band and configure the brand link.",
      icon: <Layout size={14} />,
      accent: "blue",
    }),
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

    __headerNavHeader: sectionHeader({
      title: "Header — Navigation",
      description:
        "Bilingual top-nav items. Same order on web and mobile; empty to hide.",
      icon: <Navigation size={14} />,
      accent: "blue",
    }),
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

    __headerAppearanceHeader: sectionHeader({
      title: "Header — Appearance",
      description: "Leave colours empty to inherit the active theme.",
      icon: <Palette size={14} />,
      accent: "blue",
    }),
    headerBackgroundColor: colorField({
      label: "Header background",
      description: "Empty = use theme surface colour.",
    }),
    headerTextColor: colorField({
      label: "Header text",
      description: "Empty = use theme text colour.",
    }),

    __headerDrawerBtnHeader: sectionHeader({
      title: "Header — Menu button",
      description:
        "Add a hamburger / icon button that opens the side drawer. Only shown when the drawer is enabled.",
      icon: <PanelRight size={14} />,
      accent: "blue",
    }),
    headerShowDrawerButton: {
      type: "radio",
      label: "Show menu button in header",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    headerDrawerButtonIcon: {
      type: "select",
      label: "Icon",
      options: [
        { label: "Menu (hamburger)", value: "menu" },
        { label: "Filter", value: "filter" },
        { label: "Cart", value: "cart" },
        { label: "User", value: "user" },
        { label: "Hide", value: "none" },
      ],
    },

    // ══ Footer ════════════════════════════════════════════════════════════
    __footerSetupHeader: sectionHeader({
      title: "Footer — Setup",
      description: "Visibility and the tagline beside the brand.",
      icon: <Layout size={14} />,
      accent: "green",
    }),
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
      label: "Tagline (English)",
    },
    footerTaglineAr: {
      type: "textarea",
      label: "Tagline (Arabic)",
    },

    __footerColumnsHeader: sectionHeader({
      title: "Footer — Link columns",
      description: "Group related links into bilingual columns.",
      icon: <LinkIcon size={14} />,
      accent: "green",
    }),
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

    __footerAppearanceHeader: sectionHeader({
      title: "Footer — Appearance",
      description: "Leave colours empty to inherit the active theme.",
      icon: <Palette size={14} />,
      accent: "green",
    }),
    footerBackgroundColor: colorField({
      label: "Footer background",
      description: "Empty = theme footer colour.",
    }),
    footerTextColor: colorField({
      label: "Footer text",
      description: "Empty = theme footer text colour.",
    }),

    // ══ Drawer ════════════════════════════════════════════════════════════
    __drawerSetupHeader: sectionHeader({
      title: "Side drawer — Setup",
      description:
        "A fixed, slide-out side panel. Enable it to show the preview live in the editor.",
      icon: <PanelRight size={14} />,
      accent: "purple",
    }),
    drawerEnabled: {
      type: "radio",
      label: "Enable side drawer",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    drawerSide: {
      type: "radio",
      label: "Pinned side",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    drawerWidthPx: {
      type: "number",
      label: "Width (px)",
      min: 200,
      max: 720,
    },

    __drawerTriggerHeader: sectionHeader({
      title: "Drawer — Trigger",
      description: "How customers open the drawer on the live site.",
      icon: <SlidersHorizontal size={14} />,
      accent: "purple",
    }),
    drawerTrigger: {
      type: "select",
      label: "Opens via",
      options: [
        { label: "Header menu button / external element", value: "external" },
        { label: "Floating button (fixed to edge)", value: "floating" },
        { label: "Auto-open on page load", value: "auto" },
        { label: "Never (hide trigger)", value: "none" },
      ],
    },
    drawerTriggerLabel: {
      type: "text",
      label: "Floating trigger label (English)",
    },
    drawerTriggerLabelAr: {
      type: "text",
      label: "Floating trigger label (Arabic)",
    },
    drawerTriggerIcon: {
      type: "select",
      label: "Trigger icon",
      options: [
        { label: "Menu (hamburger)", value: "menu" },
        { label: "Filter", value: "filter" },
        { label: "Cart", value: "cart" },
        { label: "User", value: "user" },
        { label: "Panel", value: "panel" },
        { label: "None", value: "none" },
      ],
    },

    __drawerContentHeader: sectionHeader({
      title: "Drawer — Content",
      description: "Title and navigation links shown inside the drawer.",
      icon: <Navigation size={14} />,
      accent: "purple",
    }),
    drawerTitle: {
      type: "text",
      label: "Drawer title (English)",
    },
    drawerTitleAr: {
      type: "text",
      label: "Drawer title (Arabic)",
    },
    drawerShowTitle: {
      type: "radio",
      label: "Show drawer title",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    drawerLinks: {
      type: "array",
      label: "Drawer navigation",
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

    __drawerAppearanceHeader: sectionHeader({
      title: "Drawer — Appearance",
      description: "Colours, animation and transition timing.",
      icon: <Palette size={14} />,
      accent: "purple",
    }),
    drawerBackgroundColor: colorField({
      label: "Drawer background",
    }),
    drawerTextColor: colorField({
      label: "Drawer text",
    }),
    drawerAccentColor: colorField({
      label: "Hover / accent colour",
      description: "Used for hover states on drawer links.",
    }),
    drawerTriggerBackgroundColor: colorField({
      label: "Floating trigger background",
    }),
    drawerTriggerTextColor: colorField({
      label: "Floating trigger text",
    }),
    drawerAnimation: {
      type: "select",
      label: "Animation",
      options: [
        { label: "Slide (from side)", value: "slide" },
        { label: "Fade", value: "fade" },
        { label: "Scale", value: "scale" },
        { label: "None", value: "none" },
      ],
    },
    drawerAnimationDurationMs: {
      type: "number",
      label: "Animation duration (ms)",
      min: 0,
      max: 2000,
    },

    __drawerBehaviourHeader: sectionHeader({
      title: "Drawer — Behaviour",
      description:
        "Runtime behaviour. Preview in the editor always stays open so you can design it.",
      icon: <Eye size={14} />,
      accent: "purple",
    }),
    drawerOverlay: {
      type: "radio",
      label: "Dim background when open",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    drawerOverlayOpacityPercent: {
      type: "number",
      label: "Overlay opacity (%)",
      min: 0,
      max: 100,
    },
    drawerCloseOnOverlayClick: {
      type: "radio",
      label: "Close on overlay click",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    drawerCloseOnEsc: {
      type: "radio",
      label: "Close on ESC",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    drawerShowCloseButton: {
      type: "radio",
      label: "Show close (X) button",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    drawerStartOpen: {
      type: "radio",
      label: "Start open on page load",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    drawerShowOnMobile: {
      type: "radio",
      label: "Show on mobile",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    drawerShowOnDesktop: {
      type: "radio",
      label: "Show on desktop",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
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
    headerBackgroundColor: "",
    headerTextColor: "",
    headerShowDrawerButton: false,
    headerDrawerButtonIcon: "menu",
    footerVisible: true,
    footerTagline: "",
    footerTaglineAr: "",
    footerColumns: DEFAULT_FOOTER_COLUMNS,
    footerBackgroundColor: "",
    footerTextColor: "",
    drawerEnabled: false,
    drawerSide: "left",
    drawerWidthPx: 320,
    drawerAnimation: "slide",
    drawerAnimationDurationMs: 260,
    drawerTrigger: "external",
    drawerTriggerLabel: "Menu",
    drawerTriggerLabelAr: "القائمة",
    drawerTriggerIcon: "menu",
    drawerTitle: "Menu",
    drawerTitleAr: "القائمة",
    drawerShowTitle: true,
    drawerLinks: DEFAULT_DRAWER_LINKS,
    drawerBackgroundColor: "#ffffff",
    drawerTextColor: "#111827",
    drawerAccentColor: "#2563eb",
    drawerTriggerBackgroundColor: "#ffffff",
    drawerTriggerTextColor: "#111827",
    drawerOverlay: true,
    drawerOverlayOpacityPercent: 50,
    drawerCloseOnOverlayClick: true,
    drawerCloseOnEsc: true,
    drawerShowCloseButton: true,
    drawerStartOpen: false,
    drawerShowOnMobile: true,
    drawerShowOnDesktop: true,
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

    // Shell colour overrides — empty string keeps the theme default.
    const headerBg = (p.headerBackgroundColor ?? "") as string;
    const headerFg = (p.headerTextColor ?? "") as string;
    const headerShowDrawerBtn = !!p.headerShowDrawerButton;
    const headerDrawerIcon =
      (p.headerDrawerButtonIcon as HeaderDrawerIcon) ?? "menu";
    const footerBg = (p.footerBackgroundColor ?? "") as string;
    const footerFg = (p.footerTextColor ?? "") as string;

    // Drawer props. We resolve everything here so we can hand plain values
    // to <SiteDrawer/> (which doesn't know about the root-props shape).
    const drawerEnabled = !!p.drawerEnabled;
    const drawerLinks =
      Array.isArray(p.drawerLinks) && p.drawerLinks.length > 0
        ? (p.drawerLinks as SiteDrawerLink[])
        : DEFAULT_DRAWER_LINKS;

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
            backgroundColor={headerBg || undefined}
            textColor={headerFg || undefined}
            showDrawerButton={headerShowDrawerBtn && drawerEnabled}
            drawerButtonIcon={headerDrawerIcon}
            drawerName="site-drawer"
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
            backgroundColor={footerBg || undefined}
            textColor={footerFg || undefined}
          />

          {/* Site drawer — portals to document.body, so nothing in the
              flex column above traps its position:fixed children. */}
          <SiteDrawer
            name="site-drawer"
            enabled={drawerEnabled}
            side={(p.drawerSide as SiteDrawerSide) ?? "left"}
            widthPx={Number(p.drawerWidthPx ?? 320)}
            animation={(p.drawerAnimation as SiteDrawerAnimation) ?? "slide"}
            animationDurationMs={Number(p.drawerAnimationDurationMs ?? 260)}
            trigger={(p.drawerTrigger as SiteDrawerTrigger) ?? "external"}
            triggerLabel={(p.drawerTriggerLabel ?? "Menu") as string}
            triggerLabelAr={(p.drawerTriggerLabelAr ?? "القائمة") as string}
            triggerIcon={(p.drawerTriggerIcon as SiteDrawerIcon) ?? "menu"}
            title={(p.drawerTitle ?? "Menu") as string}
            titleAr={(p.drawerTitleAr ?? "القائمة") as string}
            showTitle={(p.drawerShowTitle ?? true) as boolean}
            links={drawerLinks}
            backgroundColor={(p.drawerBackgroundColor ?? "#ffffff") as string}
            textColor={(p.drawerTextColor ?? "#111827") as string}
            accentColor={(p.drawerAccentColor ?? "#2563eb") as string}
            triggerBackgroundColor={
              (p.drawerTriggerBackgroundColor ?? "#ffffff") as string
            }
            triggerTextColor={
              (p.drawerTriggerTextColor ?? "#111827") as string
            }
            overlay={(p.drawerOverlay ?? true) as boolean}
            overlayOpacityPercent={Number(p.drawerOverlayOpacityPercent ?? 50)}
            closeOnOverlayClick={(p.drawerCloseOnOverlayClick ?? true) as boolean}
            closeOnEsc={(p.drawerCloseOnEsc ?? true) as boolean}
            showCloseButton={(p.drawerShowCloseButton ?? true) as boolean}
            startOpen={(p.drawerStartOpen ?? false) as boolean}
            showOnMobile={(p.drawerShowOnMobile ?? true) as boolean}
            showOnDesktop={(p.drawerShowOnDesktop ?? true) as boolean}
            language={language as "ar" | "en"}
            editMode={isEditing}
          />
        </div>
      </>
    );
  },
};

export default Root;
