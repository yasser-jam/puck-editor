import {
  CSSProperties,
  ChangeEvent,
  forwardRef,
  ReactNode,
  useId,
} from "react";
import {
  ComponentConfig,
  CustomField,
  DefaultComponentProps,
} from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
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
  const maxSpanCol = field.maxSpanCol ?? 12;

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
      <div className={getClassName("boxLegend")}>
        <span className={getClassName("legendMargin")}>Margin</span>
        <span className={getClassName("legendSep")} aria-hidden>
          ·
        </span>
        <span className={getClassName("legendPadding")}>Padding</span>
        <span className={getClassName("legendSep")} aria-hidden>
          ·
        </span>
        <span className={getClassName("legendElement")}>Element</span>
      </div>

      {(field.showSpanCol || field.showSpanRow || field.showGrow) && (
        <div className={getClassName("layoutControls")}>
          {field.showSpanCol && (
            <label className={getClassName("controlItem")}>
              <span>Columns</span>
              <select
                value={String(layout.spanCol ?? 1)}
                onChange={(event) =>
                  updateLayout({ spanCol: Number(event.target.value) })
                }
                disabled={readOnly}
              >
                {Array.from({ length: maxSpanCol }, (_, idx) => idx + 1).map(
                  (n) => (
                    <option key={`span-col-${n}`} value={String(n)}>
                      {n}
                    </option>
                  )
                )}
              </select>
            </label>
          )}
          {field.showSpanRow && (
            <label className={getClassName("controlItem")}>
              <span>Rows</span>
              <select
                value={String(layout.spanRow ?? 1)}
                onChange={(event) =>
                  updateLayout({ spanRow: Number(event.target.value) })
                }
                disabled={readOnly}
              >
                {Array.from({ length: 12 }, (_, idx) => idx + 1).map((n) => (
                  <option key={`span-row-${n}`} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}
          {field.showGrow && (
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
          )}
        </div>
      )}

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

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, className, layout, style }, ref) => {
    const pt = resolvePaddingTop(layout) ?? "0px";
    const pb = resolvePaddingBottom(layout) ?? "0px";
    const norm = normalizeLayout(layout);
    const isFloat = norm.positionMode === "float";
    const floatPlacementMode = norm.floatPlacementMode ?? "preset";
    const useFixedPos = norm.floatUseFixedPosition !== false;

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

    return (
      <div
        className={className}
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
          ...style,
        }}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

Layout.displayName = "Layout";

export { Layout };

export function withLayout<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
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
    render: (props) => (
      <Layout
        className={getClassName()}
        layout={props.layout as LayoutFieldProps}
        ref={props.puck.dragRef}
      >
        {componentConfig.render(props)}
      </Layout>
    ),
  };
}
