import { CSSProperties, ChangeEvent, forwardRef, ReactNode } from "react";
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
};

function normalizeLayout(value?: LayoutFieldProps): Required<LayoutFieldProps> {
  return {
    ...defaultLayoutValue,
    ...value,
  };
}

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
