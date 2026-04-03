import React, { useRef, useState } from "react";
import { AutoField } from "@/core";
import { useAppStore } from "@/core/store";
import { getClassNameFactory } from "@/core/lib";
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
  FullThemeProps,
  ScaleThemeProps,
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
};

type Tab = "fonts" | "colors" | "look" | "scales" | "editor";

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

  const [activeTab, setActiveTab] = useState<Tab>("fonts");

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

  return (
    <div className={getClassName()}>
      {/* ── Tab bar ── */}
      <div className={getClassName("tabs")}>
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
