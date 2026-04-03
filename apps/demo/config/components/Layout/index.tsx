"use client";

import {
  CSSProperties,
  ChangeEvent,
  forwardRef,
  ReactNode,
  useId,
} from "react";
import { useAppStore } from "@/core/store";
import {
  ComponentConfig,
  ComponentConfigParams,
  CustomField,
  DefaultComponentProps,
} from "@/core/types";
import type { LeftOrExactRight } from "@/core/types/Internal";
import { getClassNameFactory } from "@/core/lib";
import {
  getViewportBucket,
  normalizeBreakpoints,
  parseViewportWidthForBucket,
  type BreakpointThemeProps,
  type ViewportBucket,
} from "../../theme";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Layout", styles);

type LayoutFieldProps = {
  /** @deprecated use paddingTop/paddingBottom; still read for migrated data */
  padding?: string;
  spanCol?: number;
  spanRow?: number;
  grow?: boolean;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  /** `static` (default) or out-of-flow (floating) placement */
  positionMode?: "static" | "float";
  /** When floating: `position: fixed` (viewport) vs `absolute` (containing block). */
  floatUseFixedPosition?: boolean;
  /** Custom %/auto insets vs named corner/edge anchors. */
  floatPlacementMode?: "custom" | "preset";
  /** One of eight anchors when `floatPlacementMode` is `preset`. */
  floatPreset?:
    | "top-left"
    | "top-middle"
    | "top-right"
    | "middle-left"
    | "middle-right"
    | "bottom-left"
    | "bottom-middle"
    | "bottom-right";
  /** Insets when `floatPlacementMode` is `custom`: `auto` or `0%`–`100%` (legacy `px` still applied). */
  fixedTop?: string;
  fixedRight?: string;
  fixedBottom?: string;
  fixedLeft?: string;
  /** Border width (e.g. `1px`). */
  borderWidth?: string;
  /** `none` hides the border regardless of width. */
  borderStyle?: "solid" | "dashed" | "none";
  borderColor?: string;
  shadowMode?: "none" | "preset" | "custom";
  shadowPreset?: "sm" | "md" | "lg" | "xl";
  shadowOffsetX?: string;
  shadowOffsetY?: string;
  shadowBlur?: string;
  shadowSpread?: string;
  shadowColor?: string;
  /** Root box `display` for the block wrapper. */
  displayMode?: "block" | "flex" | "grid";
  /** When true, block is hidden at that viewport width (theme breakpoints). */
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
};

type LayoutVisibility = {
  showSpanCol?: boolean;
  showSpanRow?: boolean;
  showGrow?: boolean;
  maxSpanCol?: number;
};

type LayoutCustomField = CustomField<LayoutFieldProps> & LayoutVisibility;

export type WithLayout<Props extends DefaultComponentProps> = Props & {
  layout?: LayoutFieldProps;
};

type LayoutProps = WithLayout<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** When true (Puck edit mode), responsive hiding is suppressed and viewport hints may show. */
  puckIsEditing?: boolean;
}>;

const defaultLayoutValue: Required<
  Pick<
    LayoutFieldProps,
    | "spanCol"
    | "spanRow"
    | "grow"
    | "marginTop"
    | "marginRight"
    | "marginBottom"
    | "marginLeft"
    | "paddingTop"
    | "paddingRight"
    | "paddingBottom"
    | "paddingLeft"
    | "padding"
    | "positionMode"
    | "floatUseFixedPosition"
    | "floatPlacementMode"
    | "floatPreset"
    | "fixedTop"
    | "fixedRight"
    | "fixedBottom"
    | "fixedLeft"
    | "borderWidth"
    | "borderStyle"
    | "borderColor"
    | "shadowMode"
    | "shadowPreset"
    | "shadowOffsetX"
    | "shadowOffsetY"
    | "shadowBlur"
    | "shadowSpread"
    | "shadowColor"
    | "displayMode"
    | "hideOnMobile"
    | "hideOnTablet"
    | "hideOnDesktop"
  >
