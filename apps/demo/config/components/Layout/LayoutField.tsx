import { ChangeEvent, useId } from "react";
import { getClassNameFactory } from "@/core/lib";
import styles from "./styles.module.css";
import {
  type EdgeKey,
  FLOAT_PRESET_OPTIONS,
  type FloatPresetKey,
  type LayoutCustomField,
  type LayoutFieldProps,
  normalizeLayout,
  parsePx,
  parseShadowPx,
  PERCENT_INSET_OPTIONS,
  SHADOW_NUMBER_FIELDS,
  SHADOW_PRESET_CSS,
  type ShadowPresetKey,
  clampShadowPx,
  toPx,
} from "./layout-shared";

const getClassName = getClassNameFactory("Layout", styles);

export function LayoutBoxField({
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
