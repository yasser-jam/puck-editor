import { CSSProperties, forwardRef, ReactNode } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  ObjectField,
} from "@/core/types";
import { spacingOptions } from "../../options";
import { getClassNameFactory } from "@/core/lib";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Layout", styles);

const edgeSpacingOptions = [{ label: "0px", value: "0px" }, ...spacingOptions];

const edgeField = {
  type: "select" as const,
  options: edgeSpacingOptions,
};

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

export type WithLayout<Props extends DefaultComponentProps> = Props & {
  layout?: LayoutFieldProps;
};

type LayoutProps = WithLayout<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}>;

export const layoutField: ObjectField<LayoutFieldProps> = {
  type: "object",
  objectFields: {
    spanCol: {
      label: "Grid Columns (span)",
      type: "number",
      min: 1,
      max: 12,
    },
    spanRow: {
      label: "Grid Rows (span)",
      type: "number",
      min: 1,
      max: 12,
    },
    grow: {
      label: "Flex Grow",
      type: "radio",
      options: [
        { label: "true", value: true },
        { label: "false", value: false },
      ],
    },
    marginTop: { ...edgeField, label: "Margin Top" },
    marginRight: { ...edgeField, label: "Margin Right" },
    marginBottom: { ...edgeField, label: "Margin Bottom" },
    marginLeft: { ...edgeField, label: "Margin Left" },
    paddingTop: { ...edgeField, label: "Padding Top" },
    paddingRight: { ...edgeField, label: "Padding Right" },
    paddingBottom: { ...edgeField, label: "Padding Bottom" },
    paddingLeft: { ...edgeField, label: "Padding Left" },
  },
};

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
        ...componentConfig.defaultProps?.layout,
      },
    },
    resolveFields: (_, params) => {
      const edges = {
        marginTop: layoutField.objectFields.marginTop,
        marginRight: layoutField.objectFields.marginRight,
        marginBottom: layoutField.objectFields.marginBottom,
        marginLeft: layoutField.objectFields.marginLeft,
        paddingTop: layoutField.objectFields.paddingTop,
        paddingRight: layoutField.objectFields.paddingRight,
        paddingBottom: layoutField.objectFields.paddingBottom,
        paddingLeft: layoutField.objectFields.paddingLeft,
      };

      if (params.parent?.type === "Grid") {
        return {
          ...componentConfig.fields,
          layout: {
            ...layoutField,
            objectFields: {
              spanCol: layoutField.objectFields.spanCol,
              spanRow: layoutField.objectFields.spanRow,
              ...edges,
            },
          },
        };
      }
      if (params.parent?.type === "Section") {
        return {
          ...componentConfig.fields,
          layout: {
            ...layoutField,
            objectFields: {
              spanCol: {
                ...layoutField.objectFields.spanCol,
                max: 6,
              },
              spanRow: layoutField.objectFields.spanRow,
              ...edges,
            },
          },
        };
      }
      if (params.parent?.type === "Flex") {
        return {
          ...componentConfig.fields,
          layout: {
            ...layoutField,
            objectFields: {
              grow: layoutField.objectFields.grow,
              ...edges,
            },
          },
        };
      }

      return {
        ...componentConfig.fields,
        layout: {
          ...layoutField,
          objectFields: edges,
        },
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