> = {
  spanCol: 1,
  spanRow: 1,
  grow: false,
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  padding: "0px",
  positionMode: "static",
  floatUseFixedPosition: true,
  floatPlacementMode: "preset",
  floatPreset: "top-left",
  fixedTop: "auto",
  fixedRight: "auto",
  fixedBottom: "auto",
  fixedLeft: "auto",
  borderWidth: "0px",
  borderStyle: "solid",
  borderColor: "#cbd5e1",
  shadowMode: "none",
  shadowPreset: "md",
  shadowOffsetX: "0px",
  shadowOffsetY: "4px",
  shadowBlur: "6px",
  shadowSpread: "0px",
  shadowColor: "rgba(0, 0, 0, 0.12)",
  displayMode: "block",
  hideOnMobile: false,
  hideOnTablet: false,
  hideOnDesktop: false,
};

function normalizeLayout(value?: LayoutFieldProps): Required<LayoutFieldProps> {
  const merged: Required<LayoutFieldProps> = {
    ...defaultLayoutValue,
    ...value,
  };
  // Legacy float data: only had px insets — keep as custom placement.
  if (
    merged.positionMode === "float" &&
    value?.floatPlacementMode == null &&
    value?.floatPreset == null
  ) {
    merged.floatPlacementMode = "custom";
  }
  if (merged.positionMode === "float" && value?.floatUseFixedPosition === undefined) {
    merged.floatUseFixedPosition = true;
  }
  return merged;
}

type ShadowPresetKey = NonNullable<LayoutFieldProps["shadowPreset"]>;

const SHADOW_PRESET_CSS: Record<ShadowPresetKey, string> = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
};

function resolveLayoutAppearanceStyles(
  layout: Required<LayoutFieldProps>
): CSSProperties {
  const appearance: CSSProperties = {
    boxSizing: "border-box",
  };

  if (layout.borderStyle === "none") {
    appearance.borderStyle = "none";
    appearance.borderWidth = 0;
  } else {
    appearance.borderWidth = layout.borderWidth;
    appearance.borderStyle = layout.borderStyle;
    appearance.borderColor = layout.borderColor;
  }

  if (layout.shadowMode === "none") {
    appearance.boxShadow = "none";
  } else if (layout.shadowMode === "preset") {
    const key = layout.shadowPreset ?? "md";
    appearance.boxShadow = SHADOW_PRESET_CSS[key] ?? SHADOW_PRESET_CSS.md;
  } else {
    appearance.boxShadow = `${layout.shadowOffsetX} ${layout.shadowOffsetY} ${layout.shadowBlur} ${layout.shadowSpread} ${layout.shadowColor}`;
  }

  return appearance;
}

/** Inset for custom float mode: omit when auto. */
function insetCssValue(raw: string | undefined): string | undefined {
  if (raw == null) return undefined;
  const t = String(raw).trim().toLowerCase();
  if (t === "" || t === "auto") return undefined;
  return String(raw).trim();
}

const PERCENT_INSET_OPTIONS: string[] = [
  "auto",
  ...Array.from({ length: 21 }, (_, i) => `${i * 5}%`),
];

export type FloatPresetKey = NonNullable<LayoutFieldProps["floatPreset"]>;

export function getFloatInsetStyleFromPreset(
  preset: FloatPresetKey
): CSSProperties {
  const a = "auto" as const;
  switch (preset) {
    case "top-left":
      return { top: 0, left: 0, right: a, bottom: a };
    case "top-middle":
      return {
        top: 0,
        left: "50%",
        right: a,
        bottom: a,
        transform: "translateX(-50%)",
      };
    case "top-right":
      return { top: 0, right: 0, left: a, bottom: a };
    case "middle-left":
      return {
        top: "50%",
        left: 0,
        right: a,
        bottom: a,
        transform: "translateY(-50%)",
      };
    case "middle-right":
      return {
        top: "50%",
        right: 0,
        left: a,
        bottom: a,
        transform: "translateY(-50%)",
      };
    case "bottom-left":
      return { bottom: 0, left: 0, right: a, top: a };
    case "bottom-middle":
      return {
        bottom: 0,
        left: "50%",
        right: a,
        top: a,
        transform: "translateX(-50%)",
      };
    case "bottom-right":
      return { bottom: 0, right: 0, left: a, top: a };
    default:
      return { top: 0, left: 0 };
  }
}

