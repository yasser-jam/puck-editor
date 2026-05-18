import React, { useRef, useState } from "react";
import { AutoField } from "@/core";
import { useAppStore } from "@/core/store";
import { getClassNameFactory } from "@/core/lib";
import type { AppConfigProps } from "../../../root";
import {
  FONT_OPTIONS,
  getFontCssValue,
  ThemeProps,
  DEFAULT_THEME,
  COLOR_KEYS,
  ColorKey,
  ColorTheme,
  DEFAULT_COLORS,
  DEFAULT_BADGE,
  DEFAULT_SHELL,
  DEFAULT_SCALES,
  DEFAULT_BREAKPOINTS,
  FullThemeProps,
  ScaleThemeProps,
  normalizeBreakpoints,
} from "../../../theme";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("SettingsPanel", styles);

const FONT_SELECT_OPTIONS = FONT_OPTIONS.map((f) => ({
  label: f.label,
  value: f.value,
}));

// ─── Font preview ─────────────────────────────────────────────────────────────

function FontPreview({ fontKey }: { fontKey: string }) {
  const cssValue = getFontCssValue(fontKey);
  const label = FONT_OPTIONS.find((f) => f.value === fontKey)?.label ?? fontKey;
  return (
    <div className={getClassName("fontPreview")} style={{ fontFamily: cssValue }}>
      Aa — The quick brown fox jumps over the lazy dog · {label}
    </div>
  );
}

// ─── Color card ───────────────────────────────────────────────────────────────