const FLOAT_PRESET_OPTIONS: { label: string; value: FloatPresetKey }[] = [
  { label: "Top left", value: "top-left" },
  { label: "Top middle", value: "top-middle" },
  { label: "Top right", value: "top-right" },
  { label: "Middle left", value: "middle-left" },
  { label: "Middle right", value: "middle-right" },
  { label: "Bottom left", value: "bottom-left" },
  { label: "Bottom middle", value: "bottom-middle" },
  { label: "Bottom right", value: "bottom-right" },
];

type EdgeKey =
  | "marginTop"
  | "marginRight"
  | "marginBottom"
  | "marginLeft"
  | "paddingTop"
  | "paddingRight"
  | "paddingBottom"
  | "paddingLeft";

function parsePx(raw: string | undefined): number {
  if (raw == null || raw === "") return 0;
  const m = String(raw).match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function toPx(n: number): string {
  const v = Math.min(999, Math.max(0, Math.round(Number.isFinite(n) ? n : 0)));
  return `${v}px`;
}

/** Read stored shadow distances like `-4px` or `12` as integer pixels. */
function parseShadowPx(raw: string | undefined): number {
  if (raw == null || raw === "") return 0;
  const m = String(raw).trim().match(/^(-?\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function clampShadowPx(n: number, min: number, max: number): number {
  const v = Math.round(Number.isFinite(n) ? n : 0);
  return Math.min(max, Math.max(min, v));
}

const SHADOW_NUMBER_FIELDS = [
  { key: "shadowOffsetX" as const, label: "X", min: -999, max: 999 },
  { key: "shadowOffsetY" as const, label: "Y", min: -999, max: 999 },
  { key: "shadowBlur" as const, label: "Blur", min: 0, max: 999 },
  { key: "shadowSpread" as const, label: "Spread", min: -999, max: 999 },
];

function LayoutBoxField({
  field,
  value,
  onChange,
  readOnly,
}: {
  field: LayoutCustomField;
  value: LayoutFieldProps;
  onChange: (value: LayoutFieldProps) => void;
  readOnly?: boolean;
}) {
  const floatGroupId = useId();
  const layout = normalizeLayout(value);

  const updateLayout = (partial: Partial<LayoutFieldProps>) => {
    onChange({ ...layout, ...partial });
  };

  const onEdgeNumberChange =
    (key: EdgeKey) => (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      if (raw === "") {
        updateLayout({ [key]: "0px" });
        return;
      }
      const n = parseInt(raw, 10);
      if (Number.isNaN(n)) return;
      updateLayout({ [key]: toPx(n) });
    };

  const edgeVal = (key: EdgeKey) => String(parsePx(layout[key]));

  const positionMode = layout.positionMode ?? "static";
  const floatPlacementMode = layout.floatPlacementMode ?? "preset";
  const floatPreset = layout.floatPreset ?? "top-left";
  const useFixedPos = layout.floatUseFixedPosition !== false;

  return (
    <div className={getClassName("boxField")}>
      {field.showGrow && (
        <div className={getClassName("layoutControls")}>
          <label className={getClassName("controlItem")}>
            <span>Grow</span>
            <select
              value={layout.grow ? "true" : "false"}
              onChange={(event) =>
                updateLayout({ grow: event.target.value === "true" })
              }
              disabled={readOnly}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>
        </div>
      )}

      <div className={getClassName("visibilityPanel")}>
        <div className={getClassName("visibilityTitle")}>Visibility</div>
        <div className={getClassName("visibilityToggles")}>
          <span className={getClassName("visibilityLegend")}>Hide on viewport</span>
          <label className={getClassName("checkRow")}>
            <input
              type="checkbox"
              checked={layout.hideOnMobile}
              onChange={(event) =>
                updateLayout({ hideOnMobile: event.target.checked })
              }
              disabled={readOnly}
            />
            Mobile
          </label>
          <label className={getClassName("checkRow")}>
            <input
              type="checkbox"
              checked={layout.hideOnTablet}
              onChange={(event) =>
                updateLayout({ hideOnTablet: event.target.checked })
              }
              disabled={readOnly}
            />
            Tablet
          </label>
          <label className={getClassName("checkRow")}>
            <input
              type="checkbox"
              checked={layout.hideOnDesktop}
              onChange={(event) =>
                updateLayout({ hideOnDesktop: event.target.checked })
              }
              disabled={readOnly}
            />
            Desktop
          </label>
        </div>
      </div>

      <label className={getClassName("controlItem")}>
        <span>Position</span>
        <select
          value={positionMode}
          onChange={(event) =>
            updateLayout({
              positionMode: event.target.value as "static" | "float",
            })
          }
          disabled={readOnly}
        >
          <option value="static">Static</option>
          <option value="float">Float</option>
        </select>
      </label>

      {positionMode === "float" && (
        <div className={getClassName("floatPanel")}>
          <label className={getClassName("floatSwitch")}>
            <input
              type="checkbox"
              checked={useFixedPos}
              onChange={(event) =>
                updateLayout({ floatUseFixedPosition: event.target.checked })
              }
              disabled={readOnly}
            />
            <span>Position fixed (viewport)</span>
          </label>
          <p className={getClassName("floatHint")}>
            Off uses <code>position: absolute</code> (relative to the positioned
            parent).
          </p>

          <div
            className={getClassName("floatModeRow")}
            role="radiogroup"
            aria-label="Floating placement"
          >
            <label className={getClassName("floatModeOption")}>
              <input
                type="radio"
                name={`floatPlacementMode-${floatGroupId}`}
                checked={floatPlacementMode === "preset"}
                onChange={() =>
                  updateLayout({ floatPlacementMode: "preset" })
                }
                disabled={readOnly}
              />
              <span>Preset position</span>
            </label>
            <label className={getClassName("floatModeOption")}>
              <input
                type="radio"
                name={`floatPlacementMode-${floatGroupId}`}
                checked={floatPlacementMode === "custom"}
                onChange={() =>
                  updateLayout({ floatPlacementMode: "custom" })
                }
                disabled={readOnly}
              />
              <span>Custom insets</span>
            </label>
          </div>

          {floatPlacementMode === "preset" && (
            <label className={getClassName("controlItem")}>
              <span>Anchor</span>
              <select
                value={floatPreset}
                onChange={(event) =>
                  updateLayout({
                    floatPreset: event.target.value as FloatPresetKey,
                  })
                }
                disabled={readOnly}
              >
                {FLOAT_PRESET_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {floatPlacementMode === "custom" && (
            <div className={getClassName("fixedGrid")}>
              <span className={getClassName("fixedGridLabel")}>
                Inset (auto or %)
              </span>
              <div className={getClassName("fixedGridInputs")}>
                {(
                  [
                    ["fixedTop", "Top"],
                    ["fixedRight", "Right"],
                    ["fixedBottom", "Bottom"],
                    ["fixedLeft", "Left"],
                  ] as const
                ).map(([key, label]) => {
                  const raw = layout[key];
                  const v = raw ?? "auto";
                  const known = PERCENT_INSET_OPTIONS.includes(v);
                  return (
                    <label key={key} className={getClassName("fixedCell")}>
                      <span>{label}</span>
                      <select
                        className={getClassName("insetSelect")}
                        value={known ? v : v}
                        onChange={(event) =>
                          updateLayout({ [key]: event.target.value })
                        }
                        disabled={readOnly}
                        aria-label={`Inset ${label}`}
                      >
                        {!known && (
                          <option value={v}>
                            {v} (legacy)
                          </option>
                        )}
                        {PERCENT_INSET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt === "auto" ? "Auto" : opt}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={getClassName("appearanceSection")}>
        <div className={getClassName("appearanceTitle")}>Border</div>
        <div className={getClassName("appearanceRow")}>
          <label className={getClassName("controlItem")}>
            <span>Width</span>
            <input
              type="number"
              min={0}
              max={32}
              className={getClassName("edgeInput")}
              value={String(parsePx(layout.borderWidth))}
              onChange={(event) => {
                const raw = event.target.value;
                if (raw === "") {
                  updateLayout({ borderWidth: "0px" });
                  return;
                }
                const n = parseInt(raw, 10);
                if (Number.isNaN(n)) return;
                updateLayout({ borderWidth: toPx(Math.min(32, n)) });
              }}
              disabled={readOnly}
              aria-label="Border width"
            />
          </label>
          <label className={getClassName("controlItem")}>
            <span>Style</span>
            <select
              value={layout.borderStyle}
              onChange={(event) =>
                updateLayout({
                  borderStyle: event.target.value as LayoutFieldProps["borderStyle"],
                })
              }
              disabled={readOnly}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>
        <label className={getClassName("controlItem")}>
          <span>Color</span>
          <div className={getClassName("colorRow")}>
            <input
              type="color"
              className={getClassName("colorPicker")}
              value={
                /^#[0-9A-Fa-f]{6}$/.test(layout.borderColor)
                  ? layout.borderColor
                  : "#cbd5e1"
              }
              onChange={(event) => updateLayout({ borderColor: event.target.value })}
              disabled={readOnly}
              aria-label="Border color"
            />
            <input
              type="text"
              className={getClassName("textInput")}
              value={layout.borderColor}
              onChange={(event) => updateLayout({ borderColor: event.target.value })}
              disabled={readOnly}
              spellCheck={false}
            />
          </div>
        </label>

        <div className={getClassName("appearanceTitle")}>Shadow</div>
        <label className={getClassName("controlItem")}>
          <span>Mode</span>
          <select
            value={layout.shadowMode}
            onChange={(event) =>
              updateLayout({
                shadowMode: event.target.value as LayoutFieldProps["shadowMode"],
              })
            }
            disabled={readOnly}
          >
            <option value="none">None</option>
            <option value="preset">Preset</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        {layout.shadowMode === "preset" && (
          <label className={getClassName("controlItem")}>
            <span>Preset</span>
            <select
              value={layout.shadowPreset}
              onChange={(event) =>
                updateLayout({
                  shadowPreset: event.target.value as ShadowPresetKey,
                })
              }
              disabled={readOnly}
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra large</option>
            </select>
          </label>
        )}
        {layout.shadowMode === "custom" && (
          <>
            <div className={getClassName("shadowGrid")}>
              {SHADOW_NUMBER_FIELDS.map(({ key, label, min, max }) => (
                <label key={key} className={getClassName("fixedCell")}>
                  <span>{label}</span>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    className={getClassName("edgeInput")}
                    value={String(parseShadowPx(layout[key]))}
                    onChange={(event) => {
                      const raw = event.target.value;
                      if (raw === "") {
                        updateLayout({ [key]: "0px" } as Partial<LayoutFieldProps>);
                        return;
                      }
                      const n = parseInt(raw, 10);
                      if (Number.isNaN(n)) return;
                      updateLayout({
                        [key]: `${clampShadowPx(n, min, max)}px`,
                      } as Partial<LayoutFieldProps>);
                    }}
                    disabled={readOnly}
                    aria-label={`Shadow ${label}`}
                  />
                </label>
              ))}
            </div>
            <label className={getClassName("controlItem")}>
              <span>Color</span>
              <div className={getClassName("colorRow")}>
                <input
                  type="color"
                  className={getClassName("colorPicker")}
                  value={
                    /^#[0-9A-Fa-f]{6}$/.test(layout.shadowColor)
                      ? layout.shadowColor
                      : "#000000"
                  }
                  onChange={(event) =>
                    updateLayout({ shadowColor: event.target.value })
                  }
                  disabled={readOnly}
                />
                <input
                  type="text"
                  className={getClassName("textInput")}
                  value={layout.shadowColor}
                  onChange={(event) =>
                    updateLayout({ shadowColor: event.target.value })
                  }
                  disabled={readOnly}
                  spellCheck={false}
                />
              </div>
            </label>
          </>
        )}
        {layout.shadowMode !== "none" && (
          <div className={getClassName("shadowPreviewWrap")}>
            <span className={getClassName("shadowPreviewLabel")}>Preview</span>
            <div
              className={getClassName("shadowPreview")}
              style={{
                boxShadow:
                  layout.shadowMode === "preset"
                    ? SHADOW_PRESET_CSS[layout.shadowPreset ?? "md"]
                    : `${layout.shadowOffsetX} ${layout.shadowOffsetY} ${layout.shadowBlur} ${layout.shadowSpread} ${layout.shadowColor}`,
              }}
            />
          </div>
        )}
      </div>

      <div className={getClassName("boxModelKey")} aria-hidden>
        <span className={getClassName("keyItemMargin")}>
          <span className={getClassName("keySwatchMargin")} />
          Margin
        </span>
        <span className={getClassName("keySep")}>·</span>
        <span className={getClassName("keyItemPadding")}>
          <span className={getClassName("keySwatchPadding")} />
          Padding
        </span>
        <span className={getClassName("keySep")}>·</span>
        <span className={getClassName("keyItemElement")}>
          <span className={getClassName("keySwatchElement")} />
          Element
        </span>
      </div>

      <div className={getClassName("marginFrame")}>
        <div className={getClassName("mt")}>
          <input
            type="number"
            min={0}
            max={999}
            className={getClassName("edgeInput")}
            value={edgeVal("marginTop")}
            onChange={onEdgeNumberChange("marginTop")}
            disabled={readOnly}
            aria-label="Margin top"
          />
        </div>

        <div className={getClassName("midRow")}>
          <div className={getClassName("ml")}>
            <input
              type="number"
              min={0}
              max={999}
              className={`${getClassName("edgeInput")} ${getClassName("mlInput")}`}
              value={edgeVal("marginLeft")}
              onChange={onEdgeNumberChange("marginLeft")}
              disabled={readOnly}
              aria-label="Margin left"
            />
          </div>

          <div className={getClassName("paddingFrame")}>
            <div className={getClassName("pt")}>
              <input
                type="number"
                min={0}
                max={999}
                className={getClassName("edgeInput")}
                value={edgeVal("paddingTop")}
                onChange={onEdgeNumberChange("paddingTop")}
                disabled={readOnly}
                aria-label="Padding top"
              />
            </div>
            <div className={getClassName("paddingMid")}>
              <div className={getClassName("pl")}>
                <input
                  type="number"
                  min={0}
                  max={999}
                  className={`${getClassName("edgeInput")} ${getClassName("plInput")}`}
                  value={edgeVal("paddingLeft")}
                  onChange={onEdgeNumberChange("paddingLeft")}
                  disabled={readOnly}
                  aria-label="Padding left"
                />
              </div>
              <div className={getClassName("elementCore")}>Element</div>
              <div className={getClassName("pr")}>
                <input
                  type="number"
                  min={0}
                  max={999}
                  className={`${getClassName("edgeInput")} ${getClassName("prInput")}`}
                  value={edgeVal("paddingRight")}
                  onChange={onEdgeNumberChange("paddingRight")}
                  disabled={readOnly}
                  aria-label="Padding right"
                />
              </div>
            </div>
            <div className={getClassName("pb")}>
              <input
                type="number"
                min={0}
                max={999}
                className={getClassName("edgeInput")}
                value={edgeVal("paddingBottom")}
                onChange={onEdgeNumberChange("paddingBottom")}
                disabled={readOnly}
                aria-label="Padding bottom"
              />
            </div>
          </div>

          <div className={getClassName("mr")}>
            <input
              type="number"
              min={0}
              max={999}
              className={`${getClassName("edgeInput")} ${getClassName("mrInput")}`}
              value={edgeVal("marginRight")}
              onChange={onEdgeNumberChange("marginRight")}
              disabled={readOnly}
              aria-label="Margin right"
            />
          </div>
        </div>

        <div className={getClassName("mb")}>
          <input
            type="number"
            min={0}
            max={999}
            className={getClassName("edgeInput")}
            value={edgeVal("marginBottom")}
            onChange={onEdgeNumberChange("marginBottom")}
            disabled={readOnly}
            aria-label="Margin bottom"
          />
        </div>
      </div>
    </div>
  );
}

export const layoutField: LayoutCustomField = {
  type: "custom",
  label: "Layout",
  showSpanCol: true,
  showSpanRow: true,
  showGrow: false,
  maxSpanCol: 12,
  render: (props) => <LayoutBoxField {...props} field={layoutField} />,
};

const createLayoutField = (
  visibility: LayoutVisibility = {}
): LayoutCustomField => ({
  ...layoutField,
  ...visibility,
  render: (props) => (
    <LayoutBoxField {...props} field={{ ...layoutField, ...visibility }} />
  ),
});

function resolvePaddingTop(layout: LayoutFieldProps | undefined): string | undefined {
  if (!layout) return undefined;
  if (layout.paddingTop !== undefined) return layout.paddingTop;
  if (layout.padding !== undefined) return layout.padding;
  return undefined;
}

function resolvePaddingBottom(layout: LayoutFieldProps | undefined): string | undefined {
  if (!layout) return undefined;
  if (layout.paddingBottom !== undefined) return layout.paddingBottom;
  if (layout.padding !== undefined) return layout.padding;
  return undefined;
}

function viewportBucketLabel(bucket: ViewportBucket): string {
  if (bucket === "mobile") return "mobile";
  if (bucket === "tablet") return "tablet";
  return "desktop";
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  (
    { children, className, layout, style, puckIsEditing = false },
    ref
  ) => {
    const pt = resolvePaddingTop(layout) ?? "0px";
    const pb = resolvePaddingBottom(layout) ?? "0px";
    const norm = normalizeLayout(layout);
    const isFloat = norm.positionMode === "float";
    const floatPlacementMode = norm.floatPlacementMode ?? "preset";
    const useFixedPos = norm.floatUseFixedPosition !== false;

    const previewMode = useAppStore((s) => s.state.ui.previewMode);
    const viewportW = useAppStore((s) => s.state.ui.viewports.current.width);
    const rootBp = useAppStore(
      (s) => s.state.data.root.props as Partial<BreakpointThemeProps> | undefined
    );

    /** Arranging canvas (not interactive preview): keep hidden blocks visible with a hint. */
    const editorLayoutOverride =
      puckIsEditing && previewMode === "edit";

    const bp = normalizeBreakpoints({
      breakpointMobileMax: rootBp?.breakpointMobileMax,
      breakpointTabletMax: rootBp?.breakpointTabletMax,
    });
    /** Canvas width from Puck UI (not the iframe’s CSS viewport — media queries often miss that). */
    const widthPx = puckIsEditing
      ? parseViewportWidthForBucket(viewportW)
      : 0;
    const bucket = puckIsEditing
      ? getViewportBucket(widthPx, bp)
      : ("desktop" as ViewportBucket);

    const hiddenAtViewport =
      (bucket === "mobile" && norm.hideOnMobile) ||
      (bucket === "tablet" && norm.hideOnTablet) ||
      (bucket === "desktop" && norm.hideOnDesktop);

    const showViewportHint = editorLayoutOverride && hiddenAtViewport;

    /**
     * In the editor, interactive preview: apply hide via inline display using the canvas width
     * from the store. CSS @media uses the iframe document viewport, which stays wide while the
     * “mobile” canvas is only 360px wide — so media queries never matched.
     * Published pages rely on CSS + real viewport (puckIsEditing is false here).
     */
    const hideByViewportInEditor =
      puckIsEditing &&
      !editorLayoutOverride &&
      hiddenAtViewport;

    const floatStyle: CSSProperties = !isFloat
      ? { position: "static" }
      : {
          position: (useFixedPos ? "fixed" : "absolute") as "fixed" | "absolute",
          zIndex: 10,
          ...(floatPlacementMode === "preset"
            ? getFloatInsetStyleFromPreset(
                (norm.floatPreset ?? "top-left") as FloatPresetKey
              )
            : {
                top: insetCssValue(norm.fixedTop),
                right: insetCssValue(norm.fixedRight),
                bottom: insetCssValue(norm.fixedBottom),
                left: insetCssValue(norm.fixedLeft),
              }),
        };

    const appearanceStyle = resolveLayoutAppearanceStyles(norm);

    const displayMode = norm.displayMode;

    return (
      <div
        className={`${className ?? ""}${showViewportHint ? ` ${getClassName("editorHiddenHint")}` : ""}`.trim()}
        style={{
          gridColumn: layout?.spanCol
            ? `span ${Math.max(Math.min(layout.spanCol, 12), 1)}`
            : undefined,
          gridRow: layout?.spanRow
            ? `span ${Math.max(Math.min(layout.spanRow, 12), 1)}`
            : undefined,
          minWidth: 0,
          marginTop: layout?.marginTop ?? "0px",
          marginRight: layout?.marginRight ?? "0px",
          marginBottom: layout?.marginBottom ?? "0px",
          marginLeft: layout?.marginLeft ?? "0px",
          paddingTop: pt,
          paddingRight: layout?.paddingRight ?? "0px",
          paddingBottom: pb,
          paddingLeft: layout?.paddingLeft ?? "0px",
          flex: layout?.grow ? "1 1 0" : undefined,
          ...floatStyle,
          ...appearanceStyle,
          ...style,
          display: hideByViewportInEditor
            ? "none"
            : (style?.display ?? displayMode),
        }}
        ref={ref}
        data-puck-hide-mobile={norm.hideOnMobile ? "true" : undefined}
        data-puck-hide-tablet={norm.hideOnTablet ? "true" : undefined}
        data-puck-hide-desktop={norm.hideOnDesktop ? "true" : undefined}
        data-puck-layout-editor-visible={
          editorLayoutOverride ? "true" : undefined
        }
      >
        {showViewportHint && (
          <span
            className={getClassName("viewportHiddenBadge")}
            title="This block is hidden at the live site for this viewport width"
          >
            Hidden on {viewportBucketLabel(bucket)}
          </span>
        )}
        {children}
      </div>
    );
  }
);

Layout.displayName = "Layout";

export { Layout };

export function withLayout<
  Props extends LeftOrExactRight<
    Props,
    DefaultComponentProps,
    ComponentConfigParams
  >
>(componentConfig: ComponentConfig<Props>): ComponentConfig<Props> {
  return {
    ...componentConfig,
    fields: {
      ...componentConfig.fields,
      layout: layoutField,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      layout: {
        ...defaultLayoutValue,
        ...componentConfig.defaultProps?.layout,
      },
    },
    resolveFields: (_, params) => {
      if (params.parent?.type === "Grid") {
        return {
          ...componentConfig.fields,
          layout: createLayoutField({
            showSpanCol: true,
            showSpanRow: true,
            showGrow: false,
            maxSpanCol: 12,
          }),
        };
      }
      if (params.parent?.type === "Section") {
        return {
          ...componentConfig.fields,
          layout: createLayoutField({
            showSpanCol: true,
            showSpanRow: true,
            showGrow: false,
            maxSpanCol: 6,
          }),
        };
      }
      if (params.parent?.type === "Flex") {
        return {
          ...componentConfig.fields,
          layout: createLayoutField({
            showSpanCol: false,
            showSpanRow: false,
            showGrow: true,
          }),
        };
      }

      return {
        ...componentConfig.fields,
        layout: createLayoutField({
          showSpanCol: false,
          showSpanRow: false,
          showGrow: false,
        }),
      };
    },
    inline: true,
    render: (props: Parameters<typeof componentConfig.render>[0]) => {
      const layoutProps = props as Parameters<
        typeof componentConfig.render
      >[0] & { layout?: LayoutFieldProps };
      return (
        <Layout
          className={getClassName()}
          layout={layoutProps.layout as LayoutFieldProps}
          ref={layoutProps.puck.dragRef}
          puckIsEditing={layoutProps.puck?.isEditing === true}
        >
          {componentConfig.render(props as never)}
        </Layout>
      );
    },
  } as ComponentConfig<Props>;
}