function ColorCard({
  colorKey,
  label,
  description,
  value,
  defaultValue,
  onChange,
}: {
  colorKey: ColorKey;
  label: string;
  description: string;
  value: string;
  defaultValue: string;
  onChange: (key: ColorKey, value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hexInput, setHexInput] = useState(value);

  // Sync local hex input when value changes externally
  React.useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleHexCommit = (raw: string) => {
    const trimmed = raw.trim();
    // Accept 3 or 6 digit hex with or without #
    const match = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (match) {
      const hex = "#" + match[1].toUpperCase();
      onChange(colorKey, hex);
      setHexInput(hex);
    } else {
      // Revert to stored value on invalid input
      setHexInput(value);
    }
  };

  const isDefault = value === defaultValue;

  return (
    <div className={getClassName("colorCard")}>
      <div className={getClassName("colorLabel")}>{label}</div>
      <div className={getClassName("colorDescription")}>{description}</div>
      <div className={getClassName("colorInputWrapper")}>
        {/* Swatch — clicking opens the native color picker */}
        <div
          className={getClassName("colorSwatch")}
          style={{ background: value }}
          title="Click to open color picker"
        >
          <input
            ref={inputRef}
            type="color"
            value={value}
            onChange={(e) => {
              onChange(colorKey, e.target.value.toUpperCase());
              setHexInput(e.target.value.toUpperCase());
            }}
          />
        </div>

        {/* Editable hex value */}
        <input
          type="text"
          className={getClassName("colorHex")}
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={(e) => handleHexCommit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleHexCommit((e.target as HTMLInputElement).value);
            if (e.key === "Escape") setHexInput(value);
          }}
          spellCheck={false}
          maxLength={7}
        />

        {/* Reset to default */}
        {!isDefault && (
          <button
            type="button"
            className={getClassName("resetColor")}
            title={`Reset to default (${defaultValue})`}
            onClick={() => onChange(colorKey, defaultValue)}
          >
            ↺
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────────────

/** Root props stored in page data (theme + editor toggles not on FullThemeProps). */
type SettingsRootProps = Partial<FullThemeProps> & {
  enableHtmlRichTextBlock?: boolean;
  app?: AppConfigProps;
  // SOOQ locale (DSN-001 / CUR module). Defaults: rtl / ar / SYP.
  direction?: "rtl" | "ltr";
  language?: "ar" | "en";
  currency?: "SYP" | "USD" | "EUR";
};

type Tab = "app" | "locale" | "fonts" | "colors" | "look" | "scales" | "editor";

const DIRECTION_OPTIONS = [
  { label: "RTL (Arabic)", value: "rtl" },
  { label: "LTR", value: "ltr" },
];

const LANGUAGE_OPTIONS = [
  { label: "العربية (Arabic)", value: "ar" },
  { label: "English", value: "en" },
];

const CURRENCY_OPTIONS = [
  { label: "Syrian Pound (SYP)", value: "SYP" },
  { label: "US Dollar (USD)", value: "USD" },
  { label: "Euro (EUR)", value: "EUR" },
];

const DEFAULT_APP: Required<AppConfigProps> = {
  name: "App",
  bundleId: "",
  apiBaseUrl: "https://sooq.up.railway.app",
  tenantId: "",
  tenantSlug: "",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const BUNDLE_ID_PATTERN = /^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9-]*)+$/i;

function validateHttpsUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const BADGE_SHAPE_OPTIONS = [
  { label: "Rounded", value: "rounded" },
  { label: "Pill", value: "pill" },
  { label: "Square", value: "square" },
];

const BADGE_STYLE_OPTIONS = [
  { label: "Solid", value: "solid" },
  { label: "Outline", value: "outline" },
  { label: "Soft", value: "soft" },
];

const SHELL_VARIANT_OPTIONS = [
  { label: "Commerce", value: "commerce" },
  { label: "Default (legacy)", value: "default" },
];

export function SettingsPanel() {
  const rootProps = useAppStore(
    (s) => s.state.data.root.props as SettingsRootProps | undefined
  );
  const dispatch = useAppStore((s) => s.dispatch);

  const [activeTab, setActiveTab] = useState<Tab>("app");

  // ── Locale values (DSN-001 / CUR module) ──
  const direction = (rootProps?.direction ?? "rtl") as "rtl" | "ltr";
  const language = (rootProps?.language ?? "ar") as "ar" | "en";
  const currency = (rootProps?.currency ?? "SYP") as "SYP" | "USD" | "EUR";
  const app = {
    ...DEFAULT_APP,
    ...(rootProps?.app ?? {}),
  };

  // ── Font values ──
  const bodyFont = (rootProps?.bodyFont ?? DEFAULT_THEME.bodyFont) as string;
  const fontOption1 = (rootProps?.fontOption1 ?? DEFAULT_THEME.fontOption1) as string;
  const fontOption2 = (rootProps?.fontOption2 ?? DEFAULT_THEME.fontOption2) as string;

  // ── Color values ──
  const colors: ColorTheme = {
    primary:  (rootProps?.primary  ?? DEFAULT_COLORS.primary),
    surface:  (rootProps?.surface  ?? DEFAULT_COLORS.surface),
    success:  (rootProps?.success  ?? DEFAULT_COLORS.success),
    warning:  (rootProps?.warning  ?? DEFAULT_COLORS.warning),
    error:    (rootProps?.error    ?? DEFAULT_COLORS.error),
    dark:     (rootProps?.dark     ?? DEFAULT_COLORS.dark),
    text:     (rootProps?.text     ?? DEFAULT_COLORS.text),
    neutral:  (rootProps?.neutral  ?? DEFAULT_COLORS.neutral),
  };

  const badgeShape = rootProps?.badgeShape ?? DEFAULT_BADGE.badgeShape;
  const badgeStyle = rootProps?.badgeStyle ?? DEFAULT_BADGE.badgeStyle;
  const headerVariant = rootProps?.headerVariant ?? DEFAULT_SHELL.headerVariant;
  const footerVariant = rootProps?.footerVariant ?? DEFAULT_SHELL.footerVariant;

  const bpMobile =
    rootProps?.breakpointMobileMax ?? DEFAULT_BREAKPOINTS.breakpointMobileMax;
  const bpTablet =
    rootProps?.breakpointTabletMax ?? DEFAULT_BREAKPOINTS.breakpointTabletMax;

  const updateProps = (patch: Partial<SettingsRootProps>) => {
    dispatch({
      type: "replaceRoot",
      root: {
        props: { ...(rootProps ?? {}), ...patch } as any,
      },
    });
  };

  const updateFont = (key: keyof ThemeProps, value: string) =>
    updateProps({ [key]: value });

  const updateColor = (key: ColorKey, value: string) =>
    updateProps({ [key]: value });

  const appValidation = {
    apiBaseUrl: app.apiBaseUrl.trim().length > 0 && validateHttpsUrl(app.apiBaseUrl),
    bundleId: app.bundleId.trim().length === 0 || BUNDLE_ID_PATTERN.test(app.bundleId.trim()),
    tenantId: app.tenantId.trim().length === 0 || UUID_PATTERN.test(app.tenantId.trim()),
    tenantSlug: app.tenantSlug.trim().length === 0 || SLUG_PATTERN.test(app.tenantSlug.trim()),
  };

  return (
    <div className={getClassName()}>
      <div className={getClassName("intro")}>
        <strong>Store design settings</strong>
        <span>
          These choices update the whole preview. Start with language, fonts,
          and colors, then fine-tune spacing only when needed.
        </span>
      </div>

      {/* ── Tab bar ── */}
      <div className={getClassName("tabs")}>
        <button
          type="button"
          className={`${getClassName("tab")} ${activeTab === "app" ? getClassName("tab--active") : ""}`}
          onClick={() => setActiveTab("app")}
        >
          App
        </button>
        <button
          type="button"
          className={`${getClassName("tab")} ${activeTab === "locale" ? getClassName("tab--active") : ""}`}
          onClick={() => setActiveTab("locale")}
        >
          Locale
        </button>
        <button
          type="button"
          className={`${getClassName("tab")} ${activeTab === "fonts" ? getClassName("tab--active") : ""}`}
          onClick={() => setActiveTab("fonts")}
        >
          Fonts
        </button>
        <button
          type="button"
          className={`${getClassName("tab")} ${activeTab === "colors" ? getClassName("tab--active") : ""}`}
          onClick={() => setActiveTab("colors")}
        >
          Colors
        </button>
        <button
          type="button"
          className={`${getClassName("tab")} ${activeTab === "look" ? getClassName("tab--active") : ""}`}
          onClick={() => setActiveTab("look")}
        >
          Look
        </button>
        <button
          type="button"
          className={`${getClassName("tab")} ${activeTab === "scales" ? getClassName("tab--active") : ""}`}
          onClick={() => setActiveTab("scales")}
        >
          Scales
        </button>
        <button
          type="button"
          className={`${getClassName("tab")} ${activeTab === "editor" ? getClassName("tab--active") : ""}`}
          onClick={() => setActiveTab("editor")}
        >
          Editor
        </button>
      </div>

      <div className={getClassName("tabContent")}>
        {/* ══ LOCALE TAB (DSN-001 / CUR module) ══ */}
        {activeTab === "locale" && (
          <div className={getClassName("section")}>
            <div className={getClassName("sectionTitle")}>Locale & Currency</div>

            <div className={getClassName("field")}>
              <AutoField
                field={{
                  type: "radio",
                  label: "Page direction (DSN-001)",
                  options: DIRECTION_OPTIONS,
                }}
                value={direction}
                onChange={(v) => updateProps({ direction: v as "rtl" | "ltr" })}
              />
            </div>

            <div className={getClassName("field")}>
              <AutoField
                field={{
                  type: "radio",
                  label: "Default language",
                  options: LANGUAGE_OPTIONS,
                }}
                value={language}
                onChange={(v) => updateProps({ language: v as "ar" | "en" })}
              />
            </div>

            <div className={getClassName("field")}>
              <AutoField
                field={{
                  type: "select",
                  label: "Display currency",
                  options: CURRENCY_OPTIONS,
                }}
                value={currency}
                onChange={(v) =>
                  updateProps({ currency: v as "SYP" | "USD" | "EUR" })
                }
              />
            </div>
          </div>
        )}

        {activeTab === "app" && (
          <div className={getClassName("section")}>
            <div className={getClassName("sectionTitle")}>Mobile app metadata</div>
            <p className={getClassName("sectionHint")}>This root object is exported beside theme and navigation for the mobile client. Keep the base URL HTTPS and the tenant fields aligned with production.</p>

            <div className={getClassName("appGrid")}>
              <div className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label: "App name" }}
                  value={app.name}
                  onChange={(value) => updateProps({ app: { ...app, name: String(value) } })}
                />
              </div>

              <div className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label: "Bundle ID" }}
                  value={app.bundleId}
                  onChange={(value) => updateProps({ app: { ...app, bundleId: String(value) } })}
                />
                {!appValidation.bundleId ? (
                  <div className={getClassName("fieldError")}>Use a reverse-DNS bundle ID like com.sooq.merchant.mobile.</div>
                ) : null}
              </div>

              <div className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label: "API base URL" }}
                  value={app.apiBaseUrl}
                  onChange={(value) => updateProps({ app: { ...app, apiBaseUrl: String(value) } })}
                />
                {!appValidation.apiBaseUrl ? (
                  <div className={getClassName("fieldError")}>Use an HTTPS URL with no trailing path unless your backend expects one.</div>
                ) : null}
              </div>

              <div className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label: "Tenant ID" }}
                  value={app.tenantId}
                  onChange={(value) => updateProps({ app: { ...app, tenantId: String(value) } })}
                />
                {!appValidation.tenantId ? (
                  <div className={getClassName("fieldError")}>Tenant ID should be a UUID when set.</div>
                ) : null}
              </div>

              <div className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label: "Tenant slug" }}
                  value={app.tenantSlug}
                  onChange={(value) => updateProps({ app: { ...app, tenantSlug: String(value) } })}
                />
                {!appValidation.tenantSlug ? (
                  <div className={getClassName("fieldError")}>Use lowercase slug characters only, with hyphens between words.</div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* ══ FONTS TAB ══ */}
        {activeTab === "fonts" && (
          <div className={getClassName("section")}>
            <div className={getClassName("sectionTitle")}>Font Families</div>

            <div className={getClassName("field")}>
              <AutoField
                field={{ type: "select", label: "Body Font", options: FONT_SELECT_OPTIONS }}
                value={bodyFont}
                onChange={(v) => updateFont("bodyFont", v as string)}
              />
              <FontPreview fontKey={bodyFont} />
            </div>

            <div className={getClassName("field")}>
              <AutoField
                field={{ type: "select", label: "Primary Font (Option 1)", options: FONT_SELECT_OPTIONS }}
                value={fontOption1}
                onChange={(v) => updateFont("fontOption1", v as string)}
              />
              <FontPreview fontKey={fontOption1} />
            </div>

            <div className={getClassName("field")}>
              <AutoField
                field={{ type: "select", label: "Secondary Font (Option 2)", options: FONT_SELECT_OPTIONS }}
                value={fontOption2}
                onChange={(v) => updateFont("fontOption2", v as string)}
              />
              <FontPreview fontKey={fontOption2} />
            </div>
          </div>
        )}

        {/* ══ COLORS TAB ══ */}
        {activeTab === "colors" && (
          <div className={getClassName("section")}>
            <div className={getClassName("sectionTitle")}>Color Palette</div>
            <div className={getClassName("colorGrid")}>
              {COLOR_KEYS.map(({ key, label, description }) => (
                <ColorCard
                  key={key}
                  colorKey={key}
                  label={label}
                  description={description}
                  value={colors[key]}
                  defaultValue={DEFAULT_COLORS[key]}
                  onChange={updateColor}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "look" && (
          <div className={getClassName("section")}>
            <div className={getClassName("sectionTitle")}>Badges</div>
            <p className={getClassName("sectionHint")}>
              Product discount and stock labels use your palette (error, success, neutral). Shape and
              style apply site-wide.
            </p>
            <div className={getClassName("field")}>
              <AutoField
                field={{ type: "select", label: "Badge shape", options: BADGE_SHAPE_OPTIONS }}
                value={badgeShape}
                onChange={(v) => updateProps({ badgeShape: v as typeof badgeShape })}
              />
            </div>
            <div className={getClassName("field")}>
              <AutoField
                field={{ type: "select", label: "Badge style", options: BADGE_STYLE_OPTIONS }}
                value={badgeStyle}
                onChange={(v) => updateProps({ badgeStyle: v as typeof badgeStyle })}
              />
            </div>

            <div className={getClassName("sectionTitle")}>Header &amp; footer</div>
            <div className={getClassName("field")}>
              <AutoField
                field={{ type: "select", label: "Header layout", options: SHELL_VARIANT_OPTIONS }}
                value={headerVariant}
                onChange={(v) => updateProps({ headerVariant: v as typeof headerVariant })}
              />
            </div>
            <div className={getClassName("field")}>
              <AutoField
                field={{ type: "select", label: "Footer layout", options: SHELL_VARIANT_OPTIONS }}
                value={footerVariant}
                onChange={(v) => updateProps({ footerVariant: v as typeof footerVariant })}
              />
            </div>

            <div className={getClassName("sectionTitle")}>Breakpoints</div>
            <p className={getClassName("sectionHint")}>
              Max widths (px) for mobile and tablet. Used with each block&apos;s Layout → Hide on
              viewport. Desktop is anything wider than the tablet max.
            </p>
            <div className={getClassName("field")}>
              <AutoField
                field={{
                  type: "number",
                  label: "Mobile — max width (px)",
                  min: 320,
                  max: 2000,
                }}
                value={bpMobile}
                onChange={(v) => {
                  const n = Math.round(Number(v));
                  if (Number.isNaN(n)) return;
                  updateProps(
                    normalizeBreakpoints({
                      breakpointMobileMax: n,
                      breakpointTabletMax: bpTablet,
                    })
                  );
                }}
              />
            </div>
            <div className={getClassName("field")}>
              <AutoField
                field={{
                  type: "number",
                  label: "Tablet — max width (px)",
                  min: 321,
                  max: 2400,
                }}
                value={bpTablet}
                onChange={(v) => {
                  const n = Math.round(Number(v));
                  if (Number.isNaN(n)) return;
                  updateProps(
                    normalizeBreakpoints({
                      breakpointMobileMax: bpMobile,
                      breakpointTabletMax: n,
                    })
                  );
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "editor" && (
          <div className={getClassName("section")}>
            <div className={getClassName("sectionTitle")}>Blocks</div>
            <p className={getClassName("sectionHint")}>
              The HTML block renders custom markup (including scripts if your deployment allows it).
              Turn it on only when you need raw HTML in the page.
            </p>
            <div className={getClassName("field")}>
              <AutoField
                field={{
                  type: "radio",
                  label: "HTML rich text block",
                  options: [
                    { label: "Off — not in palette", value: false },
                    { label: "On — show under Content", value: true },
                  ],
                }}
                value={rootProps?.enableHtmlRichTextBlock === true}
                onChange={(v) =>
                  updateProps({ enableHtmlRichTextBlock: v === true })
                }
              />
            </div>
          </div>
        )}

        {activeTab === "scales" && (
          <div className={getClassName("section")}>
            <p className={getClassName("sectionHint")}>
              These tokens power content blocks when &quot;theme&quot; is selected (text sizes, radii,
              button dimensions). Use any valid CSS length.
            </p>

            <div className={getClassName("sectionTitle")}>Text sizes</div>
            {(
              [
                ["textSizeXs", "XS"],
                ["textSizeSm", "SM"],
                ["textSizeMd", "MD"],
                ["textSizeLg", "LG"],
                ["textSizeXl", "XL"],
                ["textSize2xl", "2XL"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label: `Text ${label}` }}
                  value={(rootProps?.[key] ?? DEFAULT_SCALES[key]) as string}
                  onChange={(v) => updateProps({ [key]: v } as Partial<ScaleThemeProps>)}
                />
              </div>
            ))}

            <div className={getClassName("sectionTitle")}>Border radius</div>
            {(
              [
                ["radiusNone", "None"],
                ["radiusSm", "SM"],
                ["radiusMd", "MD"],
                ["radiusLg", "LG"],
                ["radiusXl", "XL"],
                ["radiusFull", "Full (pill)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label: `Radius ${label}` }}
                  value={(rootProps?.[key] ?? DEFAULT_SCALES[key]) as string}
                  onChange={(v) => updateProps({ [key]: v } as Partial<ScaleThemeProps>)}
                />
              </div>
            ))}

            <div className={getClassName("sectionTitle")}>Button — small</div>
            {(
              [
                ["buttonSmHeight", "Height"],
                ["buttonSmPaddingX", "Padding X"],
                ["buttonSmPaddingY", "Padding Y"],
                ["buttonSmFontSize", "Font size"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label }}
                  value={(rootProps?.[key] ?? DEFAULT_SCALES[key]) as string}
                  onChange={(v) => updateProps({ [key]: v } as Partial<ScaleThemeProps>)}
                />
              </div>
            ))}

            <div className={getClassName("sectionTitle")}>Button — medium</div>
            {(
              [
                ["buttonMdHeight", "Height"],
                ["buttonMdPaddingX", "Padding X"],
                ["buttonMdPaddingY", "Padding Y"],
                ["buttonMdFontSize", "Font size"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label }}
                  value={(rootProps?.[key] ?? DEFAULT_SCALES[key]) as string}
                  onChange={(v) => updateProps({ [key]: v } as Partial<ScaleThemeProps>)}
                />
              </div>
            ))}

            <div className={getClassName("sectionTitle")}>Button — large</div>
            {(
              [
                ["buttonLgHeight", "Height"],
                ["buttonLgPaddingX", "Padding X"],
                ["buttonLgPaddingY", "Padding Y"],
                ["buttonLgFontSize", "Font size"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label }}
                  value={(rootProps?.[key] ?? DEFAULT_SCALES[key]) as string}
                  onChange={(v) => updateProps({ [key]: v } as Partial<ScaleThemeProps>)}
                />
              </div>
            ))}

            <div className={getClassName("sectionTitle")}>Font weights</div>
            {(
              [
                ["fontWeightNormal", "Normal"],
                ["fontWeightMedium", "Medium"],
                ["fontWeightSemibold", "Semibold"],
                ["fontWeightBold", "Bold"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label }}
                  value={(rootProps?.[key] ?? DEFAULT_SCALES[key]) as string}
                  onChange={(v) => updateProps({ [key]: v } as Partial<ScaleThemeProps>)}
                />
              </div>
            ))}

            <div className={getClassName("sectionTitle")}>Line heights</div>
            {(
              [
                ["lineHeightTight", "Tight"],
                ["lineHeightNormal", "Normal"],
                ["lineHeightRelaxed", "Relaxed"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={getClassName("field")}>
                <AutoField
                  field={{ type: "text", label }}
                  value={(rootProps?.[key] ?? DEFAULT_SCALES[key]) as string}
                  onChange={(v) => updateProps({ [key]: v } as Partial<ScaleThemeProps>)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
